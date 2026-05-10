"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { LogIn, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Inisialisasi Browser Client khusus buat Auth yang sinkron sama Middleware
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data?.user) {
        // Berhasil login! Refresh router agar Middleware sadar kita sudah punya session
        router.push("/admin")
        router.refresh()
      }
    } catch (err: any) {
      setError("Connection error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/20 blur-[100px] rounded-full" />
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <LogIn className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Admin Login</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">Nexora Control Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nexora.id" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium" 
              required 
            />
          </div>

          {error && (
            <div className="flex items-center gap-3 text-red-400 text-xs font-bold bg-red-500/10 py-4 px-5 rounded-2xl border border-red-500/20 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  )
}