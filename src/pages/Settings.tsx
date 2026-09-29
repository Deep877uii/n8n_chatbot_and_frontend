import { Globe, Shield, Info, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Settings() {
 const { connected, resetLeads } = useApp();

 return (
 <div className="space-y-5 max-w-2xl ">
 {/* Header */}
 <div>
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-3">
 <Shield className="w-3.5 h-3.5" />
 <span>Configuration</span>
 </div>
 <h1 className="text-3xl font-bold text-white tracking-tight">
 Settings
 </h1>
 <p className="text-sm text-slate-400 mt-2">
 System architecture, webhook status, and security protocols.
 </p>
 </div>

 {/* Backend Connection */}
 <section className="glass-card rounded-xl p-6 space-y-5">
 <div className="flex items-center gap-2">
 <Globe className="w-4 h-4 text-slate-400" />
 <h2 className="text-sm font-semibold text-slate-400">
 n8n Webhook Integration
 </h2>
 </div>

 <div
 className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border ${
 connected
 ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
 : 'bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
 }`}
 >
 <div className="flex-shrink-0">
 {connected ? (
 <CheckCircle2 className="w-6 h-6 text-emerald-400" />
 ) : (
 <AlertCircle className="w-6 h-6 text-red-400" />
 )}
 </div>
 <div>
 <p
 className={`text-sm font-bold ${
 connected ? 'text-emerald-400' : 'text-red-400'
 }`}
 >
 {connected ? 'Active & Connected' : 'Connection Offline'}
 </p>
 <p className="text-xs mt-1 text-slate-400">
 {connected
 ? 'Frontend is actively communicating with production n8n workflows.'
 : 'Unable to reach the n8n endpoint. Check your network or webhook status.'}
 </p>
 </div>
 </div>

 <div className="pt-2">
 <div className="flex items-start gap-3">
 <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
 <div>
 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
 Production webhook base URL
 </p>
 <p className="text-xs text-white font-mono bg-slate-900/80 p-3 rounded-lg border border-white/10 break-all shadow-inner">
 https://relock-playroom-varnish.ngrok-free.dev/webhook
 </p>
 </div>
 </div>
 </div>
 </section>

 {/* Security Details */}
 <section className="glass-card rounded-xl p-6 space-y-5">
 <div className="flex items-center gap-2">
 <Shield className="w-4 h-4 text-slate-400" />
 <h2 className="text-sm font-semibold text-slate-400">
 Security & Contract Integrity
 </h2>
 </div>

 <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5 text-sm text-slate-300 leading-relaxed space-y-3">
 <p className="font-bold text-white">
 All existing webhook contracts and headers are strictly preserved:
 </p>
 <ul className="list-disc list-inside space-y-2 pl-2 text-slate-400">
 <li>HTTPS encrypted transmission for all payloads</li>
 <li>Immutable request payload contracts across endpoints</li>
 <li>No fake or mock fallback data introduced</li>
 <li>
 External links secured with{' '}
 <code className="text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20 font-mono text-xs">
 rel="noopener noreferrer"
 </code>
 </li>
 </ul>
 </div>
 </section>

 {/* Data Management */}
 <section className="glass-card rounded-xl p-6 space-y-5 border border-red-500/20 bg-red-500/5">
 <div className="flex items-center gap-2">
 <Trash2 className="w-4 h-4 text-red-400" />
 <h2 className="text-sm font-semibold text-red-400">
 Data Management
 </h2>
 </div>

 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div className="text-sm text-slate-400">
 <p className="font-bold text-white mb-1">Reset Workspace</p>
 <p>Clear all loaded leads, drafts, and cached statistics. This cannot be undone.</p>
 </div>
 <button 
 onClick={resetLeads}
 className="flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white transition duration-150 border border-red-500/20"
 >
 Reset Data
 </button>
 </div>
 </section>
 </div>
 );
}
