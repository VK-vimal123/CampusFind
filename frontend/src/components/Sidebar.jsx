import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  CheckSquare,
  PlusCircle,
  FileText,
  User,
  ShieldCheck,
  LogOut,
  X,
  Compass
} from 'lucide-react';
import { getStoredUser, removeStoredUser } from '../data/mockItems';

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    const handleUserUpdate = () => setUser(getStoredUser());
    window.addEventListener('campusfind_user_updated', handleUserUpdate);
    return () => window.removeEventListener('campusfind_user_updated', handleUserUpdate);
  }, []);

  const handleLogout = () => {
    removeStoredUser();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home / Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Lost Items', path: '/lost-items', icon: Search },
    { name: 'Found Items', path: '/found-items', icon: CheckSquare },
    { name: 'Report Lost', path: '/report-lost', icon: PlusCircle, badge: 'Lost' },
    { name: 'Report Found', path: '/report-found', icon: PlusCircle, badge: 'Found' },
    { name: 'My Reports', path: '/my-reports', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (user?.isAdmin) {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: ShieldCheck, admin: true });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-slate-100 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
            <NavLink to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-wide block leading-tight">
                  CampusFind
                </span>
                <span className="text-[10px] text-blue-400 font-medium block">
                  College Lost & Found
                </span>
              </div>
            </NavLink>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? item.admin
                          ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        item.badge === 'Lost'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          {user && (
            <div className="flex items-center gap-3 mb-3 px-1">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-700"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.department} • {user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-600/20 rounded-lg border border-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
