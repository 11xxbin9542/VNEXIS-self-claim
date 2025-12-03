import React, { useState, useEffect } from 'react';

// SVG 아이콘 컴포넌트
const Menu = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const X = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Check = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const Heart = ({ className, fill }) => (
  <svg className={className} fill={fill || "none"} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const User = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CreditCard = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const Scan = ({ size, className }) => (
  <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
);

const Timeline = ({ size, className }) => (
  <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const ShieldCheck = ({ size, className }) => (
  <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const FileText = ({ size, className }) => (
  <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Auth Modal - 토스 스타일 */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowAuthModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {authMode === 'login' ? '로그인' : '회원가입'}
              </h2>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <input
                type="email"
                placeholder="이메일"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {authMode === 'signup' && (
                <>
                  <input
                    type="password"
                    placeholder="비밀번호 확인"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="이름"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="전화번호"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </>
              )}
            </div>

            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all mb-4">
              {authMode === 'login' ? '로그인' : '회원가입'}
            </button>

            <div className="text-center">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {authMode === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-4">간편 로그인</p>
              <div className="grid grid-cols-3 gap-3">
                <button className="py-3 bg-yellow-400 hover:bg-yellow-500 rounded-xl font-semibold transition-all text-sm">
                  카카오
                </button>
                <button className="py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all text-sm">
                  네이버
                </button>
                <button className="py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold transition-all text-sm">
                  Google
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal - 토스 스타일 */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">결제하기</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPlan.name} 플랜</h3>
                  <p className="text-gray-600 text-sm">{selectedPlan.desc}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">₩{selectedPlan.price}</div>
                  {selectedPlan.price !== "Contact" && <div className="text-gray-500 text-sm">/월</div>}
                </div>
              </div>
              <div className="border-t border-blue-200 pt-4">
                <ul className="space-y-2">
                  {selectedPlan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">결제 수단</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 px-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    신용카드
                  </button>
                  <button className="py-3 px-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl font-semibold transition-all">
                    계좌이체
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">카드 정보</label>
                <input
                  type="text"
                  placeholder="카드 번호"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all mb-3"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">청구 정보</label>
                <input
                  type="text"
                  placeholder="이름"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all mb-3"
                />
                <input
                  type="email"
                  placeholder="이메일"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">월 요금</span>
                <span className="text-gray-900 font-bold">₩{selectedPlan.price}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">VAT (10%)</span>
                <span className="text-gray-900 font-bold">₩{selectedPlan.price !== "Contact" ? (parseInt(selectedPlan.price.replace(/,/g, '')) * 0.1).toLocaleString() : "0"}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold">총 결제 금액</span>
                  <span className="text-2xl font-bold text-blue-600">₩{selectedPlan.price !== "Contact" ? (parseInt(selectedPlan.price.replace(/,/g, '')) * 1.1).toLocaleString() : "Contact"}</span>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all">
              결제하기
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              결제 시 <a href="#" className="text-blue-600 hover:underline">이용약관</a> 및 <a href="#" className="text-blue-600 hover:underline">개인정보처리방침</a>에 동의하게 됩니다.
            </p>
          </div>
        </div>
      )}

      {/* Navbar - 토스 스타일 */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-12">
              <h1 className="text-2xl font-bold text-gray-900">VNEXIS</h1>
              <div className="hidden md:flex items-center gap-8">
                <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 font-medium">서비스</a>
                <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 font-medium">요금</a>
                <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 font-medium">고객센터</a>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-[15px] text-gray-700 hover:text-gray-900 font-medium px-4 py-2"
              >
                로그인
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                시작하기
              </button>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - 토스 스타일 */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h2 className="text-[56px] leading-[1.2] font-bold text-gray-900 mb-8 tracking-tight">
              보험금 청구,<br />
              이제 쉽고 빠르게
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-10">
              복잡한 의료기록 분석부터 지급 가능성 예측까지,<br />
              VNEXIS AI가 당신의 정당한 권리를 찾아드려요.
            </p>
            <button
              onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-xl transition-colors inline-flex items-center gap-2"
            >
              무료로 시작하기
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features - 토스 스타일 */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              AI가 분석하고,<br />전문가가 검토해요
            </h3>
            <p className="text-lg text-gray-600">
              복잡한 보험금 청구, 이제 쉽게 해결하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Scan, title: "AI 의료기록 분석", desc: "진단서를 업로드하면 3초 만에 데이터화해요" },
              { icon: Timeline, title: "스마트 타임라인", desc: "병원 방문 기록을 보기 편한 타임라인으로 정리해요" },
              { icon: ShieldCheck, title: "약관 자동 매칭", desc: "가입한 보험 약관과 자동으로 비교해요" },
              { icon: FileText, title: "원클릭 리포트", desc: "전문가 수준의 청구 리포트를 생성해요" }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white p-8 rounded-2xl hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                    <Icon size={28} className="text-blue-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 청구대행 서비스 - 토스 스타일 */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="text-sm font-semibold text-blue-600 mb-4">청구대행</div>
              <h3 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                복잡한 청구,<br />
                전문가가 대신해요
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                손해사정사 자격을 가진 전문가가<br />
                청구부터 지급까지 모든 과정을 대행해드려요.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "시간 절약: 복잡한 서류 작업 불필요",
                  "전문성: 손해사정사 자격 보유 전문가",
                  "높은 성공률: 평균 승인율 95% 이상",
                  "투명한 진행: 실시간 진행 상황 확인",
                  "성공 보수제: 지급 성공 시에만 수수료 발생"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">평균 청구 성공률</span>
                  <span className="text-3xl font-bold text-blue-600">95.3%</span>
                </div>
                <div className="text-sm text-gray-600">2024년 기준</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-6">청구대행 프로세스</h4>
              <div className="space-y-4">
                {[
                  { step: "1", title: "서류 제출", desc: "의료기록을 업로드해요" },
                  { step: "2", title: "AI 분석", desc: "자동으로 분석을 진행해요" },
                  { step: "3", title: "전문가 검토", desc: "손해사정사가 검토해요" },
                  { step: "4", title: "보험사 제출", desc: "최적화된 청구서를 제출해요" },
                  { step: "5", title: "보험금 지급", desc: "결과를 안내해드려요" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - 토스 스타일 */}
      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-bold text-gray-900 mb-6">
              합리적인 요금
            </h3>
            <p className="text-xl text-gray-600">
              필요한 만큼만 사용하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Basic",
                price: "9,900",
                desc: "개인 사용자",
                features: ["월 5건 AI 분석", "기본 청구 리포트", "이메일 지원"],
                popular: false
              },
              {
                name: "Pro",
                price: "19,800",
                desc: "전문 사용자",
                features: ["무제한 AI 분석", "청구대행 서비스", "전문가 상담", "우선 처리"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "문의",
                desc: "기업 고객",
                features: ["맞춤형 솔루션", "전담 매니저", "API 연동", "SLA 보장"],
                popular: false
              }
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 ${plan.popular ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-white border-2 border-gray-200'}`}>
                {plan.popular && (
                  <div className="text-sm font-semibold mb-4 text-blue-100">가장 인기있는 플랜</div>
                )}
                <div className={`text-lg font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </div>
                <div className={`text-sm mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.desc}
                </div>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price === "문의" ? plan.price : `₩${plan.price}`}
                  </span>
                  {plan.price !== "문의" && (
                    <span className={`text-lg ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>/월</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-blue-600'}`} />
                      <span className={`text-[15px] ${plan.popular ? 'text-white' : 'text-gray-700'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                >
                  시작하기
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 손해사정선임권 - 토스 스타일 */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-blue-600 mb-4">소비자 권리</div>
            <h3 className="text-5xl font-bold text-gray-900 mb-6">
              손해사정선임권,<br />
              알고 계셨나요?
            </h3>
            <p className="text-xl text-gray-600">
              보험금 청구 시 소비자가 직접 손해사정사를 선택할 수 있어요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "소비자 권리",
                desc: "보험금 청구 시 보험사가 아닌 소비자가 직접 손해사정사를 선택할 수 있는 권리예요"
              },
              {
                title: "공정한 평가",
                desc: "소비자 편에서 공정하게 보험금을 산정하여 정당한 권리를 찾아드려요"
              },
              {
                title: "전문 업체 연결",
                desc: "VNEXIS는 신뢰할 수 있는 전문 손해사정 업체와 연결해드려요"
              },
              {
                title: "법적 근거",
                desc: "보험업법 제185조, 보험업감독규정 제7-44조에 명시된 법적 권리예요"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 밸류마크 서비스 - 토스 스타일 */}
      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="text-sm font-semibold text-blue-600 mb-4">(주)밸류마크 서비스</div>
              <h3 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                내 보험,<br />
                제대로 확인해보세요
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                가입한 보험의 보장 내용을 분석하고<br />
                필요한 보장이 빠진 건 없는지 확인해드려요.
              </p>

              <div className="space-y-4">
                {[
                  "보험 점검: 현재 가입한 보험 분석",
                  "보장 분석: 중복·부족 보장 확인",
                  "맞춤 추천: 필요한 보장 추천",
                  "무료 체험: 첫 1회 무료"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-6">보험 점검 신청</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="이름"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <input
                  type="tel"
                  placeholder="전화번호"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <input
                  type="email"
                  placeholder="이메일"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all">
                  무료 체험 신청하기
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                신청 후 24시간 내 연락드려요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 사업 제휴 - 토스 스타일 */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-blue-600 mb-4">사업 제휴</div>
            <h3 className="text-5xl font-bold text-gray-900 mb-6">
              함께 성장할<br />
              파트너를 찾아요
            </h3>
            <p className="text-xl text-gray-600">
              VNEXIS와 함께 보험 산업의 혁신을 만들어가세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "보험사",
                desc: "AI 기반 청구 시스템으로 업무 효율을 높이고 고객 만족도를 향상시켜요"
              },
              {
                title: "의료기관",
                desc: "환자의 보험금 청구를 지원하여 의료 서비스 만족도를 높여요"
              },
              {
                title: "기업",
                desc: "임직원 복지 향상을 위한 보험금 청구 지원 서비스를 제공해요"
              }
            ].map((partner, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all text-center">
                <h4 className="text-xl font-bold text-gray-900 mb-3">{partner.title}</h4>
                <p className="text-gray-600 leading-relaxed">{partner.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
            <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">제휴 문의</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="회사명"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <input
                type="text"
                placeholder="담당자명"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <input
                type="email"
                placeholder="이메일"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <input
                type="tel"
                placeholder="연락처"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <textarea
                placeholder="문의 내용"
                rows={4}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all">
                제휴 문의하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - 토스 스타일 */}
      <section className="py-32 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-5xl font-bold mb-6">
            지금 바로 시작하세요
          </h3>
          <p className="text-xl text-gray-300 mb-10">
            복잡한 보험금 청구, VNEXIS와 함께라면 쉬워요
          </p>
          <button
            onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
            className="bg-white text-gray-900 text-lg font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            무료로 시작하기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer - 토스 스타일 */}
      <footer className="bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="font-bold text-gray-900 mb-4">VNEXIS</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                보험금 청구를 쉽고 빠르게
              </p>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-4">서비스</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">AI 분석</a></li>
                <li><a href="#" className="hover:text-gray-900">청구대행</a></li>
                <li><a href="#" className="hover:text-gray-900">보험 점검</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-4">회사</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">회사 소개</a></li>
                <li><a href="#" className="hover:text-gray-900">공지사항</a></li>
                <li><a href="#" className="hover:text-gray-900">채용</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-4">고객지원</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">고객센터</a></li>
                <li><a href="#" className="hover:text-gray-900">자주 묻는 질문</a></li>
                <li><a href="#" className="hover:text-gray-900">이용약관</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500">
              © 2025 VNEXIS Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
