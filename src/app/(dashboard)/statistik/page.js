"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sparkles, TrendingUp, Leaf, Zap, RefreshCw } from "lucide-react";

export default function StatistikPage() {
  const [stats, setStats] = useState({
    organik: 0,
    plastik: 0,
    kertas: 0,
    logam: 0,
    totalKg: 0,
    totalCarbonKg: "0.0",
  });
  const [loading, setLoading] = useState(true);

  const fetchRealtimeStats = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // MENGAMBIL DATA DARI TABEL statistik (sesuai kolom category & weight)
      const { data: scans, error } = await supabase
        .from("statistik")
        .select("category, weight, created_at")
        .eq("user_id", session.user.id);

      if (error || !scans || scans.length === 0) {
        setLoading(false);
        return;
      }

      let org = 0, plas = 0, ker = 0, log = 0;

      scans.forEach((scan) => {
        // Ambil berat aktual dari kolom weight (default ke 0.5 jika kosong/null)
        const w = parseFloat(scan.weight) || 0.5; 
        const cat = scan.category?.toLowerCase() || "";
        
        if (cat.includes("organik")) org += w;
        else if (cat.includes("plastik")) plas += w;
        else if (cat.includes("kertas")) ker += w;
        else log += w;
      });

      const total = org + plas + ker + log;
      const carbon = (total * 2.5).toFixed(1);

      setStats({
        organik: org.toFixed(1),
        plastik: plas.toFixed(1),
        kertas: ker.toFixed(1),
        logam: log.toFixed(1),
        totalKg: total.toFixed(1),
        totalCarbonKg: carbon,
      });
    } catch (err) {
      console.error("Gagal memuat data statistik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealtimeStats();
  }, []);

  const totalWeight = parseFloat(stats.totalKg) || 1;
  const pOrganik = Math.round((parseFloat(stats.organik) / totalWeight) * 100) || 0;
  const pPlastik = Math.round((parseFloat(stats.plastik) / totalWeight) * 100) || 0;
  const pKertas = Math.round((parseFloat(stats.kertas) / totalWeight) * 100) || 0;
  const pLogam = Math.max(0, 100 - (pOrganik + pPlastik + pKertas));

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto pb-12">
      {/* Main Section */}
      <section className="bg-white rounded-3xl p-6 md:p-10 border border-[#22C55E]/20 shadow-sm relative overflow-hidden">
        
        {/* Efek Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Statistik & Dampak Hijau
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span> Real-time Supabase
              </span>
            </div>
            <h3 className="font-black text-2xl md:text-3xl text-slate-800 tracking-tight mt-1">
              Pantau Dampak Positifmu Bagi Bumi! 🌱
            </h3>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Lihat akumulasi riwayat daur ulang, persentase kategori sampah, serta estimasi pengurangan emisi karbon.
            </p>
          </div>

          <button 
            onClick={fetchRealtimeStats}
            className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] text-xs font-bold rounded-2xl transition-all self-start md:self-auto border border-[#22C55E]/20 active:scale-95"
            title="Muat ulang data terbaru"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Data
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-16">
            <div className="bg-slate-50 rounded-3xl p-8 h-64 animate-pulse flex items-center justify-center text-slate-400 text-xs">Sinkronisasi data Supabase...</div>
            <div className="bg-slate-50 rounded-3xl p-8 h-64 animate-pulse flex items-center justify-center text-slate-400 text-xs">Menghitung kalkulasi karbon...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch relative z-10">
            
            {/* KARTU 1: KOMPOSISI SAMPAH */}
            <div className="bg-gradient-to-b from-white to-slate-50/50 border border-slate-100 rounded-3xl p-6 md:p-8 shadow-2xs space-y-6 flex flex-col justify-between transition-all hover:border-[#22C55E]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center font-bold">
                    <TrendingUp size={18} />
                  </div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-800">Komposisi Sampah yang Didaur Ulang</h4>
                </div>
                <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                  Keseluruhan
                </span>
              </div>

              {/* Bar Komposisi */}
              <div className="space-y-4 text-xs font-medium">
                {/* Organik */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">🌿 Organik</span>
                    <span className="font-bold text-slate-800">{stats.organik} kg ({pOrganik}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                    <div className="bg-[#22C55E] h-full rounded-full transition-all duration-1000 ease-out shadow-xs" style={{ width: `${pOrganik}%` }}></div>
                  </div>
                </div>

                {/* Plastik */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">🧴 Plastik</span>
                    <span className="font-bold text-slate-800">{stats.plastik} kg ({pPlastik}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                    <div className="bg-sky-500 h-full rounded-full transition-all duration-1000 ease-out shadow-xs" style={{ width: `${pPlastik}%` }}></div>
                  </div>
                </div>

                {/* Kertas */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">📦 Kertas</span>
                    <span className="font-bold text-slate-800">{stats.kertas} kg ({pKertas}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-1000 ease-out shadow-xs" style={{ width: `${pKertas}%` }}></div>
                  </div>
                </div>

                {/* Logam */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">🥫 Logam & B3</span>
                    <span className="font-bold text-slate-800">{stats.logam} kg ({pLogam}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                    <div className="bg-slate-600 h-full rounded-full transition-all duration-1000 ease-out shadow-xs" style={{ width: `${pLogam}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* KARTU 2: DAMPAK LINGKUNGAN KUMULATIF */}
            <div className="bg-gradient-to-br from-white via-emerald-50/10 to-[#22C55E]/5 border border-[#22C55E]/30 rounded-3xl p-6 md:p-8 shadow-2xs space-y-6 flex flex-col justify-between transition-all hover:border-[#22C55E]/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-white flex items-center justify-center font-bold shadow-sm">
                    <Leaf size={18} />
                  </div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-800">Dampak Lingkungan Kumulatif</h4>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">Hasil akumulasi kontribusi hijau kamu berdasarkan total sampah yang dipindai.</p>
              </div>

              {/* Box CO2 */}
              <div className="bg-white/90 backdrop-blur-md border border-[#22C55E]/20 rounded-2xl p-6 text-center space-y-2 shadow-xs relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 text-[#22C55E]/10 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles size={90} />
                </div>
                <h2 className="text-3xl font-black text-[#22C55E] tracking-tight">
                  {stats.totalCarbonKg} kg CO₂ <span className="text-xl font-bold text-slate-700">Terkurangi</span>
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Setara dengan menyelamatkan pohon kecil dan mencegah emisi gas rumah kaca di TPA.
                </p>
              </div>

              {/* Footer Stat */}
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold bg-white/60 p-3.5 rounded-2xl border border-slate-100">
                <span>Total Sampah Dipindai: <strong className="text-slate-800">{stats.totalKg} kg</strong></span>
                <span className="text-[#22C55E] bg-[#22C55E]/10 px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                  <Zap size={12} /> Terus tingkatkan!
                </span>
              </div>
            </div>

          </div>
        )}
      </section>
    </div>
  );
}