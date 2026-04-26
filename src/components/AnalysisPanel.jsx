import { useState, useCallback } from 'react';
import { analyzeDocument } from '../api/vnexis';
import Skeleton from './ui/Skeleton';
import TermsModal from './TermsModal';

const STEPS = [
  { text: '문서 업로드 완료' },
  { text: '개인정보 보호 처리 중...' },
  { text: '의학적 소견 인식 중...' },
  { text: '보험 약관 타당성 추론 중...' },
  { text: '최종 판정 생성 중...' },
];

export default function AnalysisPanel({ onPaymentClick }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState(null);
  const [ctaClicked, setCtaClicked] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('PDF 파일만 업로드 가능합니다.');
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setError('파일 크기가 50MB를 초과합니다.');
      return;
    }
    setError(null);
    setFile(f);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    console.log('[DROP] 이벤트 발생');
    console.log('[DROP] dataTransfer:', e.dataTransfer);
    console.log('[DROP] files:', e.dataTransfer?.files);
    console.log('[DROP] items:', e.dataTransfer?.items);
    const file = e.dataTransfer?.files?.[0];
    console.log('[DROP] file:', file);
    console.log('[DROP] file.type:', file?.type);
    console.log('[DROP] file.name:', file?.name);
    handleFile(file);
  }, [handleFile]);

  const analyze = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setStepIdx(0);

    const timer = setInterval(() => {
      setStepIdx(i => Math.min(i + 1, STEPS.length - 2));
    }, 6000);

    try {
      const data = await analyzeDocument(file);
      clearInterval(timer);
      setStepIdx(STEPS.length - 1);
      setResult(data);
    } catch (e) {
      clearInterval(timer);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const grade = result?.Diagnosis_Assessment?.VNEXIS_Final_Grade;
  const grounds = result?.Diagnosis_Assessment?.Legal_Grounds || [];
  const cd = result?.Diagnosis_Assessment?.Clinical_Diagnosis;
  const pf = result?.Diagnosis_Assessment?.Pathology_Finding;
  const cta = result?.CTA_Logic;
  const ps = result?.Patient_Summary;
  const prob = Math.round((grade?.Probability || 0) * 100);
  const isApproved = grade?.Determination?.includes('일반암');

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* ── 히어로 (모바일) ── */}
      <div className="bg-navy md:hidden px-5 pt-6 pb-5">
        <div className="inline-flex items-center gap-1.5 bg-blue-900/30 border border-blue-400/20 rounded-full px-3 py-1 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-light"></span>
          <span className="font-mono text-[10px] text-blue-300 tracking-widest">AI-POWERED CLAIM ANALYSIS</span>
        </div>
        <h1 className="font-sans text-[22px] font-medium text-white leading-snug mb-2">
          보험사가 숨긴 <span className="text-brand-blue-light">수천만 원</span>,<br/>AI가 찾아드립니다
        </h1>
        <p className="font-sans text-[13px] text-slate-400 leading-relaxed">
          진단서 PDF 하나로 30초 안에 일반암 인정 가능성과 숨은 보험금을 분석해 드립니다.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[['90%','분석 정확도'],['30s','평균 분석'],['2,400+','분석 건수']].map(([n,l]) => (
            <div key={l} className="bg-white/5 border border-white/10 rounded-lg py-2.5 text-center">
              <span className="font-mono text-[18px] font-medium text-white block">{n}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 히어로 (PC) ── */}
      <div className="hidden md:block bg-navy px-10 py-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-900/30 border border-blue-400/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-light"></span>
              <span className="font-mono text-[10px] text-blue-300 tracking-widest">AI-POWERED CLAIM ANALYSIS</span>
            </div>
            <h1 className="font-sans text-[32px] font-medium text-white leading-snug mb-3">
              보험사가 숨긴 <span className="text-brand-blue-light">수천만 원</span>,<br/>AI가 찾아드립니다
            </h1>
            <p className="font-sans text-[14px] text-slate-400 leading-relaxed">
              진단서 PDF 하나로 30초 안에 일반암 인정 가능성과<br/>숨은 보험금을 분석해 드립니다.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 flex-shrink-0">
            {[['90%','분석 정확도'],['30s','평균 분석'],['2,400+','누적 건수']].map(([n,l]) => (
              <div key={l} className="bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-center">
                <span className="font-mono text-[22px] font-medium text-white block">{n}</span>
                <span className="text-[11px] text-slate-500 block mt-1">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 업로드 + 결과 영역 ── */}
      <div className="px-4 md:px-0 py-4 md:py-8 md:max-w-2xl md:mx-auto space-y-3">

        {/* 업로드 존 */}
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`relative bg-white border rounded-xl transition-all cursor-pointer
            ${dragOver ? 'border-brand-blue bg-brand-blue-dim' : 'border-surface-border hover:border-brand-blue-light'}`}
        >
          <input
            type="file"
            accept="application/pdf"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={e => handleFile(e.target.files?.[0])}
          />
          {file ? (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="text-lg">📎</span>
              <div className="flex-1 min-w-0">
                <p className="font-sans font-medium text-[13px] text-navy truncate">{file.name}</p>
                <p className="font-mono text-[11px] text-brand-teal">{(file.size/1024/1024).toFixed(1)} MB</p>
              </div>
              <span className="text-brand-teal text-sm font-medium">✓</span>
            </div>
          ) : (
            <div className="py-7 text-center">
              <div className="w-11 h-11 bg-brand-blue-dim rounded-lg flex items-center justify-center mx-auto mb-3 text-xl">📄</div>
              <p className="font-sans font-medium text-[14px] text-navy mb-1">진단서 · 조직검사지 업로드</p>
              <p className="font-sans text-[12px] text-slate-400">
                드래그하거나 <span className="text-brand-blue font-medium">클릭</span>하여 선택
                <span className="block mt-0.5">스캔본 · PDF · 최대 50MB</span>
              </p>
            </div>
          )}
        </div>

        {/* 에러 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-sans text-[12px] text-red-700 animate-fadeUp">
            ⚠️ {error}
          </div>
        )}

        {/* 약관 동의 안내 */}
        {file && !loading && !result && (
          <p className="font-sans text-[10px] text-slate-400 text-center leading-relaxed">
            분석 시작 시{' '}
            <span className="text-brand-blue underline cursor-pointer" onClick={() => setShowTerms(true)}>이용약관</span>{' '}및{' '}
            <span className="text-brand-blue underline cursor-pointer" onClick={() => setShowTerms(true)}>비식별화 데이터 활용</span>에 동의하는 것으로 간주합니다.
          </p>
        )}

        {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

        {/* 분석 버튼 */}
        <button
          onClick={analyze}
          disabled={!file || loading}
          className={`w-full rounded-xl py-3.5 font-sans font-medium text-[14px] transition-all
            ${loading
              ? 'bg-slate-100 text-slate-500 border border-surface-border cursor-wait'
              : 'bg-navy hover:bg-navy-80 text-white shadow-sm'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></span>
              {STEPS[stepIdx]?.text || '분석 중...'}
            </span>
          ) : '분석 시작 →'}
        </button>

        {/* 프로그레스 */}
        {loading && (
          <div className="bg-white border border-surface-border rounded-xl px-4 py-4 animate-fadeUp">
            <p className="font-mono text-[9px] tracking-widest text-slate-400 mb-3">
              ANALYZING — {file?.name}
            </p>
            <div className="space-y-2.5 mb-3">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] flex-shrink-0
                    ${i < stepIdx ? 'bg-brand-teal text-white'
                    : i === stepIdx ? 'bg-brand-blue text-white'
                    : 'bg-slate-100 border border-surface-border text-slate-400'}`}>
                    {i < stepIdx ? '✓' : i + 1}
                  </div>
                  <span className={`font-sans text-[12px]
                    ${i < stepIdx ? 'text-slate-400'
                    : i === stepIdx ? 'text-navy font-medium'
                    : 'text-slate-300'}`}>
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-0.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-blue to-brand-blue-light rounded-full transition-all duration-700"
                style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── 결과 ── */}
        {result && (
          <div className="space-y-3 animate-fadeUp">

            {/* 판정 카드 */}
            <div className="bg-white border border-surface-border rounded-xl px-5 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-slate-400 mb-1.5">VNEXIS FINAL GRADE</p>
                  <p className="font-sans font-medium text-[20px] text-navy leading-tight">
                    {grade?.Determination}
                  </p>
                  <p className="font-sans text-[12px] text-brand-teal font-medium mt-1.5">
                    숨은 보험금 수령 가능성 높음
                  </p>
                </div>
                <div className="relative w-[64px] h-[64px] flex-shrink-0">
                  <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#EFF6FF" strokeWidth="5"/>
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#1D4ED8" strokeWidth="5"
                      strokeDasharray="163.4"
                      strokeDashoffset={163.4 * (1 - prob / 100)}
                      strokeLinecap="round"/>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[15px] font-medium text-navy">
                    {prob}%
                  </span>
                </div>
              </div>
            </div>

            {/* 후킹 메시지 */}
            <div className="flex gap-3 bg-gradient-to-r from-brand-blue-dim to-brand-teal-dim border border-blue-100 rounded-xl px-4 py-3.5">
              <div className="w-0.5 bg-gradient-to-b from-brand-blue to-brand-teal rounded-full flex-shrink-0 self-stretch"></div>
              <p className="font-sans text-[12px] text-blue-900 leading-relaxed">
                귀하의 진단서는 <strong className="font-medium">일반암(C코드)으로 인정받아</strong> 수천만 원의 숨은 보험금을 받을 확률이 {prob}%입니다. 보험사는 이 사실을 알리지 않습니다.
              </p>
            </div>

            {/* D→M→C 체인 */}
            <div className="bg-white border border-surface-border rounded-xl px-5 py-4">
              <p className="font-mono text-[9px] tracking-widest text-slate-400 mb-3">D → M → C  역추론 체인</p>
              <div className="flex items-stretch overflow-hidden rounded-lg border border-surface-border">
                {[
                  { code: cd?.Code, name: cd?.Name, isFinal: false },
                  null,
                  { code: pf?.Morphology_Code, name: pf?.Term, isFinal: false },
                  null,
                  { code: 'C코드', name: pf?.Assessment, isFinal: true },
                ].map((node, i) =>
                  node === null ? (
                    <div key={i} className="flex items-center px-2 bg-slate-50 border-x border-surface-border text-slate-400 text-sm">→</div>
                  ) : (
                    <div key={i} className={`flex-1 px-3 py-2.5 min-w-0 ${node.isFinal ? 'bg-brand-teal-dim' : 'bg-slate-50'}`}>
                      <p className={`font-mono text-[12px] font-medium truncate ${node.isFinal ? 'text-brand-teal' : 'text-navy'}`}>
                        {node.code}
                      </p>
                      <p className="font-sans text-[10px] text-slate-400 mt-0.5 truncate">{node.name}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* 블러 게이트 */}
            {grounds.length > 0 && (
              <div className="relative rounded-xl overflow-hidden">
                <div className={`bg-white border border-surface-border rounded-xl px-5 py-4 transition-all duration-500
                  ${isPaid ? '' : 'blur-md pointer-events-none select-none'}`}>
                  <p className="font-mono text-[9px] tracking-widest text-slate-400 mb-3">핵심 의무기록 발췌 및 법적 근거</p>
                  {grounds.map((g, i) => (
                    <div key={i} className={`py-3 ${i < grounds.length - 1 ? 'border-b border-surface-border' : ''}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded font-medium
                          ${g.Source_Type === '판례' ? 'bg-brand-teal-dim text-brand-teal'
                          : g.Source_Type === 'KCD' ? 'bg-brand-amber-dim text-brand-amber'
                          : 'bg-brand-blue-dim text-brand-blue'}`}>
                          {g.Source_Type || '의무기록'}
                        </span>
                        <span className="font-sans text-[11px] text-slate-500">{g.ID}</span>
                        <span className="font-mono text-[9px] text-slate-300 border border-surface-border rounded px-1.5 py-0.5 ml-auto">
                          p.{g.Page_Number}
                        </span>
                      </div>
                      <p className="font-sans text-[12px] text-slate-600 leading-relaxed">{g.Summary}</p>
                      {g.Evidence_Quote && (
                        <p className="font-mono text-[10px] text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded mt-1.5 border-l-2 border-slate-200">
                          "{g.Evidence_Quote}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {!isPaid && (
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-transparent via-white/60 to-white/95 p-4">
                    <div className="bg-white border border-surface-border-2 rounded-xl p-5 w-full text-center shadow-lg">
                      <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center mx-auto mb-3 text-base">🔒</div>
                      <p className="font-sans font-medium text-[14px] text-navy mb-1">핵심 증거 {grounds.length}건 잠금됨</p>
                      <p className="font-sans text-[11px] text-slate-500 leading-relaxed mb-3">
                        보험사에 실제 제출할 서류에 필요한<br/>구체적인 근거를 확인하세요
                      </p>
                      <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                        {['의무기록 발췌 좌표', 'KCD 코드 적용 지침', '대법원 판례 전문'].map(c => (
                          <span key={c} className="font-sans text-[10px] bg-slate-50 border border-surface-border rounded-full px-2.5 py-1 text-slate-500">{c}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => onPaymentClick?.()}
                        className="w-full bg-navy hover:bg-navy-80 text-white font-sans font-medium text-[13px] py-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        📄 상세 리포트 받기 (유료)
                      </button>
                      <p className="font-sans text-[10px] text-slate-400 mt-2">결제 후 즉시 열람 · 보험사 제출용 PDF 포함</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 환자 요약 */}
            {ps && (
              <div className="grid grid-cols-4 gap-2">
                {[
                  ['나이', ps.Age ? `${ps.Age}세` : '-'],
                  ['성별', ps.Gender || '-'],
                  ['가입일', ps.Subscription_Date?.slice(0, 10) || '-'],
                  ['KCD', ps.KCD_Version || '-'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <span className="font-mono text-[9px] tracking-wide text-slate-400 block mb-1">{k}</span>
                    <span className="font-sans font-medium text-[12px] text-navy block truncate">{v}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
