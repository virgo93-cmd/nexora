"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Flame, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import TrendingCard from "./trending-card"

export default function Trending() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .eq('is_trending', true)
        .order('created_at', { ascending: false })
      // LIMIT 5 DIHAPUS BIAR DINAMIS TERGANTUNG ADMIN
      
      if (!error && data) {
        setTools(data)
      }
      setLoading(false)
    }

    fetchTrending()
  }, [])

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Trending AI Tools</h2>
          </div>
          {/* JUDUL DINAMIS SESUAI JUMLAH DATA */}
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            Top {tools.length} modules active this week
          </p>
        </div>
        
        <Link href="/trending" className="group flex items-center gap-2 text-white/30 hover:text-orange-400 transition-all font-black text-[10px] uppercase tracking-widest border border-white/5 px-4 py-2 rounded-xl bg-white/[0.02]">
          View All Grid 
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid Tools: lg:grid-cols-5 memastikan 5 card sebaris horizontal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-[400px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse" />
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
          <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
            <p className="text-white/10 font-black uppercase tracking-[0.5em] text-[10px]">Initialize: 0 Trending Modules Found</p>
          </div>
        )}
      </div>
    </section>
  )
}