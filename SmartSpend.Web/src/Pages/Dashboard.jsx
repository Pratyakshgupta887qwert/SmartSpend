import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
function Dashboard() {
  const location=useLocation();
  useEffect(()=>{
    const params = new URLSearchParams(location.search);
    const name= params.get("name");
    const email =params.get("email");
    if(name){
      localStorage.setItem("userName",name);
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