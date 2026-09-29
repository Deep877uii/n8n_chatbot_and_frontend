import { Users, UserCheck, Mail, Send, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const statConfig = [
 {
 key: 'totalLeads',
 label: 'Total Leads',
 icon: Users,
 change: null,
 changeNote: 'this month',
 },
 {
 key: 'availableLeads',
 label: 'Email Available',
 icon: UserCheck,
 change: null,
 changeNote: 'leads with email',
 },
 {
 key: 'emailsGenerated',
 label: 'AI Drafts',
 icon: Mail,
 change: null,
 changeNote: 'personalized emails',
 },
 {
 key: 'emailsSent',
 label: 'Emails Sent',
 icon: Send,
 change: null,
 changeNote: 'dispatched',
 },
] as const;

function StatsSkeleton() {
 return (
 <div className="flex flex-col xl:flex-row gap-5">
 <div className="glass-card flex-1 min-w-[300px] p-6 rounded-[24px]">
 <div className="flex items-center justify-between mb-4">
 <div className="animate-pulse bg-slate-200 dark:bg-slate-800 h-3.5 w-24 rounded-md" />
 <div className="animate-pulse bg-slate-200 dark:bg-slate-800 w-10 h-10 rounded-xl" />
 </div>
 <div className="animate-pulse bg-slate-200 dark:bg-slate-800 h-14 w-32 rounded-lg" />
 <div className="animate-pulse bg-slate-200 dark:bg-slate-800 h-3 w-40 mt-6 rounded-md" />
 </div>
 <div className="glass-card flex-1 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800/60 rounded-[24px]">
 {Array.from({ length: 3 }).map((_, i) => (
 <div key={i} className="p-6 flex flex-col justify-center">
 <div className="animate-pulse bg-slate-200 dark:bg-slate-800 h-3 w-20 mb-3 rounded-md" />
 <div className="animate-pulse bg-slate-200 dark:bg-slate-800 h-8 w-16 mb-3 rounded-lg" />
 <div className="animate-pulse bg-slate-200 dark:bg-slate-800 h-2 w-24 rounded-md" />
 </div>
 ))}
 </div>
 </div>
 );
}

export default function DashboardStats() {
 const { leads, leadsLoading, emailsGenerated, emailsSent, connected } = useApp();

 if (leadsLoading) {
 return <StatsSkeleton />;
 }

 const values: Record<string, number> = {
 totalLeads: leads.length,
 availableLeads: leads.filter((l) => l.email && l.email.trim()).length,
 emailsGenerated,
 emailsSent,
 };

 const heroStat = statConfig[0];
 const stripStats = statConfig.slice(1);

 return (
 <div className="flex flex-col xl:flex-row gap-5">
 {/* Hero Stat */}
 <article className="glass-card flex-1 min-w-[300px] p-6 rounded-[24px] relative overflow-hidden group">
 {/* Fancy Background blob */}
 <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-500/10 rounded-full group-hover:bg-brand-500/20 transition-colors" />

 <div className="flex items-center justify-between mb-4 relative z-10">
 <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
 {heroStat.label}
 </p>
 <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 dark:bg-brand-500/20 dark:border-brand-500/30 grid place-items-center dark:text-brand-400 shadow-lg shadow-brand-500/10">
 <heroStat.icon className="w-5 h-5" />
 </div>
 </div>

 <p className="font-heading text-6xl leading-none font-bold text-slate-900 dark:text-white relative z-10">
 {values[heroStat.key].toLocaleString()}
 </p>

 <p className="text-sm mt-6 font-medium relative z-10">
 {heroStat.change ? (
 <>
 <span className="text-emerald-400 inline-flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-md">
 <TrendingUp className="w-3.5 h-3.5" />
 {heroStat.change}
 </span>
 <span className="text-slate-500 ml-2">{heroStat.changeNote}</span>
 </>
 ) : (
 <span className="text-slate-500">{heroStat.changeNote}</span>
 )}
 {connected && (
 <span className="inline-flex items-center gap-1.5 text-emerald-400 ml-3 bg-emerald-400/10 px-2 py-0.5 rounded-md text-xs">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
 Live
 </span>
 )}
 </p>
 </article>

 {/* Inline Strip */}
 <div className="glass-card flex-1 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800/60 rounded-[24px]">
 {stripStats.map(({ key, label, icon: Icon, changeNote }) => (
 <div key={key} className="p-6 flex flex-col justify-center hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors group">
 <div className="flex items-center gap-2 mb-3">
 <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors" />
 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
 {label}
 </p>
 </div>
 <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
 {values[key].toLocaleString()}
 </p>
 <p className="text-xs text-slate-500 mt-1.5 font-medium">
 {changeNote}
 </p>
 </div>
 ))}
 </div>
 </div>
 );
}

