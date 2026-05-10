"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { 
  LogOut, CheckCircle, XCircle, Trash2, Flame, 
  Plus, LayoutDashboard, X, Edit3, Save, Upload, Zap, Bell, Tag, LayoutGrid, ShieldCheck, Code2
} from "lucide-react"

const categoryOptions = [
  "Image Generation", "LLM & Chat", "Coding Assistant", 
  "Video Creation", "Voice & Audio", "Marketing", "Productivity"
]

const tierOptions = ["Free", "Paid", "Freemium", "Open Source"]

export default function AdminDashboard() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  
  // --- STATE SPONSOR (BANNER) ---
  const [sponsorData, setSponsorData] = useState<any>({ banner_url: "", target_url: "", status: "active" })

  // --- STATE CPA ADS (SCRIPT MODE) ---
  const [cpaLeft, setCpaLeft] = useState<any>({ side: 'left', script_code: '', is_active: false })
  const [cpaRight, setCpaRight] = useState<any>({ side: 'right', script_code: '', is_active: false })

  const [formData, setFormData] = useState({
    tool_name: "",
    description: "",
    website_url: "",
    logo_url: "",
    categories: [] as string[],
    tier: [] as string[],
    is_hot: false,
    is_trending: false
  })

  const router = useRouter()

  const fetchTools = async () => {
    setLoading(true)
    const { data: toolsData, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false })
    if (!error && toolsData) {
      setTools(toolsData)
      setPendingCount(toolsData.filter(t => t.status === 'pending').length)
    }

    // Fetch Sponsor
    const { data: sp } = await supabase.from('sponsorships').select('*').limit(1).maybeSingle()
    if (sp) setSponsorData({ id: sp.id, banner_url: sp.banner_url || "", target_url: sp.target_url || "", status: sp.status || "active" })

    // Fetch CPA Ads
    const { data: cpaData } = await supabase.from('cpa_ads').select('*')
    if (cpaData) {
      const left = cpaData.find(d => d.side === 'left')
      const right = cpaData.find(d => d.side === 'right')
      if (left) setCpaLeft({ ...left, script_code: left.script_code || "" })
      if (right) setCpaRight({ ...right, script_code: right.script_code || "" })
    }
    setLoading(false)
  }

  useEffect(() => { fetchTools() }, [])

  // --- LOGIC SPONSOR BANNER ---
  const handleUpdateSponsor = async () => {
    setLoading(true)
    const payload: any = { banner_url: sponsorData.banner_url, target_url: sponsorData.target_url || "", tool_name: "CUSTOM_BANNER_MODE", status: "active" }
    if (sponsorData.id) payload.id = sponsorData.id
    await supabase.from('sponsorships').upsert([payload])
    alert("Sponsor Updated!")
    fetchTools()
    setLoading(false)
  }

  const handleRemoveSponsor = async () => {
    if (!sponsorData.id) return
    if (!confirm("Kill banner?")) return
    await supabase.from('sponsorships').delete().eq('id', sponsorData.id)
    setSponsorData({ banner_url: "", target_url: "", status: "active" })
    fetchTools()
  }

  // --- LOGIC CPA SYNC ---
  const handleSyncCpa = async (side: 'left' | 'right') => {
    setLoading(true)
    const data = side === 'left' ? cpaLeft : cpaRight
    const { error } = await supabase.from('cpa_ads').upsert([{ ...data, side }])
    if (!error) alert(`CPA ${side} Updated!`)
    fetchTools()
    setLoading(false)
  }

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>, isSponsor = false) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      await supabase.storage.from('tool-logos').upload(fileName, file)
      const { data } = supabase.storage.from('tool-logos').getPublicUrl(fileName)
      if (isSponsor) setSponsorData({ ...sponsorData, banner_url: data.publicUrl })
      else setFormData({ ...formData, logo_url: data.publicUrl })
    } catch (error: any) { alert(error.message) } finally { setUploading(false) }
  }

  // --- LOGIC ASLI MODAL ADD/EDIT TOOLS (TIDAK DIRUBAH) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = { ...formData, status: 'approved' }
    const { error } = editingId ? await supabase.from('submissions').update(payload).eq('id', editingId) : await supabase.from('submissions').insert([payload])
    if (!error) { setIsModalOpen(false); setEditingId(null); fetchTools() }
    else { alert("Gagal Simpan: " + error.message) }
    setLoading(false)
  }

  const toggleArrayItem = (list: string[], item: string) => list.includes(item) ? list.filter(i => i !== item) : [...list, item]

  const openEdit = (tool: any) => {
    setEditingId(tool.id)
    setFormData({ tool_name: tool.tool_name, description: tool.description, website_url: tool.website_url, logo_url: tool.logo_url, categories: tool.categories || [], tier: Array.isArray(tool.tier) ? tool.tier : [], is_hot: tool.is_hot || false, is_trending: tool.is_trending || false })
    setIsModalOpen(true)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('submissions').update({ status: newStatus }).eq('id', id)
    fetchTools()
  }

  return (
    // FIXED INSET-0 + BG SOLID UNTUK MENUTUP NAVBAR/FOOTER GLOBAL
    <main className="fixed inset-0 bg-[#0a0a0c] text-white z-[9999] overflow-y-auto">
      <nav className="border-b border-white/10 bg-black sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-lg">N</div>
          <h1 className="font-black text-sm tracking-tighter uppercase leading-none">Admin Terminal</h1>
        </div>
        <button onClick={() => { supabase.auth.signOut(); router.push("/login") }} className="text-[10px] font-black uppercase text-white/40 hover:text-red-400">Exit Admin</button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
        
        {/* ROW: ADVERTISING CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* BANNER SPONSOR */}
          <div className="p-8 bg-amber-500/[0.03] border border-amber-500/20 rounded-[2.5rem] space-y-6">
            <h2 className="text-xs font-black uppercase text-amber-500 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Hero Banner Ad</h2>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-black rounded-lg border border-white/10 relative overflow-hidden flex items-center justify-center shrink-0">
                {sponsorData.banner_url ? <Image src={sponsorData.banner_url} alt="Sponsor" fill className="object-cover" unoptimized /> : <Upload className="w-4 h-4 opacity-10" />}
              </div>
              <input type="file" onChange={(e) => handleUploadLogo(e, true)} className="text-[10px] flex-1" />
            </div>
            <input value={sponsorData.target_url || ""} onChange={e => setSponsorData({...sponsorData, target_url: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] outline-none" placeholder="Target Link" />
            <div className="flex gap-2">
              <button onClick={handleUpdateSponsor} className="flex-1 bg-amber-500 text-black py-3 rounded-xl text-[10px] font-black uppercase">Sync Banner</button>
              <button onClick={handleRemoveSponsor} className="bg-red-500/10 text-red-500 px-4 rounded-xl"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>

          {/* CPA SCRIPTS (LEFT & RIGHT) */}
          <div className="p-8 bg-indigo-500/[0.03] border border-indigo-500/20 rounded-[2.5rem] space-y-6">
            <h2 className="text-xs font-black uppercase text-indigo-500 flex items-center gap-2"><Code2 className="w-4 h-4" /> CPA Skyscraper Scripts</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-white/20 uppercase">Left Script</label>
                <textarea value={cpaLeft.script_code || ""} onChange={e => setCpaLeft({...cpaLeft, script_code: e.target.value})} className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-[9px] font-mono outline-none" placeholder="Paste script..." />
                <div className="flex gap-2">
                  <button onClick={() => setCpaLeft({...cpaLeft, is_active: !cpaLeft.is_active})} className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase ${cpaLeft.is_active ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/20'}`}>{cpaLeft.is_active ? 'Active' : 'OFF'}</button>
                  <button onClick={() => handleSyncCpa('left')} className="bg-indigo-600 px-3 rounded-lg"><Save className="w-3 h-3 text-white" /></button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-white/20 uppercase">Right Script</label>
                <textarea value={cpaRight.script_code || ""} onChange={e => setCpaRight({...cpaRight, script_code: e.target.value})} className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-[9px] font-mono outline-none" placeholder="Paste script..." />
                <div className="flex gap-2">
                  <button onClick={() => setCpaRight({...cpaRight, is_active: !cpaRight.is_active})} className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase ${cpaRight.is_active ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/20'}`}>{cpaRight.is_active ? 'Active' : 'OFF'}</button>
                  <button onClick={() => handleSyncCpa('right')} className="bg-indigo-600 px-3 rounded-lg"><Save className="w-3 h-3 text-white" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DATABASE TABLE (ASLI) */}
        <div className="flex justify-between items-center mb-8 px-2">
           <h2 className="text-xl font-black uppercase italic border-l-4 border-indigo-600 pl-4">Database Intelligence</h2>
           <button onClick={() => { setEditingId(null); setIsModalOpen(true) }} className="bg-indigo-600 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Initialize
           </button>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
          <table className="w-full text-left">
            <thead className="text-[9px] font-black uppercase text-white/20 border-b border-white/5 bg-white/[0.01]">
              <tr>
                <th className="px-8 py-5">Module Identity</th>
                <th className="px-8 py-5">Classification</th>
                <th className="px-8 py-5 text-center">Flags</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl relative overflow-hidden border border-white/10 shrink-0">
                        {tool.logo_url && <Image src={tool.logo_url} alt="Logo" fill className="object-cover" unoptimized />}
                      </div>
                      <p className="font-black text-xs uppercase italic text-indigo-400">{tool.tool_name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {tool.categories?.map((c: string) => <span key={c} className="px-2 py-0.5 bg-white/5 text-white/30 text-[7px] font-black rounded border border-white/5 uppercase">{c}</span>)}
                      {tool.tier?.map((t: string) => <span key={t} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[7px] font-black rounded border border-indigo-500/10 uppercase italic">{t}</span>)}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex gap-2 justify-center">
                       <button onClick={() => supabase.from('submissions').update({ is_hot: !tool.is_hot }).eq('id', tool.id).then(() => fetchTools())} className={`p-2 rounded-xl ${tool.is_hot ? 'bg-orange-500 text-white shadow-lg' : 'bg-white/5 opacity-20'}`}><Flame className="w-3.5 h-3.5" /></button>
                       <button onClick={() => supabase.from('submissions').update({ is_trending: !tool.is_trending }).eq('id', tool.id).then(() => fetchTools())} className={`p-2 rounded-xl ${tool.is_trending ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/5 opacity-20'}`}><Zap className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[8px] font-black uppercase text-emerald-400">{tool.status}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(tool)} className="p-2 text-white/20 hover:text-indigo-500"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => { if(confirm("Destroy?")) supabase.from('submissions').delete().eq('id', tool.id).then(() => fetchTools()) }} className="p-2 text-white/20 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ISINYA SAMA PERSIS DENGAN KODE AWAL LU (TIDAK BERUBAH) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-[#0d0d0f] border border-white/10 w-full max-w-xl rounded-[2.5rem] p-10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter italic border-l-4 border-indigo-600 pl-4">{editingId ? 'Modify Intel' : 'Deploy Intel'}</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center gap-6 p-5 bg-white/[0.02] border border-white/5 rounded-3xl">
                 <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                    {formData.logo_url ? <Image src={formData.logo_url} alt="Preview" fill className="object-cover" unoptimized /> : <Upload className="w-6 h-6 text-white/5" />}
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-white/20 uppercase mb-2 tracking-[0.2em]">Source Identity</p>
                    <input type="file" onChange={handleUploadLogo} className="text-[10px] text-white/40 cursor-pointer" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <input placeholder="Name" value={formData.tool_name} onChange={e => setFormData({...formData, tool_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-xs font-bold" required />
                <input placeholder="Link" value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-xs font-bold" required />
              </div>

              <textarea placeholder="Brief..." rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-xs font-medium" required />
              
              <div className="space-y-3">
                <label className="text-[9px] font-black text-indigo-400 uppercase flex items-center gap-2"><Tag className="w-3 h-3" /> Cost Tiers</label>
                <div className="flex flex-wrap gap-2">
                  {tierOptions.map(t => (
                    <button key={t} type="button" onClick={() => setFormData({...formData, tier: toggleArrayItem(formData.tier, t)})} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${formData.tier.includes(t) ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30" : "bg-white/5 border-white/5 text-white/20"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-white/20 uppercase">Segments</label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map(cat => (
                    <button key={cat} type="button" onClick={() => setFormData({...formData, categories: toggleArrayItem(formData.categories, cat)})} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${formData.categories.includes(cat) ? "bg-white/20 border-white/40 text-white" : "bg-white/5 border-white/5 text-white/20"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-white/[0.03] rounded-3xl border border-white/5">
                 <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.is_hot} onChange={e => setFormData({...formData, is_hot: e.target.checked})} className="hidden" />
                    <div className={`w-10 h-6 rounded-full relative transition-all ${formData.is_hot ? 'bg-orange-500' : 'bg-white/10'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.is_hot ? 'left-5' : 'left-1'}`} /></div>
                    <span className="text-[9px] font-black uppercase text-white/20">Hero</span>
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.is_trending} onChange={e => setFormData({...formData, is_trending: e.target.checked})} className="hidden" />
                    <div className={`w-10 h-6 rounded-full relative transition-all ${formData.is_trending ? 'bg-blue-500' : 'bg-white/10'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.is_trending ? 'left-5' : 'left-1'}`} /></div>
                    <span className="text-[9px] font-black uppercase text-white/20">Trend</span>
                 </label>
              </div>

              <button type="submit" disabled={uploading || loading} className="w-full bg-white text-black py-5 rounded-[2rem] font-black uppercase text-[11px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                <Save className="w-5 h-5" /> {loading ? "Syncing..." : "Publish Protocol"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}