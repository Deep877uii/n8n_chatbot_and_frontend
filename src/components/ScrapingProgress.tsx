import { useEffect, useState } from 'react';
import {
 Search,
 FileText,
 Filter,
 UserCheck,
 Database,
 Check,
 LoaderCircle,
} from 'lucide-react';

const steps = [
 { icon: Search, label: 'Searching LinkedIn', desc: 'Scanning hiring posts', delay: 0 },
 { icon: FileText, label: 'Extracting hiring posts', desc: 'Signals organized by role and company', delay: 2000 },
 { icon: Filter, label: 'Analyzing leads', desc: 'Qualification signals identified', delay: 4000 },
 { icon: UserCheck, label: 'Finding contact information', desc: 'Matching recruiters and work emails', delay: 6000 },
 { icon: Database, label: 'Generating lead profiles', desc: 'Building comprehensive profiles', delay: 8000 },
];

interface ScrapingProgressProps {
 isActive: boolean;
}

export default function ScrapingProgress({ isActive }: ScrapingProgressProps) {
 const [activeStep, setActiveStep] = useState(0);

 useEffect(() => {
 if (!isActive) return;

 const timers: ReturnType<typeof setTimeout>[] = [];

 steps.forEach((step, index) => {
 const timer = setTimeout(() => {
 setActiveStep(index);
 }, step.delay);
 timers.push(timer);
 });

 return () => {
 timers.forEach(clearTimeout);
 setActiveStep(0);
 };
 }, [isActive]);

 if (!isActive) return null;

 return (
 <section className="glass-card p-6 rounded-[24px]">
 <div className="flex justify-between items-center">
 <h2 className="font-bold text-base m-0 text-slate-900 dark:text-white">Search Progress</h2>
 <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-mono text-[10px] uppercase font-bold tracking-widest border border-brand-200 dark:border-brand-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)] animate-pulse">LIVE</span>
 </div>

 <div className="mt-8 ml-3 space-y-0 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
 {steps.map((step, index) => {
 const isCompleted = index < activeStep;
 const isCurrent = index === activeStep;
 const isPending = index > activeStep;

 return (
 <div
 key={step.label}
 className={`relative flex items-start gap-4 pb-8 last:pb-0 ${isCompleted ? 'opacity-100' : ''} ${
 isPending ? 'opacity-40' : ''
 }`}
 >
 <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
 isCompleted ? 'bg-emerald-500 text-white dark:text-slate-900 border-2 border-emerald-500' : 
 isCurrent ? 'bg-brand-500 text-white border-2 border-brand-500 shadow-brand-500/50' : 
 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-2 border-slate-200 dark:border-slate-700'
 }`}>
 {isCompleted ? (
 <Check className="w-3.5 h-3.5 font-bold" />
 ) : isCurrent ? (
 <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
 ) : (
 <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
 )}
 </div>
 <div className="pt-0.5">
 <p className={`text-sm font-bold mb-1 ${
 isCompleted ? 'text-emerald-600 dark:text-emerald-400' :
 isCurrent ? 'text-brand-600 dark:text-brand-400' :
 'text-slate-500 dark:text-slate-400'
 }`}>
 {step.label}
 </p>
 {!isPending && (
 <p className="text-xs text-slate-500 m-0">
 {step.desc}
 </p>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </section>
 );
}
