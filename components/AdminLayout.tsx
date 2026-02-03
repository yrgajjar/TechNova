import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Settings, LogOut, Layers, Home as HomeIcon, Sparkles, Briefcase, Menu as MenuIcon, BookOpen, UserCircle } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || !user.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Define All Menu Items
  const allNavItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['admin'] },
    { name: 'My Applications', path: '/admin/employee', icon: Briefcase, roles: ['employee'] }, // Employee Dashboard
    { name: 'Page Builder', path: '/admin/pages', icon: FileText, roles: ['admin'] },
    { name: 'Menu & Footer', path: '/admin/navigation', icon: MenuIcon, roles: ['admin'] },
    { name: 'Blog', path: '/admin/blog', icon: BookOpen, roles: ['admin'] },
    { name: 'AI Apps', path: '/admin/apps', icon: Sparkles, roles: ['admin'] },
    { name: 'Career Portal', path: '/admin/careers', icon: Briefcase, roles: ['admin'] },
    { name: 'Services', path: '/admin/services', icon: Layers, roles: ['admin'] },
    { name: 'Settings', path: '/admin/settings', icon: Settings, roles: ['admin'] },
  ];

  // Filter based on role
  const allowedItems = allNavItems.filter(item => item.roles.includes(user.role));

  // Redirect Employee trying to access Admin dashboard
  if (user.role === 'employee' && location.pathname === '/admin') {
      return <Navigate to="/admin/employee" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white shadow-xl hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">TechNova</h1>
          <div className="flex items-center mt-2 text-xs text-slate-400">
             <UserCircle className="h-3 w-3 mr-1" />
             <span className="uppercase font-bold tracking-wider">{user.role}</span>
             <span className="mx-1">•</span>
             <span>{user.username}</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {allowedItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-white mb-2">
            <HomeIcon className="h-4 w-4" />
            <span className="text-sm">View Website</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 md:hidden">
          <span className="font-bold text-gray-800">Admin Panel</span>
          <button onClick={logout} className="text-red-600 font-medium text-sm">Logout</button>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};