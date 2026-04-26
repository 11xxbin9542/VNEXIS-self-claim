# VNEXIS Self-Claim — HANDOFF.md
> 최종 업데이트: 2026-04-27
> 목적: 신규 세션의 Claude Code가 이 파일 하나로 전체 컨텍스트 복구

---

## 서비스 개요

AI 기반 보험 진단 적정성 분석 플랫폼.
의무기록 PDF → KCD/ICD/WHO 기준 분석 → 보험금 청구 근거 리포트 생성.

---

## 배포 현황

| 구분 | URL | 버전 |
|------|-----|------|
| 프론트엔드 | https://11xxbin9542.github.io/VNEXIS-self-claim/ | GitHub Pages |
| 백엔드 | https://vnexis-backend-production.up.railway.app | v3.0.0 |
| 헬스체크 | /health | `{"status":"ok","version":"3.0.0","pipeline":"gemini-vision"}` |

---

## 기술 스택

- 프론트엔드: React 18 + Vite + Tailwind CSS (DM Sans/Mono 폰트)
- 백엔드: FastAPI + Python + Gemini 2.5 Flash (Vision)
- PDF 처리: PyMuPDF 120dpi + PII 마스킹 (블랙아웃)
- 배포: GitHub Pages (프론트) + Railway (백엔드)
- **주의**: Railway GitHub 자동 배포 미작동 → `cd backend && railway up` 직접 실행 필수

---

## 핵심 아키텍처

```
PDF 업로드 (최대 50MB)
  → PDF_Stream_Parser (120dpi PNG, 10페이지 청크 병렬, PII 블랙아웃)
  → LLM_Analyzer._generate_sync (Gemini 2.5 Flash Vision, 5원칙 프롬프트)
  → VNEXIS_Response (Pydantic v2 structured output)
  → FastAPI JSONResponse
```

### VNEXIS_Response 스키마 (v3.0)

```
VNEXIS_Response
├── Analysis_ID, Timestamp
├── Patient_Summary (Age, Gender, Subscription_Date, KCD_Version)
├── Medical_Opinion (Raw_Diagnosis, Clinical_Finding, Pathology_Detail, Expert_Assessment, Confidence)
├── Coding_Standard (KCD_Code, KCD_Name, ICD_Code, ICD_Name, WHO_Classification)
├── Insurance_Coverage (Coverage_Type, Policy_Definition, Meets_Definition, Gap_Analysis)
├── Final_Grade (Determination, Probability)
├── Legal_Basis[] (Type, Case_ID, Court_Date, Key_Holding, Relevance, Source_Page)
├── CTA_Logic (Recommended_Action, Expected_Gain)
└── Anonymous_Case_Data (비식별 데이터)
```

---

## 파일 구조

```
VNEXIS-self-claim/
├── src/
│   ├── App.jsx              — 탭 라우팅, Nav (PC상단/모바일하단), Auth모달, Payment모달
│   ├── components/
│   │   ├── AnalysisPanel.jsx — 핵심 분석 UI (업로드→동의→보험정보→분석→결과)
│   │   └── TermsModal.jsx    — 약관 모달
│   └── api/
│       └── vnexis.js         — analyzeDocument(file, insuranceInfo), checkHealth()
├── HANDOFF.md               — 이 파일
└── tailwind.config.js        — navy, brand-blue, brand-teal, brand-amber 커스텀 색상
```

---

## AnalysisPanel.jsx 주요 상태 목록

| 상태 | 초기값 | 역할 |
|------|--------|------|
| `file` | null | 업로드된 PDF |
| `loading` | false | 분석 중 여부 |
| `result` | null | VNEXIS_Response JSON |
| `error` | null | 에러 메시지 |
| `isConsented` | false | 필수 동의 체크박스 (미체크 시 분석 버튼 비활성) |
| `isPaid` | true | 블러 게이트 (현재 true = 전체 공개) |
| `insuranceInfo` | `{company,type,year,month,productName}` | 보험 가입 정보 폼 |
| `showInsuranceForm` | false | PDF 첨부 시 true |
| `insuranceSkipped` | false | 건너뛰기 시 true → KCD-8차 기준 안내 |

---

## 프론트→백엔드 API

### POST /api/vnexis/analyze

FormData 파라미터:
- `file` (PDF, 필수)
- `insurance_company` (선택)
- `insurance_type` (선택: cancer/brain_heart/life/medical/dementia/whole/other)
- `subscription_year` (선택: 가입 연도 → KCD 버전 자동 결정)
- `subscription_month` (선택)
- `product_name` (선택)

응답: VNEXIS_Response JSON

---

## KCD 버전 자동 결정 로직 (프론트/백엔드 공통)

| 가입 연도 | 적용 KCD |
|-----------|----------|
| ~2008 | KCD-5차 |
| 2009~2010 | KCD-6차 |
| 2011~2015 | KCD-7차 |
| 2016~2021 | KCD-7차 개정판 |
| 2022~ | KCD-8차 |

---

## 프롬프트 핵심 원칙 (backend/main.py)

### system_instruction 요지
- 제3자 의료자문 전문가 + 보험 분쟁 손해사정사 역할
- 소비자의 정당한 권리 발굴이 임무
- 임상 코드(D코드) vs 형태학 코드(ICD-O-3) 충돌 시 → **형태학 코드 우선**
- 충돌 자체 = 약관 해석 모호 → 작성자 불이익 원칙 자동 적용

### 5원칙 구조
1. 의무기록 원문 판독 (추측 금지, 없으면 '확인 불가')
2. KCD 버전 자동 적용 (가입일 기준 차수 자동 선택, 유리한 해석)
3. 질환별 진단 확정 기준
   - **암**: Step A~E (병리 → ICD-O-3 도출 → 충돌 분석 → WHO 개정 이력 → 수술소견 무관)
   - **WHO 개정 이력 팩트**: SPN /1→/3, GIST /1→/3, Atypical carcinoid /1→/3, NET G3 /1→/3
   - **뇌혈관**: I60-I69, I63 vs I69 분쟁, 열공성 뇌경색 KCD 버전 충돌
   - **허혈성심장**: I20-I25, I21 확정 3기준
4. 보험약관 대조 및 반론 근거 (Gap_Analysis)
5. 법적 근거 5건: 2017다285109, 금감원 2021-12호, 광주지법 2019나56851 등

---

## 배포 명령어

### 프론트엔드
```bash
cd /path/to/VNEXIS-self-claim
npm run build
npx gh-pages -d dist
```

### 백엔드 (Railway)
```bash
# 반드시 backend 디렉토리에서 실행
cd /path/to/vnexis-insurance
# root main.py와 backend/main.py 동기화 필수
cp backend/main.py main.py
git add backend/main.py main.py && git commit -m "..."
git push origin main
cd backend && railway up
```

---

## 행동강령 (Claude Code 규칙)

- **str_replace 변경 줄만. 전체 파일 교체 금지.**
- backend/main.py 변경 시 반드시 root main.py에도 `cp backend/main.py main.py` 동기화
- railway up은 반드시 `cd backend` 후 실행
