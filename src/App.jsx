import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icons (Lucide React style SVGs) ---
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
const Search = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const ShieldCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const Send = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);
const Users = ({ className }) => ( // Family/Users
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const Handshake = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);
const Lock = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const UploadCloud = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);
const FileText = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const AlertTriangle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// --- Components ---

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // home, assessment, result, adjuster, valuemark, b2b
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // --- Views ---

  const HomeView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-24">
      {/* Hero Section */}
      <section className="px-6 pb-20 md:pb-32 max-w-7xl mx-auto text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              AI 기반 보험금 셀프 손해사정 플랫폼
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight break-keep"
            >
              보험사와의 기울어진 운동장,<br />
              <span className="text-blue-600">기술로 바로잡습니다.</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed break-keep max-w-2xl"
            >
              AI 진단부터 청구, 그리고 보장 분석까지.<br />
              당신의 정당한 권리를 지키는 올인원 솔루션, VNEXIS.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => navigateTo('assessment')}
                className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                AI 무료 진단 시작하기
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                서비스 소개 영상
              </button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-1 w-full max-w-md md:max-w-full"
          >
            <div className="relative aspect-square md:aspect-[4/3] bg-gradient-to-br from-blue-100 to-indigo-50 rounded-3xl overflow-hidden shadow-2xl border border-white/50">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Abstract UI Representation */}
                <div className="w-3/4 h-3/4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col gap-4">
                  <div className="h-8 w-1/3 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="flex-1 bg-blue-50/50 rounded-xl border border-blue-100 p-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">87%</div>
                      <div className="text-sm text-gray-500">지급 승률 예측</div>
                    </div>
                  </div>
                  <div className="h-12 w-full bg-gray-900 rounded-xl"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5 Pillars Grid */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">VNEXIS 5대 핵심 솔루션</h2>
            <p className="text-gray-600">보험금 청구의 모든 단계에서 당신을 지원합니다.</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: Search, title: "AI 사전/사후 점검", desc: "청구 전 확률 분석 및 부지급 대응 논리 생성", action: () => navigateTo('assessment') },
              { icon: ShieldCheck, title: "손해사정사 선임권", desc: "보험사가 아닌 내가 고르는 무료 전문가", action: () => navigateTo('adjuster') },
              { icon: Send, title: "원스톱 청구 대행", desc: "진단 후 복잡한 서류 제출까지 한 번에", action: () => { } },
              { icon: Users, title: "밸류마크 보장분석", desc: "사고 후 불안한 내 가족 보험 완벽 점검", action: () => navigateTo('valuemark') },
              { icon: Handshake, title: "비즈니스 제휴", desc: "기업 및 전문가 파트너십", action: () => navigateTo('b2b') }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                onClick={item.action}
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );

  const AssessmentView = () => {
    const [step, setStep] = useState('upload'); // upload, analyzing, result

    useEffect(() => {
      if (step === 'analyzing') {
        const timer = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(timer);
              setTimeout(() => setStep('result'), 500);
              return 100;
            }
            return prev + 2;
          });
        }, 50);
        return () => clearInterval(timer);
      }
    }, [step]);

    return (
      <div className="pt-24 pb-20 px-6 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {step === 'upload' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">AI 진단 시작하기</h2>
              <p className="text-gray-600 mb-8">부지급 안내문이나 의무기록지를 업로드하세요.</p>

              <div className="flex gap-4 mb-8">
                <button className="flex-1 py-3 px-4 rounded-xl bg-blue-50 text-blue-700 font-semibold border-2 border-blue-200">청구 전 사전 점검</button>
                <button className="flex-1 py-3 px-4 rounded-xl bg-white text-gray-600 font-semibold border-2 border-gray-100 hover:border-gray-200">부지급 통보 후 대응</button>
              </div>

              <div
                className="border-3 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group"
                onClick={() => setStep('analyzing')}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">파일을 드래그하거나 클릭하여 업로드</h3>
                <p className="text-sm text-gray-500 mb-6">PDF, JPG, PNG 지원 (최대 50MB)</p>
                <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                  <Lock className="w-3 h-3" />
                  모든 문서는 암호화되어 안전하게 처리됩니다
                </div>
              </div>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <div className="text-center pt-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full mx-auto mb-8"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI가 문서를 분석하고 있습니다</h3>
              <p className="text-gray-600 mb-8">잠시만 기다려주세요... {uploadProgress}%</p>
              <div className="max-w-md mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {step === 'result' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Score Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-white/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  <div className="relative w-48 h-48 flex-shrink-0">
                    {/* Gauge Chart SVG */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="#f1f5f9" strokeWidth="16" fill="none" />
                      <motion.circle
                        cx="96" cy="96" r="88"
                        stroke="#3b82f6"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray="553"
                        strokeDashoffset="553"
                        animate={{ strokeDashoffset: 553 - (553 * 0.87) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 }}
                        className="text-5xl font-bold text-gray-900"
                      >
                        87%
                      </motion.span>
                      <span className="text-sm font-medium text-gray-500 mt-1">지급 승률</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
                      청구 가능성 높음
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">충분히 승산이 있는 건입니다.</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      제출하신 자료를 분석한 결과, 약관 제 15조 2항에 의거하여 지급 대상에 해당할 확률이 매우 높습니다. 다만, 의료 자문 결과에 따라 분쟁 소지가 있습니다.
                    </p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                      상세 리포트 확인하기 (15,000원)
                    </button>
                  </div>
                </div>
              </div>

              {/* Locked Content */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 opacity-75 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
                  <Lock className="w-12 h-12 text-gray-400 mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">상세 분석 내용은 리포트 구매 후 확인 가능합니다</h4>
                  <p className="text-gray-500 mb-6">약관 기반 반박 논리, 필요 보완 서류 체크리스트 포함</p>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                  >
                    지금 결제하고 잠금 해제
                  </button>
                </div>

                {/* Dummy Content underneath */}
                <div className="filter blur-sm select-none">
                  <h4 className="font-bold text-lg mb-4">약관 기반 반박 논리</h4>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  const AdjusterView = () => (
    <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">손해사정사 선임권이란?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          보험금 청구 후 보험사가 실사를 나온다고 할 때,<br className="hidden md:block" />
          <span className="text-blue-600 font-bold">소비자가 직접 전문가를 선임할 수 있는 법적 권리</span>입니다.<br />
          (비용은 보험사가 부담합니다)
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-4 items-center mb-16">
        {["보험금 청구", "현장심사 안내", "VNEXIS 접수", "독립 손해사정사 배정", "공정한 조사"].map((step, i) => (
          <React.Fragment key={i}>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm relative z-10">
              <div className="text-sm text-gray-400 mb-2">Step {i + 1}</div>
              <div className="font-bold text-gray-900">{step}</div>
            </div>
            {i < 4 && (
              <div className="hidden md:flex justify-center text-gray-300">
                <ArrowRight className="w-6 h-6" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-blue-600 rounded-3xl p-10 text-center text-white shadow-xl">
        <h3 className="text-2xl font-bold mb-4">내 사건에 딱 맞는 전문가를 찾고 계신가요?</h3>
        <p className="text-blue-100 mb-8">VNEXIS가 검증된 독립 손해사정사를 무료로 매칭해드립니다.</p>
        <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
          전문가 무료 매칭하기
        </button>
      </div>
    </div>
  );

  const ValuemarkView = () => (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/50 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold mb-6 border border-white/20">
            Official Partner (주)밸류마크
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            사고는 예고 없이 찾아옵니다.<br />
            지금 당신의 우산은 튼튼한가요?
          </h2>
          <p className="text-lg text-gray-300 mb-10 leading-relaxed">
            보험금 청구 후, 많은 분들이 보장 공백을 걱정하십니다.<br />
            전문가와 함께 우리 가족의 보험을 점검해보세요.
          </p>

          <div className="bg-white rounded-2xl p-8 max-w-md text-gray-900">
            <h3 className="text-xl font-bold mb-6">무료 보장분석 상담 신청</h3>
            <div className="space-y-4">
              <input type="text" placeholder="이름" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600" />
              <input type="tel" placeholder="연락처" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600" />
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                신청하고 리포트 받기
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">신청 시 '우리 가족 보험 요약 리포트'가 무료로 제공됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const B2BView = () => (
    <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">비즈니스 파트너십</h2>
        <p className="text-gray-600">VNEXIS와 함께 보험 시장의 혁신을 만들어갈 파트너를 찾습니다.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { title: "For Insurers", desc: "AI 심사 자동화 솔루션 도입 문의" },
          { title: "For Hospitals", desc: "환자 서류 발급 간소화 연동" },
          { title: "For Adjusters", desc: "플랫폼 파트너 등록 (전문가용)" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors text-center">
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">제휴 문의하기</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input type="text" placeholder="회사/기관명" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600" />
          <input type="text" placeholder="담당자명" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600" />
        </div>
        <input type="email" placeholder="이메일" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 mb-4" />
        <textarea rows={4} placeholder="문의 내용" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 mb-6 resize-none"></textarea>
        <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
          문의 접수하기
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight cursor-pointer" onClick={() => navigateTo('home')}>
            VNEXIS
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigateTo('assessment')} className="text-sm font-medium text-gray-600 hover:text-gray-900">AI 진단</button>
            <button onClick={() => navigateTo('adjuster')} className="text-sm font-medium text-gray-600 hover:text-gray-900">손해사정사 선임</button>
            <button onClick={() => navigateTo('valuemark')} className="text-sm font-medium text-gray-600 hover:text-gray-900">보장분석</button>
            <button onClick={() => navigateTo('b2b')} className="text-sm font-medium text-gray-600 hover:text-gray-900">제휴문의</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => setShowAuthModal(true)} className="text-sm font-medium text-gray-600 hover:text-gray-900">로그인</button>
            <button onClick={() => navigateTo('assessment')} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              무료 시작
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="text-2xl font-extrabold">VNEXIS</div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-6 text-lg font-medium">
              <button onClick={() => navigateTo('home')} className="text-left">홈</button>
              <button onClick={() => navigateTo('assessment')} className="text-left">AI 진단</button>
              <button onClick={() => navigateTo('adjuster')} className="text-left">손해사정사 선임</button>
              <button onClick={() => navigateTo('valuemark')} className="text-left">보장분석</button>
              <button onClick={() => navigateTo('b2b')} className="text-left">제휴문의</button>
              <hr className="border-gray-100" />
              <button onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }} className="text-left text-blue-600">로그인</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main>
        {currentView === 'home' && <HomeView />}
        {currentView === 'assessment' && <AssessmentView />}
        {currentView === 'result' && <AssessmentView />} {/* Re-use component, internal state handles view */}
        {currentView === 'adjuster' && <AdjusterView />}
        {currentView === 'valuemark' && <ValuemarkView />}
        {currentView === 'b2b' && <B2BView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-500">
            © 2025 VNEXIS Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900">이용약관</a>
            <a href="#" className="hover:text-gray-900">개인정보처리방침</a>
            <a href="#" className="hover:text-gray-900">사업자정보확인</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">로그인</h3>
              <button onClick={() => setShowAuthModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <button className="w-full py-3 bg-[#FEE500] rounded-xl font-semibold text-[#191919]">카카오로 3초 만에 시작하기</button>
              <button className="w-full py-3 bg-[#03C75A] rounded-xl font-semibold text-white">네이버로 시작하기</button>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">또는</span></div>
              </div>
              <input type="email" placeholder="이메일" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600" />
              <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold">이메일로 로그인</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">결제하기</h3>
              <button onClick={() => setShowPaymentModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl mb-6">
              <div className="text-sm text-blue-600 font-semibold mb-1">Premium Report</div>
              <div className="text-2xl font-bold text-gray-900">15,000원</div>
            </div>
            <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors mb-3">
              토스페이로 결제
            </button>
            <button className="w-full py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              신용카드 결제
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;
