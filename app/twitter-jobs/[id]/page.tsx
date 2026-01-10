'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; 
import { 
  ArrowLeft, MapPin, Share2, 
  Briefcase, Clock, CheckCircle, Twitter, Bookmark 
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function TwitterJobDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession(); 

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [isSaved, setIsSaved] = useState(false);

  // 1. Fetch Job & Track View
  useEffect(() => {
    if (!id) return;

    fetch(`/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJob(data.data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });

    // Track View
    fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id, type: 'view' })
    }).catch(err => console.error("View track failed", err));

  }, [id]);

  // 2. CHECK BOOKMARK STATUS
  useEffect(() => {
    if (!id || !session) return;

    fetch('/api/bookmarks')
      .then(async (res) => {
         const contentType = res.headers.get("content-type");
         if (!contentType || !contentType.includes("application/json")) {
             return { success: false, data: [] };
         }
         return res.json();
      })
      .then((data) => {
         if (data.success && Array.isArray(data.data)) {
            const found = data.data.some((savedJob: any) => 
               (savedJob._id || savedJob).toString() === id.toString()
            );
            setIsSaved(found);
         }
      })
      .catch(err => console.error("Bookmark check failed", err));
  }, [id, session]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 🔥 3. HANDLE BOOKMARK (Duplicate Key Error Fixed)
  const handleBookmark = async () => {
    if (!session) {
        alert("Please login to save tweets!");
        return;
    }

    const previousState = isSaved;
    setIsSaved(!isSaved); // Optimistic Update

    try {
        const res = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                jobId: id,
                // 👇 UPDATED: Added job_id to satisfy old index
                jobData: {
                    _id: id,
                    job_id: id, // 🔥 CRITICAL FIX: Duplicate key error bachane ke liye
                    job_title: job.job_title || "Twitter Thread",
                    employer_name: job.employer_name || "Twitter User",
                    employer_logo: job.employer_logo,
                    job_city: "Remote",
                    job_country: "Global",
                    apply_link: job.link || job.url,
                    description: job.text,
                    source: 'twitter'
                }
            })
        });

        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error("Server Error (Invalid JSON)");
        }

        if (!res.ok) {
            throw new Error(data.message || "Server Error");
        }

        console.log("Bookmark Success:", data.message);

    } catch (err: any) {
        console.error("Bookmark failed:", err);
        setIsSaved(previousState); // Revert UI
        alert(err.message);
    }
  };

  const handleApplyClick = () => {
    fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id, type: 'click' })
    }).catch(err => console.error("Click track failed", err));
  };

  const applyUrl = job ? (job.link || job.apply_link || job.job_url || job.url || '#') : '#';

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F]">
      <Navbar />
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a66c2]"></div>
      </div>
    </div>
  );

  if (error || !job) return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-400">Tweet Not Found</h2>
      <button onClick={() => router.back()} className="mt-4 text-[#0a66c2] hover:underline">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0a66c2] mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Back to Feed
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white dark:bg-[#112240] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden relative">
              <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-600"></div>
              
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-5 -mt-10 items-start">
                    <div className="w-20 h-20 rounded-xl bg-white p-1 shadow-lg border border-gray-100 dark:border-white/5 flex items-center justify-center">
                      <img 
                        src={job.employer_logo || "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"} 
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => (e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg")}
                      />
                    </div>
                    
                    <div className="pt-2 sm:pt-12 flex-1">
                      <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">{job.job_title}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-gray-300">
                          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                            <Twitter size={14} className="text-black dark:text-white"/> @{job.employer_name || "TwitterUser"}
                          </span>
                          <span className="flex items-center gap-1"><MapPin size={14}/> Remote / Global</span>
                          <span className="flex items-center gap-1"><Clock size={14}/> Posted recently</span>
                      </div>
                    </div>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-[#112240] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm p-8">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Briefcase className="text-slate-900 dark:text-white" size={20} /> Thread Content
               </h3>
               <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                 {job.text}
               </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN (Sticky Sidebar) --- */}
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-[#112240] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm p-6 sticky top-24">
               <h3 className="font-bold text-lg mb-4">Interested?</h3>
               
               <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-gray-400">Platform</span>
                    <span className="font-semibold text-slate-900 dark:text-white">X (Twitter)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-gray-400">Category</span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-slate-900 dark:text-white px-2 py-0.5 rounded text-xs font-bold">{job.category}</span>
                  </div>
               </div>

               {/* 🔥 OPEN THREAD BUTTON */}
               <a 
                 href={applyUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 onClick={handleApplyClick}
                 className="block w-full bg-black dark:bg-white text-white dark:text-black text-center font-bold py-3 rounded-xl transition-all shadow-lg hover:opacity-80 mb-3 cursor-pointer"
               >
                 Open Thread
               </a>
               
               {/* ✅ BOOKMARK BUTTON */}
               <button 
                onClick={handleBookmark}
                className={`flex items-center justify-center gap-2 w-full border font-bold py-3 rounded-xl transition-all duration-200 ${
                    isSaved 
                    ? "bg-slate-900 dark:bg-slate-700 text-white border-transparent shadow-md" 
                    : "border-gray-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
               >
                 {isSaved ? <Bookmark size={18} fill="currentColor" /> : <Bookmark size={18} />}
                 {isSaved ? "Saved to Bookmarks" : "Save Tweet"}
               </button>

            </div>

            <div className="bg-slate-100 dark:bg-[#112240]/50 rounded-2xl p-6 border border-transparent dark:border-white/5 text-center">
              <p className="text-sm text-slate-500 mb-4">Share this opportunity</p>
              
              <button 
                onClick={handleCopyLink}
                className={`flex items-center justify-center gap-2 w-full border font-bold py-2 rounded-lg transition-all shadow-sm ${
                    copied 
                    ? "bg-green-50 border-green-200 text-green-600" 
                    : "bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:border-black dark:hover:border-white"
                }`}
              >
                {copied ? (
                    <>
                        <CheckCircle size={16} /> Copied!
                    </>
                ) : (
                    <>
                        <Share2 size={16} /> Copy Unique Link
                    </>
                )}
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}