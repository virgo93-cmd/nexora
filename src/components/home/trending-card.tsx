"use client"

import Image from "next/image"
import { ExternalLink, Zap } from "lucide-react"

interface ToolProps {
  tool: {
    id: string;
    tool_name: string;
    description: string;
    logo_url: string;
    categories: string[];
    website_url: string;
    tier?: string[]; // Sekarang mendukung array sesuai input admin lu
  }
  rank: number;
}

export default function TrendingCard({ tool, rank }: ToolProps) {
  return (
    <div className="group relative p-4 rounded-[2.5rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col backdrop-blur-sm">
      
      {/* Rank Badge - Cyber Style */}
      <div className="absolute top-4 left-4 px-2 py-1 rounded-lg bg-indigo-600 text-[9px] font-black text-white z-20 shadow-[0_0_10px_rgba(79,70,229,0.5)]">
        #{rank}
      </div>

      {/* Icon Container - Glass Box */}
      <div className="relative w-full aspect-square rounded-[2rem] bg-white/[0.02] flex items-center justify-center mb-5 overflow-hidden border border-white/5 shadow-inner group-hover:bg-white/[0.04] transition-colors">
          <Image 
            src={tool.logo_url} 
            alt={tool.tool_name} 
            fill
            className="group-hover:scale-110 transition-transform duration-700 object-cover p-6 z-10" 
            unoptimized
          />
          {/* Cyber Glow Behind Logo */}
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="px-2">
        <h3 className="text-xl font-black text-white mb-1.5 tracking-tight group-hover:text-indigo-400 transition-colors uppercase">
          {tool.tool_name}
        </h3>
        <p className="text-[10px] text-white/30 font-medium leading-relaxed mb-5 line-clamp-2 min-h-[30px]">
          {tool.description}
        </p>
      </div>

      {/* Badges Area - Split Tier & Category */}
      <div className="mt-auto space-y-3 px-2">
        {/* Tier Label (Pake Icon Zap) */}
        <div className="flex flex-wrap gap-1.5">
          {tool.tier?.map((t) => (
            <div key={t} className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-indigo-400 text-indigo-400" />
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter italic">
                {t}
              </span>
            </div>
          ))}
        </div>
        
        {/* All Categories Label */}
        <div className="flex flex-wrap gap-1 pb-4">
          {tool.categories?.map((cat) => (
            <span key={cat} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[7px] font-black text-white/30 uppercase tracking-widest group-hover:text-white/60 transition-colors">
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Cyber Action Footer */}
      <div className="pt-4 border-t border-white/[0.03] flex items-center justify-between px-2">
        <a 
          href={tool.website_url}
          target="_blank"
          className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-indigo-400 transition-all flex items-center gap-2"
        >
          Explore Tool <ExternalLink className="w-3 h-3" />
        </a>
        <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-40" />
        </div>
      </div>
    </div>
  )
}