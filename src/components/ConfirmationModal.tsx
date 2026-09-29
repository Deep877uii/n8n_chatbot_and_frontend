import { useEffect, useRef } from 'react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
 isOpen: boolean;
 title: string;
 description: string;
 confirmLabel?: string;
 cancelLabel?: string;
 variant?: 'danger' | 'primary' | 'success';
 onConfirm: () => void;
 onCancel: () => void;
 loading?: boolean;
}

export default function ConfirmationModal({
 isOpen,
 title,
 description,
 confirmLabel = 'Confirm',
 cancelLabel = 'Cancel',
 variant = 'primary',
 onConfirm,
 onCancel,
 loading = false,
}: ConfirmationModalProps) {
 const overlayRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handleEsc = (e: KeyboardEvent) => {
 if (e.key === 'Escape' && !loading) onCancel();
 };
 if (isOpen) {
 document.addEventListener('keydown', handleEsc);
 document.body.style.overflow = 'hidden';
 }
 return () => {
 document.removeEventListener('keydown', handleEsc);
 document.body.style.overflow = '';
 };
 }, [isOpen, onCancel, loading]);

 if (!isOpen) return null;

 const variantStyles = {
 danger: {
 btn: 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)] border border-red-500/20',
 iconBg: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20',
 icon: AlertTriangle,
 },
 primary: {
 btn: 'bg-brand-500 text-white dark:text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,241,149,0.3)]',
 iconBg: 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-500/20',
 icon: AlertCircle,
 },
 success: {
 btn: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-500/20',
 iconBg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
 icon: AlertCircle,
 },
 }[variant];

 const IconComponent = variantStyles.icon;

 return (
 <div
 ref={overlayRef}
 className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 "
 onClick={(e) => {
 if (e.target === overlayRef.current && !loading) onCancel();
 }}
 role="dialog"
 aria-modal="true"
 aria-labelledby="confirm-title"
 >
 <div className="glass-card border border-slate-200 dark:border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl bg-white dark:bg-transparent">
 <div className="flex items-start justify-between gap-4 mb-4">
 <div className="flex items-center gap-3">
 <div
 className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${variantStyles.iconBg}`}
 >
 <IconComponent className="w-5 h-5" />
 </div>
 <h3
 id="confirm-title"
 className="text-base font-bold text-slate-900 dark:text-white tracking-tight"
 >
 {title}
 </h3>
 </div>
 <button
 onClick={onCancel}
 disabled={loading}
 className="p-1.5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
 aria-label="Close"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
 {description}
 </p>

 <div className="flex items-center justify-end gap-2.5">
 <button
 type="button"
 onClick={onCancel}
 disabled={loading}
 className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-white border border-slate-300 dark:border-slate-700/50 dark:hover:border-slate-600 transition duration-150"
 >
 {cancelLabel}
 </button>
 <button
 type="button"
 onClick={onConfirm}
 disabled={loading}
 className={`px-5 py-2 rounded-xl text-sm font-bold transition duration-150 inline-flex items-center gap-2 ${variantStyles.btn} disabled:opacity-50`}
 >
 {loading && (
 <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
 )}
 {confirmLabel}
 </button>
 </div>
 </div>
 </div>
 );
}
