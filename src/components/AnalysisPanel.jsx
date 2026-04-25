import { useState, useCallback } from 'react';
import { analyzeDocument } from '../api/vnexis';
import Skeleton from './ui/Skeleton';

const STEPS = [
  { icon: '📄', text: '문서 업로드 완료' },
  { icon: '🔒', text: '개인정보 보호 처리 중...' },
  { icon: '🔍', text: '의학적 소견 인식 중...' },
  { icon: '⚖️', text: '보험 약관 타당성 추론 중...' },
  { icon: '✅', text: '분석 완료 — 결과 불러오는 중' },
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
    setDragOver(false);
    handleFile(e.dataTransfer?.files?.[0]);
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
  const prob = Math.round((grade?.Probability || 0) * 100);
  const isApproved = grade?.Determination?.includes('일반암');

  return (
    <div className="pt-24 max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-5">

      {/* 업로드 존 */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`}
      >
        <input
          type="file"
          accept="application/pdf"
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div className="text-5xl mb-4">{file ? '📎' : '📄'}</div>
        {file ? (
          <>
            <p className="font-semibold text-gray-800">{file.name}</p>
            <p className="text-sm text-gray-400 mt-1">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-gray-700">진단서 / 조직검사지 업로드</p>
            <p className="text-sm text-gray-400 mt-1">PDF · 최대 50MB · 드래그 또는 클릭</p>
          </>
        )}
      </div>

      {/* 분석 버튼 */}
      <button
        onClick={analyze}
        disabled={!file || loading}
        className={`w-full min-h-[52px] py-4 rounded-xl font-bold text-base transition-all
          ${loading
            ? 'bg-gray-100 text-gray-600 border border-gray-200 cursor-wait'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {loading
          ? <span className="flex items-center justify-center gap-2">
              <span>{STEPS[stepIdx].icon}</span>
              <span>{STEPS[stepIdx].text}</span>
              <span className="inline-flex gap-0.5 ml-1">
                {[0,1,2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </span>
            </span>
          : '분석 시작 →'
        }
      </button>

      {/* 로딩 중 단계 progress bar */}
      {loading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>분석 진행 중</span>
            <span>{stepIdx + 1} / {STEPS.length}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 에러 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm flex items-start justify-between gap-3">
          <span>⚠️ {error}</span>
          <button
            onClick={analyze}
            className="shrink-0 text-red-700 font-bold underline hover:no-underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 로딩 중 스켈레톤 */}
      {loading && (
        <div className="space-y-4 mt-2">
          <div className="rounded-2xl p-6 border border-gray-100 space-y-3">
            <Skeleton height="h-3" width="w-24" />
            <Skeleton height="h-7" width="w-48" />
          </div>
          <div className="rounded-2xl p-5 border border-gray-100 space-y-3">
            <Skeleton height="h-3" width="w-32" />
            <div className="flex gap-3">
              <Skeleton height="h-14" width="w-24" />
              <Skeleton height="h-14" width="w-8" />
              <Skeleton height="h-14" width="w-24" />
              <Skeleton height="h-14" width="w-8" />
              <Skeleton height="h-14" width="w-24" />
            </div>
          </div>
          <div className="rounded-2xl p-5 border border-gray-100 space-y-3">
            <Skeleton height="h-3" width="w-40" />
            <Skeleton height="h-12" />
            <Skeleton height="h-12" />
          </div>
        </div>
      )}

      {/* 결과 */}
      {result && (
        <div className="space-y-4">

          {/* 판정 카드 */}
          <div className={`rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3
            ${isApproved
              ? 'bg-emerald-50 border border-emerald-300'
              : 'bg-amber-50 border border-amber-300'}`}
          >
            <div>
              <p className="text-xs text-gray-400 font-mono mb-1 tracking-widest">VNEXIS FINAL GRADE</p>
              <p className={`text-xl font-bold ${isApproved ? 'text-emerald-700' : 'text-amber-700'}`}>
                {grade?.Determination}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-black ${isApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                {prob}%
              </p>
              <p className="text-xs text-gray-400">신뢰도</p>
            </div>
          </div>

          {/* D→M→C 체인 */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <p className="text-xs font-mono text-gray-400 tracking-widest mb-4">D → M → C 역추론 체인</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {[
                { code: cd?.Code, label: cd?.Name, color: 'text-blue-600' },
                null,
                { code: pf?.Morphology_Code, label: pf?.Term, color: 'text-purple-600' },
                null,
                { code: 'C코드', label: pf?.Assessment, color: 'text-emerald-600', highlight: true },
              ].map((node, i) =>
                node === null ? (
                  <span key={i} className="text-gray-300 text-xl">→</span>
                ) : (
                  <div
                    key={i}
                    className={`bg-white border rounded-xl px-4 py-3 font-mono text-sm
                      ${node.highlight ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200'}`}
                  >
                    <span className={`font-bold ${node.color}`}>{node.code}</span>
                    <span className="block text-xs text-gray-400 mt-0.5 max-w-[120px] truncate">{node.label}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 반론 근거 */}
          {grounds.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
              <p className="text-xs font-mono text-gray-400 tracking-widest">
                ⚖️ CLICK TO EVIDENCE — {grounds.length}건
              </p>
              {grounds.map((g, i) => (
                <div
                  key={i}
                  onClick={() => setExpandedEvidence(expandedEvidence === i ? null : i)}
                  className="border-l-4 border-blue-500 pl-4 py-4 rounded-r-xl cursor-pointer hover:bg-blue-50 transition-all min-h-[44px]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-blue-600 font-semibold">{g.ID}</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{g.Type}</span>
                    <span className="ml-auto text-xs font-mono text-gray-300 border border-gray-100 rounded px-2 py-0.5">
                      p.{g.Page_Number}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{g.Summary}</p>
                  {expandedEvidence === i && g.Evidence_Quote && (
                    <p className="text-xs text-gray-500 font-mono mt-2 bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg">
                      "{g.Evidence_Quote}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 상세 리포트 결제 유도 */}
          <div className="border border-dashed border-blue-300 bg-blue-50 rounded-2xl p-5 text-center space-y-3">
            <p className="text-sm text-blue-700 font-semibold">📄 보험사 제출용 상세 리포트 (판례 전문 + 반박 논리 포함)</p>
            <button
              onClick={() => onPaymentClick?.()}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all min-h-[44px]"
            >
              상세 리포트 받기 (유료)
            </button>
          </div>

          {/* CTA */}
          {cta?.Recommended_Action && (
            <div className="bg-blue-600 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm sm:text-base">{cta.Recommended_Action}</p>
                <p className="text-sm text-blue-200 mt-0.5">{cta.Expected_Gain}</p>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                {ctaClicked ? (
                  <p className="text-blue-100 text-sm text-center py-2">손해사정사 연결 기능 준비 중입니다.</p>
                ) : (
                  <button
                    onClick={() => setCtaClicked(true)}
                    className="bg-white text-blue-700 font-bold text-sm px-5 py-3 rounded-xl hover:bg-blue-50 transition-all min-h-[44px]"
                  >
                    바로 연결 →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
