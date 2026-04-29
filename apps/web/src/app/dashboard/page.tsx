import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServerClient as createServiceClient } from '@/lib/supabase-server';
import UsageWidget from './UsageWidget';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 테넌트 API Key 서버에서 조회 (클라이언트에 안전하게 전달)
  const sb = createServiceClient();
  const { data: profile } = await sb
    .from('users')
    .select('tenant_id, tenants(api_key)')
    .eq('id', user.id)
    .single();

  const apiKey = (profile?.tenants as { api_key?: string } | null)?.api_key ?? null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#0B1629] mb-6">대시보드</h1>
        <UsageWidget apiKey={apiKey} userId={user.id} />
      </div>
    </main>
  );
}
