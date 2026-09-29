import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Send, Sparkles, LayoutGrid, List, Loader2, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LeadCard from '../components/LeadCard';
import LeadTable from '../components/LeadTable';
import LeadDetails from '../components/LeadDetails';
import EmailComposer from '../components/EmailComposer';
import ConfirmationModal from '../components/ConfirmationModal';
import { TableSkeleton } from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import type { Lead } from '../types/lead';

export default function Outreach() {
 const {
 leads,
 leadsLoading,
 selectedLead,
 setSelectedLead,
 emailDraft,
 showLeadDetails,
 setShowLeadDetails,
 showEmailComposer,
 setShowEmailComposer,
 generateBulkEmails,
 sendBulkEmails,
 } = useApp();
 const navigate = useNavigate();

 const [view, setView] = useState<'grid' | 'table'>('table');
 const [showSendAllConfirm, setShowSendAllConfirm] = useState(false);
 const [isBulkGenerating, setIsBulkGenerating] = useState(false);
 const [isBulkSending, setIsBulkSending] = useState(false);

 // Leads with valid email address
 const outreachLeads = leads.filter((l) => l.email && l.email.trim());

 const handleView = useCallback(
 (lead: Lead) => {
 setSelectedLead(lead);
 setShowLeadDetails(true);
 },
 [setSelectedLead, setShowLeadDetails]
 );

 const handleGenerateMail = useCallback(
 (lead: Lead) => {
 setSelectedLead(lead);
 setShowLeadDetails(false);
 setShowEmailComposer(true);
 },
 [setSelectedLead, setShowLeadDetails, setShowEmailComposer]
 );

 const handleBulkGenerate = async () => {
 setIsBulkGenerating(true);
 try {
 await generateBulkEmails(outreachLeads);
 } finally {
 setIsBulkGenerating(false);
 }
 };

 const handleBulkSendConfirm = async () => {
 setIsBulkSending(true);
 try {
 await sendBulkEmails(outreachLeads);
 setShowSendAllConfirm(false);
 } finally {
 setIsBulkSending(false);
 }
 };

 return (
 <div className="space-y-6 ">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
 <div>
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-3">
 <Mail className="w-3.5 h-3.5" />
 <span>Campaigns</span>
 </div>
 <h1 className="text-3xl font-bold text-white tracking-tight">
 Email Campaigns
 </h1>
 <p className="text-sm text-slate-400 mt-2">
 Manage AI-personalized outreach for verified contacts
 </p>
 </div>

 {/* Actions & View Switcher */}
 {outreachLeads.length > 0 && (
 <div className="flex items-center gap-3 self-start flex-wrap">
 <button
 onClick={handleBulkGenerate}
 disabled={isBulkGenerating}
 className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl font-medium transition duration-150 border border-slate-700/50 hover:border-slate-600 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isBulkGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
 <span>Generate All</span>
 </button>
 <button
 onClick={() => setShowSendAllConfirm(true)}
 disabled={isBulkSending}
 className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-xl font-semibold transition duration-150 shadow-[0_0_20px_rgba(20,241,149,0.3)] hover:shadow-[0_0_25px_rgba(20,241,149,0.5)] border border-brand-400/50 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isBulkSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
 <span>Send All</span>
 </button>

 {/* View Switcher */}
 <div className="flex items-center glass-card p-1 ml-2 rounded-xl">
 <button
 onClick={() => setView('grid')}
 className={`p-2 rounded-lg transition ${
 view === 'grid'
 ? 'bg-brand-500/20 text-brand-400'
 : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
 }`}
 aria-label="Grid view"
 >
 <LayoutGrid className="w-4 h-4" />
 </button>
 <button
 onClick={() => setView('table')}
 className={`p-2 rounded-lg transition ${
 view === 'table'
 ? 'bg-brand-500/20 text-brand-400'
 : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
 }`}
 aria-label="Table view"
 >
 <List className="w-4 h-4" />
 </button>
 </div>
 </div>
 )}
 </div>

 {/* Outreach Leads Section */}
 <div className="space-y-4">
 <h2 className="text-sm font-semibold text-slate-400">
 Prospects ready for outreach
 </h2>

 {leadsLoading ? (
 <TableSkeleton rows={4} />
 ) : outreachLeads.length === 0 ? (
 <EmptyState
 type="no-emails"
 title="No outreach-ready prospects yet"
 description="Leads with verified contact emails will appear here automatically."
 action={
 <button
 onClick={() => navigate('/find-leads')}
 className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-xl font-semibold transition duration-150 shadow-[0_0_20px_rgba(20,241,149,0.3)] hover:shadow-[0_0_25px_rgba(20,241,149,0.5)] border border-brand-400/50 flex items-center gap-2"
 >
 <Search className="w-4 h-4" />
 Find New Leads
 </button>
 }
 />
 ) : view === 'table' ? (
 <LeadTable
 leads={outreachLeads}
 onView={handleView}
 onGenerateMail={handleGenerateMail}
 />
 ) : (
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {outreachLeads.map((lead) => (
 <LeadCard
 key={lead.leadId || lead.postUrl || lead.name}
 lead={lead}
 onClick={handleView}
 />
 ))}
 </div>
 )}
 </div>

 {/* Drawers */}
 {showLeadDetails && selectedLead && (
 <LeadDetails
 lead={selectedLead}
 onClose={() => {
 setShowLeadDetails(false);
 setSelectedLead(null);
 }}
 onGenerateMail={handleGenerateMail}
 />
 )}

 {showEmailComposer && selectedLead && (
 <EmailComposer
 lead={selectedLead}
 initialDraft={emailDraft}
 onClose={() => {
 setShowEmailComposer(false);
 }}
 />
 )}

 {/* Confirmation Modal */}
 <ConfirmationModal
 isOpen={showSendAllConfirm}
 title={`Send ${outreachLeads.length} Emails?`}
 description="These emails will be dispatched sequentially using your connected outreach workflow. This action cannot be undone."
 confirmLabel={`Send ${outreachLeads.length} Emails`}
 cancelLabel="Cancel"
 variant="success"
 loading={isBulkSending}
 onConfirm={handleBulkSendConfirm}
 onCancel={() => setShowSendAllConfirm(false)}
 />
 </div>
 );
}
