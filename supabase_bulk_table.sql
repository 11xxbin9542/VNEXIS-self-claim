-- VNEXIS 벌크 케이스 분석 결과 테이블
-- Supabase SQL Editor에서 실행하세요

CREATE TABLE IF NOT EXISTS vnexis_bulk_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 케이스 식별
  case_group        TEXT NOT NULL,     -- 피보험자별 그룹 키 (이름 기반)
  person_name       TEXT,              -- 추출된 피보험자 이름
  file_name         TEXT NOT NULL,     -- 원본 파일명
  insurance_company TEXT,             -- 추출된 보험사/기관명

  -- 분석 결과 (VNEXIS_Response 핵심 필드)
  analysis_id       TEXT,
  analysis_ts       TIMESTAMPTZ,

  -- Patient_Summary
  patient_age       TEXT,
  patient_gender    TEXT,
  kcd_version       TEXT,

  -- Medical_Opinion
  raw_diagnosis     TEXT,
  clinical_finding  TEXT,
  expert_assessment TEXT,
  confidence        TEXT,

  -- Coding_Standard
  kcd_code          TEXT,
  kcd_name          TEXT,
  icd_code          TEXT,

  -- Insurance_Coverage
  coverage_type     TEXT,
  meets_definition  BOOLEAN,
  gap_analysis      TEXT,

  -- Final_Grade
  final_grade       TEXT,
  probability       NUMERIC(5,2),

  -- CTA_Logic
  recommended_action TEXT,
  expected_gain      TEXT,

  -- 전체 응답 원본
  raw_response      JSONB,

  -- 처리 메타
  status            TEXT DEFAULT 'pending',  -- pending | success | failed
  error_message     TEXT,
  processed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vnexis_bulk_group  ON vnexis_bulk_cases (case_group);
CREATE INDEX IF NOT EXISTS idx_vnexis_bulk_person ON vnexis_bulk_cases (person_name);
CREATE INDEX IF NOT EXISTS idx_vnexis_bulk_status ON vnexis_bulk_cases (status);
CREATE INDEX IF NOT EXISTS idx_vnexis_bulk_grade  ON vnexis_bulk_cases (final_grade);
