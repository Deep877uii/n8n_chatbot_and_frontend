import { useState, useMemo } from 'react';
import {
 Search,
 Filter,
 X,
 Building2,
 MapPin,
 Sparkles,
 RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Lead, FilterOptions } from '../types/lead';

interface FilterBarProps {
 leads: Lead[];
 onResetLeadsPrompt: () => void;
}

export default function FilterBar({ leads, onResetLeadsPrompt }: FilterBarProps) {
 const { filterOptions, setFilterOptions, resetFilters } = useApp();
 const [showFilters, setShowFilters] = useState(false);

 const companies = useMemo(() => {
 const set = new Set<string>();
 leads.forEach((l) => {
 if (l.company && l.company.trim() && l.company !== 'Not available') {
 set.add(l.company.trim());
 }
 });
 return Array.from(set).sort();
 }, [leads]);

 const locations = useMemo(() => {
 const set = new Set<string>();
 leads.forEach((l) => {
 if (l.location && l.location.trim() && l.location !== 'Not available') {
 set.add(l.location.trim());
 }
 });
 return Array.from(set).sort();
 }, [leads]);

 const sources = useMemo(() => {
 const set = new Set<string>();
 leads.forEach((l) => {
 if (l.source && l.source.trim() && l.source !== 'Not available') {
 set.add(l.source.trim());
 }
 });
 return Array.from(set).sort();
 }, [leads]);

 const activeFilterCount =
 (filterOptions.query ? 1 : 0) +
 (filterOptions.company ? 1 : 0) +
 (filterOptions.location ? 1 : 0) +
 (filterOptions.source ? 1 : 0) +
 (filterOptions.status !== 'all' ? 1 : 0) +
 (filterOptions.hideDuplicates ? 1 : 0);



 return (
 <div className="space-y-3">
 {/* Main Search & Filter Bar */}
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
 {/* Search Input */}
 <div className="relative flex-1">
 <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
 <input
 type="text"
 value={filterOptions.query}
 onChange={(e) =>
 setFilterOptions((prev) => ({ ...prev, query: e.target.value }))
 }
 placeholder="Search leads by name, role, company, or keyword..."
 className="w-full pl-9 pr-8 py-2.5 text-sm bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl outline-none transition"
 />
 {filterOptions.query && (
 <button
 onClick={() =>
 setFilterOptions((prev) => ({ ...prev, query: '' }))
 }
 className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
 aria-label="Clear search"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>

 {/* Filter + Reset */}
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => setShowFilters((prev) => !prev)}
 className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 border ${
 activeFilterCount > 0 || showFilters
 ? 'bg-brand-500 text-white dark:text-slate-950 border-brand-500 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,241,149,0.3)]'
 : 'bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-white border-slate-300 dark:border-slate-700/50 dark:hover:border-slate-600'
 }`}
 >
 <Filter className="w-4 h-4" />
 <span>Filters</span>
 {activeFilterCount > 0 && (
 <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30 text-[10px] font-bold flex items-center justify-center">
 {activeFilterCount}
 </span>
 )}
 </button>

 <button
 type="button"
 onClick={onResetLeadsPrompt}
 title="Reset leads"
 className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-white border border-slate-300 dark:border-slate-700/50 hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/30 transition duration-150"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 <span className="hidden sm:inline">Reset</span>
 </button>
 </div>
 </div>

 {/* Expanded Filters */}
 {showFilters && (
 <div className="glass-card rounded-xl p-4 space-y-4 ">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <div>
 <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
 <Building2 className="w-3.5 h-3.5" />
 Company
 </label>
 <select
 value={filterOptions.company}
 onChange={(e) =>
 setFilterOptions((prev) => ({ ...prev, company: e.target.value }))
 }
 className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl outline-none transition"
 >
 <option value="">All Companies</option>
 {companies.map((comp) => (
 <option key={comp} value={comp}>{comp}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
 <MapPin className="w-3.5 h-3.5" />
 Location
 </label>
 <select
 value={filterOptions.location}
 onChange={(e) =>
 setFilterOptions((prev) => ({ ...prev, location: e.target.value }))
 }
 className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl outline-none transition"
 >
 <option value="">All Locations</option>
 {locations.map((loc) => (
 <option key={loc} value={loc}>{loc}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
 <Sparkles className="w-3.5 h-3.5" />
 Source
 </label>
 <select
 value={filterOptions.source}
 onChange={(e) =>
 setFilterOptions((prev) => ({ ...prev, source: e.target.value }))
 }
 className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl outline-none transition"
 >
 <option value="">All Sources</option>
 {sources.map((src) => (
 <option key={src} value={src}>{src}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">
 Status
 </label>
 <select
 value={filterOptions.status}
 onChange={(e) =>
 setFilterOptions((prev) => ({
 ...prev,
 status: e.target.value as FilterOptions['status'],
 }))
 }
 className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl outline-none transition"
 >
 <option value="all">All Statuses</option>
 <option value="hasEmail">Has Email</option>
 <option value="noEmail">Missing Email</option>
 <option value="generated">Email Generated</option>
 <option value="sent">Email Sent</option>
 </select>
 </div>

 <div>
 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">
 Duplicates
 </label>
 <label className="flex items-center gap-2 mt-2 cursor-pointer group">
 <input
 type="checkbox"
 checked={filterOptions.hideDuplicates}
 onChange={(e) =>
 setFilterOptions((prev) => ({ ...prev, hideDuplicates: e.target.checked }))
 }
 className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-brand-500 focus:ring-brand-500 bg-white dark:bg-slate-900/50"
 />
 <span className="text-xs font-semibold text-slate-700 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
 Hide duplicate leads
 </span>
 </label>
 </div>
 </div>

 {activeFilterCount > 0 && (
 <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/5">
 <span className="text-xs text-slate-500">
 {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
 </span>
 <button
 type="button"
 onClick={resetFilters}
 className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 hover:underline transition-colors"
 >
 Clear all filters
 </button>
 </div>
 )}
 </div>
 )}


 </div>
 );
}
