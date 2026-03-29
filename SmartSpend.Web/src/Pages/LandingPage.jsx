import { Receipt, BarChart3, Wallet, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-green-100 selection:text-green-900">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-16 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-1.5 rounded-lg">
            <Wallet className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            SmartSpend
          </h1>
        </div>

        <div className="hidden md:flex gap-10 items-center">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-green-600 transition-colors">Features</a>
          <a href="#how" className="text-sm font-medium text-slate-600 hover:text-green-600 transition-colors">How it works</a>
          <button
            onClick={() => navigate("/login")}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
        {/* Background Blur Orbs */}
        <div className="absolute top-0 -z-10 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-green-100/50 blur-[120px] rounded-full" />
        
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-green-700 bg-green-50 rounded-full border border-green-100">
            New: AI-Powered Receipt Scanning ✨
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Master your money with <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">intelligence.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop manual entry. Upload receipts and let our AI categorize your spending so you can focus on reaching your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/login")}
              className="group bg-green-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-green-700 transition-all hover:shadow-xl hover:shadow-green-200 flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="px-8 py-4 text-slate-600 font-semibold hover:text-slate-900 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto p-2 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
          <div className="rounded-[2rem] overflow-hidden border border-slate-50">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
              alt="Dashboard Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-slate-500">Everything you need to manage personal or business finances.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Receipt size={32} />, title: "Auto-Extraction", desc: "Just snap a photo. Our AI reads prices, dates, and merchants instantly." },
              { icon: <BarChart3 size={32} />, title: "Rich Analytics", desc: "Interactive charts help you visualize where every dollar goes." },
              { icon: <CheckCircle2 size={32} />, title: "Budget Alerts", desc: "Get notified before you overspend in your favorite categories." }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-3xl bg-slate-50 border border-transparent hover:border-green-200 hover:bg-white transition-all duration-300">
                <div className="text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900">Simple 3-Step Setup</h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {[
              { step: "01", title: "Upload", desc: "Take a picture of any paper or digital receipt." },
              { step: "02", title: "Process", desc: "Our AI extracts the data and categorizes it." },
              { step: "03", title: "Review", desc: "See your updated budget and insights in real-time." }
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <span className="text-6xl font-black text-green-100 absolute -top-10 left-1/2 -translate-x-1/2 -z-0">
                  {item.step}
                </span>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1 rounded-md">
              <Wallet className="text-white" size={16} />
            </div>
            <span className="font-bold text-slate-900">SmartSpend</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 SmartSpend. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;