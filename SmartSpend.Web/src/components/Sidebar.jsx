import React from "react";
import { LayoutDashboard, Receipt, Wallet, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const baseClass =
    "flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-colors";
  const activeClass = "bg-[#2d3139] text-white";
  const inactiveClass = "text-gray-400 hover:bg-[#252830]";

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="hidden sm:flex flex-col h-screen w-20 md:w-64 bg-[#1e2128] text-white p-4 md:p-6 transition-all duration-300">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 justify-center md:justify-start">
        <div className="h-6 w-6 min-w-[24px] bg-green-500 rounded-full border border-green-900"></div>
        <span className="text-xl font-bold hidden md:block truncate">
          SmartSpend
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-4">

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <LayoutDashboard size={20} />
          <span className="hidden md:block">Dashboard</span>
        </NavLink>

        {/* Receipts */}
        <NavLink
          to="/uploadreceipt"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Receipt size={20} />
          <span className="hidden md:block">Receipts</span>
        </NavLink>

        {/* Budgets */}
        <NavLink
          to="/budgets"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Wallet size={20} />
          <span className="hidden md:block">Budgets</span>
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Settings size={20} />
          <span className="hidden md:block">Settings</span>
        </NavLink>

      </nav>

      {/* Logout */}
      <div className="mt-auto border-t border-gray-800 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start gap-4 text-gray-400 p-3 hover:text-red-400 w-full transition-colors"
        >
          <LogOut size={20} />
          <span className="hidden md:block">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;