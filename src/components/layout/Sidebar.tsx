import { NavLink, useLocation } from 'react-router-dom';
import {
 LayoutDashboard,
 Search,
 ContactRound,
 Send,
 Settings2,
 X,
 Sparkles,
 AlertCircle,
 MailCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
 { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
 { to: '/find-leads', icon: Search, label: 'Search Leads' },
 { to: '/leads', icon: ContactRound, label: 'Leads' },
 { to: '/outreach', icon: Send, label: 'Email Campaigns' },
 { to: '/sent-leads', icon: MailCheck, label: 'Sent Campaigns' },
 { to: '/settings', icon: Settings2, label: 'Settings' },
];

interface SidebarProps {
 open: boolean;
 collapsed?: boolean;
 onClose: () => void;
}

export default function Sidebar({ open, collapsed, onClose }: SidebarProps) {
 const { connected, leads } = useApp();
 const location = useLocation();

 return (
 <>
 {/* Mobile Backdrop */}
 {open && (
 <div
 className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/80 z-40 lg:hidden "
 onClick={onClose}
 aria-hidden="true"
 />
 )}

 <aside
 className={`
 fixed top-[80px] left-0 z-40 h-[calc(100vh-80px)] w-[280px]
 bg-transparent
 flex flex-col
 transition duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)]
 ${collapsed ? 'lg:-translate-x-full' : 'lg:translate-x-0'}
 ${open ? 'translate-x-0' : '-translate-x-full'}
 `}
 style={{ padding: '0 0 24px 0' }}
 role="navigation"
 aria-label="Main navigation"
 >
 {/* Mobile close */}
 <div className="lg:hidden px-4 pt-4 mb-4 flex justify-end">
 <button
 onClick={onClose}
 className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
 aria-label="Close navigation"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Navigation */}
 <nav className="space-y-1.5 flex-1 px-4 mt-2">
 {navItems.map(({ to, icon: Icon, label }) => {
 const isActive =
 to === '/'
 ? location.pathname === '/'
 : location.pathname.startsWith(to);

 return (
 <NavLink
 key={to}
 to={to}
 onClick={onClose}
 className={`
 flex items-center gap-4 rounded-xl px-4 py-3
 text-sm transition duration-150 group relative overflow-hidden
 ${
 isActive
 ? 'text-slate-900 dark:text-white font-semibold'
 : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
 }
 `}
 aria-current={isActive ? 'page' : undefined}
 >
 {/* Active Background highlight */}
 {isActive && (
 <div className="absolute inset-0 bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-500/20 dark:to-indigo-500/10 border border-brand-200 dark:border-brand-500/20 rounded-xl" />
 )}
 
 {/* Hover Background */}
 {!isActive && (
 <div className="absolute inset-0 bg-slate-100/0 hover:bg-slate-100 dark:bg-slate-800/0 dark:group-hover:bg-slate-800/40 rounded-xl transition-colors" />
 )}

 {/* Active Indicator Bar */}
 {isActive && (
 <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.3)] dark:shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
 )}

 <Icon className={`w-5 h-5 flex-shrink-0 relative z-10 transition-colors ${isActive ? 'text-brand-500 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
 <span className="sidebar-copy relative z-10">{label}</span>

 {/* Lead count badge */}
 {to === '/leads' && leads.length > 0 && (
 <span className="ml-auto text-[11px] font-bold text-slate-700 dark:text-slate-100 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded-full sidebar-copy relative z-10 shadow-inner">
 {leads.length}
 </span>
 )}
 </NavLink>
 );
 })}
 </nav>

 {/* AI Credits / Connection Status */}
 <div className="mt-auto px-4 sidebar-copy">
 <div className="rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-5 relative overflow-hidden">
 {/* Glow effect in background */}
 <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10 ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
 
 <div className={`flex items-center gap-2 text-sm font-semibold mb-1 relative z-10 ${connected ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
 {connected ? <Sparkles className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
 <span>{connected ? 'n8n Connected' : 'Setup Required'}</span>
 </div>
 
 <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium relative z-10">
 {leads.length} leads in workspace
 </p>
 
 <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative z-10">
 <div
 className={`h-full rounded-full transition duration-150 ${connected ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-400' : 'bg-transparent'}`}
 style={{ width: connected ? '82%' : '0%' }}
 />
 </div>
 </div>
 </div>
 </aside>

 {/* Responsive styles for collapsed sidebar */}
 <style>{`
 @media (max-width: 900px) and (min-width: 641px) {
 aside[role="navigation"] {
 width: 88px !important;
 flex-basis: 88px !important;
 padding: 16px 0 !important;
 }
 .sidebar-copy { display: none !important; }
 aside[role="navigation"] a { 
 justify-content: center; 
 padding: 12px; 
 margin: 0 16px 8px 16px;
 border-radius: 16px;
 width: 56px;
 height: 56px;
 }
 aside[role="navigation"] a > div.absolute.left-0 {
 display: none;
 }
 }
 @media (max-width: 640px) {
 aside[role="navigation"].lg\\:sticky { position: fixed; }
 aside[role="navigation"] {
 background-color: var(--tw-bg-opacity, rgba(255, 255, 255, 0.95));
 backdrop-filter: blur(16px);
 border-right: 1px solid rgba(226, 232, 240, 0.5);
 }
 .dark aside[role="navigation"] {
 background-color: rgba(15, 23, 42, 0.95);
 border-right: 1px solid rgba(51, 65, 85, 0.5);
 }
 }
 `}</style>
 </>
 );
}

