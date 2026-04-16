import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Budgets() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://localhost:5030";

  useEffect(() => {
    const fetchBudgetSummary = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE}/api/Dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setSummary(data);

          const totalBudget = data.amountSet || 0;
          const fetchedBudgets = (data.categoryBreakdown || []).map((item) => ({
            title: item.category,
            spent: Number(item.amount),
            total: totalBudget, // Comparing spent per category vs total overall budget
          }));

          setBudgets(fetchedBudgets);
        }
      } catch (error) {
        console.error("Error fetching budget summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetSummary();
  }, [API_BASE]);

  // Logic to determine color based on spending percentage
  const getColor = (percent) => {
    if (percent < 40) return "#22c55e"; // Green
    if (percent < 70) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  const getCategoryIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes("housing") || t.includes("rent")) return "⌂";
    if (t.includes("food") || t.includes("groceries")) return "⌁";
    if (t.includes("transport") || t.includes("travel")) return "▣";
    if (t.includes("entertainment")) return "🎮";
    if (t.includes("shopping")) return "🛍";
    if (t.includes("health")) return "🏥";
    if (t.includes("personal care")) return "💅";
    if (t.includes("education")) return "📚";
    if (t.includes("bills")) return "🧾";
    return "◫";
  };

  const getCategoryColor = (index) => {
    const colors = ["bg-[#d84843]", "bg-[#2a2628]", "bg-[#ddd4d1]", "bg-[#f1b9b6]", "bg-[#f59e0b]", "bg-[#22c55e]", "bg-[#3b82f6]", "bg-[#a855f7]"];
    return colors[index % colors.length];
  };

  const formatCurrency = (amount) => {
    return `Rs ${Number(amount).toLocaleString()}`;
  };

  const amountSet = summary?.amountSet || 0;
  const totalSpent = summary?.totalSpent || 0;
  const netSurplus = summary?.savings || 0;
  const savingsRate = summary?.savingsRate || 0;
  const budgetUtilized = amountSet > 0 ? Math.round((totalSpent / amountSet) * 100) : 0;
  const activeCategoriesCount = budgets.length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#171214]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f6f1ee]">
        <div className="shrink-0">
          <Navbar />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 rounded-[30px] bg-white px-6 py-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#cf6b63]">
                  Financial Architecture
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-[#1a1516] md:text-5xl">
                  Budget Strategy
                </h1>
              </div>

              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => alert("Report generation will be available soon.")} 
                  className="rounded-2xl bg-[#f5efeb] px-5 py-3 text-sm font-semibold text-[#5f5654] shadow-sm ring-1 ring-black/5 transition hover:bg-[#efe6e1]"
                >
                  Export Report
                </button>
                <button 
                  onClick={() => navigate("/dashboard")} 
                  className="rounded-2xl bg-[#d84843] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_-18px_rgba(216,72,67,0.95)] transition hover:bg-[#cc3f3b]"
                >
                  Adjust Budget
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_0.85fr_0.85fr]">
                  <section className="rounded-[28px] bg-[linear-gradient(135deg,#d84843_0%,#cb3b36_100%)] p-6 text-white shadow-[0_24px_60px_-30px_rgba(216,72,67,0.9)]">
                    <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/90">
                      Remaining Balance
                    </div>
                    <p className="mt-10 text-sm font-medium text-white/80">
                      Net Surplus
                    </p>
                    <p className="mt-2 text-5xl font-black tracking-tight">
                      {formatCurrency(netSurplus)}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-white/90">
                      +0.0% vs last month
                    </p>
                  </section>

                  <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f7f1ee] text-[#9e9591]">
                      □
                    </div>
                    <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9d9390]">
                      Total Budgeted
                    </p>
                    <p className="mt-2 text-4xl font-black tracking-tight text-[#1a1516]">
                      {formatCurrency(amountSet)}
                    </p>
                    <p className="mt-8 text-xs text-[#b3a8a4]">
                      {activeCategoriesCount} active categories
                    </p>
                  </section>

                  <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff3f2] text-[#d84843]">
                      +
                    </div>
                    <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9d9390]">
                      Total Spent
                    </p>
                    <p className="mt-2 text-4xl font-black tracking-tight text-[#1a1516]">
                      {formatCurrency(totalSpent)}
                    </p>
                    <div className="mt-8">
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#eee6e2]">
                        <div
                          style={{
                            width: `${Math.min(budgetUtilized, 100)}%`,
                            height: "100%",
                            background: "#d84843",
                            borderRadius: "9999px",
                          }}
                        ></div>
                      </div>
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b1a6a2]">
                        {budgetUtilized}% of budget utilized
                      </p>
                    </div>
                  </section>
                </div>

                <section className="rounded-[30px] bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight text-[#1a1516]">
                      Active Allocations
                    </h2>
                    <div className="flex items-center gap-2 text-[#a69b98]">
                      <span className="rounded-xl bg-[#f5efeb] px-2 py-1 text-xs">
                        Grid
                      </span>
                      <span className="rounded-xl bg-[#f5efeb] px-2 py-1 text-xs">
                        List
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {!loading && budgets.length === 0 && (
                      <div className="py-8 text-center text-sm text-[#9d9390]">
                        No active allocations yet. Add an expense to see it here.
                      </div>
                    )}
                    {budgets.map((item, index) => {
                      const percent =
                        item.total === 0 ? 0 : Math.round((item.spent / item.total) * 100);
                      const color = getColor(percent);
                      const status = percent >= 100 ? "Over Budget" : "On Track";

                      return (
                        <div
                          key={index}
                          className="flex flex-col gap-4 rounded-[24px] border border-[#efe7e3] bg-[#fcfaf9] px-4 py-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f1ee] text-lg text-[#9e9491]">
                              {getCategoryIcon(item.title)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                                <h3 className="text-lg font-bold text-[#1a1516]">
                                  {item.title}
                                </h3>
                                <p className="text-sm font-semibold text-[#3b3334]">
                                  {formatCurrency(item.spent)} / {formatCurrency(item.total)}
                                </p>
                              </div>
                              <div className="mt-3 h-2.5 w-full max-w-[360px] overflow-hidden rounded-full bg-[#eee6e2]">
                                <div
                                  style={{
                                    width: Math.min(percent, 100) + "%",
                                    height: "100%",
                                    background: color,
                                    borderRadius: "9999px",
                                    transition: "width 0.5s ease-in-out",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="md:text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b0a5a1]">
                              Status
                            </p>
                            <span
                              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                status === "On Track"
                                  ? "bg-[#e9f8ef] text-[#1f9d59]"
                                  : "bg-[#fff0ef] text-[#d84843]"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-[28px] bg-white p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                  <h2 className="text-2xl font-bold tracking-tight text-[#1a1516]">
                    Spending Breakdown
                  </h2>

                  <div className="mt-4 rounded-[24px] bg-[#fbf7f5] p-5">
                    <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-[conic-gradient(#d84843_0deg_360deg)]">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#fbf7f5] text-center">
                        <div>
                          <p className="text-3xl font-black text-[#1a1516]">{formatCurrency(totalSpent)}</p>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#b0a5a1]">
                            Total
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    {budgets.length > 0 ? (
                      budgets.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`h-2.5 w-2.5 rounded-full ${getCategoryColor(i)}`} />
                            <span className="font-medium text-[#423b3b]">{item.title}</span>
                          </div>
                          <span className="font-semibold text-[#1a1516]">{formatCurrency(item.spent)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#9d9390] text-center py-2">No category breakdown available.</p>
                    )}
                  </div>
                </section>

                <section className="rounded-[28px] bg-white p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a79d98]">
                    Historical Graph
                  </h2>

                  <div className="mt-5 rounded-[24px] bg-[#fbf7f5] p-5">
                    <div className="flex h-56 items-end justify-between gap-3">
                      {["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"].map((month, i) => (
                        <div key={i} className="flex flex-1 flex-col items-center gap-3">
                          <div className="flex h-40 w-full items-end rounded-[18px] bg-[#f4ece8] px-2 pb-2">
                            <div className="w-full rounded-[10px] bg-[#ebe2de]" style={{ height: "4px" }}></div>
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0a5a1]">
                            {month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-[20px] bg-[#f7f1ee] px-4 py-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b0a5a1]">
                        Avg. Savings Rate
                      </p>
                      <p className="mt-2 text-2xl font-black text-[#1a1516]">
                        {savingsRate}%
                      </p>
                    </div>
                    <span className="rounded-full bg-[#e9f8ef] px-3 py-1 text-xs font-semibold text-[#1f9d59]">
                      Stable
                    </span>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budgets;
