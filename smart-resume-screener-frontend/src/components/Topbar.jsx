import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Calendar, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  // Helper to map pathname to page title
  const getPageTitle = (path) => {
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/jobs')) return 'Jobs Management';
    if (path.startsWith('/candidates')) return 'Candidates Directory';
    if (path.startsWith('/screening')) return 'AI Resume Screening';
    if (path.startsWith('/analytics')) return 'Recruitment Analytics';
    if (path.startsWith('/settings')) return 'System Settings';
    return 'Smart Resume Screener';
  };

  const getBreadcrumbs = (path) => {
    const parts = path.split('/').filter(Boolean);
    return ['Console', ...parts.map(p => p.charAt(0).toUpperCase() + p.slice(1))];
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Formatted date: "Sunday, August 23, 2026"
  const formattedDate = new Date('2026-08-23T21:25:40+05:30').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-8 shadow-sm">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb}>
              {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-300" />}
              <span>{crumb === '' ? 'Dashboard' : crumb}</span>
            </React.Fragment>
          ))}
        </div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
          {getPageTitle(location.pathname)}
        </h2>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates or jobs..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Date Display */}
        <div className="flex items-center gap-2 text-slate-500 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <span className="font-medium">{formattedDate}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors relative border border-slate-200 focus:outline-none"
          >
            <Bell className="h-4 w-4" />
            {hasUnread && <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in-up">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Activity</span>
                <button onClick={() => setHasUnread(false)} className="text-[10px] font-bold text-blue-600 hover:underline focus:outline-none">Mark all read</button>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-xs text-slate-700 font-medium"><strong className="text-blue-600">David Wilson</strong> just applied for <strong className="text-slate-800">Senior Frontend Engineer</strong>.</p>
                  <p className="text-[10px] text-slate-400 mt-1">2 minutes ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-xs text-slate-700 font-medium"><strong className="text-emerald-600">Alex Johnson</strong> was automatically shortlised for <strong className="text-slate-800">Backend Java Developer</strong>!</p>
                  <p className="text-[10px] text-slate-400 mt-1">15 minutes ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer opacity-70">
                  <p className="text-xs text-slate-700 font-medium"><strong className="text-blue-600">Sarah Smith</strong> just applied for <strong className="text-slate-800">Backend Java Developer</strong>.</p>
                  <p className="text-[10px] text-slate-400 mt-1">1 hour ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer opacity-70">
                  <p className="text-xs text-slate-700 font-medium">New Job <strong className="text-slate-800">Senior Frontend Engineer</strong> created successfully.</p>
                  <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
            className="flex items-center gap-2.5 focus:outline-none group"
          >
            <div className="text-right hidden lg:block">
              <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">Admin</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-100 group-hover:ring-blue-100 transition-all">
              A
            </div>
          </button>

          {isAdminMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in-up">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-800">System Administrator</p>
                <p className="text-[10px] text-slate-500 truncate">admin@screener.ai</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => {
                    setIsAdminMenuOpen(false);
                    navigate('/admin/change-password');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  Change Password
                </button>
                <div className="h-px bg-slate-100 my-1"></div>
                <button 
                  onClick={() => {
                    setIsAdminMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 font-bold hover:bg-rose-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
