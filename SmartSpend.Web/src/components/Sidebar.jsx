import React from "react";
import { LayoutDashboard, Receipt, Wallet, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // This tells us where we are (e.g., "/budgets")

  // Helper to check if the path is active
  const isActive = (path) => location.pathname === path;

  // Base styles for all buttons
  const baseStyle = "flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-all duration-300 w-full";
  
  // Styles for Active vs Inactive
  const activeStyle = "bg-[#2d3139] text-white";
  const inactiveStyle = "text-gray-400 hover:bg-[#252830] hover:text-white";

  const handtologout = () => {
    // Clear user session or token here (if implemented)
    navigate("/");
  }

  return (
    <div className="hidden sm:flex flex-col h-screen w-20 md:w-64 bg-[#1e2128] text-white p-4 md:p-6 transition-all duration-300">
      
      {/* 1. Logo */}
      <div className="flex items-center gap-3 mb-10 justify-center md:justify-start">
        <div className="h-6 w-6 min-w-[24px] bg-green-500 rounded-full border border-green-900"></div>
        <span className="text-xl font-bold hidden md:block truncate">SmartSpend</span>
      </div>

      {/* 2. Menu Items */}
      <nav className="flex flex-col gap-4">
        
        {/* Dashboard */}
        <button 
          onClick={() => navigate("/dashboard")}
          className={`${baseStyle} ${isActive("/dashboard") ? activeStyle : inactiveStyle}`}
        >
          <LayoutDashboard size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Dashboard</span>
        </button>

        {/* Receipts */}
        <button 
          className={`${baseStyle} ${isActive("/receipts") ? activeStyle : inactiveStyle}`}
        >
          <Receipt size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Receipts</span>
        </button>

        {/* Budgets */}
        <button 
          onClick={() => navigate("/budgets")}
          className={`${baseStyle} ${isActive("/budgets") ? activeStyle : inactiveStyle}`}
        >
          <Wallet size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Budgets</span>
        </button>

        {/* Settings */}
        <button 
          className={`${baseStyle} ${isActive("/settings") ? activeStyle : inactiveStyle}`}
        >
          <Settings size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Settings</span>
        </button>

      </nav>

      {/* 3. Logout Section */}
      <div className="mt-auto border-t border-gray-800 pt-4">
        <button onClick={handtologout} className="flex items-center justify-center md:justify-start gap-4 text-gray-400 p-3 hover:text-red-400 w-full transition-colors">
          <LogOut size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Log Out</span>
        </button>
      </div>

    </div>
  );
}

export default Sidebar;