# apps/api — VNEXIS FastAPI Backend

백엔드 소스코드는 별도 레포 `vnexis-insurance`에 있습니다.
Phase 1에서 이 디렉토리로 통합 예정.

## 배포 (Railway)
```bash
cd apps/api
railway up
```

## 로컬 실행
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
