import { Sparkles, Send, X, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Lead } from '../types/lead';

interface BulkActionBarProps {
 selectedLeads: Lead[];
 onGenerateAll: () => void;
 onSendAll: () => void;
 onClear: () => void;
}

export default function BulkActionBar({
 selectedLeads,
 onGenerateAll,
 onSendAll,
 onClear,
}: BulkActionBarProps) {
 const { generatedEmails, sentLeadIds, bulkProgress, deleteSelectedLeads } = useApp();

 const count = selectedLeads.length;
 if (count === 0 && !bulkProgress?.active) return null;

 const readyToSendCount = selectedLeads.filter((lead) => {
 const leadKey = lead.leadId || lead.postUrl || lead.name;
 const draft = generatedEmails[leadKey];
 return draft && draft.subject && draft.body && !sentLeadIds.includes(leadKey);
 }).length;

 return (
 <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92%] sm:w-auto">
 <div className="glass-card bg-white/90 dark:bg-slate-900/90 border border-brand-200 dark:border-brand-500/20 rounded-xl p-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 shadow-[0_0_30px_rgba(20,241,149,0.1)]">
 {/* Selection Count */}
 <div className="flex items-center gap-3 px-1">
 <div className="w-6 h-6 rounded-lg bg-brand-500 text-white dark:text-slate-950 font-bold flex items-center justify-center text-xs">
 {count}
 </div>
 <span className="text-sm font-bold text-brand-600 dark:text-brand-400 whitespace-nowrap">
 {count} lead{count !== 1 ? 's' : ''} selected
 </span>
 </div>

 {/* Progress */}
 {bulkProgress?.active && (
 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-xs border border-slate-200 dark:border-white/5">
 <div className="w-3.5 h-3.5 border-2 border-brand-500 dark:border-brand-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
 <span className="text-slate-700 dark:text-slate-300 font-medium">
 {bulkProgress.type === 'generate' ? 'Generating' : 'Sending'} {bulkProgress.current}/{bulkProgress.total}
 </span>
 {bulkProgress.completed > 0 && (
 <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
 <CheckCircle2 className="w-3.5 h-3.5" /> {bulkProgress.completed}
 </span>
 )}
 {bulkProgress.failed > 0 && (
 <span className="text-red-500 dark:text-red-400 flex items-center gap-1 font-bold">
 <AlertCircle className="w-3.5 h-3.5" /> {bulkProgress.failed}
 </span>
 )}
 </div>
 )}

 {/* Actions */}
 <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
 <button
 type="button"
 onClick={onGenerateAll}
 disabled={bulkProgress?.inProgress}
 className="flex-1 sm:flex-none bg-brand-500 text-white dark:text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,241,149,0.3)] transition duration-150 rounded-xl font-bold px-3.5 py-2 flex items-center justify-center gap-1.5 text-xs disabled:opacity-50"
 >
 <Sparkles className="w-3.5 h-3.5" />
 Generate All
 </button>

 <button
 type="button"
 onClick={onSendAll}
 disabled={readyToSendCount === 0 || bulkProgress?.inProgress}
 title={
 readyToSendCount === 0
 ? 'Generate emails first'
 : `Send ${readyToSendCount} email(s)`
 }
 className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-300 hover:border-slate-400 dark:border-slate-700/50 dark:hover:border-slate-600 transition duration-150 rounded-xl px-3.5 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
 >
 <Send className="w-3.5 h-3.5" />
 Send All {readyToSendCount > 0 ? `(${readyToSendCount})` : ''}
 </button>

 <button
 type="button"
 onClick={() => {
 if (confirm('Are you sure you want to delete the selected leads? This action cannot be undone.')) {
 deleteSelectedLeads();
 }
 }}
 disabled={bulkProgress?.inProgress}
 className="flex-1 sm:flex-none p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300 transition-colors disabled:opacity-50"
 aria-label="Delete selected leads"
 title="Delete selected leads"
 >
 <Trash2 className="w-4 h-4" />
 </button>

 <button
 type="button"
 onClick={onClear}
 className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
 aria-label="Clear selection"
 >
 <X className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 );
}
