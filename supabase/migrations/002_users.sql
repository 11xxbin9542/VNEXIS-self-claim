create table if not exists users (
  id uuid primary key references auth.users(id),
  tenant_id uuid references tenants(id) not null,
  role text default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  display_name text,
  email text,
  is_active boolean default true,
  created_at timestamp default now()
);
create index idx_users_tenant on users(tenant_id);
