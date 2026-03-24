import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
function Dashboard() {
  const location=useLocation();
  useEffect(()=>{
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if(token){
      localStorage.setItem("token",token);
      const decode=JSON.parse(atob(token.split(".")[1]));
      const name=decode.name||decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]||"User";
      localStorage.setItem("userName",name);
      window.history.replaceState({},document.title,"/dashboard");

    }
  },[location]);
  return (
    // 1. Create a flex container for the whole screen
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar stays on the left */}
      <Sidebar />

      {/* 2. Create a column for the right side (Navbar + Content) */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        {/* Main page content would go here later */}
        <div className="p-6">
            <h1 className="text-2xl font-bold">Dashboard Content</h1>
        </div>
      </div>

    </div>
  );
}
export default Dashboard;