import { useState, useRef } from 'react';
import {
 Mail,
 Send,
 RefreshCw,
 Paperclip,
 X,
 FileText,
 User,
 CheckCircle2,
 AlertCircle,
 Sparkles,
 Loader2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Lead, AttachmentItem } from '../types/lead';

interface MailWorkspaceProps {
 lead: Lead | null;
 onClose?: () => void;
}

function readFileAsBase64(file: File): Promise<string> {
 return new Promise((resolve, reject) => {
 const reader = new FileReader();
 reader.readAsDataURL(file);
 reader.onload = () => resolve(reader.result as string);
 reader.onerror = (error) => reject(error);
 });
}

function formatFileSize(bytes: number): string {
 if (bytes < 1024) return bytes + ' B';
 if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
 return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function validateEmail(email: string): boolean {
 return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function MailWorkspace({ lead, onClose }: MailWorkspaceProps) {
 if (!lead) {
 return (
 <div className="h-full glass-card p-8 flex flex-col items-center justify-center text-center">
 <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 shadow-[0_0_15px_rgba(20,241,149,0.15)]">
 <Mail className="w-8 h-8" />
 </div>
 <h3 className="text-xl font-bold text-white mb-2">
 Select a Lead to View Email
 </h3>
 <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
 Click on any lead in the table or card view to preview, generate, and edit personalized outreach emails.
 </p>
 </div>
 );
 }

 // Key the inner editor by leadKey so switching leads immediately mounts a fresh instance
 const leadKey = lead.leadId || lead.postUrl || lead.name;
 return <MailEditorPanel key={leadKey} lead={lead} leadKey={leadKey} onClose={onClose} />;
}

function MailEditorPanel({
 lead,
 leadKey,
 onClose,
}: {
 lead: Lead;
 leadKey: string;
 onClose?: () => void;
}) {
 const {
 generatedEmails,
 updateDraft,
 generateEmailForLead,
 sendEmailForLead,
 sentLeadIds,
 } = useApp();

 const fileInputRef = useRef<HTMLInputElement>(null);
 const sendClickedRef = useRef(false);

 const currentDraft = generatedEmails[leadKey];
 const isSent = sentLeadIds.includes(leadKey) || currentDraft?.status === 'sent';

 const [recipient, setRecipient] = useState(
 currentDraft?.recipient || lead.email || ''
 );
 const [subject, setSubject] = useState(currentDraft?.subject || '');
 const [body, setBody] = useState(currentDraft?.body || '');
 const [attachments, setAttachments] = useState<AttachmentItem[]>(
 currentDraft?.attachments || []
 );
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [isGenerating, setIsGenerating] = useState(false);
 const [isSending, setIsSending] = useState(false);

 // Handle local edits & persist to context draft
 const handleRecipientChange = (val: string) => {
 setRecipient(val);
 updateDraft(leadKey, { recipient: val });
 };

 const handleSubjectChange = (val: string) => {
 setSubject(val);
 updateDraft(leadKey, { subject: val });
 };

 const handleBodyChange = (val: string) => {
 setBody(val);
 updateDraft(leadKey, { body: val });
 };

 // Attachments handler with Base64 conversion
 const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const files = e.target.files;
 if (!files || files.length === 0) return;

 const fileList = Array.from(files);
 const newAttachments: AttachmentItem[] = [];

 for (const f of fileList) {
 try {
 const base64 = await readFileAsBase64(f);
 newAttachments.push({
 id: Date.now() + Math.random().toString(36).slice(2),
 name: f.name,
 size: f.size,
 type: f.type,
 base64,
 });
 } catch (err) {
 console.error('Failed to read file as base64', err);
 }
 }

 const updated = [...attachments, ...newAttachments];
 setAttachments(updated);
 updateDraft(leadKey, { attachments: updated });

 if (fileInputRef.current) {
 fileInputRef.current.value = '';
 }
 };

 const handleRemoveAttachment = (id: string) => {
 const updated = attachments.filter((a) => a.id !== id);
 setAttachments(updated);
 updateDraft(leadKey, { attachments: updated });
 };

 // Generate Email
 const handleGenerate = async () => {
 setIsGenerating(true);
 try {
 const draft = await generateEmailForLead(lead);
 if (draft) {
 setRecipient(draft.recipient);
 setSubject(draft.subject);
 setBody(draft.body);
 }
 } finally {
 setIsGenerating(false);
 }
 };

 // Send Email
 const handleSend = async () => {
 if (sendClickedRef.current || isSending) return;
 sendClickedRef.current = true;

 const errs: Record<string, string> = {};
 if (!recipient.trim()) {
 errs.recipient = 'Recipient email is required.';
 } else if (!validateEmail(recipient.trim())) {
 errs.recipient = 'Please enter a valid email address.';
 }
 if (!subject.trim()) {
 errs.subject = 'Subject is required.';
 }
 if (!body.trim()) {
 errs.body = 'Email body is required.';
 }

 if (Object.keys(errs).length > 0) {
 setErrors(errs);
 sendClickedRef.current = false;
 return;
 }

 setIsSending(true);
 try {
 await sendEmailForLead(lead.leadId, recipient.trim(), subject.trim(), body.trim(), attachments);
 } finally {
 setIsSending(false);
 sendClickedRef.current = false;
 }
 };

 const hasDraft = !!(subject || body);

 return (
 <div className="h-full glass-card flex flex-col overflow-hidden">
 {/* Lead Top Banner in Workspace */}
 <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50 flex items-center justify-between gap-4">
 <div className="flex items-center gap-4 min-w-0">
 <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-lg flex-shrink-0 shadow-[0_0_15px_rgba(20,241,149,0.1)]">
 {(lead.name || '?')[0]?.toUpperCase()}
 </div>
 <div className="min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <h3 className="text-base font-bold text-white truncate">
 {lead.name}
 </h3>
 {isSent && (
 <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
 <CheckCircle2 className="w-3.5 h-3.5" /> Sent
 </span>
 )}
 </div>
 <p className="text-sm text-slate-400 truncate">
 {lead.role} · {lead.company}
 </p>
 </div>
 </div>

 {onClose && (
 <button
 type="button"
 onClick={onClose}
 className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
 aria-label="Close workspace"
 >
 <X className="w-5 h-5" />
 </button>
 )}
 </div>

 {/* Editor Body */}
 <div className="flex-1 overflow-y-auto p-6 space-y-5">
 {!hasDraft && !isGenerating ? (
 <div className="py-16 text-center space-y-5">
 <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
 <Sparkles className="w-8 h-8" />
 </div>
 <div>
 <h4 className="text-lg font-bold text-white mb-2">
 No Email Draft Yet
 </h4>
 <p className="text-sm text-slate-400 max-w-sm mx-auto">
 Generate an AI-personalized email tailored to {lead.name}'s role and background.
 </p>
 </div>
 <button
 type="button"
 onClick={handleGenerate}
 disabled={isGenerating}
 className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-xl font-semibold transition duration-150 shadow-[0_0_20px_rgba(20,241,149,0.3)] hover:shadow-[0_0_25px_rgba(20,241,149,0.5)] border border-brand-400/50"
 >
 <Sparkles className="w-4 h-4" />
 Generate Outreach Email
 </button>
 </div>
 ) : isGenerating ? (
 <div className="py-20 text-center space-y-4">
 <Loader2 className="w-10 h-10 animate-spin mx-auto text-brand-400" />
 <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
 Generating tailored email with AI...
 </p>
 </div>
 ) : (
 <>
 {/* Recipient */}
 <div>
 <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
 <User className="w-4 h-4 text-slate-500" />
 Recipient Email
 </label>
 <input
 type="email"
 value={recipient}
 onChange={(e) => handleRecipientChange(e.target.value)}
 placeholder="lead@company.com"
 className={`w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition ${
 errors.recipient ? '!border-red-500/50 focus:ring-red-500/50 bg-red-500/5' : ''
 }`}
 />
 {errors.recipient && (
 <p className="text-xs font-medium text-red-400 mt-1.5 flex items-center gap-1.5">
 <AlertCircle className="w-3.5 h-3.5" /> {errors.recipient}
 </p>
 )}
 </div>

 {/* Subject */}
 <div>
 <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
 <FileText className="w-4 h-4 text-slate-500" />
 Subject
 </label>
 <input
 type="text"
 value={subject}
 onChange={(e) => handleSubjectChange(e.target.value)}
 placeholder="e.g. Exploring Collaboration with [Company]"
 className={`w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition ${
 errors.subject ? '!border-red-500/50 focus:ring-red-500/50 bg-red-500/5' : ''
 }`}
 />
 {errors.subject && (
 <p className="text-xs font-medium text-red-400 mt-1.5 flex items-center gap-1.5">
 <AlertCircle className="w-3.5 h-3.5" /> {errors.subject}
 </p>
 )}
 </div>

 {/* Email Body */}
 <div className="flex-1 flex flex-col min-h-[300px]">
 <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
 <Mail className="w-4 h-4 text-slate-500" />
 Message Body
 </label>
 <textarea
 value={body}
 onChange={(e) => handleBodyChange(e.target.value)}
 placeholder="Write your email here..."
 className={`w-full flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition resize-none leading-relaxed ${
 errors.body ? '!border-red-500/50 focus:ring-red-500/50 bg-red-500/5' : ''
 }`}
 />
 {errors.body && (
 <p className="text-xs font-medium text-red-400 mt-1.5 flex items-center gap-1.5">
 <AlertCircle className="w-3.5 h-3.5" /> {errors.body}
 </p>
 )}
 </div>

 {/* Attachment Section */}
 <div className="bg-slate-900/30 border border-white/5 rounded-xl p-4">
 <div className="flex items-center justify-between mb-3">
 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
 <Paperclip className="w-4 h-4 text-slate-500" />
 Attachments
 </span>
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 uppercase tracking-wider transition-colors"
 >
 <Paperclip className="w-3.5 h-3.5" /> Attach File
 </button>
 <input
 ref={fileInputRef}
 type="file"
 multiple
 onChange={handleFileSelect}
 className="hidden"
 />
 </div>

 {attachments.length > 0 ? (
 <div className="flex flex-wrap gap-2">
 {attachments.map((file) => (
 <div
 key={file.id}
 className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-white/10 text-sm text-slate-200"
 >
 <Paperclip className="w-3.5 h-3.5 text-slate-400" />
 <span className="max-w-[180px] truncate font-medium">
 {file.name}
 </span>
 <span className="text-xs text-slate-500">
 {formatFileSize(file.size)}
 </span>
 <button
 type="button"
 onClick={() => handleRemoveAttachment(file.id)}
 className="text-slate-400 hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-colors"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-sm text-slate-500">
 No attachments selected. (Attach resumes, portfolios, or pitch decks)
 </p>
 )}
 </div>
 </>
 )}
 </div>

 {/* Footer Controls */}
 {hasDraft && (
 <div className="px-6 py-4 border-t border-white/5 bg-slate-900/50 flex items-center justify-between gap-4">
 <button
 type="button"
 onClick={handleGenerate}
 disabled={isGenerating || isSending}
 className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl font-medium transition duration-150 border border-slate-700/50 hover:border-slate-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <RefreshCw
 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`}
 />
 <span>Regenerate</span>
 </button>

 <button
 type="button"
 onClick={handleSend}
 disabled={isGenerating || isSending || !recipient.trim() || !subject.trim() || !body.trim()}
 className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-xl font-semibold transition duration-150 shadow-[0_0_20px_rgba(20,241,149,0.3)] hover:shadow-[0_0_25px_rgba(20,241,149,0.5)] border border-brand-400/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isSending ? (
 <>
 <Loader2 className="w-4 h-4 animate-spin" />
 <span>Sending...</span>
 </>
 ) : (
 <>
 <Send className="w-4 h-4" />
 <span>Send Email</span>
 </>
 )}
 </button>
 </div>
 )}
 </div>
 );
}
