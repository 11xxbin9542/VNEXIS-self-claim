import React, { useState, useEffect } from 'react';
import {
  Scan, Timeline, ShieldCheck, FileText, UserCheck, PhoneCall, Briefcase,
  Menu, X, ChevronDown, Check, ArrowRight, Star, Activity, FileCheck, Zap
} from 'lucide-react';


// --- Data ---
const DATA = {
  nav: ["기능", "솔루션", "요금제", "FAQ"],
  hero: {
    title: "보험금 청구,\nAI로 완벽하게.",
    subtitle: "복잡한 의료기록 분석부터 지급 가능성 예측까지.\nVNEXIS AI가 당신의 정당한 권리를 찾아드립니다.",
    stats: [
      { label: "분석 정확도", value: "99.8%" },
      { label: "처리 시간", value: "30초" },
      { label: "누적 분석", value: "10만+" }
    ]
  },
  features: [
    {
      icon: Scan,
      title: "AI 의료기록 분석",
      desc: "OCR 기술로 진단서, 입원확인서를 3초 만에 데이터화합니다."
    },
    {
      icon: Timeline,
      title: "스마트 타임라인",
      desc: "복잡한 병원 방문 기록을 보험사가 보기 편한 타임라인으로 정리합니다."
    },
    {
      icon: ShieldCheck,
      title: "약관 자동 매칭",
      desc: "가입하신 보험 약관을 분석하여 지급 가능한 항목을 찾아냅니다."
    },
    {
      icon: FileText,
      title: "원클릭 리포트",
      desc: "손해사정사가 작성한 듯한 완벽한 청구 리포트를 생성합니다."
    }
  ],
  pricing: [
    {
      name: "Basic",
      price: "9,900",
      desc: "간단한 청구를 위한 필수 기능",
      features: ["AI 의료기록 분석 (월 5건)", "기본 청구 리포트", "예상 지급액 계산"],
      popular: false
    },
    {
      name: "Pro",
      price: "19,800",
      desc: "복잡한 청구도 문제없이",
      features: ["무제한 AI 분석", "프리미엄 상세 리포트", "약관 정밀 분석", "전문가 채팅 상담"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Contact",
      desc: "법인 및 대량 청구 고객",
      features: ["API 연동 지원", "전담 매니저 배정", "커스텀 리포트 양식", "우선 처리 지원"],
      popular: false
    }
  ]
};

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">VNEXIS</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {DATA.nav.map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              {item}
            </a>
          ))}
          <button className="bg-white text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors">
            시작하기
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className="md:hidden bg-slate-900 border-b border-white/10 overflow-hidden"
        >
          <div className="px-6 py-8 flex flex-col gap-6">
            {DATA.nav.map((item) => (
              <a key={item} href="#" className="text-lg font-medium text-slate-300 hover:text-white">
                {item}
              </a>
            ))}
            <button className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold">
              지금 시작하기
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-900">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            AI Powered Insurance Claim
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white">
            보험금 청구,<br />
            <span className="text-gradient">AI로 완벽하게.</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
            {DATA.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group">
              무료로 분석하기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all backdrop-blur-sm">
              서비스 소개 영상
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
            {DATA.hero.stats.map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative z-10 animate-fade-in-right delay-200">
            <div className="absolute top-0 right-0 w-64 h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col gap-4 transform translate-x-12 -translate-y-12 rotate-[-6deg]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FileCheck className="text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">청구 분석 완료</div>
                  <div className="text-xs text-slate-400">방금 전</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-700 rounded w-3/4"></div>
                <div className="h-2 bg-slate-700 rounded w-1/2"></div>
              </div>
              <div className="mt-auto">
                <div className="text-xs text-slate-400 mb-1">예상 지급액</div>
                <div className="text-2xl font-bold text-green-400">₩ 1,250,000</div>
              </div>
            </div>

            <img
              src="/hero-image.png"
              alt="Dashboard"
              className="rounded-2xl shadow-2xl border border-white/10 relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => (
  <section className="py-32 bg-slate-900 relative">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-20 reveal">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">왜 VNEXIS인가요?</h2>
        <p className="text-slate-400">
          수천 건의 보험 약관과 판례 데이터를 학습한 AI가<br />
          당신의 보험금 청구를 가장 확실하게 도와드립니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DATA.features.map((feature, i) => (
          <div
            key={i}
            className="glass p-8 rounded-2xl glass-hover group reveal"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-400">
              <feature.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section className="py-32 bg-slate-950">
    <div className="container mx-auto px-6">
      <div className="text-center mb-20 reveal">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">합리적인 요금제</h2>
        <p className="text-slate-400">필요한 기능만 골라 시작해보세요.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {DATA.pricing.map((plan, i) => (
          <div
            key={i}
            className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-blue-500 bg-blue-900/10' : 'border-white/10 bg-slate-900'} flex flex-col reveal`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-blue-500/25">
                Most Popular
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-6">{plan.desc}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">₩{plan.price}</span>
                {plan.price !== "Contact" && <span className="text-slate-500">/월</span>}
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feat, j) => (
                <li key={j} className="flex items-center gap-3 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
              선택하기
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-950 border-t border-white/5 py-20">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-white">VNEXIS</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
            VNEXIS는 인공지능 기술을 통해 보험 소비자의 권익을 보호하고,
            투명하고 공정한 보험 생태계를 만들어갑니다.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-600 text-sm">
          © 2025 VNEXIS Inc. All rights reserved.
        </div>
        <div className="flex gap-6">
          {/* Social Icons would go here */}
        </div>
      </div>
    </div>
  </footer>
);

function App() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen text-white selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}

export default App;
