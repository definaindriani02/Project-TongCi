"use client";

import React from "react";
import { BarChart3, TrendingUp, Calendar, Recycle, Sparkles } from "lucide-react";

export default function Statistik() {
  const stats = [
    { name: "Organik", amount: "4.5 Kg", percent: 45, color: "bg-emerald-500" },
    { name: "Plastik", amount: "3.2 Kg", percent: 32, color: "bg-sky-500" },
    { name: "Kertas", amount: "1.8 Kg", percent: 18, color: "bg-amber-500" },
    { name: "Logam", amount: "0.5 Kg", percent: 5, color: "bg-slate-500" },
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center text-9xl">
          📈
        </div>
        <div className="max-w-xl space-y-2 relative z-10">
          <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase inline-flex items-center gap-1.5 backdrop-blur-sm">
            <Sparkles size={12} />
            Statistik & Dampak Hijau
          </span>
          <h3 className="font-extrabold text-xl md:text-2xl">
            Pantau Dampak Positifmu Bagi Bumi! 🌍
          </h3>
          <p className="text-xs text-emerald-50 leading-relaxed font-medium">
            Lihat riwayat daur ulang, perbandingan sampah harianmu, serta estimasi pengurangan karbon dioksida yang berhasil kamu kontribusikan.
          </p>
        </div>
      </section>

      {/* STATS CONTAINERS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* RECYCLING DENSITY CARD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-emerald-500" size={20} />
              <h4 className="font-extrabold text-sm text-slate-800">Komposisi Sampah yang Didaur Ulang</h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Calendar size={10} /> Bulan Ini
            </span>
          </div>

          <div className="space-y-4">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{s.name}</span>
                  <span className="text-slate-500">{s.amount} ({s.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARBON REDUCTION CARD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[250px]">
          <div className="flex items-center gap-2">
            <Recycle className="text-sky-500" size={20} />
            <h4 className="font-extrabold text-sm text-slate-800">Dampak Lingkungan Kumulatif</h4>
          </div>

          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-2">🌳</div>
            <h5 className="font-extrabold text-lg text-emerald-800">12.5 Kg CO₂ Terkurangi</h5>
            <p className="text-[10px] text-slate-500 font-semibold max-w-xs mt-1">
              Setara dengan menyelamatkan 1 pohon kecil dan mencegah emisi gas rumah kaca TPA selama 3 bulan.
            </p>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-600 shrink-0" />
            <span className="text-[9px] text-emerald-700 font-bold leading-normal">
              Aktivitas daur ulang Anda meningkat 14% lebih tinggi dibandingkan minggu lalu! Tetap pertahankan!
            </span>
          </div>
        </div>

      </section>

    </div>
  );
}
