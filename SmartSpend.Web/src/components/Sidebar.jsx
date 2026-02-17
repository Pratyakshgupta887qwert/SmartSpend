import React from "react";
import { LayoutDashboard, Receipt, Wallet, Settings, LogOut } from "lucide-react";

function Sidebar() {
  return (
    /* md:w-64 -> width on large laptops
       w-20    -> width on tablets (icons only)
       hidden  -> hidden on mobile phones
    */
    <div className="hidden sm:flex flex-col h-screen w-20 md:w-64 bg-[#1e2128] text-white p-4 md:p-6 transition-all duration-300">
      
      {/* 1. Logo - Icon only on small, Text on large */}
      <div className="flex items-center gap-3 mb-10 justify-center md:justify-start">
        <div className="h-6 w-6 min-w-[24px] bg-green-500 rounded-full border border-green-900"></div>
        <span className="text-xl font-bold hidden md:block truncate">SmartSpend</span>
      </div>

      {/* 2. Menu Items */}
      <nav className="flex flex-col gap-4">
        
        {/* Dashboard (Active) */}
        <button className="flex items-center justify-center md:justify-start gap-4 bg-[#2d3139] p-3 rounded-xl">
          <LayoutDashboard size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Dashboard</span>
        </button>

        <button className="flex items-center justify-center md:justify-start gap-4 text-gray-400 p-3 hover:bg-[#252830] rounded-xl transition-colors">
          <Receipt size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Receipts</span>
        </button>

        <button className="flex items-center justify-center md:justify-start gap-4 text-gray-400 p-3 hover:bg-[#252830] rounded-xl transition-colors">
          <Wallet size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Budgets</span>
        </button>

        <button className="flex items-center justify-center md:justify-start gap-4 text-gray-400 p-3 hover:bg-[#252830] rounded-xl transition-colors">
          <Settings size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Settings</span>
        </button>

      </nav>

      {/* 3. Logout Section */}
      <div className="mt-auto border-t border-gray-800 pt-4">
        <button className="flex items-center justify-center md:justify-start gap-4 text-gray-400 p-3 hover:text-red-400 w-full transition-colors">
          <LogOut size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Log Out</span>
        </button>
      </div>

    </div>
  );
}

export default Sidebar;