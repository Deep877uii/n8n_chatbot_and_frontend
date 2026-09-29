import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import ToastContainer from '../Toast';


export default function Layout() {
 const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop

 const toggleSidebar = () => {
 if (window.innerWidth < 1024) {
 setSidebarOpen(!sidebarOpen);
 } else {
 setSidebarCollapsed(!sidebarCollapsed);
 }
 };

 return (
 <div className="flex w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-brand-500/30">
 {/* Abstract Background Elements for fancy UI */}
 <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/10 dark:bg-brand-600/10 opacity-20" />
 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 opacity-20" />
 </div>

 <Sidebar 
 open={sidebarOpen} 
 collapsed={sidebarCollapsed}
 onClose={() => setSidebarOpen(false)} 
 />

 {/* Spacer to push content right of the fixed sidebar on desktop */}
 <div className={`hidden lg:block shrink-0 transition-all duration-150 ${sidebarCollapsed ? 'w-0' : 'w-[280px]'}`} />

 <div className="flex-1 min-w-0 flex flex-col transition-all duration-150 h-screen z-10 relative">
 <TopNav onMenuClick={toggleSidebar} />

 <main className="flex-1 p-4 pt-2 sm:pr-6 sm:pb-6 sm:pl-0 sm:pt-2 w-full transition-all duration-150 flex flex-col min-h-0">
 <div className="flex-1 glass-panel rounded-2xl sm:rounded-[32px] overflow-hidden flex flex-col relative min-h-0">
 <div className="flex-1 overflow-y-auto p-6 md:p-8">
 <Outlet />
 </div>
 </div>
 </main>
 </div>

 <ToastContainer />
 </div>
 );
}

