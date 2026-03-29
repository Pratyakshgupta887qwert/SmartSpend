import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Static budget data
const budgets = [
  { title: "Food", spent: 10500, total: 15000 },
  { title: "Shopping", spent: 27000, total: 41000 },
  { title: "Travel", spent: 2000, total: 8000 },
  { title: "Entertainment", spent: 35000, total: 41000 },
  { title: "Utilities", spent: 2900, total: 3200 },
  { title: "Utilities", spent: 900, total: 3200 }
];

function Budgets() {
  // Logic to determine color based on spending percentage
  const getColor = (percent) => {
    if (percent < 40) return "#22c55e"; // Green
    if (percent < 70) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  return (
    <div className="flex h-screen ss-app-bg overflow-hidden">
      
      {/* 1. Fixed Sidebar */}
      <Sidebar />

      {/* 2. Main Layout Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* FIX: This wrapper prevents the Navbar from thinning/shrinking */}
        <div className="shrink-0">
          <Navbar />
        </div>
    
        {/* 3. Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          <h1 className="ss-title text-3xl mb-5">
            Budgets
          </h1>

          {/* Budget Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {budgets.map((item, index) => {
              const percent = Math.round((item.spent / item.total) * 100);
              const color = getColor(percent);

              return (
                <div key={index} className="ss-card p-5">

                  {/* Card Header: Title & Info */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-[#173122] text-lg">{item.title}</h3>
                      <p className="text-slate-500 text-sm">
                        Spent ₹{item.spent.toLocaleString()} of ₹{item.total.toLocaleString()}
                      </p>
                    </div>

                    {/* Circular Progress Indicator */}
                    <div
                      className="w-[60px] h-[60px] rounded-full flex items-center justify-center"
                      style={{
                        background: `conic-gradient(${color} ${percent * 3.6}deg, #e5e7eb 0deg)`
                      }}
                    >
                      <div className="w-[45px] h-[45px] rounded-full bg-white flex items-center justify-center text-[12px] font-bold text-slate-600">
                        {percent}%
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="mt-4 w-full h-[10px] bg-slate-200 rounded-[10px] overflow-hidden">
                    <div
                      style={{
                        width: Math.min(percent, 100) + "%",
                        height: "100%",
                        background: color,
                        borderRadius: "10px",
                        transition: "width 0.5s ease-in-out"
                      }}
                    ></div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budgets;