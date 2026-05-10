"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import TrendingCard from "@/components/home/trending-card"
import { Flame, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TrendingPage() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllTrending = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
      
      if (!error && data) setTools(data)
      setLoading(false)
    }
    fetchAllTrending()
  }, [])

  return (
    <main className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 min-h-screen bg-[#070708]">
      {/* Header Section - Modern Cyberpunk */}
      <div className="mb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Live Pulse</span>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none uppercase">
          Trending <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500">
            Intelligence
          </span>
        </h1>
        <p className="text-white/20 font-medium max-w-xl text-sm leading-relaxed border-l border-white/10 pl-6">
          The most powerful AI tools currently dominating the digital frontier. 
          Real-time data synchronization with Nexora Hub.
        </p>
      </div>

      {/* Grid Content - Tighter Gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {loading ? (
          [...Array(10)].map((_, i) => (
            <div key={i} className="h-[420px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse" />
          ))
        ) : tools.length > 0 ? (
          tools.map((tool, index) => (
            <TrendingCard 
              key={tool.id} 
              tool={tool} 
              rank={index + 1} 
            />
          ))
        ) : (
          <div className="col-span-full py-32 text-center border border-dashed border-white/5 rounded-[3rem]">
            <p className="text-white/10 font-black uppercase tracking-[0.5em] text-xs text-center">System Scan: 0 Results Found</p>
          </div>
        )}
      </div>
    </main>
  )
}