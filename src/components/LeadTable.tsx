import { Eye, Mail, Trash2 } from 'lucide-react';
import type { Lead } from '../types/lead';
import { useApp } from '../context/AppContext';

function displayValue(val: string | null | undefined): string {
 return val?.trim() || '—';
}

function formatDate(dateStr: string | null | undefined): string {
 if (!dateStr) return '—';
 try {
 const date = new Date(dateStr);
 if (isNaN(date.getTime())) return dateStr;
 return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
 } catch {
 return dateStr;
 }
}

function getStatusBadge(isSent: boolean, hasDraft: boolean, isGenerating: boolean) {
 if (isSent) return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">Sent</span>;
 if (isGenerating) return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">Generating</span>;
 if (hasDraft) return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20">Draft Ready</span>;
 return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50">New</span>;
}

interface LeadTableProps {
 leads: Lead[];
 onView: (lead: Lead) => void;
 onGenerateMail: (lead: Lead) => void;
}

export default function LeadTable({
 leads,
 onView,
 onGenerateMail,
}: LeadTableProps) {
 const {
 selectedLeadIds,
 toggleSelectLead,
 selectAllLeads,
 clearSelection,
 generatedEmails,
 sentLeadIds,
 activeWorkspaceLeadId,
 setActiveWorkspaceLeadId,
 deleteSelectedLeads,
 } = useApp();

 const allSelected =
 leads.length > 0 &&
 leads.every((l) =>
 selectedLeadIds.includes(l.leadId || l.postUrl || l.name)
 );

 const someSelected =
 !allSelected &&
 leads.some((l) =>
 selectedLeadIds.includes(l.leadId || l.postUrl || l.name)
 );

 const handleHeaderCheckbox = () => {
 if (allSelected) {
 clearSelection();
 } else {
 selectAllLeads(leads.map((l) => l.leadId || l.postUrl || l.name));
 }
 };

 return (
 <div className="glass-card rounded-[24px] overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-sm min-w-[900px]">
 <thead className="bg-slate-50 dark:bg-slate-900/40 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/60 uppercase tracking-wider">
 <tr>
 <th className="p-4 w-11 pl-6">
 <input
 type="checkbox"
 checked={allSelected}
 ref={(input) => {
 if (input) input.indeterminate = someSelected;
 }}
 onChange={handleHeaderCheckbox}
 className="w-4 h-4 cursor-pointer accent-brand-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded"
 aria-label="Select all leads"
 />
 </th>
 <th className="p-4 pl-0 font-semibold">Name</th>
 <th className="p-4 font-semibold">Company</th>
 <th className="p-4 font-semibold hidden lg:table-cell">Job role</th>
 <th className="p-4 font-semibold hidden sm:table-cell">Email</th>
 <th className="p-4 font-semibold">Status</th>
 <th className="p-4 font-semibold hidden xl:table-cell">Posted</th>
 <th className="p-4 pr-6 font-semibold text-right">Actions</th>
 </tr>
 </thead>
 <tbody>
 {leads.map((lead) => {
 const leadKey = lead.leadId || lead.postUrl || lead.name;
 const isSelected = selectedLeadIds.includes(leadKey);
 const isActive = activeWorkspaceLeadId === leadKey;
 const draft = generatedEmails[leadKey];
 const isSent = sentLeadIds.includes(leadKey) || draft?.status === 'sent';
 const hasDraft = !!(draft?.subject || draft?.body);
 const isGenerating = draft?.status === 'generating';

 return (
 <tr
 key={leadKey}
 onClick={() => setActiveWorkspaceLeadId(leadKey)}
 className={`group table-row border-b border-slate-200 dark:border-slate-800/40 transition-colors cursor-pointer ${
 isActive
 ? 'bg-brand-50 dark:bg-brand-500/5 shadow-[inset_3px_0_0_#3b82f6]'
 : isSelected
 ? 'bg-brand-50 dark:bg-brand-500/5'
 : 'hover:bg-slate-50 dark:hover:bg-slate-800/30 hover:shadow-sm'
 }`}
 >
 {/* Checkbox */}
 <td
 className="p-4 pl-6"
 onClick={(e) => {
 e.stopPropagation();
 toggleSelectLead(leadKey);
 }}
 >
 <input
 type="checkbox"
 checked={isSelected}
 onChange={() => {}}
 className="w-4 h-4 cursor-pointer accent-brand-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded opacity-60 group-hover:opacity-100 transition-opacity"
 aria-label={`Select ${lead.name}`}
 />
 </td>

 {/* Name */}
 <td className="p-4 pl-0 font-bold text-slate-900 dark:text-white">
 {displayValue(lead.name)}
 </td>

 {/* Company */}
 <td className="p-4 text-slate-600 dark:text-slate-400">
 {displayValue(lead.company)}
 </td>

 {/* Role */}
 <td className="p-4 text-slate-600 dark:text-slate-400 hidden lg:table-cell">
 {displayValue(lead.jobTitle || lead.role)}
 </td>

 {/* Email */}
 <td className="p-4 hidden sm:table-cell">
 {lead.email ? (
 <span className="text-slate-600 dark:text-slate-400 font-mono text-xs px-2 py-1 rounded bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
 {lead.email}
 </span>
 ) : (
 <span className="text-slate-400 dark:text-slate-600">—</span>
 )}
 </td>

 {/* Status */}
 <td className="p-4">
 {getStatusBadge(isSent, hasDraft, isGenerating)}
 </td>

 {/* Posted */}
 <td className="p-4 text-slate-500 hidden xl:table-cell text-xs">
 {formatDate(lead.postedAt)}
 </td>

 {/* Actions */}
 <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
 <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
 <button
 type="button"
 onClick={() => onView(lead)}
 className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 transition active:scale-95"
 aria-label={`View ${lead.name}`}
 title="View"
 >
 <Eye className="w-[18px] h-[18px]" />
 </button>

 <button
 type="button"
 onClick={() => onGenerateMail(lead)}
 disabled={isGenerating}
 className={`p-2 rounded-xl transition active:scale-95 ${
 hasDraft
 ? 'text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10'
 : 'text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
 }`}
 aria-label={`Generate email for ${lead.name}`}
 title={hasDraft ? 'Mail' : 'Generate'}
 >
 {isGenerating ? (
 <div className="w-[18px] h-[18px] border-2 border-current/40 border-t-current rounded-full animate-spin" />
 ) : (
 <Mail className="w-[18px] h-[18px]" />
 )}
 </button>

 <button
 type="button"
 onClick={() => {
 if (confirm('Are you sure you want to delete this lead?')) {
 deleteSelectedLeads([leadKey]);
 }
 }}
 className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition active:scale-95"
 aria-label={`Delete ${lead.name}`}
 title="Delete"
 >
 <Trash2 className="w-[18px] h-[18px]" />
 </button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 );
}
