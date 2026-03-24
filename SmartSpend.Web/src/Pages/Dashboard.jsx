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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-6 bg-[#f5f7fb] min-h-screen overflow-y-auto">

          <div className="grid grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="col-span-2 space-y-6">

              {/* TOP CARDS */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { title: "Income", amount: "$8,500", color: "text-green-500" },
                  { title: "Expense", amount: "$4,900", color: "text-red-500" },
                  { title: "Savings", amount: "$2,000", color: "text-blue-500" },
                  { title: "Investment", amount: "$1,600", color: "text-purple-500" },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-xs text-gray-400">{item.title}</p>
                    <h1 className={`text-xl font-bold mt-1 ${item.color}`}>
                      {item.amount}
                    </h1>
                  </div>
                ))}
              </div>

              {/* EXPENSE OVERVIEW */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold mb-4">Expense Overview</h2>
                <ExpenseChart />
              </div>

              {/* TRANSACTIONS */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold mb-4">Recent Transactions</h2>

                <div className="space-y-3 text-sm">
                  {[
                    { name: "Domino's Pizza", category: "Food", amount: "$499" },
                    { name: "Zara", category: "Shopping", amount: "$1200" },
                    { name: "Uber", category: "Travel", amount: "$680" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.category}</p>
                      </div>
                      <p className="font-semibold">{item.amount}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {/* PIE */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold mb-4">Spending Breakdown</h2>
                <SpendingPieChart />
              </div>

              {/* AI INSIGHTS */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold mb-4">AI Insights</h2>

                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    📈 Food spending increased ₹1000
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    💡 Save ₹2000 next month
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;