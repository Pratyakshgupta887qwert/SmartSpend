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
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* 1. Fixed Sidebar */}
      <Sidebar />

      {/* 2. Main Layout Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* FIX: This wrapper prevents the Navbar from thinning/shrinking */}
        <div className="shrink-0">
          <Navbar />
        </div>
    
        {/* 3. Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto" style={{
          padding: "30px",
          background: "#f3f4f6",
        }}>

          <h1 style={{ marginBottom: "20px", fontWeight: "bold", fontSize: "30px" }}>
            Budgets
          </h1>

          {/* Budget Cards Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: "20px"
          }}>

            {budgets.map((item, index) => {
              const percent = Math.round((item.spent / item.total) * 100);
              const color = getColor(percent);

              return (
                <div key={index} style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}>

                  {/* Card Header: Title & Info */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                      <p style={{ color: "#6b7280" }}>
                        Spent ₹{item.spent.toLocaleString()} of ₹{item.total.toLocaleString()}
                      </p>
                    </div>

                    {/* Circular Progress Indicator */}
                    <div style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: `conic-gradient(${color} ${percent * 3.6}deg, #e5e7eb 0deg)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <div style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}>
                        {percent}%
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div style={{
                    marginTop: "15px",
                    width: "100%",
                    height: "10px",
                    background: "#e5e7eb",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: Math.min(percent, 100) + "%",
                      height: "100%",
                      background: color,
                      borderRadius: "10px",
                      transition: "width 0.5s ease-in-out"
                    }}></div>
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