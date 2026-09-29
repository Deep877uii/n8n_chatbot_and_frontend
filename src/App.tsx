import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FindLeads = lazy(() => import('./pages/FindLeads'));
const Leads = lazy(() => import('./pages/Leads'));
const Outreach = lazy(() => import('./pages/Outreach'));
const SentLeads = lazy(() => import('./pages/SentLeads'));
const Settings = lazy(() => import('./pages/Settings'));



const PageLoader = () => {
 const [show, setShow] = useState(false);

 useEffect(() => {
 // Prevent harsh flickering on fast route changes by delaying the loader
 const timer = setTimeout(() => setShow(true), 150);
 return () => clearTimeout(timer);
 }, []);

 if (!show) return <div className="flex-1 min-h-[50vh]" />;

 return (
 <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[50vh] ">
 <div className="relative w-12 h-12">
 <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
 <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
 </div>
 <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Loading content...</p>
 </div>
 );
};

export default function App() {
 return (
 <BrowserRouter>
 <AppProvider>
 <Routes>
 <Route element={<Layout />}>
 <Route path="/" element={
 <Suspense fallback={<PageLoader />}>
 <Dashboard />
 </Suspense>
 } />
 <Route path="/find-leads" element={
 <Suspense fallback={<PageLoader />}>
 <FindLeads />
 </Suspense>
 } />
 <Route path="/leads" element={
 <Suspense fallback={<PageLoader />}>
 <Leads />
 </Suspense>
 } />
 <Route path="/outreach" element={
 <Suspense fallback={<PageLoader />}>
 <Outreach />
 </Suspense>
 } />
 <Route path="/sent-leads" element={
 <Suspense fallback={<PageLoader />}>
 <SentLeads />
 </Suspense>
 } />
 <Route path="/settings" element={
 <Suspense fallback={<PageLoader />}>
 <Settings />
 </Suspense>
 } />
 </Route>
 </Routes>
 </AppProvider>
 </BrowserRouter>
 );
}
