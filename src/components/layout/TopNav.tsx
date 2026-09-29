import { Menu, Bell, Search, User, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopNavProps {
 onMenuClick: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
 const { theme, toggleTheme } = useApp();

 return (
 <header className="sticky top-0 z-20 h-20 flex items-center justify-between px-4 sm:px-8 w-full bg-transparent transition duration-150">
 {/* Left: Search / Menu / Logo */}
 <div className="flex items-center gap-5 w-72 shrink-0">
 <button
 onClick={onMenuClick}
 className="p-2.5 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition border border-transparent hover:border-slate-300 dark:hover:border-slate-700/50 shadow-sm"
 aria-label="Toggle navigation menu"
 >
 <Menu className="w-5 h-5" />
 </button>

 {/* Brand */}
 <div className="flex items-center gap-3 cursor-pointer select-none group">
 <div className="w-9 h-9 rounded-xl flex-shrink-0 bg-gradient-to-br from-brand-500 to-indigo-600 text-white grid place-items-center font-bold text-sm shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
 L
 </div>
 <span className="text-xl font-heading font-semibold tracking-tight text-slate-900 dark:text-white hidden sm:block">
 LeadForge
 </span>
 </div>
 </div>

 {/* Center: Search Bar */}
 <div className="flex-1 max-w-[600px] px-2 hidden md:block">
 <div className="flex items-center bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-full px-4 py-2 transition focus-within:bg-white/80 dark:focus-within:bg-slate-800/80 focus-within:border-brand-500/50 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.15)] group">
 <Search className="w-4 h-4 text-slate-400 group-focus-within:text-brand-500 dark:group-focus-within:text-brand-400 transition-colors mr-2" />
 <input
 type="text"
 placeholder="Search leads, campaigns, or settings..."
 className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium"
 />
 <div className="hidden lg:flex items-center gap-1">
 <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">⌘K</kbd>
 </div>
 </div>
 </div>

 {/* Right: Actions */}
 <div className="flex items-center gap-4 ml-auto">
 {/* Theme Toggle */}
 <button
 onClick={toggleTheme}
 className="relative h-10 w-10 rounded-full grid place-items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition border border-transparent hover:border-slate-300 dark:hover:border-slate-700/50"
 aria-label="Toggle theme"
 >
 {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
 </button>

 {/* Notifications */}
 <button
 className="relative h-10 w-10 rounded-full grid place-items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition border border-transparent hover:border-slate-300 dark:hover:border-slate-700/50"
 aria-label="Notifications"
 >
 <Bell className="w-5 h-5" />
 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
 </button>

 {/* Profile */}
 <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
 <div className="hidden sm:block text-right mr-1">
 <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Admin User</p>
 </div>
 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 grid place-items-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300">
 <User className="w-4 h-4" />
 </div>
 </button>
 </div>
 </header>
 );
}

