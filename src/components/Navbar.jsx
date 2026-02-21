
// export default Navbar;
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, HeartPulse } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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