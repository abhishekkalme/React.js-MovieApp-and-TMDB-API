import React, { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [history, setHistory] = useState([
        { id: 1, message: "Welcome to Movie Explorer! 🚀", type: "success", timestamp: new Date() },
        { id: 2, message: "New server added: Vidplus (Hindi) 🇮🇮", type: "info", timestamp: new Date() },
        { id: 3, message: "Community features coming soon! 💬", type: "info", timestamp: new Date() }
    ]);

    const showNotification = (message, type = "info", duration = 3000) => {
        const id = Date.now();
        const newNotification = { id, message, type };
        setNotifications((prev) => [...prev, newNotification]);
        setHistory((prev) => [{ ...newNotification, timestamp: new Date() }, ...prev].slice(0, 10));

        if (duration !== Infinity) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <NotificationContext.Provider value={{ showNotification, removeNotification, history, clearHistory }}>
            {children}
            {/* The actual rendering of notifications will be done in a separate container in App.jsx or here */}
            <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
        </NotificationContext.Provider>
    );
};

// Internal container for stacking notifications
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const NotificationContainer = ({ notifications, removeNotification }) => {
    return (
        <div className="fixed top-24 right-6 z-[200] flex flex-col gap-3 pointer-events-none w-full max-w-[320px]">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
                        layout
                        className="pointer-events-auto"
                    >
                        <NotificationItem
                            notification={notification}
                            onClose={() => removeNotification(notification.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

const NotificationItem = ({ notification, onClose }) => {
    const icons = {
        success: <FiCheckCircle className="text-green-500" />,
        error: <FiAlertCircle className="text-red-500" />,
        info: <FiInfo className="text-blue-500" />,
    };

    const colors = {
        success: "border-green-500/20 bg-green-500/10",
        error: "border-red-500/20 bg-red-500/10",
        info: "border-blue-500/20 bg-blue-500/10",
    };

    return (
        <div className={`flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${colors[notification.type] || colors.info}`}>
            <div className="text-xl flex-shrink-0">
                {icons[notification.type] || icons.info}
            </div>
            <p className="text-sm font-medium text-white flex-1 leading-tight">
                {notification.message}
            </p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
                <FiX size={16} />
            </button>
        </div>
    );
};
