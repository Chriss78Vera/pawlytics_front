import { createContext, useContext, useMemo, useState } from 'react';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const notify = ({ title, message, type = 'info' }) => {
    const notification = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
    };

    setNotifications((current) => [notification, ...current].slice(0, 10));
    setIsOpen(true);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = useMemo(() => ({
    notifications,
    isOpen,
    setIsOpen,
    notify,
    clearNotifications,
  }), [notifications, isOpen]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider');
  }

  return context;
}
