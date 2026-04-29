"""
테넌트 수동 생성 스크립트
실행: python scripts/create_tenant.py --name "더큰보험" --type ga --plan pro
"""

import os
import argparse
import uuid
from dotenv import load_dotenv

load_dotenv()


def create_tenant(name: str, tenant_type: str, plan: str):
    from supabase import create_client

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        print("[오류] .env 파일에 SUPABASE_URL, SUPABASE_KEY를 설정하세요.")
        return

    sb = create_client(url, key)
    api_key = str(uuid.uuid4())

    result = sb.table("tenants").insert({
        "name": name,
        "type": tenant_type,
        "plan": plan,
        "api_key": api_key,
    }).execute()

    tenant = result.data[0]

    print(f"\n{'='*50}")
    print("테넌트 생성 완료")
    print(f"{'='*50}")
    print(f"이름:     {tenant['name']}")
    print(f"유형:     {tenant['type']}")
    print(f"플랜:     {tenant['plan']}")
    print(f"API Key:  {api_key}")
    print(f"월 한도:  {tenant['monthly_quota']}건")
    print(f"{'='*50}")
    print(f"\n사용법:")
    print(f'curl -H "X-API-Key: {api_key}" https://your-api.railway.app/api/v1/usage')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="InsuMetric 테넌트 생성")
    parser.add_argument("--name", required=True, help="테넌트 이름")
    parser.add_argument("--type", choices=["ga", "surveyor", "fc"], default="fc")
    parser.add_argument("--plan", choices=["basic", "pro", "enterprise"], default="basic")
    args = parser.parse_args()
    create_tenant(args.name, args.type, args.plan)
