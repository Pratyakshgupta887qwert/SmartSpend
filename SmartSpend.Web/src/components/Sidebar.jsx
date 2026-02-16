import React from "react";
// We still need the icons to make it look like the image!
import { LayoutDashboard, Receipt, Wallet, Settings, LogOut } from "lucide-react";

function Sidebar() {
  return (
    <div className="h-screen w-64 bg-[#1e2128] text-white p-6 flex flex-col h-screen">
      
      {/* 1. Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="h-6 w-6 bg-green-500 rounded-full border border-green-900"></div>
        <span className="text-xl font-bold">SmartSpend</span>
      </div>

      {/* 2. Menu Items (Written out simply) */}
      <nav className="flex flex-col gap-4">
        
        {/* Active Item */}
        <button className="flex items-center gap-4 bg-[#2d3139] p-3 rounded-xl">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        <button className="flex items-center gap-4 text-gray-400 p-3 hover:bg-[#252830] rounded-xl">
          <Receipt size={20} />
          <span>Upload Receipt</span>
        </button>

        <button className="flex items-center gap-4 text-gray-400 p-3 hover:bg-[#252830] rounded-xl">
          <Wallet size={20} />
          <span>Budgets</span>
        </button>

        <button className="flex items-center gap-4 text-gray-400 p-3 hover:bg-[#252830] rounded-xl">
          <Settings size={20} />
          <span>Settings</span>
        </button>

      </nav>

      {/* 3. Logout at the bottom */}
      <div className="mt-auto border-t border-gray-800 pt-4">
        <button className="flex items-center gap-4 text-gray-400 p-3 hover:text-red-400 w-full text-left transition-colors">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>

    </div>
  );
}

export default Sidebar;