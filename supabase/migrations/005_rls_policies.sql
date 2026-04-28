alter table analyses enable row level security;
alter table api_usage enable row level security;

create policy "analyses_tenant_isolation" on analyses
  for all to authenticated
  using (tenant_id = (select tenant_id from users where users.id = auth.uid()))
  with check (tenant_id = (select tenant_id from users where users.id = auth.uid()));

create policy "usage_tenant_isolation" on api_usage
  for select to authenticated
  using (tenant_id = (select tenant_id from users where users.id = auth.uid()));
