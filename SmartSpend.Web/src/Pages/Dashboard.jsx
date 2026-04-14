import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ExpenseChart from "../components/ExpenseChart";

import SpendingPieChart from "../components/SpendingPieChart";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [incomeInput, setIncomeInput] = useState(0);
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [graphData, setGraphData] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://localhost:5030";

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

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    try {
      setSummaryError("");

      // 1. GET /api/Dashboard/overview
      const overviewRes = await fetch(`${API_BASE}/api/Dashboard/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!overviewRes.ok) throw new Error("Unable to load dashboard overview");
      const overviewData = await overviewRes.json();
      console.log("[Dashboard] overview:", overviewData);
      setDashboardData(overviewData);
      setMonthlyIncome(Number(overviewData.income || 0));

      // 2. GET /api/Dashboard/category-breakdown
      const breakdownRes = await fetch(
        `${API_BASE}/api/Dashboard/category-breakdown?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!breakdownRes.ok) throw new Error("Unable to load category breakdown");
      const breakdownData = await breakdownRes.json();
      console.log("[Dashboard] category-breakdown:", breakdownData);
      const mappedPie = breakdownData.map((item) => ({
        name: item.category,
        value: Number(item.totalExpense || 0),
      }));
      setPieData(mappedPie);
      // Sync summary state for the existing chart / stat cards
      setSummary({
        amountSet: overviewData.income,
        totalSpent: overviewData.totalExpense,
        savings: overviewData.totalBalance,
        savingsRate: overviewData.savingsRate,
        categoryBreakdown: breakdownData.map((item) => ({
          category: item.category,
          amount: item.totalExpense,
        })),
      });

      // 3. GET /api/Expenses/recent
      const recentRes = await fetch(`${API_BASE}/api/Expenses/recent?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!recentRes.ok) throw new Error("Unable to load recent expenses");
      const recentData = await recentRes.json();
      console.log("[Dashboard] recent expenses:", recentData);
      setRecentTransactions(recentData);

      // 4. GET /api/Dashboard/monthly-graph
      const graphRes = await fetch(`${API_BASE}/api/Dashboard/monthly-graph`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (graphRes.ok) {
        const graphJson = await graphRes.json();
        setGraphData(graphJson);
      }
    } catch (error) {
      setSummaryError(error.message || "Unable to load dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [API_BASE]);

  const chartData = (() => {
    const currentMonthIndex = new Date().getMonth();
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const displayLabels = labels.slice(0, Math.max(7, currentMonthIndex + 1));
    const amountSet = Number(monthlyIncome || 0);

    return displayLabels.map((label, index) => {
      const monthNumber = index + 1;
      const monthData = graphData.find(g => g.month === monthNumber);

      return {
        day: label,
        expense: monthData ? Number(monthData.totalExpense) : 0,
        income: amountSet,
      };
    });
  })();

  const handleSetBudget = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const amount = Number(incomeInput) || 0;
    if (amount <= 0) return;

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const saveBudget = async () => {
      try {
        await fetch(`${API_BASE}/api/Budgets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amountSet: amount,
            month,
            year,
          }),
        });

        setMonthlyIncome(amount);
        await fetchDashboardData();
      } catch (error) {
        setSummaryError("Unable to save budget");
      }
    };

    saveBudget();
  };

  const pieChartData = pieData.length > 0
    ? pieData
    : summary?.categoryBreakdown?.map((item) => ({
        name: item.category,
        value: Number(item.amount || 0),
      })) || [];

  const totalSpent = Number(summary?.totalSpent || 0);
  const savings = Number(summary?.savings || 0);
  const savingsRate = Number(summary?.savingsRate || 0);

  return (
    <div className="flex h-screen overflow-hidden bg-[#171214]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f6f1ee]">
        <Navbar />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#efe7e3] bg-white px-5 py-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)] ring-1 ring-black/5 md:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#1a1516]">
                    Set your monthly income
                  </h2>
                  <p className="mt-1 text-sm text-[#8f8581]">
                    Define your primary revenue stream to optimize your precision budget architecture.
                  </p>
                  <p className="mt-2 text-xs text-[#b0a5a1]">
                    Note: Your budget will be updated on the 1st of every month.
                  </p>
                  {summaryError && (
                    <p className="mt-2 text-xs font-semibold text-[#d84843]">
                      {summaryError}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex h-12 min-w-[220px] items-center rounded-2xl border border-[#e8ded9] bg-[#faf7f5] px-4 text-[#1a1516] shadow-inner">
                    <span className="mr-2 text-sm font-semibold text-[#9d9390]">Rs</span>
                    <input
                      type="number"
                      value={incomeInput}
                      onChange={(e) => setIncomeInput(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#b8aeaa]"
                      placeholder="0"
                    />
                  </div>

                  <button
                    onClick={handleSetBudget}
                    className="h-12 rounded-2xl bg-[#d84843] px-6 text-sm font-semibold text-white shadow-[0_18px_35px_-18px_rgba(216,72,67,0.95)] transition hover:bg-[#cc3f3b]"
                  >
                    Set Budget
                  </button>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.75fr)_360px]">
              <div className="space-y-6">
                <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
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
                              Rs {monthlyIncome.toLocaleString()}
                            </p>
                          </div>
                          <span className="mt-3 rounded-full bg-[#d84843] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                            {savingsRate.toFixed(1)}%
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
                      <ExpenseChart data={chartData} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 px-4 pb-5 pt-4 md:grid-cols-3 md:px-6">
                    {[
                      {
                        value: `Rs ${monthlyIncome.toLocaleString()}`,
                        label: "Income",
                        tone: "text-[#494141]",
                      },
                      {
                        value: `Rs ${totalSpent.toLocaleString()}`,
                        label: "Expense",
                        tone: "text-[#d84843]",
                      },
                      {
                        value: `Rs ${savings.toLocaleString()}`,
                        label: "Savings",
                        tone: "text-[#494141]",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="rounded-[22px] border border-[#efe7e3] bg-[#faf7f5] px-4 py-4"
                      >
                        <p className={`text-xl font-bold ${item.tone}`}>{item.value}</p>
                        <p className="mt-1 text-xs text-[#9e9491]">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[32px] bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight text-[#1a1516]">
                        Recent Transactions
                      </h2>
                      <p className="mt-1 text-sm text-[#8f8581]">
                        Your latest activity will appear here once backend data is connected.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/uploadreceipt")}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4eeea] text-2xl font-medium text-[#655d5b] transition hover:bg-[#ece4df]"
                    >
                      +
                    </button>
                  </div>

                  {recentTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {recentTransactions.map((txn) => (
                        <div
                          key={txn.id}
                          className="flex items-center justify-between rounded-[22px] border border-[#efe7e3] bg-[#faf7f5] px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#1a1516]">
                              {txn.description || txn.category}
                            </p>
                            <p className="mt-0.5 text-xs text-[#9e9491]">
                              {txn.category} &middot;{" "}
                              {new Date(txn.spentAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-[#d84843]">
                            - Rs {Number(txn.amount).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-dashed border-[#e7deda] bg-[#fcfaf9] px-6 text-center">
                      <div>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3ece8] text-2xl text-[#b0a5a1]">
                          +
                        </div>
                        <h3 className="mt-5 text-xl font-semibold text-[#1a1516]">
                          No transactions yet
                        </h3>
                        <p className="mt-2 max-w-md text-sm leading-6 text-[#938987]">
                          Recent transactions will populate here after expenses start syncing from your backend.
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-[28px] bg-white p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
                  <h2 className="text-2xl font-bold tracking-tight text-[#1a1516]">
                    Spending Breakdown
                  </h2>

                  <div className="mt-4 rounded-[24px] bg-[#fbf7f5] p-3">
                    <SpendingPieChart data={pieChartData} />
                  </div>

                  <div className="mt-4 space-y-3 text-sm">
                    {(summary?.categoryBreakdown || []).length > 0 ? (
                      summary.categoryBreakdown.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#d84843]" />
                            <span className="font-medium text-[#423b3b]">
                              {item.category}
                            </span>
                          </div>
                          <span className="font-semibold text-[#1a1516]">
                            Rs {Number(item.amount || 0).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#9e9491]">
                        No spending data available yet.
                      </p>
                    )}
                  </div>
                </section>

                <section className="overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#f4fbf7_0%,#edf7f1_100%)] shadow-[0_24px_60px_-30px_rgba(15,23,42,0.22)] ring-1 ring-[#d5ebe0]">
                  <div className="border-b border-[#dcece4] px-5 pb-4 pt-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top_left,#d8f0ff,#9fd5ff_55%,#74a7ff_100%)] text-sm font-bold text-[#12507c] shadow-sm">
                        AI
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-[#14532d]">
                          SmartSpend AI
                        </h2>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#73a085]">
                          Assistant
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="rounded-[22px] bg-white px-5 py-5 shadow-sm ring-1 ring-[#e3efe8]">
                      <p className="font-semibold text-[#1a1516]">Hi John Doe!</p>
                      <p className="mt-2 text-sm leading-6 text-[#4f5f57]">
                        How can i assist you today?
                      </p>
                    </div>

                    {[
                      "How can i save more this month?",
                      "What are my biggest expenses?",
                      "Any budgeting tips for me?",
                    ].map((item, i) => (
                      <button
                        key={i}
                        className="w-full rounded-[18px] bg-white px-4 py-3 text-left text-sm font-medium text-[#355145] shadow-sm ring-1 ring-[#e3efe8] transition hover:bg-[#f8fcfa]"
                      >
                        {item}
                      </button>
                    ))}

                    <div className="flex items-center gap-2 rounded-[18px] border border-[#dcece4] bg-white px-3 py-3 shadow-sm">
                      <span className="text-[#8aa395]">+</span>
                      <input
                        type="text"
                        value="Ask me anything..."
                        readOnly
                        className="w-full bg-transparent text-sm text-[#6e6563] outline-none"
                      />
                      <span className="text-[#d84843]">&gt;</span>
                    </div>
                  </div>
                </section>

                <section className="rounded-[30px] bg-white p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.22)] ring-1 ring-black/5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-[#1a1516]">
                        Upcoming Bills
                      </h2>
                      <p className="mt-1 text-sm text-[#8f8581]">
                        Scheduled bill reminders will appear here.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/pulse")}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4eeea] text-2xl font-medium text-[#655d5b] transition hover:bg-[#ece4df]"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex min-h-[220px] items-center justify-center rounded-[24px] border border-dashed border-[#e7deda] bg-[#fcfaf9] px-6 text-center">
                    <div>
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3ece8] text-xl text-[#b0a5a1]">
                        +
                      </div>
                      <p className="mt-4 text-lg font-semibold text-[#1a1516]">
                        No upcoming bills yet
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#938987]">
                        Upcoming bills will populate here after backend integration is added.
                      </p>
                    </div>
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

export default Dashboard;
