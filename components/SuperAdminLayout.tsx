import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building, CreditCard, Settings, LogOut, Menu, ShieldCheck } from 'lucide-react';
import { useAuth, useAppSettings } from '../App';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/superadmin/dashboard' },
  { name: 'Businesses', icon: Building, path: '/superadmin/businesses' },
  { name: 'Plans', icon: CreditCard, path: '/superadmin/plans' },
  { name: 'Settings', icon: Settings, path: '/superadmin/settings' },
];

const Sidebar: React.FC = () => {
  const { settings } = useAppSettings();
  return (
    <aside className="flex flex-col bg-slate-800 text-white h-full transition-all duration-300 w-64">
      <div className="flex items-center h-16 border-b border-slate-700 px-4">
         <ShieldCheck size={28} className="text-primary-light" />
         <span className="ml-2 text-xl font-bold">Super Admin</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`
            }
          >
            <item.icon size={20} />
            <span className="ml-4 font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const Header: React.FC<{ onToggleMobileSidebar: () => void }> = ({ onToggleMobileSidebar }) => {
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
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Welcome, Super Admin</span>
                <div className="relative" ref={popoverRef}>
                     <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                    </button>
                    {isPopoverOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1" role="menu" aria-orientation="vertical">
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

const SuperAdminLayout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {isMobileOpen && (
          <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
          ></div>
      )}

      <div className={`
        fixed inset-y-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
