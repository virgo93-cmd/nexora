"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import { usePathname } from "next/navigation";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#0a0a0c] text-foreground selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
        
        {/* IKLAN POPUNDER - Pindah ke posisi paling atas body agar cepat ter-load */}
        {!isAdminPage && (
          <Script 
            src="https://pl29406804.profitablecpmratenetwork.com/a8/7d/66/a87d662880d0ed02124eb64e1e3fc2f1.js" 
            strategy="afterInteractive" 
          />
        )}

        {/* Navbar */}
        {!isAdminPage && <Navbar />}

        {/* Gradasi Navbar */}
        {!isAdminPage && (
          <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent z-[40] pointer-events-none" />
        )}

        {/* KOTAK AD SPACE SUDAH DIHAPUS TOTAL AGAR WEB LOOK PREMIUM */}

        {/* Konten Utama */}
        <main className={`flex-1 relative z-10 flex flex-col ${!isAdminPage ? 'pt-16' : ''}`}>
          {children}
        </main>

        {/* Footer */}
        {!isAdminPage && <Footer />}
        
      </body>
    </html>
  );
}