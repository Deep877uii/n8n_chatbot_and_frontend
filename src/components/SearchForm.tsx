import { useState, useCallback, useEffect, useRef } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import type { ScraperRequest } from '../types/lead';

interface SearchFormProps {
 onSubmit: (params: ScraperRequest) => void;
 isLoading: boolean;
}

export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
 const [searchQuery, setSearchQuery] = useState('');
 const [location, setLocation] = useState('');
 const [datePosted, setDatePosted] = useState<string>('past-week');
 const [maxPosts, setMaxPosts] = useState<number>(10);
 const [showFilters, setShowFilters] = useState(false);
 const inputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
 inputRef.current?.focus();
 }, []);

 const handleSubmit = useCallback(
 (e: React.FormEvent) => {
 e.preventDefault();
 if (!searchQuery.trim()) return;
 onSubmit({
 searchQuery: searchQuery.trim(),
 location: location.trim() || undefined,
 datePosted: datePosted || undefined,
 maxPosts,
 });
 },
 [searchQuery, location, datePosted, maxPosts, onSubmit]
 );

 return (
 <form onSubmit={handleSubmit} className="glass-card p-2 rounded-[24px]">
 {/* Main search row */}
 <div className="flex items-center gap-3 p-3">
 <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0" />
 <input
 ref={inputRef}
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Find hiring leads..."
 className="flex-1 outline-none text-base placeholder:text-slate-500 bg-transparent text-slate-900 dark:text-white"
 required
 />
 <button
 type="submit"
 disabled={!searchQuery.trim() || isLoading}
 className="bg-brand-500 hover:bg-brand-400 text-white rounded-xl px-5 py-3 text-sm font-bold whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-brand-500/25 transition hover:scale-105 active:scale-95"
 >
 {isLoading ? (
 <span className="flex items-center gap-2">
 <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
 Searching…
 </span>
 ) : (
 'Start AI Search'
 )}
 </button>
 </div>

 {/* Filter pills */}
 <div className="border-t border-slate-200 dark:border-slate-800/60 flex flex-wrap gap-2 p-3">
 <button
 type="button"
 onClick={() => setShowFilters(!showFilters)}
 className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2 text-xs flex gap-2 items-center font-bold transition-colors"
 >
 Location <ChevronDown className="w-3.5 h-3.5" />
 </button>
 <button
 type="button"
 onClick={() => setShowFilters(!showFilters)}
 className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2 text-xs flex gap-2 items-center font-bold transition-colors"
 >
 Date Posted <ChevronDown className="w-3.5 h-3.5" />
 </button>
 <button
 type="button"
 onClick={() => setShowFilters(!showFilters)}
 className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2 text-xs flex gap-2 items-center font-bold transition-colors"
 >
 Max Posts <ChevronDown className="w-3.5 h-3.5" />
 </button>
 <button
 type="button"
 onClick={() => setShowFilters(!showFilters)}
 className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2 text-xs flex gap-2 items-center font-bold transition-colors"
 >
 LinkedIn <ChevronDown className="w-3.5 h-3.5" />
 </button>
 </div>

 {/* Expanded filters */}
 {showFilters && (
 <div className="border-t border-slate-200 dark:border-slate-800/60 p-4 space-y-4 ">
 <div className="grid sm:grid-cols-3 gap-5">
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
 Location
 </label>
 <input
 type="text"
 value={location}
 onChange={(e) => setLocation(e.target.value)}
 placeholder="e.g. San Francisco, Remote"
 className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition placeholder:text-slate-400 dark:placeholder:text-slate-600"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
 Date Posted
 </label>
 <select
 value={datePosted}
 onChange={(e) => setDatePosted(e.target.value)}
 className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition appearance-none cursor-pointer"
 >
 <option value="past-24h">Past 24 hours</option>
 <option value="past-week">Past week</option>
 <option value="past-month">Past month</option>
 <option value="any-time">Any time</option>
 </select>
 </div>
 <div>
 <div className="flex items-center justify-between mb-2">
 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
 Max Posts
 </label>
 <span className="text-xs font-bold font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 px-2 py-0.5 rounded-md">
 {maxPosts}
 </span>
 </div>
 <input
 type="range"
 min={5}
 max={50}
 value={maxPosts}
 onChange={(e) => setMaxPosts(Number(e.target.value))}
 className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-500"
 />
 <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-2">
 <span>5</span>
 <span>50</span>
 </div>
 </div>
 </div>
 </div>
 )}
 </form>
 );
}
