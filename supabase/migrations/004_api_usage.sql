create table if not exists api_usage (
  id bigserial primary key,
  tenant_id uuid references tenants(id) not null,
  user_id uuid references users(id),
  endpoint text not null,
  status_code int,
  response_time_ms int,
  tokens_used int default 0,
  created_at timestamp default now()
);
create index idx_usage_tenant on api_usage(tenant_id);
create index idx_usage_created on api_usage(created_at);
