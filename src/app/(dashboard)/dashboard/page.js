"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Scan, BookOpen, BarChart3, Recycle, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [scanCount, setScanCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);

        // Get profile points
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (prof) setProfile(prof);

        // Get scan count
        const { count } = await supabase
          .from("scans")
          .select("*", { count: "exact", head: true })
          .eq("user_id", session.user.id);
        
        setScanCount(count || 0);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* GREETING CARD */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-6 md:p-8 text-white shadow-md">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center text-9xl">
          🌱
        </div>
        <div className="max-w-xl space-y-3 relative z-10">
          <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase inline-flex items-center gap-1.5 backdrop-blur-sm">
            <Sparkles size={12} />
            TongCi AI Platform
          </span>
          <h3 className="font-extrabold text-xl md:text-2xl">
            Halo{user ? `, ${user.email.split("@")[0]}` : ""}! Selamat Datang di TongCi 👋
          </h3>
          <p className="text-xs text-emerald-50 leading-relaxed font-medium">
            Mari mulai memilah sampahmu hari ini. Foto sampah, biarkan AI kami mengklasifikasikan jenisnya, dan dapatkan poin untuk ditukarkan dengan hadiah menarik!
          </p>
          <div className="pt-2">
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-bold text-xs hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
            >
              <Scan size={14} /> Mulai Scan AI
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Points card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Award size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Poin Terkumpul</p>
            <h4 className="text-2xl font-extrabold text-slate-800">{profile?.points || 0} Pts</h4>
            <p className="text-[10px] font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
              <TrendingUp size={10} /> +18 Pts tiap scan sukses
            </p>
          </div>
        </div>

        {/* Scan Count Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Scan size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Scan Sampah</p>
            <h4 className="text-2xl font-extrabold text-slate-800">{scanCount} Kali</h4>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
              Diidentifikasi dengan Gemini AI
            </p>
          </div>
        </div>

        {/* Recycling Impact Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <Recycle size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Estimasi Daur Ulang</p>
            <h4 className="text-2xl font-extrabold text-slate-800">{(scanCount * 0.15).toFixed(2)} Kg</h4>
            <p className="text-[10px] font-semibold text-sky-600 mt-0.5">
              Mengurangi emisi TPA lokal
            </p>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="space-y-4">
        <h4 className="font-bold text-sm text-slate-700 tracking-wide">Navigasi Fitur Unggulan</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/scan" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors group flex flex-col justify-between min-h-[160px] text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Scan size={20} />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-xs text-slate-800">Klasifikasi AI</h5>
              <p className="text-[10px] text-slate-500 leading-normal">
                Gunakan kamera atau file foto untuk memilah sampahmu menggunakan Gemini.
              </p>
            </div>
          </Link>

          <Link href="/edukasi" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors group flex flex-col justify-between min-h-[160px] text-left">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen size={20} />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-xs text-slate-800">Edukasi Sampah</h5>
              <p className="text-[10px] text-slate-500 leading-normal">
                Pelajari metode 3R (Reduce, Reuse, Recycle) dan jenis-jenis tempat pembuangan sampah.
              </p>
            </div>
          </Link>

          <Link href="/chat" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors group flex flex-col justify-between min-h-[160px] text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles size={20} />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-xs text-slate-800">Chat AI - CiCi</h5>
              <p className="text-[10px] text-slate-500 leading-normal">
                Ada pertanyaan khusus tentang sampah atau lingkungan? Diskusi dengan asisten AI CiCi.
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* Guest Alert banner */}
      {!user && (
        <section className="bg-pink-50 border border-pink-100 p-4 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="text-pink-500 shrink-0 mt-0.5" size={18} />
          <div>
            <h5 className="font-bold text-xs text-pink-800">Anda Menggunakan Akun Tamu</h5>
            <p className="text-[10px] text-pink-600 font-medium leading-normal mt-0.5">
              Hasil scan Anda tidak akan tersimpan secara permanen dan Anda tidak dapat menabung poin hadiah. Silakan <Link href="/login" className="underline font-bold">Masuk</Link> atau <Link href="/register" className="underline font-bold">Daftar Akun</Link> untuk mulai menabung poin.
            </p>
          </div>
        </section>
      )}

    </div>
  );
}
