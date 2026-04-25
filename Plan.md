# VNEXIS 프론트엔드 개선 실행 계획
> Research.md 기반 | 승인 후 코딩 착수

---

## 수정 대상 파일 목록

### 1. `src/api/vnexis.js`
- **수정 이유**: AbortController 타임아웃 없음, 기술 에러 문자열 그대로 throw
- **수정 방식**: str_replace (2곳 패치)
- **예상 변경 라인**: +15줄
- **변경 내용**:
  - 60초 AbortController 타임아웃 추가
  - 에러 메시지 매핑 함수 `humanizeError()` 추가
  - HTTP 상태코드별 분기 처리

### 2. `src/components/AnalysisPanel.jsx`
- **수정 이유**: 로딩 UX 빈약, 에러 raw 노출, 반응형 0%, 터치 타겟 미달, alert() 사용
- **수정 방식**: str_replace (8곳 패치)
- **예상 변경 라인**: +60줄 수정/추가
- **변경 내용**:
  - 로딩 중 progress bar + 단계 메시지 분리 표시
  - 에러 배너에 재시도 버튼 추가
  - Evidence onClick: alert() → 인라인 상세 펼침 (useState)
  - CTA "바로 연결 →": alert() → 모달 또는 인라인 메시지
  - 반응형: 판정 카드 `flex-col sm:flex-row`, D→M→C `grid grid-cols-[auto_1fr_auto_1fr_auto]`
  - 터치 타겟: Evidence `py-2` → `py-4`, CTA 버튼 `py-2.5` → `py-3`

### 3. `tailwind.config.js`
- **수정 이유**: 스켈레톤 shimmer 애니메이션 토큰 추가
- **수정 방식**: str_replace (keyframes + animation 섹션에 추가)
- **예상 변경 라인**: +10줄

---

## 신규 생성 파일 목록

### 1. `src/components/ui/Skeleton.jsx`
- **역할**: 로딩 중 결과 영역에 표시할 shimmer 스켈레톤 컴포넌트
- **의존성**: tailwind.config.js의 `animate-shimmer` 토큰
- **예상 라인**: 30줄

---

## 디자인 토큰 변경 사항

### 추가할 토큰 (tailwind.config.js)

```js
// keyframes에 추가
'shimmer': {
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
}

// animation에 추가
'shimmer': 'shimmer 1.8s infinite linear',
```

### 보존 목록 (변경 금지)
| 토큰 | 값 | 이유 |
|------|-----|------|
| `colors.primary` | `#1E3A8A` | 전역 사용 |
| `fontFamily.sans` | `['Inter', 'sans-serif']` | 전역 폰트 |
| `animation.fade-in-down` | 기존값 | Nav에서 사용 중 |
| `keyframes.fade-in-down` | 기존값 | 위와 동일 |

---

## 작업 순서 (Step별)

### Step 1 — API 레이어 강화
**목표**: 타임아웃 + 에러 메시지 친화화  
**수정 파일**: `src/api/vnexis.js`  
**검증 방법**: 오프라인 상태에서 분석 시도 → "인터넷 연결을 확인..." 메시지 표시 확인  
**예상 소요**: 10분

### Step 2 — 스켈레톤 컴포넌트
**목표**: shimmer 애니메이션 스켈레톤 UI 기반 구축  
**수정 파일**: `tailwind.config.js` (str_replace) + `src/components/ui/Skeleton.jsx` (신규)  
**검증 방법**: Skeleton 렌더 후 shimmer 애니메이션 육안 확인  
**예상 소요**: 15분

### Step 3 — 로딩 UX 개선
**목표**: 분석 중 빈 화면 제거, 단계 진행 시각화, 스켈레톤 적용  
**수정 파일**: `src/components/AnalysisPanel.jsx` (str_replace × 2)  
**검증 방법**: 분석 버튼 클릭 후 progress bar + 스켈레톤 표시 확인  
**예상 소요**: 20분

### Step 4 — 에러 처리 개선
**목표**: raw 에러 메시지 제거, 재시도 버튼 추가, alert() 제거  
**수정 파일**: `src/components/AnalysisPanel.jsx` (str_replace × 3)  
**검증 방법**: 잘못된 파일 업로드 → 친화적 메시지 표시, "다시 시도" 클릭 → 재분석 동작  
**예상 소요**: 20분

### Step 5 — 모바일 반응성
**목표**: AnalysisPanel 전 영역 반응형 적용, 터치 타겟 확대  
**수정 파일**: `src/components/AnalysisPanel.jsx` (str_replace × 3)  
**검증 방법**: 브라우저 DevTools 모바일 시뮬레이터(iPhone SE 375px) 레이아웃 확인  
**예상 소요**: 20분

---

## 전체 영향 요약

| 항목 | 수정 전 | 수정 후 |
|------|--------|--------|
| 로딩 UX | 버튼 텍스트만 변경 | progress bar + 스켈레톤 |
| 에러 메시지 | raw 기술 문자열 | 사용자 친화 한국어 |
| 재시도 | 불가 | 에러 배너 내 버튼 |
| 타임아웃 | 없음 | 60초 AbortController |
| 반응형 | 0개 클래스 | 전 영역 적용 |
| 터치 타겟 | 미달 2곳 | 44px 이상 |
| alert() | 2곳 | 인라인 UI 교체 |

---

## 리스크 항목

| 리스크 | 영향 가능성 | 대응 |
|--------|------------|------|
| AnalysisPanel str_replace 범위 오지정 | 중 | 수정 전 Read로 라인 재확인 |
| shimmer 애니메이션 퍼포먼스 | 저 | `will-change: background-position` 미추가 시 GPU 과부하 — 추가 예정 |
| AbortController 60초 설정 | 저 | Gemini 응답이 60초 초과 시 오탐 — 90초로 조정 가능 |
| Evidence 인라인 펼침 전환 | 저 | Alert() 제거 후 빈 공간 — useState expand 패턴으로 교체, 기존 클릭 기능 동일 유지 |
| 기존 정상 기능 영향 | 없음 예상 | AssessmentView, HomeView, Nav는 전혀 건드리지 않음 |
