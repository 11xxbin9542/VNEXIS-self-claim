'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const TENANT_TYPES = [
  { value: 'ga', label: 'GA 법인 (보험대리점)', desc: '소속 설계사 관리 + 분석' },
  { value: 'fc', label: '개인 설계사 (FC)', desc: '고객 진단서 분석' },
  { value: 'surveyor', label: '독립 손해사정사', desc: '업무 자동화' },
];

// 오리지널 코어 엔진 직접 연결
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', displayName: '', tenantName: '', tenantType: 'fc' });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { display_name: form.displayName } },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('회원가입 실패');

      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({ name: form.tenantName || form.displayName, type: form.tenantType })
        .select()
        .single();

      if (tenantError) throw tenantError;

      const { error: userError } = await supabase
        .from('users')
        .insert({ id: authData.user.id, tenant_id: tenant.id, role: 'owner', display_name: form.displayName, email: form.email });

      if (userError) throw userError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-sans text-2xl font-semibold text-slate-800">VNX<span className="text-blue-600">EXIS</span></h1>
          <p className="font-sans text-sm text-slate-500 mt-2">Enterprise 계정 생성</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div><label className="text-xs text-slate-500 block mb-1">이메일</label><input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="text-xs text-slate-500 block mb-1">비밀번호</label><input type="password" required minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="text-xs text-slate-500 block mb-1">담당자명</label><input type="text" required value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>
          <div>
            <label className="text-xs text-slate-500 block mb-2">계정 유형</label>
            <div className="space-y-2">
              {TENANT_TYPES.map(t => (
                <label key={t.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${form.tenantType === t.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                  <input type="radio" value={t.value} checked={form.tenantType === t.value} onChange={e => setForm(f => ({ ...f, tenantType: e.target.value }))} className="accent-blue-600" />
                  <div><p className="text-sm font-medium text-slate-800">{t.label}</p><p className="text-xs text-slate-500">{t.desc}</p></div>
                </label>
              ))}
            </div>
          </div>
          {form.tenantType === 'ga' && <div><label className="text-xs text-slate-500 block mb-1">법인명</label><input type="text" value={form.tenantName} onChange={e => setForm(f => ({ ...f, tenantName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" /></div>}
          {error && <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-lg mt-4 disabled:opacity-50">{loading ? '처리 중...' : '계정 생성'}</button>
        </form>
      </div>
    </div>
  );
}
