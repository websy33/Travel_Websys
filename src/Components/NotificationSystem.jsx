import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  // Function to add notification
  const addNotification = (type, title, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, type, title, message, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  // Function to remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Expose functions globally
  useEffect(() => {
    window.showNotification = addNotification;
    return () => {
      delete window.showNotification;
    };
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle size={20} />;
      case 'error': return <FiAlertCircle size={20} />;
      case 'info': return <FiInfo size={20} />;
      default: return <FiInfo size={20} />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      case 'info': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`${getColors(notification.type)} px-6 py-4 rounded-lg shadow-lg max-w-sm flex items-start space-x-3`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <p className="text-sm opacity-90 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <FiX size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;