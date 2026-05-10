"use client"

import Link from "next/link"
import Image from "next/image" // Import Image untuk logo lu
import { Mail, Zap, ArrowUpRight, Globe, Shield, Terminal } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-[#0a0a0c] border-t border-white/5 pt-20 pb-10 px-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* BRAND SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {/* LOGO BARU DARI ASSETS */}
              <div className="relative w-10 h-10">
                <Image 
                  src="/assets/images/logo.png" 
                  alt="Nexora Logo" 
                  fill 
                  className="object-contain" 
                  unoptimized 
                />
              </div>
              {/* JUDUL DISAMAKAN DENGAN NAVBAR */}
              <span className="text-xl font-black tracking-tighter text-white drop-shadow-lg uppercase italic">
                Nexora
              </span>
            </div>
            <p className="text-white/30 text-xs leading-relaxed font-bold uppercase tracking-wider max-w-xs">
              High-performance AI intelligence directory. Indexing the digital frontier.
            </p>
            <div className="pt-2">
              <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/20 transition-all">
                <Mail className="w-3 h-3" /> Contact Admin
              </Link>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 border-l-2 border-indigo-500 pl-3">Directory</h3>
            <ul className="space-y-4">
              {['Home', 'Trending', 'New Tools', 'Submit Tool'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-white/40 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group"
                  >
                    <span className="text-indigo-500/50 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all">/</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* POPULAR CATEGORIES */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 border-l-2 border-purple-500 pl-3">Intelligence</h3>
            <ul className="space-y-4">
              {['Image Generation', 'LLM & Chat', 'Coding Assistant', 'Marketing'].map((item) => (
                <li key={item}>
                  <Link href={`/category/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-white/40 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-between group">
                    {item}
                    <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-purple-500 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SYSTEM STATUS BOX */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 border-l-2 border-emerald-500 pl-3">System Status</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Protocol</span>
                <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Terminal</span>
                <span className="text-[9px] font-black text-white/60 uppercase italic tracking-widest">ID-TSM-2026</span>
              </div>
              <div className="pt-2">
                <Link href="/submit" className="block w-full bg-white text-black text-center py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-indigo-600 hover:text-white shadow-xl shadow-white/5 active:scale-95">
                  Deploy Module
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">
              © {currentYear} NEXORA HUB. AUTHENTICATED ACCESS ONLY.
            </p>
            <p className="text-[8px] font-bold text-indigo-500/30 uppercase tracking-[0.2em]">
              Project by Febryand Artansyah
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-[9px] font-black text-white/10 hover:text-white uppercase tracking-widest transition-all flex items-center gap-2 group">
              <Shield className="w-3 h-3 group-hover:text-amber-500 transition-colors" /> Privacy Protocol
            </Link>
            <div className="flex items-center gap-2 text-[9px] font-black text-white/10 uppercase tracking-widest italic">
              <Terminal className="w-3 h-3" /> node.tsm.prod
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Watermark */}
      <div className="absolute bottom-[-50px] right-[-50px] opacity-[0.02] pointer-events-none">
        <h1 className="text-[200px] font-black italic">NEXORA</h1>
      </div>
    </footer>
  )
}