# CLAUDE.md — VNEXIS Enterprise v4.0
> 세션 시작 시 반드시 읽을 것.

## 행동강령
1. 기존 코드 덮어쓰기 금지. str_replace만 사용
2. 전체 파일 교체 금지
3. shell=True 금지
4. 완료마다 git commit
5. Phase 순서 반드시 준수 (0→1→2→3→4→5)

## 프로젝트 구조
모노레포: apps/web(Next.js) + apps/api(FastAPI) + packages/shared(타입)
DB: Supabase (Multi-tenant RLS)
배포: web→Vercel, api→Railway

## 현재 Phase: 0 (기반 정리)
다음: Phase 1 (인증 + DB)

## CEO 결정 사항
- 타깃: GA 법인 + FC 설계사 우선
- 인프라: Supabase 무료 플랜 유지 (유료 고객 확보 시 전환)
- 프론트: Next.js App Router + TypeScript + Tailwind
