import { useState, useMemo } from 'react';
import {
 Sparkles,
 ArrowUpRight,
 Radar,
 TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
 AreaChart,
 Area,
 XAxis,
 Tooltip,
 ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';
import DashboardStats from '../components/DashboardStats';
import LeadDetails from '../components/LeadDetails';
import EmailComposer from '../components/EmailComposer';
import type { Lead } from '../types/lead';

export default function Dashboard() {
 const { leads, emailDraft } = useApp();
 const navigate = useNavigate();
 const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
 const [composerLead, setComposerLead] = useState<Lead | null>(null);

 // Leads-per-month chart data
 const chartData = useMemo(() => {
 const now = new Date();
 const months: { name: string; leads: number }[] = [];
 for (let i = 5; i >= 0; i--) {
 const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
 const monthName = d.toLocaleDateString('en', { month: 'short', day: '2-digit' });
 const count = leads.filter((l) => {
 if (!l.postedAt) return false;
 const ld = new Date(l.postedAt);
 return (
 ld.getFullYear() === d.getFullYear() &&
 ld.getMonth() === d.getMonth()
 );
 }).length;
 months.push({ name: monthName, leads: count });
 }
 return months;
 }, [leads]);

 return (
 <div className="space-y-8 ">
 {/* Header */}
 <div className="flex flex-wrap items-end justify-between gap-5 mb-4">
 <div>
 <p className="text-sm font-semibold text-brand-400 mb-2 uppercase tracking-widest">
 Overview
 </p>
 <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
 Dashboard
 </h1>
 <p className="mt-2 mb-0 text-base text-slate-600 dark:text-slate-400">
 Your AI-powered lead generation command center
 </p>
 </div>
 <button
 onClick={() => navigate('/find-leads')}
 className="bg-brand-500 hover:bg-brand-400 text-white rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition hover:scale-105 active:scale-95"
 >
 <Sparkles className="w-4 h-4" />
 Find New Leads
 </button>
 </div>

 {/* KPI Stats */}
 <DashboardStats />

 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
 {/* Scraper Status Card */}
 <section className="glass-card p-6 rounded-[24px]">
 <div className="flex justify-between gap-3">
 <div>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
 AI Scraper
 </p>
 <h2 className="text-lg font-bold text-slate-900 dark:text-white m-0">
 Lead Discovery Engine
 </h2>
 </div>
 <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-2 h-fit ${leads.length > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-brand-50 text-brand-600 border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20'}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${leads.length > 0 ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-brand-500 dark:bg-brand-400'}`} />
 {leads.length > 0 ? 'Active' : 'Idle'}
 </span>
 </div>

 <div className="mt-8 flex items-center gap-5">
 <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 grid place-items-center text-brand-500 dark:text-brand-400 shadow-inner">
 <Radar className="w-8 h-8" />
 </div>
 <div>
 <p className="font-bold text-base text-slate-900 dark:text-white m-0">
 LinkedIn hiring signal scan
 </p>
 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-0">
 {leads.length > 0 ? `${leads.length} leads discovered` : 'Ready for your first scan'}
 </p>
 </div>
 </div>

 {leads.length > 0 && (
 <div className="mt-8">
 <div className="flex justify-between text-sm mb-3">
 <span className="text-slate-500 dark:text-slate-400 font-medium">Pipeline utilization</span>
 <span className="font-bold text-brand-600 dark:text-brand-300">
 {Math.min(Math.round((leads.length / 100) * 100), 100)}%
 </span>
 </div>
 <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700/50">
 <div
 className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-400 transition duration-150 ease-out"
 style={{ width: `${Math.min(Math.round((leads.length / 100) * 100), 100)}%` }}
 />
 </div>
 </div>
 )}

 <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/60 flex justify-between items-center group cursor-pointer" onClick={() => navigate('/find-leads')}>
 <div>
 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider m-0">
 Quick action
 </p>
 <button className="text-sm font-bold mt-1 mb-0 text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
 Find New Leads
 </button>
 </div>
 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 grid place-items-center text-slate-500 dark:text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400 group-hover:border-brand-300 dark:group-hover:border-brand-500/30 transition">
 <ArrowUpRight className="w-4 h-4" />
 </div>
 </div>
 </section>
 </div>

 {/* Leads Trend Chart */}
 {leads.length > 0 && (
 <section className="glass-card p-6 rounded-[24px]">
 <div className="flex justify-between items-start mb-6">
 <div>
 <h2 className="text-lg font-bold text-slate-900 dark:text-white m-0">
 Lead Generation Trend
 </h2>
 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
 Leads discovered per month
 </p>
 </div>
 <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 flex items-center gap-2">
 <TrendingUp className="w-4 h-4" />
 {leads.length} total
 </span>
 </div>

 <div className="mt-4 h-64 w-full relative">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
 <defs>
 <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.4} />
 <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
 </linearGradient>
 </defs>
 <XAxis
 dataKey="name"
 stroke="#475569"
 fontSize={12}
 tickLine={false}
 axisLine={false}
 dy={10}
 />
 <Tooltip
 contentStyle={{
 background: 'rgba(30, 41, 59, 0.8)',
 backdropFilter: 'blur(12px)',
 border: '1px solid rgba(71, 85, 105, 0.5)',
 borderRadius: '12px',
 boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
 fontSize: '13px',
 color: '#f8fafc',
 }}
 itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
 />
 <Area
 type="monotone"
 dataKey="leads"
 stroke="#3b82f6"
 strokeWidth={4}
 fill="url(#areaFill)"
 activeDot={{ r: 6, strokeWidth: 0, fill: '#60a5fa' }}
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </section>
 )}

 {/* Lead Details Drawer */}
 {selectedLead && (
 <LeadDetails
 lead={selectedLead}
 onClose={() => setSelectedLead(null)}
 onGenerateMail={() => {
 setComposerLead(selectedLead);
 setSelectedLead(null);
 }}
 />
 )}

 {/* Email Composer Modal */}
 {composerLead && (
 <EmailComposer
 lead={composerLead}
 initialDraft={emailDraft}
 onClose={() => setComposerLead(null)}
 />
 )}
 </div>
 );
}

