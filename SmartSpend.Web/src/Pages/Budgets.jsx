import { Weight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import React from "react";
import Navbar from "../components/Navbar";


const budgets = [
  { title: "Food", spent: 10500, total: 15000 },
  { title: "Shopping", spent: 27000, total: 41000 },
  { title: "Travel", spent: 2000, total: 8000 },
  { title: "Entertainment", spent: 35000, total: 41000 },
  { title: "Utilities", spent: 2900, total: 3200 },
  { title: "Utilities", spent: 900, total: 3200 }
];

function Budgets() {

  const getColor = (percent) => {
    if (percent < 40) return "green";
    if (percent < 70) return "orange";
    return "red";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar stays on the left */}
      <Sidebar />

      <div className="flex-2 flex flex-col">
        <Navbar />
    
    <div style={{
      padding: "30px",
      background: "#f3f4f6",
      minHeight: "100vh"
    }}>

      <h1 style={{ marginBottom: "20px", fontWeight:"bold", fontSize:"30px"}}>Budgets</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
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

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>

                <div>
                  <h3>{item.title}</h3>
                  <p style={{ color: "#6b7280" }}>
                    Spent ₹{item.spent} of ₹{item.total}
                  </p>
                </div>

                
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
                    fontSize: "12px"
                  }}>
                    {percent}%
                  </div>
                </div>

              </div>

              
              <div style={{
                marginTop: "15px",
                width: "100%",
                height: "10px",
                background: "#e5e7eb",
                borderRadius: "10px"
              }}>
                <div style={{
                  width: percent + "%",
                  height: "100%",
                  background: color,
                  borderRadius: "10px"
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
