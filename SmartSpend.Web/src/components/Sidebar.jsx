import React from "react";
import { LayoutDashboard, Receipt, Wallet, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const baseClass =
    "flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-all duration-200";
 const activeClass = "bg-green-100/90 text-green-700 shadow-sm border border-green-200";
const inactiveClass = "text-slate-500 hover:bg-green-50 hover:text-green-700";

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="hidden sm:flex flex-col h-screen w-20 md:w-64 bg-gradient-to-b from-white to-[#f5faf7] border-r border-green-100 p-4 md:p-6">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 justify-center md:justify-start">
        <div className="h-7 w-7 min-w-[28px] bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md"></div>
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
      <div className="mt-auto border-t border-green-100 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start gap-4 text-slate-400 p-3 rounded-xl hover:bg-red-50 hover:text-red-500 w-full transition-colors"
        >
          <LogOut size={20} />
          <span className="hidden md:block">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;