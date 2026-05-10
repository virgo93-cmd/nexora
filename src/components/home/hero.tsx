"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Flame, ExternalLink, ShieldCheck, Mail } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0)
  const [hotTools, setHotTools] = useState<any[]>([])
  const [sponsors, setSponsors] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const heroBgs = [
    "/assets/images/hero1.png",
    "/assets/images/hero2.png",
    "/assets/images/hero3.png",
  ]

  useEffect(() => {
    const fetchData = async () => {
      const { data: hot } = await supabase
        .from('submissions')
        .select('*')
        .eq('is_hot', true)
        .eq('status', 'approved')
      if (hot) setHotTools(hot)

      const { data: sps } = await supabase
        .from('sponsorships')
        .select('*')
        .eq('status', 'active')
        .limit(1)
      if (sps) setSponsors(sps)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (hotTools.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % hotTools.length)
      }
      setBgIndex((prev) => (prev + 1) % heroBgs.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [hotTools.length])

  const currentTool = hotTools[currentIndex]
  const currentSponsor = sponsors[0]

  // Cek apakah mode iklan custom (gambar full) atau mode default (teks)
  const isCustomBanner = currentSponsor && currentSponsor.banner_url && !currentSponsor.tool_name.includes("Partner With Nexora");

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-10">
      
      <div className="flex flex-col gap-3 mb-6 z-20 relative">
        
        {/* 1. NEWSLETTER BANNER */}
        <div className="relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-2.5 md:py-3 shadow-2xl">
          <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-4 md:pr-48">
            <div className="flex flex-col text-center md:text-left justify-center">
              <h2 className="text-sm md:text-base font-black text-white tracking-tight leading-none uppercase italic">
                Get the best AI tools in your inbox
              </h2>
              <p className="text-white/60 text-[8px] md:text-[10px] font-bold uppercase tracking-wider mt-1">
                Join 50,000+ subscribers getting weekly updates
              </p>
            </div>
            <div className="flex w-full md:w-auto items-center bg-white rounded-xl p-0.5 shadow-lg">
              <input type="email" placeholder="Enter email" className="input flex-1 md:w-48 bg-transparent border-none focus:ring-0 text-slate-900 text-[10px] px-3 outline-none font-bold" />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-black text-[9px] uppercase transition-all tracking-widest">Subscribe</button>
            </div>
          </div>
          <div className="absolute -right-2 -top-4 -bottom-4 z-10 pointer-events-none hidden sm:block">
            <div className="relative h-full w-[180px] md:w-[220px]">
              <Image src="/assets/images/ai.png" alt="AI Robot" fill priority className="object-contain object-right drop-shadow-[-20px_10px_30px_rgba(0,0,0,0.4)]" unoptimized />
            </div>
          </div>
        </div>

        {/* 2. SPONSORSHIP BANNER - DUA MODE */}
        <div className="relative w-full mb-10 z-30 group">
          {/* Efek Highlight Iklan (Glow di pinggiran) */}
          <div className={`absolute -inset-0.5 rounded-[2rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 ${isCustomBanner ? 'bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 animate-pulse' : 'bg-transparent'}`} />

          <div className={`relative w-full overflow-hidden rounded-[2rem] shadow-2xl transition-all h-full min-h-[60px] md:min-h-[70px] flex items-center ${isCustomBanner ? 'border-amber-500/50' : 'bg-[#0d0d0f] border border-amber-500/30'}`}>
            
            {isCustomBanner ? (
              /* MODE 2: CUSTOM BANNER (Full Image) */
              <a href={currentSponsor.target_url || "/contact"} target="_blank" className="relative w-full h-full block">
                <div className="relative w-full h-[60px] md:h-[70px]">
                  <Image 
                    src={currentSponsor.banner_url} 
                    alt="Sponsorship Banner" 
                    fill 
                    className="object-cover" 
                    unoptimized 
                  />
                </div>
              </a>
            ) : (
              /* MODE 1: DEFAULT BANNER (Teks & Logo) */
              <div className="w-full px-8 py-2.5 md:py-3 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
                <div className="relative z-40 flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {currentSponsor?.banner_url ? (
                      <Image src={currentSponsor.banner_url} alt="Logo" width={40} height={40} className="object-cover" unoptimized />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex flex-col text-center md:text-left justify-center">
                    <h2 className="text-sm md:text-base font-black text-amber-500 tracking-tight leading-none uppercase italic">
                      {currentSponsor ? currentSponsor.tool_name : "Partner With Nexora Hub"}
                    </h2>
                    <p className="text-white/30 text-[8px] md:text-[10px] font-black uppercase tracking-wider mt-1 italic">
                      {currentSponsor ? currentSponsor.description : "Feature your intelligence to our global tech elite audience"}
                    </p>
                  </div>
                </div>
                <Link 
                  href="/contact" 
                  className="bg-white text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all tracking-widest hover:bg-amber-500 hover:text-white flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer relative z-50"
                >
                  <Mail className="w-3.5 h-3.5" /> Contact Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BACKGROUND SLIDER - TETAP */}
      <div className="absolute top-[160px] bottom-0 left-0 right-0 z-0 overflow-hidden pointer-events-none flex justify-start items-center" style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 85%)', maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 85%)' }}>
        <div className="relative w-full lg:w-[80%] h-full opacity-50 transition-all duration-1000">
          {heroBgs.map((bg, index) => (
            <div key={bg} className={`absolute inset-0 transition-opacity duration-1000 ${bgIndex === index ? 'opacity-100' : 'opacity-0'}`}>
              <Image src={bg} alt="Hero BG" fill priority={index === 0} loading="eager" className="object-cover" unoptimized />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-transparent to-[#0a0a0c]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-transparent to-[#0a0a0c]" />
        </div>
      </div>

      {/* HERO CONTENT - TETAP */}
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-stretch gap-0">
          <div className="relative w-full lg:w-[75%] py-4 md:pr-12 flex flex-col justify-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 mb-6 uppercase tracking-widest text-[9px] font-black text-white/30">
                <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                The #1 AI Tools Directory
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1] mb-6 tracking-tighter uppercase italic">
                Discover the Best <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 italic">AI Tools</span>
              </h1>
              <p className="text-white/40 text-base md:text-lg max-w-lg mb-8 leading-relaxed font-medium">
                Explore hand-picked AI tools across various categories. Find the perfect AI solution for your needs.
              </p>
              <div className="relative w-full max-w-xl group">
                <div className="relative flex items-center bg-white rounded-2xl p-1 shadow-xl overflow-hidden transition-all border border-white/10">
                  <Search className="ml-5 w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Search AI tools..." className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 text-base px-4 outline-none font-bold" />
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all text-sm shadow-md shadow-indigo-600/10 uppercase tracking-widest">Search</button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/5 to-transparent my-6" />

          {/* SISI KANAN - HOT TOOLS - TETAP */}
          <div className="w-full lg:w-[25%] py-4 flex flex-col justify-center items-center lg:pl-10">
            <div className="flex items-center gap-4 mb-8 self-center lg:self-start">
              <Flame className="w-8 h-8 text-orange-500 fill-orange-500 animate-pulse" />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Hot Tool</h3>
            </div>
            <div className="w-full max-w-[260px]">
              {currentTool ? (
                <div key={currentTool.id} className="relative group animate-in fade-in slide-in-from-right-4 duration-700">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-500 rounded-[2.2rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <div className="relative bg-[#0d0d0f] border border-white/10 rounded-[2rem] p-6 flex flex-col items-center shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-30 blur-xl pointer-events-none">
                        <Image src={currentTool.logo_url} alt="watermark" fill className="object-contain scale-150" unoptimized />
                    </div>
                    <div className="z-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl relative overflow-hidden mb-5 border border-white/10 shadow-inner">
                        <Image src={currentTool.logo_url} alt={currentTool.tool_name} fill className="object-cover p-2" unoptimized />
                    </div>
                    <div className="z-10 text-center mb-6 w-full">
                      <h2 className="text-xl font-black text-white tracking-tighter mb-1 uppercase italic">{currentTool.tool_name}</h2>
                      <p className="text-[10px] text-white/60 line-clamp-2 font-bold leading-relaxed mb-4 min-h-[30px]">{currentTool.description}</p>
                    </div>
                    <a href={currentTool.website_url} target="_blank" className="z-10 w-full bg-white text-black py-3.5 rounded-xl font-black text-[10px] transition-all hover:bg-orange-500 hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-xl text-center">
                      Explore <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border border-dashed border-white/5 rounded-[2rem] text-white/10 text-[10px] font-black uppercase tracking-widest">Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}