"""
InsuMetric Rate Limiter
- 플랜별 월간/분당 한도 제어
- api_usage 테이블에 호출 기록
- 한도 초과 시 429 반환
"""

import os
import logging
from datetime import datetime, timedelta

logger = logging.getLogger("insumetric")

# ── 플랜별 제한 ──
PLAN_LIMITS = {
    "basic":      {"monthly": 100,  "per_minute": 5,  "label": "Basic"},
    "pro":        {"monthly": 500,  "per_minute": 15, "label": "Pro"},
    "enterprise": {"monthly": 5000, "per_minute": 60, "label": "Enterprise"},
}


class RateLimiter:
    """Supabase api_usage 테이블 기반 Rate Limiter"""

    def __init__(self):
        self._sb = None

    @property
    def sb(self):
        if self._sb is None:
            url = os.getenv("SUPABASE_URL", "")
            key = os.getenv("SUPABASE_KEY", "")
            if url and key:
                from supabase import create_client
                self._sb = create_client(url, key)
        return self._sb

    def get_tenant_from_api_key(self, api_key: str) -> dict | None:
        """API Key → 테넌트 정보 조회"""
        if not self.sb:
            return None
        try:
            result = (
                self.sb.table("tenants")
                .select("id, name, type, plan, monthly_quota, is_active")
                .eq("api_key", api_key)
                .eq("is_active", True)
                .single()
                .execute()
            )
            return result.data
        except Exception:
            return None

    def count_monthly_usage(self, tenant_id: str) -> int:
        """이번 달 사용량 조회"""
        if not self.sb:
            return 0
        try:
            first_of_month = datetime.now().replace(
                day=1, hour=0, minute=0, second=0, microsecond=0
            )
            result = (
                self.sb.table("api_usage")
                .select("id", count="exact")
                .eq("tenant_id", tenant_id)
                .gte("created_at", first_of_month.isoformat())
                .execute()
            )
            return result.count or 0
        except Exception:
            return 0

    def count_minute_usage(self, tenant_id: str) -> int:
        """최근 1분 사용량 조회"""
        if not self.sb:
            return 0
        try:
            one_min_ago = (datetime.now() - timedelta(minutes=1)).isoformat()
            result = (
                self.sb.table("api_usage")
                .select("id", count="exact")
                .eq("tenant_id", tenant_id)
                .gte("created_at", one_min_ago)
                .execute()
            )
            return result.count or 0
        except Exception:
            return 0

    def record_usage(
        self,
        tenant_id: str,
        user_id: str | None,
        endpoint: str,
        status_code: int,
        response_time_ms: int,
    ):
        """API 호출 기록"""
        if not self.sb:
            return
        try:
            self.sb.table("api_usage").insert({
                "tenant_id": tenant_id,
                "user_id": user_id,
                "endpoint": endpoint,
                "status_code": status_code,
                "response_time_ms": response_time_ms,
            }).execute()
        except Exception as e:
            logger.warning(f"[BILLING] 사용량 기록 실패: {e}")

    def check_limits(self, tenant: dict) -> tuple[bool, str]:
        """
        한도 체크. 초과 시 (False, 사유) 반환.
        """
        plan = tenant.get("plan", "basic")
        limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["basic"])
        tenant_id = tenant["id"]

        # 월간 한도
        monthly = self.count_monthly_usage(tenant_id)
        if monthly >= limits["monthly"]:
            return False, (
                f"월간 분석 한도({limits['monthly']}건)를 초과했습니다. "
                f"현재 플랜: {limits['label']}. "
                f"업그레이드하시면 더 많은 분석이 가능합니다."
            )

        # 분당 한도
        per_min = self.count_minute_usage(tenant_id)
        if per_min >= limits["per_minute"]:
            return False, (
                f"요청 빈도가 초과되었습니다 (분당 {limits['per_minute']}건). "
                f"잠시 후 다시 시도해 주세요."
            )

        return True, ""


# 싱글톤 인스턴스
rate_limiter = RateLimiter()
