"use client";

import React, { useState, useEffect } from "react";
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
  Menu,
  Scale,
  Award,
  Calendar,
  Leaf,
} from "lucide-react";

// Import Recharts secara normal agar struktur & warna (fill) tidak hilang
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// 1. Data Tren Pemilahan 6 Bulan
const trendData = [
  { month: "Jan", Organik: 14, Plastik: 10 },
  { month: "Feb", Organik: 22, Plastik: 15 },
  { month: "Mar", Organik: 19, Plastik: 18 },
  { month: "Apr", Organik: 26, Plastik: 20 },
  { month: "Mei", Organik: 30, Plastik: 22 },
  { month: "Jun", Organik: 28, Plastik: 21 },
];

// 2. Data Komposisi Sampah (Donut)
const compositionData = [
  { name: "Organik", value: 40, color: "#10B981" },
  { name: "Plastik", value: 30, color: "#0EA5E9" },
  { name: "Kertas", value: 20, color: "#F59E0B" },
  { name: "Logam", value: 10, color: "#64748B" },
];

// 3. Data Sampah per Kategori (kg)
const categoryBarData = [
  { month: "Jan", total: 18, Organik: 18, Plastik: 12, Kertas: 8, Logam: 4 },
  { month: "Feb", total: 22, Organik: 22, Plastik: 15, Kertas: 10, Logam: 5 },
  { month: "Mar", total: 19, Organik: 19, Plastik: 18, Kertas: 12, Logam: 5 },
  { month: "Apr", total: 26, Organik: 26, Plastik: 20, Kertas: 14, Logam: 6 },
  { month: "Mei", total: 30, Organik: 30, Plastik: 22, Kertas: 15, Logam: 7 },
  { month: "Jun", total: 28, Organik: 28, Plastik: 21, Kertas: 13, Logam: 6 },
];

function SidebarLink({ icon, label, href = "#", active = false, sidebarOpen = true }) {
  return (
    <a
      href={href}
      className={`flex items-center rounded-xl text-xs font-semibold transition-all duration-200 ${
        sidebarOpen ? "px-4 py-2.5 gap-3" : "p-2 justify-center"
      } ${
        active
          ? "bg-emerald-500 text-white shadow-md shadow-emerald-100 scale-[1.02]"
          : "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          active ? "bg-white/20" : "bg-emerald-50 text-emerald-600"
        }`}
      >
        {icon}
      </div>
      {sidebarOpen && <span>{label}</span>}
    </a>
  );
}

// Tooltip khusus Tren Pemilahan
const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur border border-emerald-100 p-3 rounded-2xl shadow-lg text-xs space-y-1">
        <p className="font-extrabold text-emerald-900 border-b border-slate-100 pb-1">{label}</p>
        <p className="font-semibold text-emerald-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Organik: <span className="font-bold">{payload[0]?.value} kg</span>
        </p>
        <p className="font-semibold text-sky-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-500"></span>
          Plastik: <span className="font-bold">{payload[1]?.value} kg</span>
        </p>
      </div>
    );
  }
  return null;
};

// Tooltip khusus Sampah per Kategori
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur border border-emerald-100 p-3.5 rounded-2xl shadow-lg text-xs space-y-1.5 min-w-[130px]">
        <p className="font-extrabold text-emerald-900 text-sm border-b border-slate-100 pb-1">{label}</p>
        <div className="space-y-1 font-bold text-slate-600">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Organik
            </span>
            <span className="text-emerald-950 font-black">{data.Organik}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-sky-600">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span> Plastik
            </span>
            <span className="text-emerald-950 font-black">{data.Plastik}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-amber-500">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Kertas
            </span>
            <span className="text-emerald-950 font-black">{data.Kertas}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span> Logam
            </span>
            <span className="text-emerald-950 font-black">{data.Logam}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function StatistikPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Menggunakan rAF (requestAnimationFrame) untuk menghindari error "cascading renders" linter
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-emerald-50/20 text-emerald-800 font-sans">
      {/* 1. SIDEBAR */}
      <aside
        className={`bg-white border-r border-slate-100 flex flex-col justify-between p-4 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20 items-center"
        }`}
      >
        <div className="w-full">
          {/* Logo */}
          <div className={`flex items-center gap-3 py-2 mb-2 ${sidebarOpen ? "px-2" : "justify-center"}`}>
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image src="/logo.png" alt="TongCi Logo" fill sizes="40px" className="object-contain" priority />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-base text-emerald-600 leading-none">TongCi</h1>
                <span className="text-[10px] text-pink-500 font-bold">Sampah Cinta 💕</span>
              </div>
            )}
          </div>

          {/* Menu */}
          <nav className="space-y-1 w-full mt-4">
            <SidebarLink icon={<LayoutDashboard size={16} />} label="Dashboard" href="/dasboard" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<BookOpen size={16} />} label="Edukasi Sampah" href="/edukasi" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<Scan size={16} />} label="Klasifikasi AI" href="/scan" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<BarChart3 size={16} />} label="Statistik" href="/statistik" active sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<Gift size={16} />} label="Reward" href="/reward" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<MessageSquare size={16} />} label="Chat AI" href="/CICI" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<User size={16} />} label="Profil" href="/profil" sidebarOpen={sidebarOpen} />
            <SidebarLink icon={<Settings size={16} />} label="Pengaturan" href="/pengaturan" sidebarOpen={sidebarOpen} />
          </nav>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-emerald-700 hover:text-emerald-500 p-1.5 rounded-lg hover:bg-slate-50"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-bold text-emerald-800 text-sm hidden sm:block">Statistik</h2>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-2.5 h-4 w-4 text-emerald-500" />
            <input
              type="text"
              placeholder="Cari fitur, tips, informasi..."
              className="w-full pl-10 pr-4 py-2 bg-emerald-50/40 border border-emerald-100/60 rounded-full text-xs text-emerald-800 outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-emerald-500 relative p-1">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-emerald-500 text-white font-bold rounded-full flex items-center justify-center text-xs">
              A
            </div>
          </div>
        </header>

        {/* WORKSPACE STATISTIK */}
        <main className="flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto">
          <div>
            <h3 className="font-bold text-xl text-emerald-900">Statistik</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Pantau perkembangan pengelolaan sampahmu.</p>
          </div>

          {/* 4 CARDS RINGKASAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Scale size={18} />
              </div>
              <p className="text-2xl font-black text-emerald-900">142 kg</p>
              <p className="text-xs text-emerald-600 font-bold">Total Sampah</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award size={18} />
              </div>
              <p className="text-2xl font-black text-emerald-900">3.280</p>
              <p className="text-xs text-emerald-600 font-bold">Poin Diraih</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <p className="text-2xl font-black text-emerald-900">28</p>
              <p className="text-xs text-emerald-600 font-bold">Hari Aktif</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Leaf size={18} />
              </div>
              <p className="text-2xl font-black text-emerald-900">47 kg</p>
              <p className="text-xs text-emerald-600 font-bold">CO₂ Dikurangi</p>
            </div>
          </div>

          {/* 1. TREN PEMILAHAN 6 BULAN */}
          <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-emerald-900">Tren Pemilahan 6 Bulan</h4>
            <div className="h-56 w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOrganik" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                    <YAxis ticks={[0, 8, 16, 24, 32]} domain={[0, 32]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                    <Tooltip content={<CustomAreaTooltip />} />
                    <Area type="monotone" dataKey="Organik" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOrganik)" />
                    <Area type="monotone" dataKey="Plastik" stroke="#0284C7" strokeWidth={1.5} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          {/* 2. KOMPOSISI SAMPAH */}
          <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-emerald-900">Komposisi Sampah</h4>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
              <div className="h-44 w-44 relative flex items-center justify-center shrink-0">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={compositionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {compositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatResult={(val) => `${val}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="absolute text-center">
                  <span className="text-xl font-black text-emerald-950">100%</span>
                  <span className="block text-[10px] text-slate-400 font-bold">Total</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-2.5 w-full max-w-xs">
                {compositionData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-slate-900 font-extrabold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. SAMPAH PER KATEGORI (kg) */}
          <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-emerald-900">Sampah per Kategori (kg)</h4>
            <div className="h-56 w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                    <YAxis ticks={[0, 8, 16, 24, 32]} domain={[0, 32]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(241, 245, 249, 0.6)" }} />
                    <Bar dataKey="total" fill="#6096BA" radius={[6, 6, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
