import React from "react";
import {
  Activity,
  BrainCircuit,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Wallet,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const baseClass =
    "group flex items-center justify-center md:justify-start gap-4 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200";
  const activeClass =
    "bg-white text-[#181314] shadow-[0_14px_30px_-18px_rgba(0,0,0,0.85)]";
  const inactiveClass =
    "text-white/70 hover:bg-white/10 hover:text-white";

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="hidden sm:flex h-screen w-24 md:w-72 flex-col overflow-hidden bg-[linear-gradient(180deg,#251d21_0%,#2a2025_48%,#171214_100%)] px-4 py-5 text-white">
      <div className="mb-8 flex items-center justify-center gap-3 md:justify-start">
        <div className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-xl bg-[#d84843] shadow-[0_14px_28px_-16px_rgba(216,72,67,0.95)]"></div>
        <span className="hidden truncate text-xl font-semibold tracking-tight md:block">
          SmartSpend
        </span>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <LayoutDashboard size={18} />
          <span className="hidden md:block">Dashboard</span>
        </NavLink>

        <NavLink
          to="/budgets"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Wallet size={18} />
          <span className="hidden md:block">Budget</span>
        </NavLink>

        <NavLink
          to="/uploadreceipt"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <BrainCircuit size={18} />
          <span className="hidden md:block">AI Insights</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Activity size={18} />
          <span className="hidden md:block">Pulse</span>
        </NavLink>

        <button
          type="button"
          className={`${baseClass} ${inactiveClass} w-full`}
        >
          <PlusCircle size={18} />
          <span className="hidden md:block">Add Expense</span>
        </button>
      </nav>

      <div className="mt-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
        <p className="hidden text-xs uppercase tracking-[0.28em] text-white/35 md:block">
          Finance Mode
        </p>
        <p className="mt-2 hidden text-sm leading-6 text-white/70 md:block">
          Keep tracking your daily flow and let SmartSpend surface the signals.
        </p>
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-4 rounded-2xl px-3 py-3 text-white/60 transition-colors hover:bg-white/10 hover:text-[#ff8d88] md:justify-start"
        >
          <LogOut size={18} />
          <span className="hidden md:block">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
