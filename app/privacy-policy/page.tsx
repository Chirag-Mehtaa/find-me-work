'use client'; // Client component zaroori hai animations ke liye

import React from "react";
import Navbar from '@/components/Navbar'; 
import { Shield, Lock, Eye, Server, Mail, FileText, CheckCircle2, ExternalLink } from "lucide-react";

export default function PrivacyPolicyPage() {
  // आज की तारीख या डायनामिक डेट
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      {/* 🔥 CUSTOM ANIMATION STYLES (Ye naya code hai) */}
      <style jsx global>{`
        @keyframes soothePop {
          0% { opacity: 0; transform: scale(0.95) translateY(30px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-soothe {
          opacity: 0; /* Initially hidden */
          animation: soothePop 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] transition-colors duration-300 overflow-hidden relative font-sans selection:bg-teal-500/30 selection:text-teal-900 dark:selection:text-teal-100">
          
          <Navbar />
          
        {/* 🔥 AMBIENT BACKGROUND BLOBS */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-multiply dark:mix-blend-soft-light animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-multiply dark:mix-blend-soft-light animate-pulse-slow animation-delay-2000"></div>

        {/* --- MAIN CONTAINER --- */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-10">
          
          {/* 🔥 HERO SECTION (First Pop) */}
          <div className="text-center mb-16 animate-soothe">
              <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-white/5 rounded-2xl shadow-xl shadow-teal-500/10 dark:shadow-teal-500/5 border border-gray-100 dark:border-white/10 mb-6 backdrop-blur-md">
                  <Shield size={40} className="text-teal-600 dark:text-teal-400" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                  We Value Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-300">Privacy</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Transparency is key. This document explains in plain English how we handle your data at FindMeWork.
              </p>
              <div className="inline-block mt-6 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 text-sm font-bold border border-teal-100 dark:border-teal-800/50">
                  Last Updated: {lastUpdated}
              </div>
          </div>

          {/* 🔥 CONTENT CARDS (Second Pop - Delayed) */}
          <div className="space-y-8 animate-soothe delay-200">

              {/* Introduction Card */}
              <SectionCard 
                  icon={<FileText size={24} />} 
                  title="Introduction"
              >
                  <p>
                      Welcome to **FindMeWork**. We are committed to protecting your personal information and your right to privacy. When you visit our website and use our services, you trust us with your personal information. We take that trust seriously.
                  </p>
              </SectionCard>

              {/* Section 1: What we collect */}
              <SectionCard 
                  icon={<Eye size={24} />} 
                  title="1. Information We Collect"
              >
                  <p className="mb-4">We collect minimal information necessary to provide you with the best job-finding experience.</p>
                  <ul className="space-y-4">
                      <ListItem title="Account Data">
                          When you sign up (e.g., via Google), we store basic profile info like your name, email address, and profile picture.
                      </ListItem>
                      <ListItem title="Usage Data">
                          We automatically collect anonymous info about how you navigate our site (pages visited, time spent) to improve our platform.
                      </ListItem>
                      <ListItem title="Cookies & Technologies">
                          We use cookies to maintain your logged-in session and remember your preferences. You can control these via your browser settings.
                      </ListItem>
                  </ul>
              </SectionCard>

                {/* Section 2: How we use it */}
                <SectionCard 
                  icon={<Server size={24} />} 
                  title="2. How We Use Your Data"
              >
                  <p className="mb-4">We use your information strictly for legitimate business purposes:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CheckItem>To facilitate account creation and logon process.</CheckItem>
                      <CheckItem>To send you service-related administrative information.</CheckItem>
                      <CheckItem>To protect our services and prevent fraud.</CheckItem>
                      <CheckItem>To personalize the job feeds you see.</CheckItem>
                  </div>
              </SectionCard>

              {/* Section 3: Data Security */}
              <SectionCard 
                  icon={<Lock size={24} />} 
                  title="3. Data Security & Sharing"
              >
                    <p className="mb-6">
                      We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
                  </p>
                  <div className="p-6 bg-teal-50/50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800/50 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                      <h4 className="text-lg font-bold text-teal-800 dark:text-teal-200 flex items-center gap-2 mb-2">
                          <Shield size={20} className="inline"/> Our Promise
                      </h4>
                      <p className="text-teal-700 dark:text-teal-300 font-medium leading-relaxed">
                          We <strong>do not</strong> sell, trade, or rent your personal identification information to third parties for marketing purposes. Your data is yours.
                      </p>
                  </div>
              </SectionCard>

                {/* Section 4: Third Party Links */}
                <SectionCard 
                  icon={<ExternalLink size={24} />} 
                  title="4. Third-Party Websites"
              >
                    <p>
                      Our platform contains links to third-party websites (like LinkedIn or Twitter) to apply for jobs. Once you use these links to leave our site, any information you provide to these third parties is not covered by this Privacy Policy. We encourage you to review their privacy policies.
                  </p>
              </SectionCard>


              {/* 🔥 CONTACT SECTION (Third Pop - More Delayed) */}
              <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 text-center animate-soothe delay-300">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3 mb-4">
                      <Mail className="text-teal-500"/> Still have questions?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        If you have any questions or concerns about this Privacy Policy, please contact us.
                    </p>
                    <a href="mailto:support@findmework.com">
                      <button className="group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-500 dark:to-cyan-400 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all active:scale-95 overflow-hidden">
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                          <Mail size={18} className="mr-2"/> Contact Support
                      </button>
                    </a>
              </div>

                {/* Footer Note */}
              <div className="text-center mt-12 text-slate-500 dark:text-slate-400 text-sm font-medium animate-soothe delay-500">
                  &copy; {new Date().getFullYear()} FindMeWork. Built with trust.
              </div>

          </div>
        </main>
      </div>
    </>
  );
}

// ==========================================
// 👇 SUB-COMPONENTS (SAME AS BEFORE)
// ==========================================

function SectionCard({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
        <section className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-lg rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-gray-100 dark:border-white/5 transition-all hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <h2 className="flex items-center gap-4 text-2xl font-bold text-slate-900 dark:text-white mb-6 relative z-10">
                <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                    {icon}
                </div>
                {title}
            </h2>
            <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg space-y-4 relative z-10">
                {children}
            </div>
        </section>
    );
}

function ListItem({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <li className="flex gap-4 items-start">
            <div className="mt-1.5 p-1 bg-teal-100 dark:bg-teal-900/50 rounded-full shrink-0">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
            <div>
                <strong className="block text-slate-900 dark:text-white font-bold mb-1">{title}</strong>
                <span className="text-slate-600 dark:text-slate-400">{children}</span>
            </div>
        </li>
    );
}

function CheckItem({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
            <CheckCircle2 size={20} className="text-teal-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-200 font-medium">{children}</span>
        </div>
    );
}