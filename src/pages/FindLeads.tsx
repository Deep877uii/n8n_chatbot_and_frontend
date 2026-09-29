import { useState, useRef, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import ScrapingProgress from '../components/ScrapingProgress';
import { startScraper } from '../api/n8n';
import { useApp } from '../context/AppContext';
import type { ScraperRequest } from '../types/lead';

export default function FindLeads() {
 const { refreshLeads, addToast } = useApp();
 const navigate = useNavigate();
 const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

 useEffect(() => {
 return () => {
 if (pollTimerRef.current) clearInterval(pollTimerRef.current);
 };
 }, []);

 const startPolling = useCallback(() => {
 if (pollTimerRef.current) clearInterval(pollTimerRef.current);
 let polls = 0;
 pollTimerRef.current = setInterval(async () => {
 polls++;
 console.log(`[FindLeads] Polling for new leads... (${polls}/6)`);
 await refreshLeads();
 if (polls >= 6) {
 if (pollTimerRef.current) clearInterval(pollTimerRef.current);
 pollTimerRef.current = null;
 }
 }, 5000);
 }, [refreshLeads]);

 const [scraping, setScraping] = useState(false);
 const [result, setResult] = useState<{
 success: boolean;
 message: string;
 count?: number;
 } | null>(null);

 const handleSearch = async (params: ScraperRequest) => {
 setScraping(true);
 setResult(null);

 try {
 const response = await startScraper(params);

 if (response.success) {
 const isAsync = response.leadsProcessed === undefined;
 setResult({
 success: true,
 message:
 response.message ||
 (isAsync
 ? 'Scraping triggered! New leads will appear shortly.'
 : 'Lead scraping completed successfully.'),
 count: response.leadsProcessed,
 });
 addToast(
 'success',
 isAsync
 ? 'Scraping triggered! Checking for new leads...'
 : `Lead scraping completed. ${response.leadsProcessed || 0} leads found.`
 );
 await refreshLeads();
 if (isAsync) {
 startPolling();
 }
 } else {
 setResult({
 success: false,
 message:
 response.error ||
 'Failed to scrape leads. Please try again later.',
 });
 addToast(
 'error',
 response.error || 'Failed to scrape leads. Please try again later.'
 );
 }
 } catch (err) {
 const message =
 err instanceof Error
 ? err.message
 : 'Failed to scrape leads. Please try again later.';
 setResult({ success: false, message });
 addToast('error', message);
 } finally {
 setScraping(false);
 }
 };

 return (
 <div className="space-y-6 max-w-5xl mx-auto pt-3 ">
 {/* Header */}
 <div className="text-center mb-10">
 <p className="text-sm font-semibold text-brand-500 dark:text-brand-400 mb-2 uppercase tracking-widest">
 AI-powered discovery
 </p>
 <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
 Find New Leads
 </h1>
 <p className="text-base text-slate-600 dark:text-slate-400 mt-3 max-w-md mx-auto">
 Discover hiring opportunities and turn them into qualified outreach prospects with AI.
 </p>
 </div>

 {/* Search Form */}
 <SearchForm onSubmit={handleSearch} isLoading={scraping} />

 {/* Scraping Progress */}
 {scraping && (
 <div className="mt-8 ">
 <ScrapingProgress isActive={scraping} />
 </div>
 )}

 {/* Result Card */}
 {result && !scraping && (
 <div
 className={`glass-card p-6 flex items-start justify-between gap-4 rounded-[24px] ${
 result.success
 ? 'border-l-4 border-l-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
 : 'border-l-4 border-l-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
 }`}
 >
 <div className="flex items-start gap-4">
 {result.success ? (
 <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center flex-shrink-0">
 <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
 </div>
 ) : (
 <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center flex-shrink-0">
 <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
 </div>
 )}
 <div className="pt-1">
 <p
 className={`text-base font-bold ${
 result.success ? 'text-slate-900 dark:text-white' : 'text-red-600 dark:text-red-400'
 }`}
 >
 {result.message}
 </p>
 {result.success && result.count !== undefined && (
 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
 {result.count} new lead{result.count !== 1 ? 's' : ''} retrieved.
 </p>
 )}
 </div>
 </div>

 {result.success && (
 <button
 type="button"
 onClick={() => navigate('/leads')}
 className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 flex items-center gap-2 px-5 py-2.5 text-sm font-bold flex-shrink-0 rounded-xl transition shadow-sm"
 >
 <span>View Leads</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 )}
 </div>
 )}
 </div>
 );
}
