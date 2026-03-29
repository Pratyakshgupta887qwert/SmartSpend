import React from "react";
import { CheckCheck, BellRing, Trash2 } from "lucide-react";

function formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

function Notification({
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onClearAll,
}) {
  return (
    <div className="absolute right-0 mt-3 w-[22rem] max-w-[92vw] rounded-2xl border border-green-100 bg-white shadow-xl z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-green-100 flex items-center justify-between bg-green-50/60">
        <div>
          <h3 className="text-sm font-bold text-[#163122]">Notifications</h3>
          <p className="text-[11px] text-slate-500">Your recent activity updates</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="p-2 rounded-lg text-slate-500 hover:text-green-700 hover:bg-green-100 transition"
            title="Mark all as read"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <BellRing className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNotificationClick(item.id)}
              className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-green-50/40 transition ${
                item.read ? "bg-white" : "bg-green-50/70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-[#163122]">{item.title}</p>
                {!item.read && <span className="w-2 h-2 mt-1.5 rounded-full bg-green-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-600 mt-1">{item.message}</p>
              <p className="text-[11px] text-slate-400 mt-1">{formatTime(item.createdAt)}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default Notification;
