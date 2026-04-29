"""
InsuMetric API 인증 미들웨어
- API Key 방식 (B2B용)
- JWT Bearer 방식 (프론트엔드 대시보드용)
- 둘 다 없으면 게스트 모드 (한도 제한 강화)
"""

import logging
from fastapi import Request, HTTPException
from .rate_limiter import rate_limiter

logger = logging.getLogger("insumetric")

# 게스트 모드 한도 (비인증)
GUEST_DAILY_LIMIT = 3


async def extract_tenant(request: Request) -> dict | None:
    """
    요청에서 테넌트 정보 추출.
    우선순위: API Key 헤더 → Bearer JWT → 게스트
    """
    # 1. API Key 헤더
    api_key = request.headers.get("X-API-Key", "")
    if api_key:
        tenant = rate_limiter.get_tenant_from_api_key(api_key)
        if tenant:
            logger.info(f"[AUTH] API Key 인증: {tenant['name']} ({tenant['plan']})")
            return tenant
        raise HTTPException(401, "유효하지 않은 API Key입니다.")

    # 2. Bearer JWT (Supabase Auth 연동 시 JWT 검증 로직 추가)
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        pass  # Phase 3에서 JWT 검증 구현

    # 3. 게스트 모드 (비인증 — 무료 체험)
    return {
        "id": "guest",
        "name": "Guest",
        "type": "guest",
        "plan": "guest",
        "monthly_quota": GUEST_DAILY_LIMIT,
        "is_active": True,
    }
