'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, CheckCircle2, Calendar, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';

export default function NoticePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans overflow-hidden">
      <Navbar />

      <main className="relative container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        
        {/* BACKGROUND EFFECTS */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        {/* HERO CARD */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            // 🔥 Removed 'transform-gpu' temporarily to see if software rendering handles the border better
            // Kept overflow-hidden to clip the ribbon corners
            className="relative bg-white/80 dark:bg-[#112240]/80 backdrop-blur-2xl rounded-3xl p-8 md:p-14 border border-amber-200 dark:border-amber-500/20 shadow-2xl shadow-amber-500/10 text-center overflow-hidden"
        >
            {/* 🔥 RIBBON FIX 3.0 (The Ultimate Fix) 
                1. Removed nested complex divs.
                2. Added 'shadow-[0_0_0_3px_#d97706]' (matches orange-600) to act as a border filler.
                3. Positioned absolutely with better alignment.
            */}
            <div className="absolute -top-12 -right-12 w-32 h-32 flex justify-center items-end rotate-45 pointer-events-none z-20">
                 <div className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-bold py-2 text-center uppercase tracking-widest shadow-[0_0_4px_rgba(234,88,12,0.5)]">
                      Limited Time
                 </div>
            </div>

            {/* HEADER */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-sm mb-6 border border-amber-200 dark:border-amber-700/50 animate-pulse">
                <Sparkles size={16} /> Special Announcement
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-normal leading-tight">
                Go <span className="inline-block px-1 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">PRO</span> for <span className="underline decoration-wavy decoration-teal-500 decoration-2">FREE!</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
                We are unlocking the full power of FindMeWork for everyone. No credit card required. Experience the future of job hunting on us.
            </p>

            {/* DATES */}
            <div className="inline-flex flex-col md:flex-row items-center gap-4 bg-slate-50 dark:bg-[#0A192F] p-4 md:px-8 rounded-2xl border border-gray-200 dark:border-white/10 mb-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                        <Calendar size={24} />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Valid From</p>
                        <p className="font-bold text-lg">1st February</p>
                    </div>
                </div>
                <div className="hidden md:block w-px min-w-[1px] h-10 bg-gray-300 dark:bg-white/10"></div>
                <div className="text-slate-400 font-bold md:hidden">↓</div>
                <div className="flex items-center gap-3">
                    <div className="text-left">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Valid Until</p>
                        <p className="font-bold text-lg">1st March</p>
                    </div>
                </div>
            </div>

            {/* FEATURES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-10">
                <FeatureItem text="Unlimited Job Searches" />
                <FeatureItem text="Direct DM Templates" />
                <FeatureItem text="Access to Hidden Founders List" />
                <FeatureItem text="Priority Support" />
            </div>

            {/* CTA BUTTON */}
            {session ? (
                 <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-xl shadow-amber-500/30 hover:scale-105 transition-all duration-300">
                      <span className="mr-2">Go to Dashboard</span> <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                      <span className="absolute inset-0 rounded-full ring-2 ring-white/20 animate-ping opacity-20"></span>
                 </Link>
            ) : (
                <button onClick={() => signIn()} className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-xl shadow-amber-500/30 hover:scale-105 transition-all duration-300">
                    <span className="mr-2">Claim Free Pro Access</span> <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                </button>
            )}

            <p className="mt-4 text-xs text-slate-400">
                *Offer valid for all registered users. Automatically activated.
            </p>

        </motion.div>

        {/* TRUST BADGES */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <TrustCard 
                icon={<Crown size={24} className="text-amber-500"/>}
                title="Premium Features"
                desc="Usually $29/mo, now $0."
            />
            <TrustCard 
                icon={<Zap size={24} className="text-teal-500"/>}
                title="Instant Activation"
                desc="No waiting time. Just login."
            />
             <TrustCard 
                icon={<ShieldCheck size={24} className="text-blue-500"/>}
                title="No Credit Card"
                desc="100% Free. No hidden charges."
            />
        </div>

      </main>
    </div>
  );
}

// ✨ Helper: Feature List Item
function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#0A192F] p-3 rounded-xl border border-gray-100 dark:border-white/5">
            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{text}</span>
        </div>
    );
}

// ✨ Helper: Trust Card
function TrustCard({ icon, title, desc }: any) {
    return (
        <div className="bg-white/50 dark:bg-[#112240]/50 p-6 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white dark:bg-[#0A192F] rounded-xl shadow-sm mb-4">
                {icon}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
    );
}