import React, { useEffect, useState } from 'react';
import { Bell, Search, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Notification from './Notification';
import { useNotifications } from '../context/NotificationContext';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const apiBaseUrl = "https://localhost:5030";
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

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
        <nav className="sticky top-0 z-10 flex h-20 w-full items-center justify-between border-b border-black/5 bg-[#f6f1ee]/90 px-5 backdrop-blur md:px-8">
            <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#a79d98]">
                    Good Morning
                </p>
                <h1 className="truncate text-lg font-semibold tracking-tight text-[#1b1718] md:text-2xl">
                    {displayTitle}
                </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {isSearchOpen && (
                    <div className="hidden md:flex items-center rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-black/5">
                        <Search className="h-4 w-4 text-[#8d8380]" />
                        <input
                            type="text"
                            placeholder="Search expenses, bills, budgets..."
                            className="ml-3 w-64 bg-transparent text-sm text-[#1b1718] outline-none placeholder:text-[#a89f9c]"
                        />
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setIsSearchOpen((previous) => !previous)}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#544d4d] shadow-sm ring-1 ring-black/5 transition hover:text-[#1b1718]"
                >
                    <Search className="h-4 w-4" />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsNotificationOpen((previous) => !previous)}
                        className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#544d4d] shadow-sm ring-1 ring-black/5 transition hover:text-[#1b1718]"
                    >
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 text-[10px] font-semibold text-white bg-[#d84843] rounded-full border-2 border-[#f6f1ee] flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotificationOpen && (
                        <Notification
                            notifications={notifications}
                            onNotificationClick={(id) => markAsRead(id)}
                            onMarkAllRead={markAllAsRead}
                            onClearAll={clearAll}
                        />
                    )}
                </div>

                <button className="hidden items-center gap-2 rounded-2xl bg-white px-3 py-2 text-left shadow-sm ring-1 ring-black/5 transition hover:bg-white md:flex">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fdf0df] text-[#cf7a22]">
                        <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-[#7c7472]">
                        Pro
                    </span>
                </button>

                <button className="flex items-center gap-3 rounded-2xl bg-white px-2.5 py-2 shadow-sm ring-1 ring-black/5 transition hover:bg-white">
                    <img 
                        src={resolvedImage}
                        alt="User" 
                        className="w-9 h-9 rounded-2xl object-cover border border-[#efe4df]" 
                    />
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold leading-tight text-[#1b1718]">
                            {storedName}
                        </p>
                        <p className="text-[11px] text-[#8d8380]">{storedRole}</p>
                    </div>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
