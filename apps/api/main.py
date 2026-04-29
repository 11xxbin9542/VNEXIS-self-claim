"""
InsuMetric API — apps/api/main.py
Phase 2: 과금 엔진 + Rate Limiting 통합

실제 AI 분석 로직은 vnexis-insurance 레포의 backend/main.py에서 이전 예정 (Phase 3).
현재는 과금/미들웨어 뼈대 + 사용량 API 완전 구현.
"""

import os
import time
import logging
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from middleware.auth import extract_tenant
from middleware.rate_limiter import rate_limiter, PLAN_LIMITS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("insumetric")

app = FastAPI(title="InsuMetric API", version="4.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ───────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "version": "4.0.0", "phase": "2"}


# ── 사용량 조회 ───────────────────────────────────────────────────────────────

@app.get("/api/v1/usage")
async def get_usage(request: Request):
    """테넌트 사용량 조회"""
    tenant = await extract_tenant(request)
    if not tenant or tenant["id"] == "guest":
        raise HTTPException(401, "API Key가 필요합니다.")

    plan = tenant.get("plan", "basic")
    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["basic"])
    monthly = rate_limiter.count_monthly_usage(tenant["id"])

    return {
        "tenant": tenant["name"],
        "plan": plan,
        "usage": {
            "monthly_used": monthly,
            "monthly_limit": limits["monthly"],
            "monthly_remaining": max(0, limits["monthly"] - monthly),
            "per_minute_limit": limits["per_minute"],
        },
        "upgrade_available": plan != "enterprise",
    }


@app.get("/api/v1/usage/history")
async def get_usage_history(request: Request):
    """최근 30일 사용량 히스토리"""
    tenant = await extract_tenant(request)
    if not tenant or tenant["id"] == "guest":
        raise HTTPException(401, "API Key가 필요합니다.")

    if not rate_limiter.sb:
        return {"history": []}

    from datetime import datetime, timedelta
    thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()

    result = (
        rate_limiter.sb.table("api_usage")
        .select("endpoint, status_code, response_time_ms, created_at")
        .eq("tenant_id", tenant["id"])
        .gte("created_at", thirty_days_ago)
        .order("created_at", desc=True)
        .limit(100)
        .execute()
    )

    return {"history": result.data or []}


# ── 문서 분석 (AI 분석 로직 연결 슬롯) ───────────────────────────────────────

@app.post("/api/v1/analyze/document")
async def analyze_document(
    request: Request,
    file: UploadFile = File(...),
    insurance_company: str = Form(""),
    insurance_type: str = Form(""),
    subscription_year: str = Form(""),
    subscription_month: str = Form(""),
    product_name: str = Form(""),
):
    """
    PDF 문서 분석 엔드포인트.
    과금 미들웨어 → AI 분석 → 사용량 기록 순서로 실행.
    AI 분석 로직은 vnexis-insurance/backend/main.py 이전 시 여기에 삽입.
    """
    start_time = time.time()

    # ── Rate Limiting ──
    tenant = await extract_tenant(request)
    if tenant and tenant["id"] != "guest":
        allowed, reason = rate_limiter.check_limits(tenant)
        if not allowed:
            raise HTTPException(status_code=429, detail=reason)

    # ── 파일 검증 ──
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "PDF 파일만 업로드 가능합니다.")

    content = await file.read()
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(413, "파일이 너무 큽니다. 50MB 이하 파일을 사용해 주세요.")

    # ── TODO: AI 분석 로직 삽입 지점 ──
    # vnexis-insurance/backend/main.py의 analyze_pdf 로직을 여기에 이전
    result = {"message": "AI 분석 로직 연결 대기 중 (Phase 3 백엔드 이전 시 활성화)"}

    # ── 사용량 기록 ──
    elapsed_ms = int((time.time() - start_time) * 1000)
    if tenant and tenant["id"] != "guest":
        rate_limiter.record_usage(
            tenant_id=tenant["id"],
            user_id=None,
            endpoint="/api/v1/analyze/document",
            status_code=200,
            response_time_ms=elapsed_ms,
        )
        logger.info(f"[BILLING] {tenant['name']} | {elapsed_ms}ms")

    return JSONResponse(content=result)


# ── 레거시 호환 엔드포인트 (/api/vnexis/analyze → /api/v1/analyze/document) ──

@app.post("/api/vnexis/analyze")
async def analyze_pdf_legacy(
    request: Request,
    file: UploadFile = File(...),
    insurance_company: str = Form(""),
    insurance_type: str = Form(""),
    subscription_year: str = Form(""),
    subscription_month: str = Form(""),
    product_name: str = Form(""),
):
    """레거시 엔드포인트 — 과금 미들웨어 적용 후 동일 처리"""
    return await analyze_document(
        request, file,
        insurance_company, insurance_type,
        subscription_year, subscription_month, product_name,
    )
