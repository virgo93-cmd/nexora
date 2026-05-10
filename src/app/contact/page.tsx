"use client"

import Link from "next/link"
import { ArrowLeft, Mail, MessageSquare, Send, Zap } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white py-20 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* BACK BUTTON */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-indigo-400 transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Terminal</span>
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 uppercase italic">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Admin</span>
          </h1>
          <p className="text-white/30 text-lg font-medium border-l-2 border-amber-500/30 pl-6">
            For sponsorship inquiries, bug reports, or partnership proposals. 
            Direct transmission to Nexora HQ.
          </p>
        </div>

        <div className="grid gap-6">
          {/* EMAIL CARD */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 hover:border-amber-500/30 transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/10">
                  <Mail className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Official Inquiry</p>
                  <h3 className="text-xl font-black tracking-tight">rendirenaldi27@gmail.com</h3>
                </div>
              </div>
              <a 
                href="mailto:rendirenaldi27@gmail.com" 
                className="p-3 bg-white/5 rounded-xl hover:bg-white text-white hover:text-black transition-all"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* TELEGRAM/WA CARD (OPSIONAL) */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/10">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Fast Response</p>
                <h3 className="text-xl font-black tracking-tight italic">Available 24/7 for Sponsors</h3>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-12 p-8 bg-gradient-to-br from-amber-500/5 to-transparent border border-white/5 rounded-[2.5rem] text-center">
          <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em] leading-relaxed">
            Response time: &lt; 12 Hours <br />
            Secure Transmission Guaranteed
          </p>
        </div>

      </div>
    </main>
  )
}