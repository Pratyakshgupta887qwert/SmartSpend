import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    
    // 1. Retrieve the stored name (Fallback to 'User' if empty)
    const storedName = localStorage.getItem("userName") || "User";

    // 2. Determine title based on current path
    const rawPath = location.pathname.split("/")[1];
    
    // Logic: If on dashboard, show Welcome. Otherwise, show page name.
    const displayTitle = (rawPath === "dashboard" || !rawPath) 
        ? `Welcome Back, ${storedName}!` 
        : rawPath.charAt(0).toUpperCase() + rawPath.slice(1);

    return (
        <nav className="w-full h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
            
            {/* LEFT SIDE: Dynamic Welcome Message */}
            <div>
                <h1 className="text-xl font-bold text-gray-800 transition-all">
                    {displayTitle}
                </h1>
                {rawPath === "dashboard" && (
                    <p className="text-[11px] text-gray-400 font-medium">Monitoring your spending habits.</p>
                )}
            </div>

            {/* RIGHT SIDE: Actions & Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
                
                {/* Notification Bell */}
                <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-gray-100 mx-1 hidden sm:block"></div>

                {/* Profile Section */}
                <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-all group text-left">
                    <img 
                        src="https://i.pravatar.cc/40" 
                        alt="User" 
                        className="w-9 h-9 rounded-xl object-cover shadow-sm border border-gray-100" 
                    />
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {storedName}
                        </p>
                        <p className="text-[11px] text-gray-400">Student Account</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block group-hover:text-gray-600 transition-colors" />
                </button>

            </div>
        </nav>
    );
}

export default Navbar;