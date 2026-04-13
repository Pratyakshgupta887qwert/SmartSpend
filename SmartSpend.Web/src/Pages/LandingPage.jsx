import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  X,
  Menu,
  Receipt,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4efec] font-sans text-slate-900 selection:bg-red-200 selection:text-slate-900">
      <section className="overflow-hidden bg-[#1b1517] text-white">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#c53a37] p-2 shadow-lg shadow-red-950/30">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">SmartSpend</span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#products" className="transition hover:text-white">
              Products
            </a>
            <a href="#features" className="transition hover:text-white">
              For companies
            </a>
            <a href="#resources" className="transition hover:text-white">
              Resources
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl bg-[#f2ebe6] px-4 py-2 text-sm font-semibold text-[#9f2f2c] transition hover:bg-white"
            >
              Sign up
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className="rounded-xl border border-white/10 p-2 text-white md:hidden"
            aria-label="Open navigation"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm text-white/85">
              <a href="#products" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-2 py-1.5 transition hover:bg-white/10">
                Products
              </a>
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-2 py-1.5 transition hover:bg-white/10">
                For companies
              </a>
              <a href="#resources" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-2 py-1.5 transition hover:bg-white/10">
                Resources
              </a>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl bg-[#f2ebe6] px-4 py-2 text-sm font-semibold text-[#9f2f2c] transition hover:bg-white"
              >
                Sign up
              </button>
            </div>
          </div>
        )}

        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-10">
          <div className="relative">
            <div className="absolute left-0 top-8 h-40 w-40 rounded-full bg-[#c53a37]/20 blur-3xl" />
            <div className="absolute left-24 top-24 h-52 w-52 rounded-full bg-[#8e2d2b]/20 blur-3xl" />

            <span className="relative inline-flex rounded-lg bg-[#c53a37] px-4 py-2 text-sm font-semibold shadow-lg shadow-red-950/30">
              $1 for 1 year - limited time
            </span>

            <div className="relative mt-8 max-w-xl">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Smarter Finance,
                <br />
                Made Simple
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/70 sm:text-lg">
                Manage expenses and track your spending with ease, all in one
                place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center justify-center rounded-xl bg-[#c53a37] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:bg-[#d84a46]"
                >
                  Get started for free
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center justify-center rounded-xl bg-[#f2ebe6] px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="absolute right-0 top-8 h-56 w-56 rounded-full bg-[#c53a37]/20 blur-3xl" />

            <div className="relative w-full max-w-[460px]">
              <div className="absolute right-3 top-0 z-20 w-[60%] rounded-[2rem] border border-[#e9ddd7] bg-[#f7f1ed] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:right-6 sm:w-[58%] sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#c53a37]" />
                    <span className="text-[11px] font-bold text-slate-900">
                      SmartSpend
                    </span>
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400">
                    Budget
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    ["Food", "$129.16"],
                    ["Travel", "$20.16"],
                    ["Shop", "$30.16"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 text-sm shadow-sm"
                    >
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-[#b63331] p-4 text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                        Balance
                      </p>
                      <p className="mt-1 text-2xl font-bold">$15,000</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                        Out of
                      </p>
                      <p className="mt-1 text-2xl font-bold">$20,000</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-28 overflow-hidden rounded-[2.5rem] bg-[#e9dfd9] pt-16 shadow-[0_32px_70px_rgba(0,0,0,0.30)] sm:mt-24">
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 to-transparent" />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
                  alt="Customer using SmartSpend"
                  className="h-[340px] w-full object-cover object-top sm:h-[420px]"
                />

                <div className="absolute left-5 top-28 rounded-2xl bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-xl backdrop-blur sm:left-6 sm:top-32">
                  <p className="max-w-[180px] text-xs font-semibold leading-5 sm:text-sm">
                    Manage expenses with one click
                  </p>
                  <p className="mt-1 text-lg font-bold">$ 224.16</p>
                </div>

                <div className="absolute bottom-5 right-5 rounded-full border-4 border-white bg-[#c53a37] p-1 shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80"
                    alt="Advisor avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto -mt-2 w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="rounded-t-[2.5rem] bg-[#f4efec] px-4 pb-10 pt-12 sm:px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Track your expenses, keep your budget on target,
            </h2>
            <p className="mt-2 text-lg text-slate-700 sm:text-2xl">
              and gain full visibility into where your money goes.
            </p>
          </div>

          <div
            id="products"
            className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_1fr_1fr]"
          >
            <article className="rounded-[2rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#1b1517] p-3 text-white">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Monthly Balance</p>
                  <h3 className="text-3xl font-bold text-slate-900">$12,450</h3>
                </div>
              </div>
              <p className="mt-3 inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                18.2% this month
              </p>

              <div className="mt-5 space-y-4 rounded-[1.5rem] bg-[#f6f2ef] p-4">
                {[
                  ["Freelance Projects", "$2,500.00", "w-[88%]"],
                  ["Investments", "$1,500.00", "w-[62%]"],
                  ["Savings", "$350.00", "w-[26%]"],
                ].map(([label, value, width]) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{label}</span>
                      <span className="font-semibold text-slate-500">{value}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-200">
                      <div
                        className={`h-2.5 rounded-full ${
                          label === "Savings" ? "bg-[#c53a37]" : "bg-slate-900"
                        } ${width}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article
              id="features"
              className="rounded-[2rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Recent Transactions</p>
                  <h3 className="text-xl font-bold text-slate-900">
                    Latest activity
                  </h3>
                </div>
                <div className="rounded-full bg-slate-100 p-2 text-slate-500">
                  <Receipt className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    brand: "D",
                    name: "Dribbble",
                    date: "July 8 | 11:55 AM",
                    value: "-$10.67",
                    tone: "text-slate-900",
                    bg: "bg-[#2d2628]",
                  },
                  {
                    brand: "N",
                    name: "Netflix",
                    date: "July 7 | 7:36 AM",
                    value: "-$12.01",
                    tone: "text-slate-900",
                    bg: "bg-[#c53a37]",
                  },
                  {
                    brand: "A",
                    name: "Airbnb",
                    date: "July 5 | 11:17 AM",
                    value: "-$112.43",
                    tone: "text-slate-900",
                    bg: "bg-[#f16d55]",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-3 transition hover:border-slate-200 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white ${item.bg}`}
                      >
                        {item.brand}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.date}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${item.tone}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900">
                See details
                <ChevronRight className="h-4 w-4" />
              </button>
            </article>

            <article
              id="resources"
              className="rounded-[2rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Spending</p>
                  <h3 className="mt-1 text-5xl font-bold tracking-tight text-slate-900">
                    84%
                  </h3>
                </div>
                <div className="rounded-full bg-red-50 p-3 text-[#c53a37]">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-[conic-gradient(#c53a37_0_290deg,#f0d7d2_290deg_340deg,#f7ece8_340deg_360deg)] p-4">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-slate-900">84%</p>
                      <p className="mt-1 text-sm text-slate-400">of budget used</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#c53a37]" />
                  Rent
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e7b8af]" />
                  Food
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f5d9ce]" />
                  Gifts
                </span>
              </div>
            </article>
          </div>

          <section className="mt-14 rounded-[2rem] bg-[#efe6e1] px-5 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:px-8">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Gain insights on your budget
              </h2>
              <p className="mt-3 text-lg leading-8 text-slate-700">
                Stay on top of your expenses and make informed decisions to
                manage your finances better.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b1517] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Start tracking now
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
              >
                Open dashboard
              </button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
