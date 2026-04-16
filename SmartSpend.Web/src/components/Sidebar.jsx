import React from "react";
import {
  Activity,
  BrainCircuit,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Wallet,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/budgets", icon: Wallet, label: "Budget" },
    { to: "/insights", icon: BrainCircuit, label: "AI Insights" },
    { to: "/pulse", icon: Activity, label: "Pulse" },
    { to: "/uploadreceipt", icon: PlusCircle, label: "Add Expense" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const baseClass =
    "group flex items-center justify-center md:justify-start gap-4 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200";
  const activeClass =
    "bg-white text-[#181314] shadow-[0_14px_30px_-18px_rgba(0,0,0,0.85)]";
  const inactiveClass =
    "text-white/70 hover:bg-white/10 hover:text-white";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <>
      <div className="hidden sm:flex h-screen w-24 md:w-72 flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#251d21_0%,#2a2025_48%,#171214_100%)] px-4 py-5 text-white">
        <div className="mb-8 flex items-center justify-center gap-3 md:justify-start">
          <div className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-xl bg-[#d84843] shadow-[0_14px_28px_-16px_rgba(216,72,67,0.95)]"></div>
          <span className="hidden truncate text-xl font-semibold tracking-tight md:block">
            SmartSpend
          </span>
        </div>

        <nav className="flex flex-col gap-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${baseClass} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <Icon size={18} />
                <span className="hidden md:block">{item.label}</span>
              </NavLink>
            );
          })}

        </nav>

        <div className="mt-auto rounded-[28px] border border-white/10 bg-white/[0.05] p-4 shadow-[0_18px_35px_-28px_rgba(0,0,0,0.95)]">
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

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#2e2629] bg-[#1a1417]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.4rem)] pt-2 backdrop-blur sm:hidden">
        <div className="grid grid-cols-7 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={`mobile-${item.to}`}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] font-medium transition ${
                    isActive ? "bg-white text-[#1b1718]" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={16} />
                <span className="mt-1 truncate">{item.label}</span>
              </NavLink>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] font-medium text-white/70 transition hover:bg-white/10 hover:text-[#ff8d88]"
          >
            <LogOut size={16} />
            <span className="mt-1">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
