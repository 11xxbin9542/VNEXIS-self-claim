// Supabase DB 타입 — 001~004 마이그레이션과 1:1 매칭
// supabase gen types typescript 명령으로 자동 갱신 가능

export type TenantType = 'ga' | 'surveyor' | 'fc' | 'admin';
export type PlanType = 'basic' | 'pro' | 'enterprise';
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Tenant {
  id: string;
  name: string;
  type: TenantType;
  logo_url: string | null;
  plan: PlanType;
  api_key: string;
  monthly_quota: number;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  tenant_id: string;
  role: UserRole;
  display_name: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Analysis {
  id: string;
  tenant_id: string;
  user_id: string;
  analysis_id: string | null;
  file_hash: string | null;
  patient_age: number | null;
  patient_gender: string | null;
  insurance_company: string | null;
  insurance_type: string | null;
  subscription_year: string | null;
  kcd_version: string | null;
  result_json: Record<string, unknown>;
  kcd_code: string | null;
  icd_code: string | null;
  coverage_type: string | null;
  determination: string | null;
  probability: number | null;
  needs_review: boolean;
  reviewed_by: string | null;
  review_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiUsage {
  id: number;
  tenant_id: string;
  user_id: string | null;
  endpoint: string;
  status_code: number | null;
  response_time_ms: number | null;
  tokens_used: number;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      tenants: { Row: Tenant; Insert: Omit<Tenant, 'id' | 'created_at'>; Update: Partial<Tenant> };
      users:   { Row: User;   Insert: Omit<User,   'created_at'>;         Update: Partial<User> };
      analyses:  { Row: Analysis;  Insert: Omit<Analysis,  'id' | 'created_at' | 'updated_at'>; Update: Partial<Analysis> };
      api_usage: { Row: ApiUsage;  Insert: Omit<ApiUsage,  'id' | 'created_at'>;               Update: Partial<ApiUsage> };
    };
  };
}
