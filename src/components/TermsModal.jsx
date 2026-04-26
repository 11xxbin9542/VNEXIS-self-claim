export default function TermsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-surface-border px-5 py-4 flex items-center justify-between">
          <p className="font-sans font-medium text-[14px] text-navy">이용약관 및 개인정보 처리방침</p>
          <button onClick={onClose} className="text-slate-400 hover:text-navy text-lg">✕</button>
        </div>
        <div className="px-5 py-4 font-sans text-[12px] text-slate-600 leading-relaxed space-y-4">
          <div>
            <p className="font-medium text-navy mb-1">제1조 (서비스 성격)</p>
            <p>본 서비스는 AI를 활용한 참고용 정보 제공 서비스이며, 법적·의료적 조언을 대체하지 않습니다. 분석 결과는 전문 손해사정사 또는 의료전문가의 최종 판단을 대신하지 않습니다.</p>
          </div>
          <div>
            <p className="font-medium text-navy mb-1">제2조 (업로드 자료 처리)</p>
            <p>업로드된 의무기록은 분석 목적으로만 사용되며, 분석 완료 즉시 서버에서 삭제됩니다. Google Gemini API를 통해 처리되며, Google의 개인정보 처리방침이 적용됩니다.</p>
          </div>
          <div className="bg-brand-blue-dim border border-blue-100 rounded-lg px-4 py-3">
            <p className="font-medium text-brand-blue mb-1">제3조 (비식별화 데이터 수집 동의) ★</p>
            <p>서비스 품질 향상을 위해 분석 결과의 일부를 비식별화하여 수집합니다.</p>
            <p className="mt-2 font-medium text-navy">수집 항목: 성별, 연령대(10세 단위), D코드, M-Code, C코드, 판정 결과</p>
            <p className="mt-1 text-red-600 font-medium">절대 미수집: 성명, 주민번호, 생년월일, 병원명, 의사명, 주소 등 식별 정보</p>
          </div>
          <div>
            <p className="font-medium text-navy mb-1">제4조 (유료 서비스 및 환불)</p>
            <p>상세 리포트는 결제 후 즉시 제공됩니다. 열람 전 전액 환불 가능, 열람 후 환불 불가. 결제는 Toss Payments를 통해 처리됩니다.</p>
          </div>
          <div>
            <p className="font-medium text-navy mb-1">제5조 (면책)</p>
            <p>분석 결과의 정확성을 보장하지 않으며, 이를 근거로 한 보험 청구 결과에 책임지지 않습니다. 타인의 의무기록 업로드 시 모든 법적 책임은 이용자에게 있습니다.</p>
          </div>
          <div className="bg-slate-50 rounded-lg px-4 py-3 text-[11px] text-slate-500">
            <p className="font-medium text-slate-600 mb-2">개인정보 처리방침 요약</p>
            <p>수집 목적: 서비스 제공, AI 모델 개선</p>
            <p>보유 기간: 수집일로부터 3년 (동의 철회 시 즉시 삭제)</p>
            <p>제3자 제공: 없음</p>
            <p>처리 위탁: Google LLC (Gemini API), Railway Inc. (서버 호스팅)</p>
            <p className="mt-1">문의: contact@vnexis.ai</p>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-surface-border">
          <button
            onClick={onClose}
            className="w-full bg-navy text-white font-sans font-medium text-[13px] py-3 rounded-lg"
          >
            확인 및 동의
          </button>
        </div>
      </div>
    </div>
  );
}
