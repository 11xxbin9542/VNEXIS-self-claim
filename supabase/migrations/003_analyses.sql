create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  user_id uuid references users(id) not null,
  analysis_id text,
  file_hash text,
  patient_age int,
  patient_gender text,
  insurance_company text,
  insurance_type text,
  subscription_year text,
  kcd_version text,
  result_json jsonb not null,
  kcd_code text,
  icd_code text,
  coverage_type text,
  determination text,
  probability float,
  needs_review boolean default false,
  reviewed_by uuid references users(id),
  review_note text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
create index idx_analyses_tenant on analyses(tenant_id);
create index idx_analyses_kcd on analyses(kcd_code);
