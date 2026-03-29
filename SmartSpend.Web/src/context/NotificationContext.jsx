/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "smartspend_notifications";

const NotificationContext = createContext(null);

const getInitialNotifications = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(getInitialNotifications);

  const syncToStorage = useCallback((nextNotifications) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextNotifications));
  }, []);

  const addNotification = useCallback(
    ({ title, message, type = "info" }) => {
      setNotifications((previous) => {
        const next = [
          {
            id: Date.now() + Math.random(),
            title,
            message,
            type,
            read: false,
            createdAt: new Date().toISOString(),
          },
          ...previous,
        ].slice(0, 50);

        syncToStorage(next);
        return next;
      });
    },
    [syncToStorage]
  );

  const markAsRead = useCallback(
    (id) => {
      setNotifications((previous) => {
        const next = previous.map((item) =>
          item.id === id ? { ...item, read: true } : item
        );

        syncToStorage(next);
        return next;
      });
    },
    [syncToStorage]
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((previous) => {
      const next = previous.map((item) => ({ ...item, read: true }));
      syncToStorage(next);
      return next;
    });
  }, [syncToStorage]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
    }),
    [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }

  return context;
}
