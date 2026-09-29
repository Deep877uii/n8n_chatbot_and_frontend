import { useEffect, useState } from 'react';
import { RefreshCw, Mail, Calendar, CheckCircle2, X, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TableSkeleton } from '../components/LoadingState';

export default function SentLeads() {
 const { sentLeads, sentLeadsLoading, refreshSentLeads } = useApp();
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [selectedLead, setSelectedLead] = useState<any>(null);

 useEffect(() => {
 refreshSentLeads();
 }, [refreshSentLeads]);

 const handleRefresh = async () => {
 setIsRefreshing(true);
 await refreshSentLeads();
 setIsRefreshing(false);
 };

 return (
 <div className="max-w-7xl mx-auto space-y-6">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
 <div>
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-3">
 <Mail className="w-3.5 h-3.5" />
 <span>History</span>
 </div>
 <h1 className="text-3xl font-bold text-white tracking-tight">
 Sent Campaigns
 </h1>
 <p className="text-sm text-slate-400 mt-2">
 Review emails previously sent to your leads via Supabase.
 </p>
 </div>

 <button
 onClick={handleRefresh}
 disabled={sentLeadsLoading || isRefreshing}
 className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl font-medium transition duration-150 border border-slate-700/50 hover:border-slate-600 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <RefreshCw
 className={`w-4 h-4 ${(sentLeadsLoading || isRefreshing) ? 'animate-spin' : ''}`}
 />
 {sentLeadsLoading ? 'Loading...' : 'Refresh History'}
 </button>
 </div>

 {/* Main Content */}
 <div className="glass-card rounded-xl overflow-hidden">
 {sentLeadsLoading && sentLeads.length === 0 ? (
 <div className="p-6">
 <TableSkeleton rows={5} />
 </div>
 ) : sentLeads.length === 0 ? (
 <div className="p-16 text-center">
 <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4 text-brand-400 shadow-[0_0_15px_rgba(20,241,149,0.15)]">
 <Mail className="w-8 h-8" />
 </div>
 <h3 className="text-lg font-bold text-white mb-2">
 No Sent Campaigns Yet
 </h3>
 <p className="text-sm text-slate-400 max-w-sm mx-auto">
 Any leads you contact via the Outreach page will appear here once recorded in Supabase.
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto custom-scrollbar">
 <table className="w-full text-left text-sm border-collapse">
 <thead>
 <tr className="border-b border-white/5 bg-slate-900/50">
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">
 Recipient
 </th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">
 Subject
 </th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 w-48">
 Status
 </th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 w-40 text-right">
 Date
 </th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 w-20 text-center">
 Action
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {sentLeads.map((lead, i) => (
 <tr
 key={lead.id || i}
 className="hover:bg-slate-800/30 transition-colors group"
 >
 <td className="p-4">
 <div className="font-medium text-white">
 {lead.recipient || lead.email || lead.lead_email || 'Unknown'}
 </div>
 {(lead.company || lead.name) && (
 <div className="text-xs text-slate-500 mt-0.5">
 {lead.name} {lead.name && lead.company ? '•' : ''} {lead.company}
 </div>
 )}
 </td>
 <td className="p-4">
 <div className="text-slate-400 truncate max-w-md">
 {lead.subject || lead.emailSubject || lead.email_subject || 'No Subject'}
 </div>
 </td>
 <td className="p-4">
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
 <CheckCircle2 className="w-3 h-3" />
 {lead.status || 'Sent'}
 </span>
 </td>
 <td className="p-4 text-right">
 <div className="flex items-center justify-end gap-1.5 text-slate-500 text-xs">
 <Calendar className="w-3.5 h-3.5" />
 {lead.created_at || lead.sent_at || lead.sentAt
 ? new Date(lead.created_at || lead.sent_at || lead.sentAt || '').toLocaleDateString()
 : 'Recent'}
 </div>
 </td>
 <td className="p-4 text-center">
 <button
 onClick={() => setSelectedLead(lead)}
 className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors inline-flex items-center justify-center"
 title="View Email"
 >
 <Eye className="w-4 h-4" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* Email Modal */}
 {selectedLead && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 ">
 <div className="glass-card w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
 <div className="p-6 border-b border-white/5 flex items-start justify-between bg-slate-900/50">
 <div>
 <h2 className="text-xl font-bold text-white m-0">
 {selectedLead.subject || selectedLead.emailSubject || selectedLead.email_subject || 'No Subject'}
 </h2>
 <div className="text-sm text-slate-400 mt-1 flex items-center gap-2">
 <span>To:</span>
 <span className="font-medium text-white">
 {selectedLead.recipient || selectedLead.email || selectedLead.lead_email || 'Unknown'}
 </span>
 </div>
 </div>
 <button
 onClick={() => setSelectedLead(null)}
 className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>
 
 <div className="p-6 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
 {selectedLead.body || selectedLead.emailBody || selectedLead.email_body || selectedLead.content || selectedLead.email_content || 'No email body available.'}
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
