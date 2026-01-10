'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; 
import { 
  ArrowLeft, MapPin, Share2, 
  Building2, Briefcase, Clock, CheckCircle, Bookmark 
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function JobDetailsPage() {
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
    if(!id) return;

    fetch(`/api/jobs/${id}`) 
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setJob(data.data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(err => {
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
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch(e) {
            return { success: false, data: [] };
        }
      })
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
           // Safe check
           const found = data.data.some((savedJob: any) => {
             const sId = savedJob._id || savedJob;
             return sId.toString() === id.toString();
           });
           setIsSaved(found);
        }
      })
      .catch(err => console.error("Bookmark check failed:", err));
  }, [id, session]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  // 🔥 3. HANDLE BOOKMARK (Updated with Full Data)
  const handleBookmark = async () => {
    if (!session) {
        alert("Please login to save jobs!");
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
                // 👇 YEH HAI MAIN FIX: Poora Data bhejna padega
                jobData: {
                    _id: id, 
                    job_title: job.job_title || "LinkedIn Job",
                    employer_name: job.employer_name || "Company",
                    employer_logo: job.employer_logo,
                    job_city: job.job_city || "Remote",
                    job_country: job.job_country || "N/A",
                    apply_link: job.apply_link || job.job_url || job.link,
                    description: job.text || job.job_description,
                    source: job.source || 'linkedin' // Explicitly mark as linkedin
                }
            })
        });
        
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Server HTML Error:", text);
            throw new Error("Server Error");
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

  // 4. Track Click
  const handleApplyClick = () => {
    fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id, type: 'click' })
    }).catch(err => console.error("Click track failed", err));
  };

  const applyUrl = job ? (job.link || job.apply_link || job.job_url || job.url || '#') : '#';

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F]">
      <Navbar />
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a66c2]"></div>
      </div>
    </div>
  );

  if (error || !job) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-400">Job Not Found 😕</h2>
      <button onClick={() => router.back()} className="mt-4 text-[#0a66c2] hover:underline">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0a66c2] mb-6 transition-colors font-medium">
          <ArrowLeft size={18} /> Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#112240] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden relative">
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-5 -mt-10 items-start">
                    <div className="w-20 h-20 rounded-xl bg-white dark:bg-[#0A192F] p-1 shadow-lg border border-gray-100 dark:border-white/5 flex items-center justify-center">
                      <img src={job.employer_logo || "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"} className="w-full h-full object-contain rounded-lg" onError={(e) => (e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png")} />
                    </div>
                    <div className="pt-2 sm:pt-12 flex-1">
                      <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">{job.job_title}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-gray-300">
                          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1"><Building2 size={14} className="text-[#0a66c2]"/> {job.employer_name}</span>
                          <span className="flex items-center gap-1"><MapPin size={14}/> {job.job_city || "Remote"}</span>
                          <span className="flex items-center gap-1"><Clock size={14}/> Posted recently</span>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#112240] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm p-8">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Briefcase className="text-[#0a66c2]" size={20} /> About the Job</h3>
               <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{job.text}</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-[#112240] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm p-6 sticky top-24">
               <h3 className="font-bold text-lg mb-4">Interested in this role?</h3>
               <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-gray-400">Apply via</span><span className="font-semibold text-slate-900 dark:text-white capitalize">{job.source}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-gray-400">Category</span><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{job.category}</span></div>
               </div>

               <a href={applyUrl} target="_blank" rel="noopener noreferrer" onClick={handleApplyClick} className="block w-full bg-[#0a66c2] hover:bg-blue-700 text-white text-center font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 mb-3 cursor-pointer">
                 Apply Now
               </a>
               
               <button onClick={handleBookmark} className={`flex items-center justify-center gap-2 w-full border font-bold py-3 rounded-xl transition-all duration-200 ${isSaved ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md" : "border-gray-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}>
                 {isSaved ? <Bookmark size={18} fill="currentColor" /> : <Bookmark size={18} />}
                 {isSaved ? "Saved to Bookmarks" : "Save this Job"}
               </button>
            </div>

            <div className="bg-slate-100 dark:bg-[#0A192F]/50 rounded-2xl p-6 border border-transparent dark:border-white/5 text-center">
              <p className="text-sm text-slate-500 mb-4">Know someone perfect for this?</p>
              <button onClick={handleCopyLink} className={`flex items-center justify-center gap-2 w-full border font-bold py-2 rounded-lg transition-all shadow-sm ${copied ? "bg-green-50 border-green-200 text-green-600" : "bg-white dark:bg-[#112240] border-gray-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:text-[#0a66c2] hover:border-[#0a66c2]"}`}>
                {copied ? <><CheckCircle size={16} /> Copied!</> : <><Share2 size={16} /> Copy Unique Link</>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}