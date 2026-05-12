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
      <head>
        {/* SEO MANUAL - BIAR TETEP SATU FILE */}
        <title>Nexora | Discover the Best AI Tools Directory 2026</title>
        <meta name="description" content="Explore 100+ hand-picked AI tools. The ultimate directory for productivity and business powered by AI." />
        <meta name="keywords" content="AI Tools, Best AI Directory, Artificial Intelligence, Nexora AI" />
        
        {/* Open Graph buat Facebook/Meta Ads */}
        <meta property="og:title" content="Nexora - Best AI Tools Directory" />
        <meta property="og:description" content="Find the perfect AI tool for your needs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nexora-ten-mu.vercel.app/" />

        {/* --- VERIFIKASI MONETAG --- */}
        <meta name="monetag" content="c46d9ff6b068c7b9672ff5213b5b3907" />

        {/* IKLAN POPUNDER LAMA (JANGAN DIHAPUS) */}
        {!isAdminPage && (
          <Script 
            src="https://pl29406804.profitablecpmratenetwork.com/a8/7d/66/a87d662880d0ed02124eb64e1e3fc2f1.js" 
            strategy="afterInteractive" 
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-[#0a0a0c] text-foreground selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
        
        {!isAdminPage && <Navbar />}

        {!isAdminPage && (
          <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent z-[40] pointer-events-none" />
        )}

        <main className={`flex-1 relative z-10 flex flex-col ${!isAdminPage ? 'pt-16' : ''}`}>
          {children}
        </main>

        {!isAdminPage && <Footer />}

        {/* SCRIPT KLIK SEMBARANG JADI DUIT (MONETAG) */}
        {!isAdminPage && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener('click', function() {
                  const monetagLink = "https://omg10.com/4/10995340";
                  if(!window.popunderRun) {
                    window.open(monetagLink, '_blank');
                    window.popunderRun = true;
                    // Reset tiap 20 detik biar gak terlalu agresif tapi tetep cuan
                    setTimeout(() => { window.popunderRun = false; }, 20000);
                  }
                });
              `,
            }}
          />
        )}
        
      </body>
    </html>
  );
}