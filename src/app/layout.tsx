"use client" // Wajib ada buat pake usePathname

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import { usePathname } from "next/navigation";

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
  
  // Deteksi halaman admin
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#0a0a0c] text-foreground selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
        
        {/* Navbar HANYA muncul jika bukan admin */}
        {!isAdminPage && <Navbar />}

        {/* Gradasi Navbar HANYA muncul jika bukan admin */}
        {!isAdminPage && (
          <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent z-[40] pointer-events-none" />
        )}

        {/* SLOT IKLAN CPA (Kiri & Kanan) - Hanya muncul jika bukan admin & layar lebar */}
        {!isAdminPage && (
          <>
            <aside className="hidden 2xl:flex fixed left-4 top-32 bottom-20 w-[160px] items-center justify-center z-30">
              {/* Ruang stand-by untuk script CPA */}
            </aside>

            <aside className="hidden 2xl:flex fixed right-4 top-32 bottom-20 w-[160px] items-center justify-center z-30">
              {/* Ruang stand-by untuk script CPA */}
            </aside>
          </>
        )}

        {/* Konten Utama: pt-16 hanya ada kalau ada Navbar (bukan admin) */}
        <main className={`flex-1 relative z-10 flex flex-col ${!isAdminPage ? 'pt-16' : ''}`}>
          {children}
        </main>

        {/* Footer HANYA muncul jika bukan admin */}
        {!isAdminPage && <Footer />}
        
      </body>
    </html>
  );
}