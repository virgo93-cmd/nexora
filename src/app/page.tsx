"use client"

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Hero from "@/components/home/hero";
import Categories from "@/components/home/categories";
import Trending from "@/components/home/trending";
// HAPUS IMPORT FOOTER DI SINI BRO

export default function Page() {
  
  useEffect(() => {
    const testKoneksi = async () => {
      const { data, error } = await supabase.from('submissions').select('*').limit(1);
      if (error) {
        console.error("❌ Koneksi Supabase Gagal:", error.message);
      } else {
        console.log("✅ Koneksi Supabase Berhasil! Data:", data);
      }
    };
    testKoneksi();
  }, []);

  return (
    <div className="relative flex flex-col overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <Hero />
      
      {/* Wrapper untuk Konten di Bawah Hero */}
      <div className="relative z-10 -mt-8 md:-mt-12 flex flex-col gap-4 pb-20">
        
        {/* 2. CATEGORY GRID SECTION */}
        <Categories />

        {/* 3. TRENDING AI TOOLS SECTION */}
        <Trending />

      </div>

      {/* JANGAN PANGGIL FOOTER DI SINI LAGI, SUDAH ADA DI LAYOUT.TSX */}

    </div>
  );
}