"use client";

import React, { useState } from "react";
// Pastikan kamu sudah menginstal lucide-react (npm install lucide-react)
import { 
  LayoutDashboard, 
  BookOpen, 
  Scan, 
  BarChart3, 
  Gift, 
  MessageSquare, 
  User, 
  Settings, 
  Search, 
  Bell,
  Cpu
} from "lucide-react";

export default function KlasifikasiAI() {
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  const categories = [
    { name: "Organik", desc: "Tempat sampah hijau", color: "bg-emerald-500", icon: "🥬" },
    { name: "Plastik", desc: "Tempat sampah biru", color: "bg-sky-500", icon: "🧴" },
    { name: "Kertas", desc: "Tempat sampah kuning", color: "bg-amber-500", icon: "📦" },
    { name: "Logam", desc: "Tempat sampah abu", color: "bg-slate-500", icon: "🥫" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans" suppressHydrationWarning>
      
      {/* SIDEBAR LEFT */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-2 px-2 py-4 mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
              🌱
            </div>
            <div>
              <h1 className="font-bold text-lg text-emerald-600 leading-none">TongCi</h1>
              <span className="text-xs text-pink-500 font-medium">Sampah Cinta 💕</span>
            </div>
          </div>

          <nav className="space-y-1">
            <SidebarLink icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <SidebarLink icon={<BookOpen size={18} />} label="Edukasi Sampah" />
            <SidebarLink icon={<Scan size={18} />} label="Klasifikasi AI" active />
            <SidebarLink icon={<BarChart3 size={18} />} label="Statistik" />
            <SidebarLink icon={<Gift size={18} />} label="Reward" />
            <SidebarLink icon={<MessageSquare size={18} />} label="Chat AI" />
            <SidebarLink icon={<User size={18} />} label="Profil" />
            <SidebarLink icon={<Settings size={18} />} label="Pengaturan" />
          </nav>
        </div>

        <div className="bg-pink-50 rounded-xl p-3 flex items-center gap-3 border border-pink-100">
          <div className="text-2xl">🤖</div>
          <div>
            <p className="text-xs font-bold text-slate-700">CiCi siap bantu! 💕</p>
            <p className="text-[10px] text-slate-500">Klik Chat AI untuk tanya</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        
        {/* TOPBAR / HEADER */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-emerald-700 text-sm tracking-wide">Klasifikasi AI</h2>
          </div>

          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari fitur, tips, informasi..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center text-xs">
              A
            </div>
          </div>
        </header>

        {/* MAIN BODY WORKSPACE */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* CARD UTAMA: SCANNER INTERFACE */}
          <section className="bg-white rounded-3xl p-8 border border-emerald-50 shadow-sm min-h-[400px] flex flex-col justify-between relative overflow-hidden">
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  Klasifikasi Sampah AI 🤖
                </h3>
                <p className="text-xs text-emerald-600 font-medium mt-0.5">
                  Foto sampahmu, AI akan mengidentifikasi jenisnya!
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center my-auto py-8">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 text-4xl mb-4 relative animate-bounce">
                🗑️
                <span className="absolute -bottom-1 -right-1 text-base">🔍</span>
              </div>

              <h4 className="font-bold text-slate-800 mb-1">Menganalisis gambar...</h4>
              <p className="text-xs text-emerald-600 font-medium mb-4 flex items-center gap-1">
                CiCi sedang bekerja keras 🔍
              </p>

              <div className="w-64 bg-emerald-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-2/3 rounded-full animate-pulse"></div>
              </div>

              <button 
                onClick={() => setIsAnalyzing(!isAnalyzing)}
                className="text-xs text-emerald-600 underline font-semibold mt-6 hover:text-emerald-700 transition-colors"
              >
                Lihat hasil demo →
              </button>
            </div>

          </section>

          {/* GRID KATEGORI SAMPAH BAWAH */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-200 cursor-pointer"
              >
                <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center text-2xl text-white mb-3 shadow-sm`}>
                  {cat.icon}
                </div>
                <h4 className="font-bold text-sm text-slate-800">{cat.name}</h4>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">{cat.desc}</p>
              </div>
            ))}
          </section>

        </main>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button className="fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 hover:bg-emerald-600 transition-all font-semibold text-xs border border-emerald-400">
        <span className="text-base">🤖</span>
        <span>CiCi Tanya AI</span>
      </button>

    </div>
  );
}

function SidebarLink({ icon, label, active = false }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
        active
          ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}