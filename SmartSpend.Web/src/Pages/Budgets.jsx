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
    <div className="flex h-screen overflow-hidden bg-[#171214]">
      
      {/* 1. Fixed Sidebar */}
      <Sidebar />

      {/* 2. Main Layout Wrapper */}
      <div className="flex-1 flex min-w-0 flex-col bg-[#f6f1ee]">
        
        {/* FIX: This wrapper prevents the Navbar from thinning/shrinking */}
        <div className="shrink-0">
          <Navbar />
        </div>
    
        {/* 3. Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">

          <h1 className="mb-5 text-3xl font-bold tracking-tight text-[#1a1516]">
            Budgets
          </h1>

          {/* Budget Cards Grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {budgets.map((item, index) => {
              const percent = Math.round((item.spent / item.total) * 100);
              const color = getColor(percent);

              return (
                <div key={index} className="rounded-[26px] border border-[#efe7e3] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-30px_rgba(15,23,42,0.48)]">

                  {/* Card Header: Title & Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#1a1516]">{item.title}</h3>
                      <p className="text-sm text-[#8f8583]">
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
                      <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white text-[12px] font-bold text-[#5f5755]">
                        {percent}%
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="mt-4 h-[10px] w-full overflow-hidden rounded-[10px] bg-[#ebe3df]">
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