create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('ga', 'surveyor', 'fc', 'admin')),
  logo_url text,
  plan text default 'basic' check (plan in ('basic', 'pro', 'enterprise')),
  api_key text unique default gen_random_uuid()::text,
  monthly_quota int default 100,
  is_active boolean default true,
  created_at timestamp default now()
);
