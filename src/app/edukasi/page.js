"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
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
  ChevronRight,
  CheckCircle2,
  ArrowDownWideNarrow,
  RefreshCw,
  Recycle,
  Menu,
  X
} from "lucide-react";

// Komponen SidebarLink dengan ikon di dalam lingkaran rapi
function SidebarLink({ icon, label, href = "#", active = false, sidebarOpen = true }) {
  return (
    <a
      href={href}
      className={`flex items-center rounded-xl text-xs font-semibold transition-all duration-200 ${
        sidebarOpen ? "px-4 py-2 gap-3" : "p-2 justify-center"
      } ${
        active
          ? "bg-emerald-500 text-white shadow-md shadow-emerald-100 scale-[1.02]"
          : "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
        active ? "bg-white/20" : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
      }`}>
        {icon}
      </div>
      {sidebarOpen && <span>{label}</span>}
    </a>
  );
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("organik");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const educationContent = {
    organik: [
      { title: "Apa itu sampah organik?", slug: "apa-itu-sampah-organik" },
      { title: "Cara mengompos sampah organik?", slug: "cara-mengompos-sampah-organik" },
      { title: "Manfaat kompos organik", slug: "manfaat-kompos-organik" }
    ],
    plastik: [
      { title: "Jenis plastik yang bisa didaur ulang?", slug: "jenis-plastik-daur-ulang" },
      { title: "Cara membersihkan plastik sebelum daur ulang?", slug: "cara-bersihkan-sampah-plastik" },
      { title: "Berapa lama plastik terurai?", slug: "berapa-lama-plastik-terurai" }
    ],
    kertas: [
      { title: "Proses mendaur ulang kertas di rumah", slug: "proses-daur-ulang-kertas" },
      { title: "Jenis kertas yang tidak boleh masuk tempat sampah daur ulang", slug: "kertas-tidak-boleh-didaur-ulang" },
      { title: "Dampak pengurangan penggunaan kertas terhadap hutan", slug: "dampak-pengurangan-kertas" }
    ],
    logam: [
      { title: "Cara memilah sampah kaleng dan besi", slug: "cara-memilah-sampah-logam" },
      { title: "Bahaya membuang sampah elektronik sembarangan", slug: "bahaya-sampah-elektronik" },
      { title: "Tempat penyaluran limbah logam dan baterai bekas", slug: "tempat-penyaluran-limbah-logam" }
    ]
  };

  const tabs = [
    { id: "organik", name: "Organik", icon: "🥬", activeBg: "bg-emerald-500 text-white shadow-sm", inactiveBg: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100" },
    { id: "plastik", name: "Plastik", icon: "🧴", activeBg: "bg-sky-500 text-white shadow-sm", inactiveBg: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100" },
    { id: "kertas", name: "Kertas", icon: "📦", activeBg: "bg-amber-500 text-white shadow-sm", inactiveBg: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100" },
    { id: "logam", name: "Logam", icon: "🥫", activeBg: "bg-slate-500 text-white shadow-sm", inactiveBg: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100" },
  ];

  return (
    // suppressHydrationWarning ditambahkan di sini untuk mengabaikan gangguan ekstensi browser
    <div className="flex min-h-screen bg-emerald-50/30 text-emerald-800 font-sans animate-fade-in" suppressHydrationWarning>
      
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-100 flex flex-col gap-1 p-4 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20 items-center"}`}>
        <div className="w-full">
          {/* Logo Utama */}
          <div className={`flex items-center gap-3 py-2 mb-2 ${sidebarOpen ? "px-2" : "justify-center"}`}>
            <div className="w-14 h-14 relative flex-shrink-0">
              <Image src="/logo.png" alt="TongCi Logo" fill sizes="56px" className="object-contain scale-110" priority />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg text-emerald-600 leading-none tracking-wide">TongCi</h1>
                <span className="text-xs text-pink-500 font-bold drop-shadow-sm">Sampah Cinta 💕</span>
              </div>
            )}
          </div>

          {/* Navigasi */}
          <nav className="space-y-1 w-full">
            <SidebarLink icon={<LayoutDashboard size={16} />} label="Dashboard" href="#" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<BookOpen size={16} />} label="Edukasi Sampah" href="#" active sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<Scan size={16} />} label="Klasifikasi AI" href="#" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<BarChart3 size={16} />} label="Statistik" href="#" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<Gift size={16} />} label="Reward" href="#" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<MessageSquare size={16} />} label="Chat AI" href="#" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<User size={16} />} label="Profil" href="#" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<Settings size={16} />} label="Pengaturan" href="#" sidebarOpen={sidebarOpen} />
          </nav>
        </div>
        
        {/* Banner Bawah */}
        {sidebarOpen ? (
          <div className="bg-emerald-50/50 rounded-2xl p-3 flex items-center gap-3 border border-emerald-100/50 hover:scale-[1.01] transition-transform w-full mt-4">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image src="/logo.png" alt="CiCi mini" fill sizes="40px" className="object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-800">CiCi siap bantu! 💕</p>
              <p className="text-[10px] text-emerald-600 font-medium">Klik Chat AI untuk tanya</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 relative flex-shrink-0 mt-4 mb-2">
            <Image src="/logo.png" alt="CiCi mini" fill sizes="40px" className="object-contain" />
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-emerald-700 hover:text-emerald-500 p-1.5 rounded-lg hover:bg-slate-50 transition-all active:scale-95">
              <Menu size={20} />
            </button>
            <h2 className="font-bold text-emerald-800 text-sm tracking-wide hidden sm:block">Edukasi Sampah</h2>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-2.5 h-4 w-4 text-emerald-500" />
            <input type="text" className="w-full pl-10 pr-4 py-2 bg-emerald-50/40 border border-emerald-100/60 rounded-full text-xs text-emerald-800" />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-emerald-500 hover:text-emerald-600 relative p-1">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-emerald-500 text-white font-bold rounded-full flex items-center justify-center text-xs">A</div>
          </div>
        </header>

        {/* Workspace Utama */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Section Pilihan Judul Edukasi */}
          <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-xl text-emerald-800 flex items-center gap-2">Edukasi Sampah 📚</h3>
              <p className="text-xs text-emerald-500 font-semibold mt-1">Pelajari cara mengelola sampah dengan benar!</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all active:scale-95 duration-200 ${
                    activeTab === tab.id ? tab.activeBg : tab.inactiveBg
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            {/* List Judul Artikel dengan Link Dinamis */}
            <div className="space-y-3 pt-2">
              {educationContent[activeTab] && educationContent[activeTab].map((item, idx) => (
                <Link 
                  key={idx}
                  href={`/edukasi/${activeTab}/${item.slug}`}
                  className="w-full flex items-center justify-between p-4 bg-white border border-emerald-100/40 rounded-2xl cursor-pointer hover:bg-emerald-50/30 hover:border-emerald-300/60 hover:scale-[1.005] transition-all duration-200 group shadow-sm"
                >
                  <span className="text-xs font-bold text-emerald-800 group-hover:text-emerald-900 transition-colors">
                    {item.title}
                  </span>
                  <ChevronRight size={16} className="text-emerald-500 group-hover:text-emerald-700 transition-colors" />
                </Link>
              ))}
            </div>
          </section>

          {/* 3R Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center"><ArrowDownWideNarrow size={20} /></div>
              <span className="inline-block bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Reduce</span>
              <h4 className="font-bold text-xs text-emerald-800">Kurangi penggunaan produk sekali pakai.</h4>
              <ul className="space-y-2 text-[11px] text-emerald-700 font-semibold">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Bawa tas belanja sendiri</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Hindari sedotan plastik</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><RefreshCw size={20} /></div>
              <span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Reuse</span>
              <h4 className="font-bold text-xs text-emerald-800">Gunakan kembali barang yang masih bisa dipakai.</h4>
              <ul className="space-y-2 text-[11px] text-emerald-700 font-semibold">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Gunakan botol minum sendiri</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Perbaiki barang rusak</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Recycle size={20} /></div>
              <span className="inline-block bg-pink-50 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Recycle</span>
              <h4 className="font-bold text-xs text-emerald-800">Daur ulang agar menjadi bahan baru.</h4>
              <ul className="space-y-2 text-[11px] text-emerald-700 font-semibold">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Pilah sampah berdasarkan jenis</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Bersihkan sebelum didaur ulang</li>
              </ul>
            </div>
          </section>
        </main>
      </div>

      {/* Floating Action AI Button */}
      <button className="fixed bottom-6 right-6 bg-emerald-500 text-white pl-4 pr-6 py-3 rounded-full shadow-lg flex items-center gap-4 hover:bg-emerald-600 hover:scale-105 transition-all duration-200 font-bold text-xs border border-emerald-400 z-50 group">
          <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
            <Image src="/logo.png" alt="CiCi float" fill sizes="32px" className="object-contain scale-[1.8] origin-center" />
          </div>
          <span className="tracking-wide">CiCi Tanya AI</span>
      </button>
    </div>
  );
}