"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { 
  ImageIcon, 
  Video, 
  PenTool, 
  MessageSquare, 
  Code, 
  Mic2, 
  Megaphone, 
  Layout 
} from "lucide-react"

// Sesuaikan 'dbName' dengan pilihan kategori yang ada di form Submit & Admin lu
const categoryList = [
  { name: "Image", dbName: "Image Generation", slug: "image-generation", icon: ImageIcon, color: "from-blue-500 to-cyan-400", text: "text-blue-400" },
  { name: "Video", dbName: "Video Creation", slug: "video-creation", icon: Video, color: "from-pink-500 to-rose-400", text: "text-pink-400" },
  { name: "Writing", dbName: "Writing", slug: "writing", icon: PenTool, color: "from-emerald-500 to-teal-400", text: "text-emerald-400" },
  { name: "Chatbot", dbName: "LLM & Chat", slug: "llm-chat", icon: MessageSquare, color: "from-green-500 to-emerald-400", text: "text-green-400" },
  { name: "Code", dbName: "Coding Assistant", slug: "coding-assistant", icon: Code, color: "from-indigo-500 to-purple-400", text: "text-indigo-400" },
  { name: "Voice", dbName: "Voice & Audio", slug: "voice-audio", icon: Mic2, color: "from-purple-500 to-fuchsia-400", text: "text-purple-400" },
  { name: "Marketing", dbName: "Marketing", slug: "marketing", icon: Megaphone, color: "from-orange-500 to-amber-400", text: "text-orange-400" },
  { name: "Productivity", dbName: "Productivity", slug: "productivity", icon: Layout, color: "from-violet-500 to-purple-400", text: "text-violet-400" },
]

export default function Categories() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchCounts = async () => {
      // Ambil kolom categories dari semua yang approved
      const { data, error } = await supabase
        .from('submissions')
        .select('categories')
        .eq('status', 'approved')

      if (!error && data) {
        const newCounts: Record<string, number> = {}
        
        // Inisialisasi awal semua kategori dengan 0 berdasarkan dbName
        categoryList.forEach(c => {
          newCounts[c.dbName] = 0
        })

        // Iterasi data dari DB
        data.forEach(item => {
          item.categories?.forEach((catName: string) => {
            // Jika nama kategori dari DB cocok dengan list kita, tambahkan hitungan
            if (newCounts.hasOwnProperty(catName)) {
              newCounts[catName]++
            }
          })
        })
        setCounts(newCounts)
      }
    }

    fetchCounts()
  }, [])

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categoryList.map((cat) => {
          // Ambil count berdasarkan dbName yang sinkron sama database
          const count = counts[cat.dbName] || 0
          
          return (
            <Link 
              key={cat.name} 
              href={`/category/${cat.slug}`}
              className="group relative p-[1px] rounded-[1.8rem] transition-all duration-500 hover:-translate-y-2"
            >
              {/* CYBER GRADIENT BORDER */}
              <div className={`absolute inset-0 rounded-[1.8rem] bg-gradient-to-b from-white/10 to-transparent opacity-100 group-hover:bg-gradient-to-br group-hover:${cat.color} transition-all duration-500`} />

              {/* CARD CONTENT */}
              <div className="relative flex flex-col items-center justify-center p-5 rounded-[1.8rem] bg-[#070708] h-full transition-all duration-500 group-hover:bg-black/60 backdrop-blur-md">
                
                {/* INNER GLOW */}
                <div className={`absolute inset-0 rounded-[1.8rem] bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 blur-xl transition-opacity`} />

                {/* ICON */}
                <div className={`relative z-10 p-2.5 rounded-xl bg-white/[0.03] ${cat.text} mb-3 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`}>
                  <cat.icon className="w-5 h-5 stroke-[2.5]" />
                </div>

                {/* TEXT SECTION */}
                <div className="relative z-10 text-center">
                  <h3 className="text-[10px] font-black text-white mb-0.5 tracking-[0.1em] uppercase">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-indigo-500 transition-colors" />
                    <span className="text-[8px] text-white/20 font-black tracking-widest uppercase group-hover:text-white/60">
                      {count} Units
                    </span>
                  </div>
                </div>
              </div>

              {/* EXTERNAL CYBER GLOW */}
              <div className={`absolute inset-0 rounded-[1.8rem] bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500 -z-10`} />
            </Link>
          )
        })}
      </div>
    </section>
  )
}