import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#0B1629]">대시보드</h1>
        <p className="mt-2 text-slate-500 text-sm">
          Phase 2에서 분석 내역 + 통계 카드가 여기에 추가됩니다.
        </p>
        <div className="mt-6 p-4 bg-white rounded-xl border border-[#E2E8F0] text-sm text-slate-600">
          로그인 UID: <code className="font-mono text-xs">{user.id}</code>
        </div>
      </div>
    </main>
  );
}
