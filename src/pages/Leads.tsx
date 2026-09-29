import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
 RefreshCw,
 Search,
 AlertTriangle,
 LayoutGrid,
 List,
 Sparkles,
 Send,
 Loader2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import LeadTable from '../components/LeadTable';
import LeadCard from '../components/LeadCard';
import LeadDetails from '../components/LeadDetails';
import EmailComposer from '../components/EmailComposer';
import FilterBar from '../components/FilterBar';
import BulkActionBar from '../components/BulkActionBar';
import ConfirmationModal from '../components/ConfirmationModal';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingState';
import type { Lead } from '../types/lead';

export default function Leads() {
 const {
 leads,
 leadsLoading,
 leadsError,
 refreshLeads,
 resetLeads,
 selectedLead,
 setSelectedLead,
 emailDraft,
 showLeadDetails,
 setShowLeadDetails,
 showEmailComposer,
 setShowEmailComposer,
 selectedLeadIds,
 clearSelection,

 setActiveWorkspaceLeadId,
 filterOptions,
 generateBulkEmails,
 sendBulkEmails,
 generatedEmails,
 sentLeadIds,
 } = useApp();

 const navigate = useNavigate();

 const [view, setView] = useState<'table' | 'grid'>(() => {
 return (localStorage.getItem('leadgen_lead_view') as 'table' | 'grid') || 'table';
 });
 const [activeTab, setActiveTab] = useState<'new' | 'contacted'>('new');
 const [showResetConfirm, setShowResetConfirm] = useState(false);
 const [showSendAllConfirm, setShowSendAllConfirm] = useState(false);
 const [showBulkSendConfirm, setShowBulkSendConfirm] = useState(false);
 const [isBulkGenerating, setIsBulkGenerating] = useState(false);
 const [isBulkSending, setIsBulkSending] = useState(false);

 const handleViewChange = (newView: 'table' | 'grid') => {
 setView(newView);
 localStorage.setItem('leadgen_lead_view', newView);
 };

 const handleViewLead = useCallback(
 (lead: Lead) => {
 setSelectedLead(lead);
 setShowLeadDetails(true);
 },
 [setSelectedLead, setShowLeadDetails]
 );

 const handleGenerateMail = useCallback(
 (lead: Lead) => {
 const leadKey = lead.leadId || lead.postUrl || lead.name;
 setActiveWorkspaceLeadId(leadKey);
 setSelectedLead(lead);
 setShowLeadDetails(false);
 setShowEmailComposer(true);
 },
 [setSelectedLead, setShowLeadDetails, setShowEmailComposer, setActiveWorkspaceLeadId]
 );

 // Folder counts
 const { newLeadsCount, contactedLeadsCount } = useMemo(() => {
 let newCount = 0;
 let contactedCount = 0;
 leads.forEach((lead) => {
 const leadKey = lead.leadId || lead.postUrl || lead.name;
 const isSent = sentLeadIds.includes(leadKey) || generatedEmails[leadKey]?.status === 'sent';
 if (isSent) contactedCount++;
 else newCount++;
 });
 return { newLeadsCount: newCount, contactedLeadsCount: contactedCount };
 }, [leads, sentLeadIds, generatedEmails]);

 // Filter leads
 const filteredLeads = useMemo(() => {
 const seen = new Set<string>();

 return leads.filter((lead) => {
 if (filterOptions.query) {
 const q = filterOptions.query.toLowerCase();
 const matchesName = lead.name?.toLowerCase().includes(q);
 const matchesCompany = lead.company?.toLowerCase().includes(q);
 const matchesRole = lead.role?.toLowerCase().includes(q);
 const matchesJobTitle = lead.jobTitle?.toLowerCase().includes(q);
 const matchesLocation = lead.location?.toLowerCase().includes(q);
 const matchesEmail = lead.email?.toLowerCase().includes(q);
 if (
 !matchesName &&
 !matchesCompany &&
 !matchesRole &&
 !matchesJobTitle &&
 !matchesLocation &&
 !matchesEmail
 ) {
 return false;
 }
 }
 if (filterOptions.company && lead.company !== filterOptions.company) return false;
 if (filterOptions.location && lead.location !== filterOptions.location) return false;
 if (filterOptions.source && lead.source !== filterOptions.source) return false;
 if (filterOptions.status === 'hasEmail' && !lead.email) return false;
 if (filterOptions.status === 'noEmail' && lead.email) return false;

 const leadKey = lead.leadId || lead.postUrl || lead.name;
 const draft = generatedEmails[leadKey];
 const isSent = sentLeadIds.includes(leadKey) || draft?.status === 'sent';
 const hasDraft = !!(draft?.subject || draft?.body);

 if (activeTab === 'new' && isSent) return false;
 if (activeTab === 'contacted' && !isSent) return false;
 if (filterOptions.status === 'generated' && !hasDraft) return false;
 if (filterOptions.status === 'sent' && !isSent) return false;

 if (filterOptions.hideDuplicates) {
 const dupKey = `${lead.name?.trim().toLowerCase()}|${lead.company?.trim().toLowerCase()}`;
 if (seen.has(dupKey)) return false;
 seen.add(dupKey);
 }

 return true;
 });
 }, [leads, filterOptions, generatedEmails, sentLeadIds, activeTab]);

 const selectedLeads = useMemo(() => {
 return leads.filter((l) =>
 selectedLeadIds.includes(l.leadId || l.postUrl || l.name)
 );
 }, [leads, selectedLeadIds]);


 const handleBulkGenerate = async (leadsToGenerate: Lead[] = selectedLeads) => {
 setIsBulkGenerating(true);
 try {
 await generateBulkEmails(leadsToGenerate.length > 0 ? leadsToGenerate : filteredLeads);
 } finally {
 setIsBulkGenerating(false);
 }
 };

 const handleBulkSendConfirm = async (leadsToSend: Lead[] = selectedLeads) => {
 setIsBulkSending(true);
 try {
 await sendBulkEmails(leadsToSend.length > 0 ? leadsToSend : filteredLeads);
 setShowSendAllConfirm(false);
 setShowBulkSendConfirm(false);
 } finally {
 setIsBulkSending(false);
 }
 };

 const handleResetConfirm = () => {
 resetLeads();
 setShowResetConfirm(false);
 };

 return (
 <div className="space-y-8 pb-24">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
 <div>
 <p className="text-sm font-semibold text-brand-400 mb-2 uppercase tracking-widest">
 Pipeline
 </p>
 <div className="flex items-center gap-3">
 <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
 Leads
 </h1>
 <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
 {filteredLeads.length} of {leads.length}
 </span>
 </div>
 <p className="text-base text-slate-600 dark:text-slate-400 mt-2 mb-0">
 Review, filter, and manage outreach campaigns.
 </p>
 </div>

 {/* Action Controls & View Switcher */}
 <div className="flex items-center gap-3 self-start flex-wrap">
 
 <button
 onClick={() => handleBulkGenerate(filteredLeads)}
 disabled={isBulkGenerating || filteredLeads.length === 0}
 className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition active:scale-95"
 >
 {isBulkGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
 <span>Generate All</span>
 </button>
 
 <button
 onClick={() => setShowSendAllConfirm(true)}
 disabled={isBulkSending || filteredLeads.length === 0}
 className="bg-brand-500 hover:bg-brand-400 text-white disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 transition active:scale-95"
 >
 {isBulkSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
 <span>Send All</span>
 </button>

 {/* View Switcher */}
 <div className="flex items-center bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-1 ml-2">
 <button
 onClick={() => handleViewChange('table')}
 className={`p-2 rounded-lg transition ${
 view === 'table'
 ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
 : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
 }`}
 aria-label="Table view"
 >
 <List className="w-4 h-4" />
 </button>
 <button
 onClick={() => handleViewChange('grid')}
 className={`p-2 rounded-lg transition ${
 view === 'grid'
 ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
 : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
 }`}
 aria-label="Grid view"
 >
 <LayoutGrid className="w-4 h-4" />
 </button>
 </div>

 {/* Refresh */}
 <button
 onClick={refreshLeads}
 disabled={leadsLoading}
 className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:pointer-events-none p-2.5 rounded-xl shadow-sm transition active:scale-95 ml-1"
 title="Refresh leads"
 >
 <RefreshCw
 className={`w-4 h-4 ${leadsLoading ? 'animate-spin text-brand-400' : ''}`}
 />
 </button>
 </div>
 </div>

 {/* Folder Tabs */}
 <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/60 pb-px">
 <button
 onClick={() => setActiveTab('new')}
 className={`px-5 py-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
 activeTab === 'new' 
 ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
 : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
 }`}
 >
 New Leads
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
 activeTab === 'new' ? 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
 }`}>
 {newLeadsCount}
 </span>
 </button>
 <button
 onClick={() => setActiveTab('contacted')}
 className={`px-5 py-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
 activeTab === 'contacted' 
 ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
 : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
 }`}
 >
 Contacted
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
 activeTab === 'contacted' ? 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
 }`}>
 {contactedLeadsCount}
 </span>
 </button>
 </div>

 {/* Filter Bar */}
 {leads.length > 0 && (
 <FilterBar
 leads={leads}
 onResetLeadsPrompt={() => setShowResetConfirm(true)}
 />
 )}

 {/* Main Workspace Layout */}
 {leadsError ? (
 <div className="glass-card p-10 text-center max-w-md mx-auto border-l-4 border-l-red-500 rounded-2xl">
 <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
 Unable to load leads
 </h3>
 <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{leadsError}</p>
 <button
 onClick={refreshLeads}
 className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition"
 >
 <RefreshCw className="w-4 h-4" />
 Try Again
 </button>
 </div>
 ) : leadsLoading ? (
 <TableSkeleton rows={6} />
 ) : leads.length === 0 ? (
 <EmptyState
 type="no-leads"
 action={
 <button
 onClick={() => navigate('/find-leads')}
 className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-lg shadow-brand-500/20 transition active:scale-95 mt-4"
 >
 <Search className="w-4 h-4" />
 Find New Leads
 </button>
 }
 />
 ) : filteredLeads.length === 0 ? (
 <EmptyState
 type="no-results"
 action={
 <button
 onClick={() => {}}
 className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition mt-4"
 >
 Clear Filters
 </button>
 }
 />
 ) : (
 <div className="grid gap-6 grid-cols-1">
 {/* Leads List */}
 <div className="w-full">
 {view === 'table' ? (
 <LeadTable
 leads={filteredLeads}
 onView={handleViewLead}
 onGenerateMail={handleGenerateMail}
 />
 ) : (
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
 {filteredLeads.map((lead) => (
 <LeadCard
 key={lead.leadId || lead.postUrl || lead.name}
 lead={lead}
 onClick={(l) => {
 handleViewLead(l);
 }}
 />
 ))}
 </div>
 )}
 </div>
 </div>
 )}

 {/* Bulk Action Bar */}
 <BulkActionBar
 selectedLeads={selectedLeads}
 onGenerateAll={() => handleBulkGenerate(selectedLeads)}
 onSendAll={() => setShowBulkSendConfirm(true)}
 onClear={clearSelection}
 />

 {/* Lead Details Drawer */}
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

 {/* Email Composer */}
 {showEmailComposer && selectedLead && (
 <EmailComposer
 lead={selectedLead}
 initialDraft={emailDraft}
 onClose={() => {
 setShowEmailComposer(false);
 }}
 />
 )}

 {/* Confirmation Modals */}
 <ConfirmationModal
 isOpen={showResetConfirm}
 title="Clear Database?"
 description="This will permanently delete all scraped leads and email drafts from your database. This action cannot be undone."
 confirmLabel="Clear Database"
 cancelLabel="Cancel"
 variant="danger"
 onConfirm={handleResetConfirm}
 onCancel={() => setShowResetConfirm(false)}
 />

 <ConfirmationModal
 isOpen={showSendAllConfirm}
 title={`Send ${filteredLeads.length} Emails?`}
 description="These emails will be dispatched sequentially using your connected outreach workflow. This action cannot be undone."
 confirmLabel={`Send ${filteredLeads.length} Emails`}
 cancelLabel="Cancel"
 variant="success"
 loading={isBulkSending}
 onConfirm={() => handleBulkSendConfirm(filteredLeads)}
 onCancel={() => setShowSendAllConfirm(false)}
 />

 <ConfirmationModal
 isOpen={showBulkSendConfirm}
 title={`Send ${selectedLeads.length} Selected Emails?`}
 description="These emails will be dispatched sequentially. This action cannot be undone."
 confirmLabel={`Send ${selectedLeads.length} Emails`}
 cancelLabel="Cancel"
 variant="success"
 loading={isBulkSending}
 onConfirm={() => handleBulkSendConfirm(selectedLeads)}
 onCancel={() => setShowBulkSendConfirm(false)}
 />
 </div>
 );
}
