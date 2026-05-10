"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  ChevronDown, 
  Image as ImageIcon, 
  Video, 
  PenTool, 
  MessageSquare, 
  Code, 
  Mic2, 
  Megaphone, 
  Menu,
  X
} from "lucide-react"

const categories = [
  { name: "Image", icon: ImageIcon, color: "text-blue-400" },
  { name: "Video", icon: Video, color: "text-pink-400" },
  { name: "Writing", icon: PenTool, color: "text-emerald-400" },
  { name: "Chatbot", icon: MessageSquare, color: "text-green-400" },
  { name: "Code", icon: Code, color: "text-indigo-400" },
  { name: "Voice", icon: Mic2, color: "text-purple-400" },
  { name: "Marketing", icon: Megaphone, color: "text-orange-400" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExploreActive, setIsExploreActive] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4 pointer-events-none">
      <nav 
        onMouseLeave={() => setIsExploreActive(false)}
        className="relative flex items-center w-full max-w-7xl px-6 md:px-10 py-3 transition-all duration-500 pointer-events-auto h-[64px]"
      >
        
        {/* SISI KIRI: LOGO */}
        <div className="flex items-center gap-3 z-20 pr-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-8 w-8 transition-transform group-hover:scale-110">
              <Image 
                src="/assets/images/logo.png" 
                alt="Logo" 
                fill 
                sizes="32px" 
                priority 
                className="object-contain" 
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-white drop-shadow-lg">Nexora</span>
          </Link>
        </div>

        {/* AREA TENGAH: SLIDE CATEGORIES (DYNAMIC ROUTING) */}
        <div className={`flex-1 flex items-center transition-all duration-700 ease-in-out ${isExploreActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"}`}>
          <div className="h-4 w-px bg-white/10 mx-4 hidden lg:block" />
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                href={`/category/${cat.name.toLowerCase()}`}
                onClick={() => setIsExploreActive(false)} // Tutup slide saat diklik
                className="group/item flex items-center gap-2 text-white/40 hover:text-white transition-all whitespace-nowrap"
              >
                <cat.icon className={`w-4 h-4 ${cat.color} opacity-60 group-hover/item:opacity-100 transition-opacity`} />
                <span className="text-[11px] font-extrabold uppercase tracking-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* SISI KANAN: EXPLORE & SUBMIT */}
        <div className="flex items-center gap-4 z-20 pl-4">
          <button 
            onMouseEnter={() => setIsExploreActive(true)}
            className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all px-5 py-2 rounded-full ${isExploreActive ? "bg-white text-black shadow-xl" : "text-white/60 hover:text-white"}`}
          >
            Explore
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExploreActive ? "rotate-180" : ""}`} />
          </button>

          {/* SUBMIT TOOL BUTTON */}
          <Link 
            href="/submit" 
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap tracking-tighter uppercase border border-indigo-500/50 hover:scale-105 active:scale-95"
          >
            SUBMIT TOOL
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden ml-4 p-2 text-white/80 hover:text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>
    </header>
  )
}