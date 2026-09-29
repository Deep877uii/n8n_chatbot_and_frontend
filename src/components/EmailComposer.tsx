import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
 X,
 Send,
 RefreshCw,
 Mail,
 User,
 FileText,
 AlertCircle,
 Paperclip,
 CheckCircle2,
 Minus,
 Maximize2,
 Minimize2,
} from 'lucide-react';
import type { Lead, EmailDraft, AttachmentItem } from '../types/lead';
import { useApp } from '../context/AppContext';

interface EmailComposerProps {
 lead: Lead;
 initialDraft: EmailDraft | null;
 onClose: () => void;
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

export default function EmailComposer({
 lead,
 initialDraft,
 onClose,
}: EmailComposerProps) {
 const {
 generatedEmails,
 updateDraft,
 generateEmailForLead,
 sendEmailForLead,
 sentLeadIds,
 } = useApp();

 const leadKey = lead.leadId || lead.postUrl || lead.name;
 const activeDraft = generatedEmails[leadKey] || initialDraft;
 const isSent = sentLeadIds.includes(leadKey) || activeDraft?.status === 'sent';

 const [recipient, setRecipient] = useState(
 activeDraft?.recipient || lead.email || ''
 );
 const [subject, setSubject] = useState(activeDraft?.subject || '');
 const [body, setBody] = useState(activeDraft?.body || '');
 const [attachments, setAttachments] = useState<AttachmentItem[]>(
 activeDraft?.attachments || []
 );
 const [loading, setLoading] = useState(!activeDraft?.subject && !activeDraft?.body);
 const [sending, setSending] = useState(false);
 const [regenerating, setRegenerating] = useState(false);
 const [errors, setErrors] = useState<Record<string, string>>({});

 const [isMinimized, setIsMinimized] = useState(false);
 const [isFullScreen, setIsFullScreen] = useState(false);

 const overlayRef = useRef<HTMLDivElement>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const sendClickedRef = useRef(false);

 // If no draft exists yet, generate on first mount
 useEffect(() => {
 if (!activeDraft?.subject && !activeDraft?.body) {
 handleGenerate();
 }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 useEffect(() => {
 const handleEsc = (e: KeyboardEvent) => {
 if (e.key === 'Escape' && !sending) onClose();
 };
 document.addEventListener('keydown', handleEsc);
 return () => {
 document.removeEventListener('keydown', handleEsc);
 };
 }, [onClose, sending]);

 // No drag handlers needed for docked style

 async function handleGenerate() {
 setLoading(true);
 setRegenerating(true);
 try {
 const res = await generateEmailForLead(lead);
 if (res) {
 setRecipient(res.recipient);
 setSubject(res.subject);
 setBody(res.body);
 }
 } finally {
 setLoading(false);
 setRegenerating(false);
 }
 }

 async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
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
 }

 function handleRemoveAttachment(id: string) {
 const updated = attachments.filter((a) => a.id !== id);
 setAttachments(updated);
 updateDraft(leadKey, { attachments: updated });
 }

 function validate(): boolean {
 const newErrors: Record<string, string> = {};

 if (!lead.leadId) {
 newErrors.general = 'Lead ID is missing.';
 }
 if (!recipient.trim()) {
 newErrors.recipient = 'Recipient email is required.';
 } else if (!validateEmail(recipient.trim())) {
 newErrors.recipient = 'Please enter a valid recipient email.';
 }
 if (!subject.trim()) {
 newErrors.subject = 'Subject cannot be empty.';
 }
 if (!body.trim()) {
 newErrors.body = 'Email body cannot be empty.';
 }

 setErrors(newErrors);
 return Object.keys(newErrors).length === 0;
 }

 async function handleSend() {
 if (sendClickedRef.current || sending) return;
 sendClickedRef.current = true;

 if (!validate()) {
 sendClickedRef.current = false;
 return;
 }

 setSending(true);
 try {
 const ok = await sendEmailForLead(
 lead.leadId,
 recipient.trim(),
 subject.trim(),
 body.trim(),
 attachments
 );
 if (ok) {
 onClose();
 }
 } finally {
 setSending(false);
 sendClickedRef.current = false;
 }
 }

 return createPortal(
 <div
 ref={overlayRef}
 className={`fixed z-[90] pointer-events-none transition duration-150 ${
 isFullScreen && !isMinimized
 ? 'inset-4 sm:inset-10 flex items-center justify-center'
 : 'bottom-0 right-4 sm:right-24 flex items-end justify-end'
 }`}
 role="dialog"
 aria-modal="false"
 aria-label="Email composer"
 >
 <div
 className={`glass-card flex flex-col overflow-hidden pointer-events-auto transition duration-150 ease-out ${
 isMinimized 
 ? 'w-72 h-auto rounded-t-2xl rounded-b-none border-b-0' 
 : isFullScreen 
 ? 'w-full h-full max-w-4xl rounded-2xl'
 : 'w-[540px] max-w-[calc(100vw-2rem)] rounded-t-2xl rounded-b-none border-b-0'
 }`}
 style={{
 maxHeight: isMinimized ? 'auto' : isFullScreen ? '100%' : '75vh',
 height: (isFullScreen && !isMinimized) ? '100%' : undefined
 }}
 >
 {/* Header */}
 <div 
 className={`flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-slate-900/50 select-none ${isMinimized ? '' : 'border-b border-slate-200 dark:border-white/5'}`}
 onClick={() => isMinimized && setIsMinimized(false)}
 style={{ cursor: isMinimized ? 'pointer' : 'default' }}
 >
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-[0_0_15px_rgba(20,241,149,0.15)]">
 <Mail className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2 mb-0.5">
 <h2 className="text-base font-bold text-slate-900 dark:text-white">
 AI Outreach Mail
 </h2>
 {isSent && (
 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
 <CheckCircle2 className="w-3 h-3" /> Sent
 </span>
 )}
 </div>
 <p className="text-xs text-slate-500 dark:text-slate-400">
 Personalized for {lead.name || 'this lead'} · {lead.company}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-1">
 <button
 onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
 disabled={sending}
 className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
 aria-label={isMinimized ? "Expand" : "Minimize"}
 >
 <Minus className="w-4 h-4" />
 </button>
 <button
 onClick={(e) => { e.stopPropagation(); setIsFullScreen(!isFullScreen); setIsMinimized(false); }}
 disabled={sending}
 className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 hidden sm:block"
 aria-label={isFullScreen ? "Exit Full Screen" : "Full Screen"}
 >
 {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
 </button>
 <button
 onClick={(e) => { e.stopPropagation(); onClose(); }}
 disabled={sending}
 className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
 aria-label="Close email composer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Body and Footer */}
 {!isMinimized && (
 <>
 <div className="flex-1 overflow-y-auto p-6 space-y-5">
 {loading && !recipient && !subject ? (
 <div className="flex flex-col items-center justify-center py-20 gap-4">
 <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
 <p className="text-sm font-semibold text-slate-400">
 {regenerating
 ? 'Crafting new draft with AI...'
 : 'Generating personalized email...'}
 </p>
 </div>
 ) : (
 <>
 {errors.general && (
 <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
 <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
 <span className="text-xs text-red-400 font-medium">
 {errors.general}
 </span>
 </div>
 )}

 {/* Recipient */}
 <div>
 <label
 htmlFor="modal-email-recipient"
 className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider"
 >
 <User className="w-4 h-4 text-slate-500" />
 Recipient Email
 </label>
 <input
 id="modal-email-recipient"
 type="email"
 value={recipient}
 onChange={(e) => {
 setRecipient(e.target.value);
 updateDraft(leadKey, { recipient: e.target.value });
 if (errors.recipient) {
 setErrors((prev) => {
 const n = { ...prev };
 delete n.recipient;
 return n;
 });
 }
 }}
 placeholder="name@company.com"
 className={`w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition
 ${errors.recipient ? '!border-red-500/50 focus:ring-red-500/50 bg-red-50 dark:bg-red-500/5' : ''}`}
 />
 {errors.recipient && (
 <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 font-medium">
 <AlertCircle className="w-3.5 h-3.5" />
 {errors.recipient}
 </p>
 )}
 </div>

 {/* Subject */}
 <div>
 <label
 htmlFor="modal-email-subject"
 className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider"
 >
 <FileText className="w-4 h-4 text-slate-500" />
 Subject
 </label>
 <input
 id="modal-email-subject"
 type="text"
 value={subject}
 onChange={(e) => {
 setSubject(e.target.value);
 updateDraft(leadKey, { subject: e.target.value });
 if (errors.subject) {
 setErrors((prev) => {
 const n = { ...prev };
 delete n.subject;
 return n;
 });
 }
 }}
 placeholder="Enter email subject"
 className={`w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition
 ${errors.subject ? '!border-red-500/50 focus:ring-red-500/50 bg-red-50 dark:bg-red-500/5' : ''}`}
 />
 {errors.subject && (
 <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 font-medium">
 <AlertCircle className="w-3.5 h-3.5" />
 {errors.subject}
 </p>
 )}
 </div>

 {/* Body */}
 <div className="flex-1 flex flex-col min-h-[250px]">
 <label
 htmlFor="modal-email-body"
 className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider"
 >
 <Mail className="w-4 h-4 text-slate-500" />
 Email Message
 </label>
 <textarea
 id="modal-email-body"
 value={body}
 onChange={(e) => {
 setBody(e.target.value);
 updateDraft(leadKey, { body: e.target.value });
 if (errors.body) {
 setErrors((prev) => {
 const n = { ...prev };
 delete n.body;
 return n;
 });
 }
 }}
 placeholder="Compose your message..."
 className={`w-full flex-1 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition resize-none leading-relaxed
 ${errors.body ? '!border-red-500/50 focus:ring-red-500/50 bg-red-50 dark:bg-red-500/5' : ''}`}
 />
 {errors.body && (
 <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 font-medium">
 <AlertCircle className="w-3.5 h-3.5" />
 {errors.body}
 </p>
 )}
 </div>

 {/* Attachments */}
 <div className="bg-slate-100 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 rounded-xl p-4">
 <div className="flex items-center justify-between mb-3">
 <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
 <Paperclip className="w-4 h-4 text-slate-500" />
 Attachments
 </span>
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 flex items-center gap-1.5 uppercase tracking-wider transition-colors"
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
 className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-200"
 >
 <Paperclip className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
 <span className="max-w-[160px] truncate font-medium">
 {file.name}
 </span>
 <span className="text-xs text-slate-500">
 {formatFileSize(file.size)}
 </span>
 <button
 type="button"
 onClick={() => handleRemoveAttachment(file.id)}
 className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
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

 {/* Footer */}
 <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 px-6 py-5 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50">
 <button
 onClick={onClose}
 disabled={sending}
 className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition duration-150 border border-slate-200 dark:border-slate-700/50 dark:hover:border-slate-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
 >
 Close
 </button>
 <div className="flex gap-3 sm:ml-auto">
 <button
 onClick={handleGenerate}
 disabled={loading || sending}
 className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition duration-150 border border-slate-200 dark:border-slate-700/50 dark:hover:border-slate-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <RefreshCw
 className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`}
 />
 Regenerate
 </button>
 <button
 onClick={handleSend}
 disabled={loading || sending || !recipient.trim() || !subject.trim() || !body.trim()}
 className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-brand-600 hover:bg-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400 text-white dark:text-slate-950 rounded-xl font-semibold transition duration-150 shadow-[0_0_20px_rgba(20,241,149,0.3)] hover:shadow-[0_0_25px_rgba(20,241,149,0.5)] border border-brand-500 dark:border-brand-400/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {sending ? (
 <>
 <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
 Sending...
 </>
 ) : (
 <>
 <Send className="w-4 h-4" />
 Send Email
 </>
 )}
 </button>
 </div>
 </div>
 </>)}
 </div>
 </div>,
 document.body
 );
}
