'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  User, Mail, Bookmark, Trash2, 
  MapPin, Building2, Loader2, ArrowRight, Home, Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. AUTH CHECK
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/'); 
    }
  }, [status, router]);

  // 🔥 2. FETCH SAVED JOBS
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch('/api/bookmarks'); 
        const text = await res.text();
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Invalid JSON response", e);
            return;
        }

        if (data.success && Array.isArray(data.data)) {
            const validJobs = data.data.filter((j: any) => j && (j._id || j.job_id));
            setSavedJobs(validJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs from DB:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
        fetchBookmarks();
    }
  }, [status]);

  // 🔥 3. REMOVE BOOKMARK
  const removeBookmark = async (e: React.MouseEvent, idToDelete: string) => {
    e.preventDefault(); 
    e.stopPropagation(); // 👈 Ye zaroori hai taaki card click trigger na ho

    const previousJobs = [...savedJobs];
    setSavedJobs((prev) => prev.filter((job) => {
        const jId = job._id || job.job_id || job;
        return jId.toString() !== idToDelete.toString();
    }));

    try {
        const res = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobId: idToDelete })
        });

        if (!res.ok) {
            throw new Error("Failed to delete from server");
        }
    } catch (err) {
        console.error("Delete failed, reverting UI:", err);
        setSavedJobs(previousJobs);
        alert("Failed to delete job. Please check your connection.");
    }
  };

  if (status === 'loading') {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] flex items-center justify-center">
            <Loader2 className="animate-spin text-teal-500" size={40} />
        </div>
    );
  }

  if (!session) return null; 

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans transition-colors duration-300 pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* BACK BUTTON */}
        <div className="mb-8">
            <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
            >
                <div className="p-2 bg-white dark:bg-[#112240] rounded-full border border-gray-200 dark:border-white/5 shadow-sm">
                    <Home size={18} />
                </div>
                Back to Home
            </Link>
        </div>

        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">User Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Welcome back, {session.user?.name?.split(' ')[0]}! Here is your activity.</p>
            </div>
            <div className="hidden md:block">
                 <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-bold border border-teal-100 dark:border-teal-800/30">
                    <Calendar size={16}/> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                 </span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* PROFILE CARD */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-[#112240] rounded-3xl p-8 border border-gray-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-black/20 sticky top-24">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-6 group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative w-28 h-28 rounded-full p-1 bg-white dark:bg-[#112240]">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[#0A192F] flex items-center justify-center text-teal-600">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold">{session.user?.name}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-1">
                            <Mail size={14}/> {session.user?.email}
                        </p>
                        <div className="w-full bg-slate-50 dark:bg-[#0A192F] rounded-xl p-4 grid grid-cols-2 gap-4 border border-gray-100 dark:border-white/5">
                             <div className="text-center">
                                 <span className="block text-2xl font-extrabold text-teal-600 dark:text-teal-400">{savedJobs.length}</span>
                                 <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Saved</span>
                             </div>
                             <div className="text-center border-l border-gray-200 dark:border-white/10">
                                 <span className="block text-2xl font-extrabold text-purple-600 dark:text-purple-400">Pro</span>
                                 <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Status</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SAVED JOBS LIST */}
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Bookmark className="text-teal-500 fill-teal-500" size={20} /> Saved Opportunities
                    </h3>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-[#112240] px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/5">
                        {savedJobs.length} Items
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-teal-500" size={30} />
                    </div>
                ) : savedJobs.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <AnimatePresence mode="popLayout">
                            {savedJobs.map((job, index) => {
                                const jobId = job._id || job.job_id || `job-${index}`;
                                // 🔥 Logic to determine URL
                                const jobUrl = job.source === 'twitter' ? `/twitter-jobs/${jobId}` : `/linkedin-jobs/${jobId}`;
                                
                                return (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    key={jobId}
                                    // 🔥 CLICK HANDLER HERE
                                    onClick={() => router.push(jobUrl)}
                                    className="group relative bg-white dark:bg-[#112240] p-5 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all shadow-sm hover:shadow-lg overflow-hidden cursor-pointer"
                                >
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-[#0A192F] p-2 flex items-center justify-center border border-gray-100 dark:border-white/5 shrink-0">
                                            <img 
                                                src={job.employer_logo || "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"} 
                                                className="w-full h-full object-contain"
                                                onError={(e) => (e.currentTarget.src = "/fallback-job.png")}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-lg text-slate-900 dark:text-white truncate pr-2">
                                                    {job.job_title || "Unknown Title"}
                                                </h4>
                                                {/* Delete Button */}
                                                <button 
                                                    onClick={(e) => removeBookmark(e, jobId)}
                                                    className="p-2 -mt-2 -mr-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors z-20 cursor-pointer"
                                                    title="Remove from saved"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300"><Building2 size={14}/> {job.employer_name || "Company"}</span>
                                                <span className="flex items-center gap-1"><MapPin size={14}/> {job.job_city || "Remote"}</span>
                                            </div>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                                    job.source === 'twitter' 
                                                    ? 'bg-black/5 text-black border-black/10 dark:bg-white/10 dark:text-white dark:border-white/20' 
                                                    : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                                }`}>
                                                    {job.source || 'LinkedIn'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Link tag removed, handled by onClick on motion.div */}
                                </motion.div>
                            )})}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#112240] rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Bookmark size={30} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Saved Jobs Yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">
                            Start exploring jobs and bookmark the ones you like to see them here.
                        </p>
                        <Link href="/linkedin-jobs" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-teal-500/30">
                            Browse Jobs <ArrowRight size={18}/>
                        </Link>
                    </div>
                )}
            </div>

        </div>
      </main>
    </div>
  );
}