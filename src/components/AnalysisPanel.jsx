import { useState, useCallback } from 'react';
import { analyzeDocument } from '../api/vnexis';

const STEPS = [
  '📄 PDF 파싱 중...',
  '🔒 PII 마스킹 처리...',
  '🤖 Gemini Vision 분석 중...',
  '⚖️ D→M→C 코드 역추론...',
  '✅ 결과 생성 완료',
];

export default function AnalysisPanel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

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
    }, 2000);

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
    <div className="pt-24 max-w-2xl mx-auto px-4 py-10 space-y-5">

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
        className={`w-full py-4 rounded-xl font-bold text-base transition-all
          ${loading
            ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-wait'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {loading ? STEPS[stepIdx] : '분석 시작 →'}
      </button>

      {/* 에러 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* 결과 */}
      {result && (
        <div className="space-y-4">

          {/* 판정 카드 */}
          <div className={`rounded-2xl p-6 flex justify-between items-center
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
            <div className="flex items-center gap-3 flex-wrap">
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
                  onClick={() => alert(`Page ${g.Page_Number}\n\n"${g.Evidence_Quote}"`)}
                  className="border-l-4 border-blue-500 pl-4 py-2 rounded-r-xl cursor-pointer hover:bg-blue-50 transition-all"
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
                  {g.Evidence_Quote && (
                    <p className="text-xs text-gray-400 font-mono mt-1.5 bg-gray-50 px-2 py-1 rounded">
                      "{g.Evidence_Quote}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          {cta?.Recommended_Action && (
            <div className="bg-blue-600 text-white rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold">{cta.Recommended_Action}</p>
                <p className="text-sm text-blue-200 mt-0.5">{cta.Expected_Gain}</p>
              </div>
              <button
                onClick={() => alert('손해사정사 연결 기능 준비 중')}
                className="shrink-0 bg-white text-blue-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all"
              >
                바로 연결 →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
