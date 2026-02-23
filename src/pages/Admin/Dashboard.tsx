import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, CalendarCheck, UtensilsCrossed, Settings, LogOut, Menu, X, FileText, Palette } from 'lucide-react';
import Reservations from './Reservations';
import MenuManager from './MenuManager';
import AdminSettings from './Settings';
import BlogManager from './BlogManager';
import DesignSettings from './DesignSettings';
import { api } from '../../lib/api';

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'menu' | 'blog' | 'design' | 'settings'>('overview');
  const [stats, setStats] = useState({ totalReservations: 0, pendingReservations: 0, newMessages: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoggingOut = useRef(false);

  useEffect(() => {
    if (!isLoading && !user && !isLoggingOut.current) {
      navigate('/admin/login');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    isLoggingOut.current = true;
    await logout();
    navigate('/');
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      api.getStats()
        .then(data => setStats(data))
        .catch(err => console.error(err));
    }
  }, [activeTab, navigate]);

  if (isLoading || !user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'reservations': return <Reservations />;
      case 'menu': return <MenuManager />;
      case 'blog': return <BlogManager />;
      case 'design': return <DesignSettings />;
      case 'settings': return <AdminSettings />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
              <h3 className="text-neutral-400 text-sm uppercase tracking-wider mb-2">Total Reservations</h3>
              <p className="text-4xl font-bold text-white">{stats.totalReservations}</p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
              <h3 className="text-neutral-400 text-sm uppercase tracking-wider mb-2">Pending Actions</h3>
              <p className="text-4xl font-bold text-amber-500">{stats.pendingReservations}</p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
              <h3 className="text-neutral-400 text-sm uppercase tracking-wider mb-2">New Messages</h3>
              <p className="text-4xl font-bold text-white">{stats.newMessages}</p>
            </div>
          </div>
        );
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm transition-all duration-200 group ${
        activeTab === tab 
          ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' 
          : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
      }`}
    >
      <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${activeTab === tab ? 'text-white' : 'text-neutral-500 group-hover:text-amber-500'}`} />
      <span className="font-medium tracking-wide text-sm uppercase">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row text-neutral-200 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-neutral-900 border-b border-neutral-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-serif font-bold text-white tracking-wider">TASHA ADMIN</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white hover:text-amber-500 transition-colors">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col
        transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-8 border-b border-neutral-800 hidden md:block">
          <h1 className="text-2xl font-serif font-bold text-white tracking-widest">TASHA</h1>
          <p className="text-xs text-amber-500 uppercase tracking-wider mt-2">Admin Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavButton tab="overview" icon={LayoutDashboard} label="Overview" />
          <NavButton tab="reservations" icon={CalendarCheck} label="Reservations" />
          <NavButton tab="menu" icon={UtensilsCrossed} label="Menu Manager" />
          <NavButton tab="blog" icon={FileText} label="Blog & Events" />
          <NavButton tab="design" icon={Palette} label="Design & Content" />
          <NavButton tab="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-neutral-800 bg-neutral-900">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-xs text-neutral-500 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-sm transition-colors text-sm uppercase tracking-wider font-semibold"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-65px)] md:h-screen bg-neutral-950">
        <header className="mb-10 hidden md:flex justify-between items-end border-b border-neutral-800 pb-6">
          <div>
            <h2 className="text-4xl font-serif font-bold text-white capitalize tracking-tight">
              {activeTab === 'blog' ? 'Blog & Events' : activeTab === 'design' ? 'Design & Content' : activeTab}
            </h2>
            <p className="text-neutral-400 mt-2">Manage your restaurant's {activeTab} settings.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </header>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
