import React, { useEffect } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const apiBaseUrl = "https://localhost:5030";

    // 1. Retrieve the stored name (Fallback to 'User' if empty)
    const storedName = localStorage.getItem("userName") || "User";
    const storedRole = localStorage.getItem("userRole") || "User";
    const storedImage = localStorage.getItem("userImage") || "";

    const resolvedImage = storedImage
        ? (storedImage.startsWith("/profile-images/")
            ? `${apiBaseUrl}/api/auth/profile-image/${storedImage.split("/").pop()}`
            : (storedImage.startsWith("http://") || storedImage.startsWith("https://")
                ? storedImage
                : `${apiBaseUrl}${storedImage}`))
        : "https://ui-avatars.com/api/?name=User&background=E2E8F0&color=334155";
    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(!token){
            navigate("/");
        }
    },[navigate]);
    // 2. Determine title based on current path
    const rawPath = location.pathname.split("/")[1];
    
    // Logic: If on dashboard, show Welcome. Otherwise, show page name.
    const displayTitle = (rawPath === "dashboard" || !rawPath) 
        ? `Welcome Back, ${storedName}!` 
        : rawPath.charAt(0).toUpperCase() + rawPath.slice(1);

    return (
        <nav className="w-full h-20 bg-white/90 backdrop-blur-md border-b border-green-100 flex items-center justify-between px-6 md:px-8 sticky top-0 z-10">
            
            {/* LEFT SIDE: Dynamic Welcome Message */}
            <div>
                <h1 className="text-xl font-extrabold text-[#14281b] transition-all tracking-tight">
                    {displayTitle}
                </h1>
                {rawPath === "dashboard" && (
                    <p className="text-[11px] text-slate-500 font-medium">Monitoring your spending habits.</p>
                )}
            </div>

            {/* RIGHT SIDE: Actions & Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
                
                {/* Notification Bell */}
                <button className="relative p-2 rounded-xl text-slate-500 hover:bg-green-50 hover:text-green-700 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-green-100 mx-1 hidden sm:block"></div>

                {/* Profile Section */}
                <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-green-50 transition-all group text-left border border-transparent hover:border-green-100">
                    <img 
                        src={resolvedImage}
                        alt="User" 
                        className="w-9 h-9 rounded-xl object-cover shadow-sm border border-green-100" 
                    />
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-[#1a2f22] leading-tight">
                            {storedName}
                        </p>
                        <p className="text-[11px] text-slate-500">{storedRole} Account</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block group-hover:text-green-700 transition-colors" />
                </button>

            </div>
        </nav>
    );
}

export default Navbar;