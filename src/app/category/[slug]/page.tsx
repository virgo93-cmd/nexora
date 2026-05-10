"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import TrendingCard from "@/components/home/trending-card"
import { LayoutGrid, ChevronLeft, Search } from "lucide-react"
import Link from "next/link"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mapping slug ke Nama Kategori Asli (Biar matching sama Database)
  const categoryMap: Record<string, string> = {
    "image": "Image Generation",
    "image-generation": "Image Generation",
    "video": "Video Creation",
    "video-creation": "Video Creation",
    "writing": "Writing",
    "llm": "LLM & Chat",
    "chatbot": "LLM & Chat",
    "code": "Coding Assistant",
    "coding-assistant": "Coding Assistant",
    "voice": "Voice & Audio",
    "marketing": "Marketing",
    "productivity": "Productivity"
  }

  useEffect(() => {
    const fetchCategoryTools = async () => {
      setLoading(true)
      
      // Ambil nama kategori yang bener dari map, kalau gak ada balik ke capitalize standar
      const formattedCategory = categoryMap[slug.toLowerCase()] || 
                                slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .contains('categories', [formattedCategory]) 

      if (!error && data) {
        setTools(data)
      }
      setLoading(false)
    }

    if (slug) fetchCategoryTools()
  }, [slug])

  return (
    <main className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 min-h-screen bg-[#070708]">
      
      {/* CYBER NAV */}
      <div className="mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/20 hover:text-indigo-400 transition-all text-[10px] font-black uppercase tracking-[0.2em] mb-10 group"
        >
          <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
          System / Hub / <span className="text-white/40">Category</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.1)]">
              <LayoutGrid className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Filtered Database</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                {slug.replace(/-/g, ' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Core</span>
              </h1>
            </div>
          </div>
          
          <div className="text-right hidden md:block border-l border-white/5 pl-8">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Active Modules</p>
            <p className="text-2xl font-black text-white">{tools.length}</p>
          </div>
        </div>
      </div>

      {/* GRID CONTENT - Cyberpunk Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {loading ? (
          [...Array(10)].map((_, i) => (
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
          <div className="col-span-full py-32 text-center border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
            <Search className="w-10 h-10 text-white/5 mx-auto mb-4" />
            <p className="text-white/20 font-black uppercase tracking-[0.4em] text-xs">
              Error 404: No Intelligence Found in {slug}
            </p>
            <Link href="/submit" className="inline-block mt-6 px-8 py-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
              Initialize New Tool Submission
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}