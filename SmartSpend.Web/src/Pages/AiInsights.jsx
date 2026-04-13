import React, { useMemo, useState } from "react";
import { BrainCircuit, Sparkles, Target, TrendingUp, WandSparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const BILLS_STORAGE_KEY = "smartspend_upcoming_bills";

function getBills() {
  try {
    const raw = localStorage.getItem(BILLS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function daysUntil(dateString) {
  const now = new Date();
  const due = new Date(dateString);
  const diff = due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function AiInsights() {
  const [selectedPrompt, setSelectedPrompt] = useState("How can I reduce my next month spend?");

  const bills = useMemo(() => {
    return getBills()
      .filter((bill) => !bill.paid)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, []);

  const summary = useMemo(() => {
    const now = new Date();
    const in30 = new Date();
    in30.setDate(now.getDate() + 30);

    const dueSoon = bills.filter((bill) => {
      const due = new Date(bill.dueDate);
      return due >= now && due <= in30;
    });

    const total30Days = dueSoon.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
    const largest = bills.reduce(
      (top, bill) => (Number(bill.amount || 0) > Number(top.amount || 0) ? bill : top),
      { title: "-", amount: 0 }
    );

    return {
      total30Days,
      dueSoonCount: dueSoon.length,
      largest,
    };
  }, [bills]);

  const generatedAnswer = useMemo(() => {
    if (selectedPrompt.includes("reduce")) {
      return `You have ${summary.dueSoonCount} upcoming bills in the next 30 days. If you automate only the top ${Math.min(
        2,
        summary.dueSoonCount
      )} highest bills and cap optional spending at 15%, you can lower payment stress while keeping your essentials stable.`;
    }

    if (selectedPrompt.includes("risk")) {
      return `Your highest upcoming bill is ${summary.largest.title} at Rs ${Number(
        summary.largest.amount || 0
      ).toLocaleString()}. Set a reminder 3 days before due date and keep a buffer of at least 1.2x of this amount.`;
    }

    return "Try grouping all recurring bills into one pay-window each week. This reduces missed payments, improves cash visibility, and makes your budget easier to control.";
  }, [selectedPrompt, summary]);

  const prompts = [
    "How can I reduce my next month spend?",
    "Where is my biggest bill risk?",
    "Give me a smarter payment strategy",
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#171214]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f6f1ee]">
        <Navbar />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <section className="overflow-hidden rounded-[30px] border border-[#ece3de] bg-white p-6 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.34)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9f9490]">
                    AI Insights Studio
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-[#1a1516] sm:text-4xl">
                    Smart guidance for your money moves
                  </h1>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f6f1ee] px-4 py-2 text-sm font-semibold text-[#605655]">
                  <Sparkles size={15} />
                  Personalized from your upcoming bills
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[#efe7e3] bg-[#fcfaf9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#938987]">Due in 30 days</p>
                  <p className="mt-2 text-3xl font-bold text-[#1a1516]">Rs {summary.total30Days.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-[#efe7e3] bg-[#fcfaf9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#938987]">Bills due soon</p>
                  <p className="mt-2 text-3xl font-bold text-[#1a1516]">{summary.dueSoonCount}</p>
                </div>
                <div className="rounded-2xl border border-[#efe7e3] bg-[#fcfaf9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#938987]">Largest bill</p>
                  <p className="mt-2 text-xl font-bold text-[#1a1516]">{summary.largest.title}</p>
                  <p className="text-sm text-[#7d7370]">Rs {Number(summary.largest.amount || 0).toLocaleString()}</p>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
              <section className="rounded-[28px] border border-[#ece3de] bg-white p-5 shadow-[0_20px_55px_-34px_rgba(15,23,42,0.34)]">
                <div className="mb-4 flex items-center gap-2">
                  <BrainCircuit size={18} className="text-[#d84843]" />
                  <h2 className="text-2xl font-bold tracking-tight text-[#1a1516]">AI Advisor</h2>
                </div>

                <div className="space-y-3">
                  {prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setSelectedPrompt(prompt)}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        selectedPrompt === prompt
                          ? "bg-[linear-gradient(135deg,#d84843_0%,#ff6d66_100%)] text-white"
                          : "border border-[#efe7e3] bg-[#fcfaf9] text-[#4b4343] hover:bg-[#f7f1ee]"
                      }`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-[#f7f2ef] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f8582]">Insight Response</p>
                  <p className="mt-3 text-sm leading-7 text-[#3f3738]">{generatedAnswer}</p>
                </div>
              </section>

              <section className="rounded-[28px] border border-[#ece3de] bg-white p-5 shadow-[0_20px_55px_-34px_rgba(15,23,42,0.34)]">
                <h2 className="text-2xl font-bold tracking-tight text-[#1a1516]">Priority Signals</h2>

                <div className="mt-4 space-y-3">
                  {bills.slice(0, 4).map((bill) => {
                    const remaining = daysUntil(bill.dueDate);
                    return (
                      <div key={bill.id} className="rounded-2xl border border-[#efe7e3] bg-[#fcfaf9] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-[#1a1516]">{bill.title}</p>
                          <p className="font-semibold text-[#1a1516]">Rs {Number(bill.amount).toLocaleString()}</p>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-[#8f8583]">
                          <span>{bill.category}</span>
                          <span>{remaining >= 0 ? `${remaining} day(s) left` : "Overdue"}</span>
                        </div>
                      </div>
                    );
                  })}

                  {bills.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#e8ddd8] bg-[#fcfaf9] p-5 text-sm text-[#857a77]">
                      Add upcoming bills in Pulse to unlock live AI insights here.
                    </div>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#f7f2ef] p-4">
                    <div className="flex items-center gap-2 text-[#d84843]"><TrendingUp size={15} /><span className="text-xs font-semibold uppercase tracking-[0.16em]">Trend</span></div>
                    <p className="mt-2 text-sm text-[#4a4242]">Your recurring bills are concentrated near month-end. Splitting due dates can reduce pressure.</p>
                  </div>
                  <div className="rounded-2xl bg-[#f7f2ef] p-4">
                    <div className="flex items-center gap-2 text-[#d84843]"><Target size={15} /><span className="text-xs font-semibold uppercase tracking-[0.16em]">Goal</span></div>
                    <p className="mt-2 text-sm text-[#4a4242]">Target auto-paying 2 highest bills first for stronger payment reliability.</p>
                  </div>
                </div>

                <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1d1718] px-4 py-2.5 text-sm font-semibold text-white hover:bg-black">
                  <WandSparkles size={14} />
                  Generate next-week action plan
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiInsights;
