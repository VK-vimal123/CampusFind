import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Plus, LogOut, User, Compass, Shield } from 'lucide-react';
import { getStoredUser, removeStoredUser, saveStoredUser } from '../data/mockItems';

export default function Navbar({ onMenuToggle }) {
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

  const toggleAdminRole = () => {
    if (!user) return;
    const updated = { ...user, isAdmin: !user.isAdmin };
    saveStoredUser(updated);
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle + Logo title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">CampusFind</span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/report-lost"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Report Lost
          </Link>
          <Link
            to="/report-found"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Report Found
          </Link>

          {/* Admin Toggle */}
          <button
            onClick={toggleAdminRole}
            className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer ${
              user?.isAdmin
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle Admin Mode for demo"
          >
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            <span>{user?.isAdmin ? 'Admin View: ON' : 'Switch to Admin'}</span>
          </button>

          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <Link to="/profile" className="flex items-center gap-2 group">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300 group-hover:border-blue-600"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-blue-600">{user.name}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{user.department}</p>
                </div>
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
