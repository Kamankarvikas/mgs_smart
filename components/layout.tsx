import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, FileText, Inbox, UsersRound, Settings, LogOut, Menu, Building2 } from 'lucide-react';
import { useAuth, useAppSettings } from '../App';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { name: 'Leads', icon: UserPlus, path: '/app/leads' },
  { name: 'Clients', icon: Users, path: '/app/clients' },
  { name: 'Letters', icon: FileText, path: '/app/letters' },
  { name: 'Inbox', icon: Inbox, path: '/app/inbox' },
  { name: 'Team', icon: UsersRound, path: '/app/team' },
  { name: 'Settings', icon: Settings, path: '/app/settings' },
];

const Sidebar: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const { settings } = useAppSettings();
  return (
    <aside className={`flex flex-col bg-surface border-r border-slate-200/80 h-full transition-all duration-300 w-64 ${isCollapsed ? 'md:w-20' : ''}`}>
      <div className={`flex items-center h-16 border-b border-slate-200/80 px-4 ${isCollapsed ? 'md:justify-center' : 'justify-between'}`}>
         <span className={`text-xl font-bold text-primary ${isCollapsed ? 'md:hidden' : ''}`}>{settings.companyName}</span>
         <Building2 size={28} className="text-primary" />
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''} ${
                isActive
                  ? 'bg-primary-bg-active text-primary'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <item.icon size={20} />
            <span className={`ml-4 font-medium ${isCollapsed ? 'md:hidden' : ''}`}>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const Header: React.FC<{ onToggleDesktopSidebar: () => void; onToggleMobileSidebar: () => void }> = ({ onToggleDesktopSidebar, onToggleMobileSidebar }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsPopoverOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="flex items-center justify-between h-16 bg-surface border-b border-slate-200/80 px-6 flex-shrink-0">
            <div>
                {/* Mobile Menu Button */}
                <button onClick={onToggleMobileSidebar} className="p-2 rounded-full hover:bg-slate-100 md:hidden">
                    <Menu size={24} className="text-slate-600" />
                </button>
                {/* Desktop Menu Button */}
                <button onClick={onToggleDesktopSidebar} className="p-2 rounded-full hover:bg-slate-100 hidden md:block">
                    <Menu size={24} className="text-slate-600" />
                </button>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Welcome, Admin</span>
                <div className="relative" ref={popoverRef}>
                    <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full">
                        <img src={`https://i.pravatar.cc/150?u=admin`} alt="Admin" className="w-10 h-10 rounded-full" />
                    </button>
                    {isPopoverOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                <NavLink 
                                    to="/app/company" 
                                    onClick={() => setIsPopoverOpen(false)} 
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" 
                                    role="menuitem"
                                >
                                    <Building2 size={14} className="mr-2" /> Company Profile
                                </NavLink>
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" 
                                    role="menuitem"
                                >
                                    <LogOut size={14} className="mr-2" /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const DashboardLayout: React.FC = () => {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Overlay for mobile sidebar */}
      {isMobileOpen && (
          <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
          ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar isCollapsed={isDesktopCollapsed} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onToggleDesktopSidebar={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
