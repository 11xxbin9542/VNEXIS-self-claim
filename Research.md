# VNEXIS 프론트엔드 심층 분석 리포트
> 분석 기준일: 2026-04-25 | 대상 버전: v2.7.1

---

## 1. 대기 시간 UX (Loading State)

### 현재 구현 상태

**AssessmentView (App.jsx:350~583) — 목업 전용**
- 스피너(rotate 360° framer-motion) + 진행률 숫자 + 파란 progress bar
- `setInterval 50ms × +2%` → 약 2.5초 만에 100% 달성 후 mock result 렌더
- 실제 API 호출 없음. 데모용 가짜 로딩

**AnalysisPanel.jsx (실제 Gemini 연동) — 문제 있음**
- `loading` 상태(boolean)로 버튼 텍스트만 교체
- `setInterval(2000ms)` × 4단계 = 최대 8초 후 step index가 `STEPS.length - 2` (인덱스 3)에서 **영구 고정**
- Gemini 실제 응답 시간 15~30초 동안: "⚖️ D→M→C 코드 역추론..." 문구가 수십 초간 고정 표시
- 화면 나머지 영역은 완전히 **빈 공백** — 사용자는 앱이 멈췄는지 알 수 없음
- AbortController/timeout 없음 → 네트워크 오류 시 **무한 로딩 상태**에 갇힘

### 단계별 프로그레스 메시지 (지시서 기준)
| 단계 | 메시지 | 예상 경과 |
|------|--------|-----------|
| 1 | 📄 문서 업로드 완료 | 0~1초 |
| 2 | 🔒 개인정보 보호 처리 중... | 1~3초 |
| 3 | 🔍 의학적 소견 인식 중... | 3~10초 |
| 4 | ⚖️ 보험 약관 타당성 추론 중... | 10~25초 |
| 5 | ✅ 분석 완료 — 결과를 불러오는 중 | 25~30초 |

### 스켈레톤 UI 삽입 위치
| 컴포넌트 | 위치 | 대상 영역 |
|---------|------|-----------|
| AnalysisPanel.jsx:131~148 | 판정 카드 | 판정 문구 + 신뢰도 % 숫자 |
| AnalysisPanel.jsx:150~175 | D→M→C 체인 | 코드 3개 박스 |
| AnalysisPanel.jsx:178~206 | 반론 근거 목록 | 항목별 텍스트 라인 |
| AnalysisPanel.jsx:209~222 | CTA 스트립 | 텍스트 + 버튼 영역 |

---

## 2. 모바일 반응성 (Mobile First)

### Tailwind Breakpoint 사용 현황
| 파일 | md: | sm: | lg: | 합계 |
|------|-----|-----|-----|------|
| App.jsx | 45 | 1 | 1 | 47 |
| AnalysisPanel.jsx | **0** | **0** | **0** | **0** |
| 전체 | 45 | 1 | 1 | 47 |

**AnalysisPanel.jsx는 반응형 클래스가 단 한 개도 없음.**

### 모바일 레이아웃 붕괴 위험 컴포넌트

**① D→M→C 체인 (AnalysisPanel.jsx:153~174)**
- `flex items-center gap-3 flex-wrap` — wrap은 되지만 화살표(→)가 혼자 다음 줄로 내려가는 현상
- `max-w-[120px] truncate` 라벨이 320px 기기에서 잘려 코드명 미표시

**② Evidence 클릭 항목 (AnalysisPanel.jsx:186~204)**
- `py-2` = 8px 상하 패딩 → 실제 터치 타겟 높이 ≈ 24~30px (44px 기준 미달)
- 모바일에서 오클릭 잦음

**③ AssessmentView 모드 선택 버튼 (App.jsx:411~425)**
- `flex flex-col md:flex-row` — 모바일 세로 정렬은 OK
- 버튼 내부 텍스트가 길어 320px에서 텍스트 오버플로우 가능성

**④ 판정 카드 (AnalysisPanel.jsx:131~148)**
- `flex justify-between items-center` → 좌(결과명) + 우(신뢰도 %) 가로 배치
- 좁은 화면에서 결과명이 길 경우 % 숫자와 충돌

### 카메라 직접 촬영
- `AnalysisPanel.jsx:84`: `<input type="file" accept="application/pdf">` — PDF 전용, `capture` 속성 없음
- 향후 JPG/PNG 지원 시 `capture="environment"` 추가 필요 (현재는 PDF만 수용이라 불필요)

### 터치 타겟 크기 미달 항목 (44px 기준)
| 위치 | 요소 | 현재 높이 추정 | 조치 필요 |
|------|------|---------------|-----------|
| AnalysisPanel.jsx:187 | Evidence 항목 전체 | ~30px | py-4로 확대 필요 |
| AnalysisPanel.jsx:217 | CTA "바로 연결 →" 버튼 | ~36px (py-2.5) | py-3으로 확대 |
| App.jsx:707 | 로그인 텍스트 버튼 | ~20px (텍스트만) | 패딩 추가 필요 |

### 개선 우선순위 Top 3
1. **AnalysisPanel.jsx** — 전체 반응형 클래스 부재, D→M→C flex wrap 수정
2. **Evidence 터치 타겟** — py-2 → py-4 확대
3. **CTA 버튼 크기** — py-2.5 → py-3

---

## 3. 에러 핸들링 (Error Handling)

### 현재 에러 처리 전수 목록

| 파일 | 라인 | 처리 방식 | 문제점 |
|------|------|-----------|--------|
| vnexis.js | 13 | `response.json().catch(() => ({detail: response.statusText}))` | statusText는 영문 기술 메시지 |
| vnexis.js | 14 | `throw new Error(err.detail ...)` | "LLM JSON 파싱 실패: ..." 같은 기술 문자열 그대로 throw |
| AnalysisPanel.jsx | 23 | `setError('PDF 파일만 업로드...')` | OK (사용자 친화적) |
| AnalysisPanel.jsx | 27 | `setError('파일 크기가 50MB...')` | OK (사용자 친화적) |
| AnalysisPanel.jsx | 59 | `setError(e.message)` | ⚠️ raw 기술 문자열 그대로 표시 |
| AnalysisPanel.jsx | 122 | `⚠️ {error}` | ⚠️ 기술 메시지 그대로 렌더링 |
| AnalysisPanel.jsx | 186 | `alert(...)` | ⚠️ 모바일에서 UI 블록, 디자인 불일치 |
| AnalysisPanel.jsx | 216 | `alert('손해사정사 연결 기능 준비 중')` | ⚠️ alert 사용 |
| App.jsx | 전체 | — | AssessmentView는 mock — 에러 처리 없음 |

### 사용자 친화 메시지 매핑 테이블

| 기술적 에러 패턴 | 사용자 표시 메시지 |
|-----------------|-------------------|
| `response.status === 400` | "파일 형식을 확인해 주세요. PDF만 업로드 가능합니다." |
| `response.status === 413` | "파일이 너무 큽니다. 50MB 이하 파일을 사용해 주세요." |
| `detail.includes('LLM JSON')` | "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." |
| `detail.includes('LLM 분석 오류')` | "AI 서버에 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." |
| `TypeError: Failed to fetch` | "인터넷 연결을 확인하고 다시 시도해 주세요." |
| AbortError (timeout) | "분석 시간이 초과되었습니다. 페이지를 새로고침 후 시도해 주세요." |
| `response.status === 502` | "AI 서버가 일시적으로 응답하지 않습니다. 잠시 후 다시 시도해 주세요." |

### 재시도 버튼 배치 위치
- **AnalysisPanel.jsx:120~124** 에러 배너 내부 오른쪽
- `error && <div>⚠️ {friendlyMessage} <button onClick={analyze}>다시 시도</button></div>` 구조

### 추가 누락 항목
- **타임아웃 없음**: `analyzeDocument()`에 `AbortController` + 60초 타임아웃 필요
- **retry 없음**: 오류 발생 시 파일 재선택 없이 버튼 재클릭 불가 (loading=false로 복귀하지만 에러 메시지와 retry CTA 없음)

---

## 4. 비즈니스 확장성

### 현재 결제 UI 현황
- App.jsx:826~848: `showPaymentModal` + Payment Modal 구현 완료 (Toss Pay, 카드 버튼 존재, 미연동)
- App.jsx:554~576: AssessmentView 내 sticky CTA `"리포트 전문 확인하기 (15,000원)"` — 모달 트리거 연결됨
- **AnalysisPanel.jsx**: 결제 게이트 전혀 없음 — 실제 분석 결과가 무료로 전체 노출

### 결제 버튼 삽입 가능 위치
| 위치 | 컴포넌트 | 설명 |
|------|---------|------|
| AnalysisPanel.jsx:127 결과 div 내부 상단 | AnalysisPanel | 결과 미리보기 후 페이게이트 |
| AnalysisPanel.jsx:209 CTA 스트립 | AnalysisPanel | 손해사정사 연결 버튼 옆 |
| App.jsx:706 nav 우측 | App | "무료 시작" 버튼 교체 또는 추가 |

### 결과 PDF 다운로드 버튼 후보 위치
- AnalysisPanel.jsx:127 `{result && ...}` 블록 최상단 → "결과 리포트 저장 (PDF)" 버튼
- CTA 스트립(line 209) 우측 또는 바로 위

### Toss Payments 연동 UI 흐름
```
1. 분석 결과 렌더
     ↓
2. 판정 카드 + D→M→C 체인: 정상 표시 (무료 미리보기)
     ↓
3. 반론 근거 (Legal_Grounds) 섹션: blur-md 처리 + "잠금" 오버레이
     - "보험사가 꼼짝 못 할 반박 논리 {N}건이 발견되었습니다"
     ↓
4. 결제 CTA (sticky bottom or inline)
     - "전체 리포트 열람하기 (15,000원)" → setShowPaymentModal(true)
     ↓
5. 결제 완료(webhook or 토스 콜백) → blur 제거, 전체 결과 표시
```

### 향후 기능을 위한 레이아웃 여백 확보 지점
- AnalysisPanel.jsx:74 `space-y-5` 컨테이너: 새 카드 추가 시 자동 간격 확보
- 판정 카드(line 131) 아래: 분석 날짜/Analysis_ID 표시 공간 (현재 미표시)
- 반론 근거 섹션 하단: "관련 판례 더 보기" 확장 가능 지점
- CTA 스트립 하단: 신뢰도 배지, 공유 버튼 추가 가능
