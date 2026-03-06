
// export default Navbar;
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, HeartPulse, Bell, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import { useSocket } from '../context/SocketContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      // Listen for socket events to prepend new notifications
      const handleNewNotification = () => fetchNotifications();

      socket.on('emergency_created', handleNewNotification);
      socket.on('request_accepted', handleNewNotification);
      socket.on('request_completed', handleNewNotification);

      return () => {
        socket.off('emergency_created', handleNewNotification);
        socket.off('request_accepted', handleNewNotification);
        socket.off('request_completed', handleNewNotification);
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="ll-navbar-wrapper">
      <div className="ll-navbar-inner">
        {/* Brand Section */}
        <Link to="/" className="ll-brand">
          <div className="ll-brand-icon">
            <HeartPulse className="text-white " size={20} />

          </div>
          <span className="ll-brand-text">LifeLink</span>
        </Link>

        {/* User Actions */}
        <div className="ll-nav-actions">
          {user && (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors relative"
                >
                  <Bell size={20} className="text-gray-600 dark:text-zinc-300" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                      <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                      <button onClick={handleMarkAllAsRead} className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No notifications yet.</div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif._id} className={`p-4 border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className={`text-sm font-semibold mb-1 ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-zinc-300'}`}>{notif.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">{notif.message}</p>
                              </div>
                              {!notif.isRead && (
                                <button onClick={(e) => handleMarkAsRead(notif._id, e)} className="text-blue-500 hover:bg-blue-100 p-1 rounded-full transition-colors">
                                  <Check size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Badge */}
              <div className="ll-profile-badge">
                <div className="ll-avatar">
                  {user?.name?.charAt(0)}
                  <span className="ll-online-indicator"></span>
                </div>
                <div className="ll-profile-info">
                  <span className="ll-user-name">{user?.name}</span>
                  <span className="ll-user-type">
                    {user?.role === 'medical' ? 'Clinic Partner' : `Donor • ${user?.bloodGroup}`}
                  </span>
                </div>
              </div>
            </>
          )}

          <button onClick={handleLogout} className="ll-logout-btn" title="Sign Out">
            <LogOut size={18} />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

// Inserted via JS for easy setup, but better moved to index.css
const styles = `
:root {
  --ll-red: #E11D48;
  --ll-zinc-900: #09090b;
  --ll-zinc-500: #71717a;
  --ll-zinc-100: #f4f4f5;
  --ll-glass: rgba(255, 255, 255, 0.8);
}

.ll-navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--ll-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

.ll-navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

/* Brand Styling */
.ll-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: opacity 0.2s;
}

.ll-brand:hover { opacity: 0.8; }

.ll-brand-icon {
  background: var(--ll-red);
  color: white;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.25);
}

.ll-brand-text {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--ll-zinc-900);
  letter-spacing: -0.04em;
}

/* Profile Badge Styling */
.ll-nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.ll-profile-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 4px 12px 4px 6px;
  border-radius: 99px;
  border: 1px solid var(--ll-zinc-100);
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.ll-avatar {
  width: 32px;
  height: 32px;
  background: var(--ll-zinc-900);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  position: relative;
}

.ll-online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: #22c55e;
  border: 2px solid white;
  border-radius: 50%;
}

.ll-profile-info {
  display: flex;
  flex-direction: column;
}

.ll-user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ll-zinc-900);
  line-height: 1;
}

.ll-user-type {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--ll-zinc-500);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-top: 2px;
}

/* Logout Button */
.ll-logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: var(--ll-zinc-500);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.ll-logout-btn:hover {
  color: var(--ll-red);
  background: #fff1f2;
}

@media (max-width: 640px) {
  .ll-profile-info, .ll-logout-btn span { display: none; }
  .ll-navbar-inner { height: 64px; padding: 0 1rem; }
  .ll-profile-badge { padding: 4px; border: none; background: none; box-shadow: none; }
}
`;

if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default Navbar;