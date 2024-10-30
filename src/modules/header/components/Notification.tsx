// NotificationComponent.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
import { Notification } from '../types/types';
import { Poppins, Montserrat } from 'next/font/google';

// Load fonts
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });

interface NotificationComponentProps {
  notifications: Notification[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  markAsRead: (id: string) => void;
}

const   NotificationComponent = React.forwardRef<HTMLDivElement, NotificationComponentProps>(
  ({ notifications, isOpen, setIsOpen, markAsRead }, ref) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
      <div className="relative mr-4 " ref={ref}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white text-lg sm:text-lg cursor-pointer hover:text-red-600 transition-colors duration-300"
        >
          <FaBell />
          {unreadCount > 0 && (
            <span className={`absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ${montserrat.className}`}>
              {unreadCount}
            </span>
          )}
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute right-0 mt-2 w-64 rounded-lg shadow-2xl overflow-hidden ${poppins.className}`}
              style={{
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="px-4 py-3 border-b border-white border-opacity-20">
                <p className="text-white text-sm font-semibold">Notifications</p>
              </div>
              {notifications.length === 0 ? (
                <p className="text-white text-sm p-4">No notifications</p>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`px-4 py-3 border-b border-white border-opacity-10 ${notif.read ? 'opacity-50' : ''} cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors duration-300`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <p className={`text-white text-sm ${montserrat.className}`}>{notif.message}</p>
                    <p className={`text-gray-400 text-xs mt-1 ${montserrat.className}`}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

NotificationComponent.displayName = 'NotificationComponent';

export default NotificationComponent;