'use client';

import Link from 'next/link';
import { Zap, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#020c1b] border-t border-gray-200 dark:border-white/5 pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* COLUMN 1: Brand & Desc */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                FindMeWork
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              We help you find jobs hidden in the noise. Connect with top companies and startups instantly.
            </p>
            
            {/* Social Icons (GitHub Removed) */}
            <div className="flex items-center gap-4 pt-2">
              <SocialLink href="https://linkedin.com/company/findmework" icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialLink href="https://twitter.com/findmework" icon={<Twitter size={18} />} label="Twitter" />
              <SocialLink href="mailto:support@findmework.com" icon={<Mail size={18} />} label="Email" />
            </div>
          </div>

          {/* COLUMN 2: Company */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="mailto:support@findmework.com">Contact Support</FooterLink></li>
            </ul>
          </div>

          {/* COLUMN 3: Resources */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4">Jobs</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><FooterLink href="/linkedin-jobs">LinkedIn Feeds</FooterLink></li>
              <li><FooterLink href="/twitter-jobs">Twitter Feeds</FooterLink></li>
            </ul>
          </div>

          {/* COLUMN 4: Legal */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><FooterLink href="/privacy-policy">Privacy Policy</FooterLink></li>
            </ul>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-100 dark:border-white/5 my-8"></div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-500">
          <p>© {currentYear} FindMeWork Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            {/* India Removed as requested */}
            <span>for job seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ✨ Helper Component for Links (Hover Effect)
function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 block w-fit"
    >
      {children}
    </Link>
  );
}

// ✨ Helper Component for Social Icons
function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white transition-all shadow-sm"
    >
      {icon}
    </a>
  );
}