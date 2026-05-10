"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Send, Copy, CheckCircle2, Wallet, Upload, X, PartyPopper } from "lucide-react"
import { supabase } from "@/lib/supabase"

// SINKRONISASI 8 KATEGORI UTAMA LU BRO
const categoryOptions = [
  "Image Generation", 
  "Video Creation", 
  "Writing", 
  "LLM & Chat", 
  "Coding Assistant", 
  "Voice & Audio", 
  "Marketing", 
  "Productivity"
]

export default function SubmitTool() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false) 
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [cryptoMethods, setCryptoMethods] = useState([
    { network: "BSC (BEP20)", coin: "USDT", address: "Loading...", image: "/assets/images/usdt.png" },
    { network: "BSC (BEP20)", coin: "USDC", address: "Loading...", image: "/assets/images/usdc.png" },
  ])

  useEffect(() => {
    const fetchWallets = async () => {
      const { data } = await supabase.from('settings').select('key, value')
      if (data) {
        const usdt = data.find(s => s.key === 'usdt_address')?.value || "0xf3f63769b04c89030f3479a4874da9cd4a5cb508"
        const usdc = data.find(s => s.key === 'usdc_address')?.value || "0xf3f63769b04c89030f3479a4874da9cd4a5cb508"
        setCryptoMethods([
          { network: "BSC (BEP20)", coin: "USDT", address: usdt, image: "/assets/images/usdt.png" },
          { network: "BSC (BEP20)", coin: "USDC", address: usdc, image: "/assets/images/usdc.png" },
        ])
      }
    }
    fetchWallets()
  }, [])

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const uploadLogo = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    // PASTIKAN BUCKETNYA tool-logos AGAR SAMA DENGAN ADMIN
    const { error: uploadError } = await supabase.storage.from('tool-logos').upload(fileName, file)
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('tool-logos').getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    if (selectedCategories.length === 0) return alert("Please select at least one category!")
    
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    try {
      let finalLogoUrl = ""
      const file = fileInputRef.current?.files?.[0]
      if (file) finalLogoUrl = await uploadLogo(file)

      const { error } = await supabase.from('submissions').insert([{
        tool_name: formData.get('toolName'),
        website_url: formData.get('websiteUrl'),
        categories: selectedCategories,
        description: formData.get('description'),
        email: formData.get('email'),
        txid: formData.get('txid'),
        logo_url: finalLogoUrl,
        status: 'pending',
        tier: ['Freemium'] // Default tier untuk submit user
      }])

      if (error) throw error
      setShowSuccess(true)
      
    } catch (err: any) {
      alert("Error: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyAddress = (address: string, index: number) => {
    navigator.clipboard.writeText(address)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white py-20 px-6 relative">
      
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
          <div className="bg-[#121214] border border-white/10 rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-2 italic uppercase">Success!</h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed font-medium">
              Intelligence received. Our team will verify your submission within 24 hours.
            </p>
            <button 
              onClick={() => window.location.href = "/"}
              className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-500 hover:text-white transition-all shadow-lg"
            >
              Back to Terminal
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-indigo-400 transition-colors mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black uppercase tracking-widest text-[10px]">Back to Directory</span>
        </Link>

        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic">
            Submit <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Tool</span>
          </h1>
          <p className="text-white/30 text-lg max-w-2xl leading-relaxed font-medium border-l-2 border-indigo-500/30 pl-6">
            Deploy your AI to the Nexora ecosystem. donation-based model to ensure premium indexing and zero spam.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Logo Identity</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full h-32 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                      logoPreview ? "border-indigo-500/50 bg-indigo-500/5" : "border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    {logoPreview ? (
                      <div className="relative w-full h-full flex items-center justify-center p-4">
                        <img src={logoPreview} alt="Preview" className="h-full w-auto object-contain rounded-xl shadow-2xl" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeLogo(); }} className="absolute top-4 right-4 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-white/10 mb-2" />
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Upload Local File</p>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Tool Name</label>
                    <input name="toolName" type="text" placeholder="Nexora AI" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500/50 outline-none transition-all text-sm font-bold" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Website URL</label>
                    <input name="websiteUrl" type="url" placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500/50 outline-none transition-all text-sm font-bold" required />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Select Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                          selectedCategories.includes(cat) 
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-lg" 
                          : "bg-white/5 border-white/5 text-white/30 hover:border-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Description</label>
                  <textarea name="description" rows={3} placeholder="Describe the module functionality..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500/50 outline-none text-sm font-medium resize-none" required />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Contact Email</label>
                    <input name="email" type="email" placeholder="admin@module.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-indigo-500/50 outline-none text-sm font-bold" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400/50 ml-1 italic">Transaction TXID (BEP20)</label>
                    <input name="txid" type="text" placeholder="Paste Hash" className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-2xl px-5 py-4 focus:border-indigo-500/50 outline-none text-sm font-black text-indigo-400 placeholder:text-indigo-400/20" required />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Processing..." : "Deploy Tool"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-indigo-500/20 rounded-2xl">
                  <Wallet className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest leading-none">Donation</h3>
                  <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] mt-1">Network: BSC (BEP20)</p>
                </div>
              </div>

              <div className="space-y-4">
                {cryptoMethods.map((method, idx) => (
                  <div key={idx} className="bg-black/40 border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 bg-white/5 rounded-full overflow-hidden p-1.5 border border-white/5">
                          <Image src={method.image} alt={method.coin} fill sizes="32px" className="object-contain p-1" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">{method.network}</p>
                          <p className="font-black text-sm text-white">{method.coin}</p>
                        </div>
                      </div>
                      <button onClick={() => copyAddress(method.address, idx)} className="p-2 hover:bg-white/5 rounded-xl transition-all group relative">
                        {copiedIndex === idx ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/10 group-hover:text-white" />}
                      </button>
                    </div>
                    <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 overflow-hidden">
                      <code className="text-[9px] text-white/30 break-all block font-mono text-center tracking-tighter">{method.address}</code>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-[9px] text-white/30 italic leading-relaxed text-center font-medium uppercase tracking-widest">
                  Premium Indexing. 24h Review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}