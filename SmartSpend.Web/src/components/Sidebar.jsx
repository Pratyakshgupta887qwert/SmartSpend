import React from "react";
import { LayoutDashboard, Receipt, Wallet, Settings, LogOut } from "lucide-react";
<<<<<<< HEAD
import { useNavigate, useLocation } from "react-router-dom";

// function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Check active route
//   const isActive = (path) => location.pathname === path;

//   // Common styles
//   const baseStyle =
//     "flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-all duration-300 w-full";


import {NavLink, useNavigate} from "react-router-dom"; // Added useLocation

function Sidebar() {
  const navigate = useNavigate();
   // This tells us where we are (e.g., "/budgets")
  const baseClass= "flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-colors";
  const activeClass ="bg-[#2d3139] text-white";
  const inactiveClass="text-gray-400 hover:bg-[#252830]";

  // Helper to check if the path is active
  // const isActive = (path) => location.pathname === path;

  // // Base styles for all buttons
  // const baseStyle = "flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-all duration-300 w-full";
  
  // // Styles for Active vs Inactive
  // const activeStyle = "bg-[#2d3139] text-white";
  // const inactiveStyle = "text-gray-400 hover:bg-[#252830] hover:text-white";
>>>>>>> aa42a96803c4c04d13ea457fa19bc227677cc7ec

  const activeStyle = "bg-[#2d3139] text-white";
  const inactiveStyle =
    "text-gray-400 hover:bg-[#252830] hover:text-white opacity-80";

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
        

        {/* Dashboard (Active) */}
        <NavLink to="/dashboard" className={({isActive})=>`${baseClass} ${isActive ? activeClass : inactiveClass}`}>
        {/* <button onClick={()=>navigate("/dashboard")}className="flex items-center justify-center md:justify-start gap-4 bg-[#2d3139] p-3 rounded-xl"> */}

        {/* Dashboard */}
<<<<<<< HEAD
        <button
          onClick={() => navigate("/dashboard")}
          className={`${baseStyle} ${
            isActive("/dashboard") ? activeStyle : inactiveStyle
          }`}
        >
=======
       
>>>>>>> aa42a96803c4c04d13ea457fa19bc227677cc7ec
          <LayoutDashboard size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Dashboard</span>
        {/* </button> */}
        </NavLink>

        {/* Receipts */}
<<<<<<< HEAD
        <button
          onClick={() => navigate("/uploadreceipt")}
          className={`${baseStyle} ${
            isActive("/uploadreceipt") ? activeStyle : inactiveStyle
          }`}
=======
        <NavLink 
          to={"/receipts"}
          className={({isActive})=>`${baseClass} ${isActive? activeClass: inactiveClass}`}
>>>>>>> aa42a96803c4c04d13ea457fa19bc227677cc7ec
        >
          <Receipt size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Receipts</span>
        </NavLink>

<<<<<<< HEAD
        {/* Budgets */}
        <button
          onClick={() => navigate("/budgets")}
          className={`${baseStyle} ${
            isActive("/budgets") ? activeStyle : inactiveStyle
          }`}
        >
=======

        <NavLink to={"/budgets"} className={({isActive})=>`${baseClass} ${isActive? activeClass: inactiveClass}`}>
        {/* <button onClick={()=>navigate("/budgets")}className="flex items-center justify-center md:justify-start gap-4 text-gray-400 p-3 hover:bg-[#252830] rounded-xl transition-colors"> */}
>>>>>>> aa42a96803c4c04d13ea457fa19bc227677cc7ec
          <Wallet size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Budgets</span>
        {/* </button> */}
        </NavLink>

        {/* Settings */}
<<<<<<< HEAD
        <button
          className={`${baseStyle} ${
            isActive("/settings") ? activeStyle : inactiveStyle
          }`}
        >
          <Settings size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Settings</span>
        </button>
=======
        <NavLink to= {"/settings"}
        
          className={({isActive})=>`${baseClass} ${isActive? activeClass: inactiveClass}`}>
          <Settings size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Settings</span>
        </NavLink>

>>>>>>> aa42a96803c4c04d13ea457fa19bc227677cc7ec
      </nav>

      {/* Logout */}
      <div className="mt-auto border-t border-gray-800 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start gap-4 text-gray-400 p-3 hover:text-red-400 w-full transition-colors"
        >
          <LogOut size={20} className="min-w-[20px]" />
          <span className="hidden md:block">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
