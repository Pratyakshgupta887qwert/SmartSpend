import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import ExpenseChart from "../components/ExpenseChart";
import SpendingPieChart from "../components/SpendingPieChart";

function Dashboard() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      const decode = jwtDecode(token);
      const name =
        decode.name ||
        decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        "User";

      localStorage.setItem("userName", name);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#171214]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f6f1ee]">
        <Navbar />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
            <div className="space-y-6">
              <section className="overflow-hidden rounded-[30px] bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                <div className="border-b border-[#efe7e3] px-6 pb-5 pt-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#b4aaa6]">
                    Good Morning
                  </p>
                  <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="max-w-sm text-3xl font-black uppercase leading-none tracking-tight text-[#ff4e45]">
                        Your Total Balance
                      </h2>
                      <div className="mt-5 flex items-start gap-4">
                        <div>
                          <p className="text-xs font-medium text-[#aaa09c]">
                            Total Balance
                          </p>
                          <p className="mt-1 text-4xl font-bold tracking-tight text-[#1a1516]">
                            Rs 0
                          </p>
                        </div>
                        <span className="mt-3 rounded-full bg-[#d84843] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                          0.0%
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex h-9 items-center rounded-full bg-[#f5f0ed] px-4 text-xs font-semibold text-[#5e5554] shadow-inner">
                      Monthly
                    </div>
                  </div>
                </div>

                <div className="px-3 pt-4 md:px-5">
                  <div className="rounded-[24px] bg-[linear-gradient(180deg,#fbf7f5_0%,#ffffff_100%)] p-3">
                    <ExpenseChart />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 px-4 pb-5 pt-4 md:grid-cols-3 md:px-6">
                  {[
                    { value: "Rs 0", label: "Income", tone: "text-[#494141]" },
                    { value: "Rs 0", label: "Expense", tone: "text-[#d84843]" },
                    { value: "Rs 0", label: "Savings", tone: "text-[#494141]" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="rounded-[22px] border border-[#efe7e3] bg-[#faf7f5] px-4 py-3"
                    >
                      <p className={`text-lg font-bold ${item.tone}`}>{item.value}</p>
                      <p className="text-xs text-[#9e9491]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <section className="rounded-[28px] bg-white p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-[#1a1516]">
                      Recent Transactions
                    </h2>
                    <button className="rounded-full bg-[#f4eeea] px-3 py-1.5 text-xs font-semibold text-[#655d5b]">
                      View All
                    </button>
                  </div>

                  <div className="space-y-3 text-sm">
                    {[
                      {
                        badge: "D",
                        name: "Dribbble",
                        meta: "Apr 18 | 11:37 AM",
                        amount: "Rs 0",
                        color: "bg-[#2d2729]",
                      },
                      {
                        badge: "N",
                        name: "Netflix",
                        meta: "Apr 17 | 7:50 PM",
                        amount: "Rs 0",
                        color: "bg-[#d84843]",
                      },
                      {
                        badge: "A",
                        name: "Airbnb",
                        meta: "Apr 15 | 9:45 PM",
                        amount: "Rs 0",
                        color: "bg-[#393033]",
                      },
                      {
                        badge: "S",
                        name: "Spotify",
                        meta: "Apr 14 | 10:15 PM",
                        amount: "Rs 0",
                        color: "bg-[#1db954]",
                      },
                      {
                        badge: "N",
                        name: "Note",
                        meta: "Apr 14 | 7:57 AM",
                        amount: "Rs 0",
                        color: "bg-[#f1d8d7] text-[#c54441]",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-[22px] border border-[#efe7e3] bg-[#fcfaf9] px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white ${item.color}`}
                          >
                            {item.badge}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1a1516]">{item.name}</p>
                            <p className="text-xs text-[#938987]">{item.meta}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-[#272122]">{item.amount}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[28px] bg-white p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-[#1a1516]">
                      Upcoming Bills
                    </h2>
                    <button className="rounded-full bg-[#f4eeea] px-3 py-1.5 text-[11px] font-semibold text-[#655d5b]">
                      Manage All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      ["Figma", "Apr 20 | 7:59", "Rs 0", "bg-[#f24e1e]"],
                      ["YouTube", "Apr 20 | 7:59", "Rs 0", "bg-[#ff0000]"],
                      ["Spotify", "Jun 20 | 6:59", "Rs 0", "bg-[#1db954]"],
                      ["Telegram", "May 20 | 09:00", "Rs 0", "bg-[#229ed9]"],
                    ].map(([name, meta, amount, color], i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-[20px] border border-[#efe7e3] bg-[#fcfaf9] px-3 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-3 w-3 rounded-full ${color}`} />
                          <div>
                            <p className="text-sm font-semibold text-[#1a1516]">{name}</p>
                            <p className="text-[11px] text-[#938987]">{meta}</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-[#272122]">{amount}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="space-y-6">
              <section className="rounded-[28px] bg-white p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                <h2 className="text-2xl font-bold tracking-tight text-[#1a1516]">
                  Spending Breakdown
                </h2>

                <div className="mt-4 rounded-[24px] bg-[#fbf7f5] p-3">
                  <SpendingPieChart />
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  {[
                    ["Food", "Rs 0", "bg-[#d84843]"],
                    ["Travel", "Rs 0", "bg-[#2a2628]"],
                    ["Meds", "Rs 0", "bg-[#ddd4d1]"],
                    ["School", "Rs 0", "bg-[#f1b9b6]"],
                  ].map(([name, amount, color], i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                        <span className="font-medium text-[#423b3b]">{name}</span>
                      </div>
                      <span className="font-semibold text-[#1a1516]">{amount}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-4 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                <div className="flex items-center gap-3 border-b border-[#efe7e3] pb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top_left,#d8f0ff,#9fd5ff_55%,#74a7ff_100%)] text-lg">
                    AI
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#1a1516]">
                      SmartSpend AI
                    </h2>
                    <p className="text-xs text-[#938987]">Assistant</p>
                  </div>
                </div>

                <div className="space-y-3 py-4">
                  <div className="rounded-[20px] bg-[#f6f1ee] px-4 py-3 text-sm text-[#3d3637]">
                    <p className="font-semibold text-[#1a1516]">Hi John Doe!</p>
                    <p className="mt-1">How can i assist you today?</p>
                  </div>

                  {[
                    "How can i save more this month?",
                    "What are my biggest expenses?",
                    "Any budgeting tips for me?",
                  ].map((item, i) => (
                    <button
                      key={i}
                      className="w-full rounded-[18px] bg-[linear-gradient(135deg,#776c73_0%,#9e9499_100%)] px-4 py-3 text-left text-sm text-white/95"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 rounded-[18px] border border-[#efe7e3] bg-[#fcfaf9] px-3 py-3">
                  <span className="text-[#9a908d]">+</span>
                  <input
                    type="text"
                    value="Ask me anything..."
                    readOnly
                    className="w-full bg-transparent text-sm text-[#6e6563] outline-none"
                  />
                  <span className="text-[#d84843]">&gt;</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
