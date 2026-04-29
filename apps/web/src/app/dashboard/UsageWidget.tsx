'use client';

import { useEffect, useState } from 'react';

interface UsageData {
  tenant: string;
  plan: string;
  usage: {
    monthly_used: number;
    monthly_limit: number;
    monthly_remaining: number;
    per_minute_limit: number;
  };
  upgrade_available: boolean;
}

interface Props {
  apiKey: string | null;
  userId: string;
}

export default function UsageWidget({ apiKey, userId }: Props) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!apiKey) { setLoading(false); return; }
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_URL}/api/v1/usage`, {
          headers: { 'X-API-Key': apiKey },
        });
        if (res.ok) setUsage(await res.json());
      } catch (e) {
        console.warn('사용량 조회 실패:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [apiKey]);

  const remaining = usage?.usage.monthly_remaining ?? 100;
  const isLow = remaining < 10;

  const cards = [
    { label: '플랜',       value: usage?.plan?.toUpperCase() ?? 'BASIC',                     color: 'text-[#1D4ED8]' },
    { label: '이번 달 사용', value: `${usage?.usage.monthly_used ?? 0}건`,                     color: 'text-[#0B1629]' },
    { label: '잔여 한도',   value: loading ? '...' : `${remaining}건`,                         color: isLow ? 'text-red-500' : 'text-[#0D9488]' },
    { label: '분당 허용',   value: `${usage?.usage.per_minute_limit ?? '-'}건/min`,            color: 'text-[#0B1629]' },
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-[#E2E8F0] rounded-xl px-5 py-4">
            <p className="font-mono text-[9px] text-slate-400 tracking-widest mb-1 uppercase">
              {label}
            </p>
            <p className={`font-sans text-lg font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {isLow && !loading && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          잔여 분석 한도가 <strong>{remaining}건</strong> 남았습니다.
          {usage?.upgrade_available && ' 플랜을 업그레이드하시면 더 많은 분석이 가능합니다.'}
        </div>
      )}

      <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] text-sm text-slate-600">
        로그인 UID: <code className="font-mono text-xs">{userId}</code>
      </div>
    </>
  );
}
