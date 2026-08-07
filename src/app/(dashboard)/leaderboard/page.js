"use client";

import React from "react";
import { Award, Gift, Sparkles, Trophy } from "lucide-react";

export default function Leaderboard() {
  const topUsers = [
    { rank: 1, name: "Defina Indriani", points: 840, avatar: "👩‍🌾" },
    { rank: 2, name: "Budi Santoso", points: 720, avatar: "👨‍💻" },
    { rank: 3, name: "Amelia Putri", points: 680, avatar: "👩" },
    { rank: 4, name: "Reza Rahardian", points: 510, avatar: "👨" },
    { rank: 5, name: "Siti Rahma", points: 430, avatar: "👩‍⚕️" },
  ];

  const rewards = [
    { title: "E-Voucher Gopay Rp 10.000", cost: 100, icon: "💳", stock: "Tersedia" },
    { title: "Tumbler Bambu Ramah Lingkungan", cost: 350, icon: "🥛", stock: "Tersedia" },
    { title: "Tas Belanja Canvas TongCi", cost: 200, icon: "🛍️", stock: "Tersedia" },
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center text-9xl">
          🏆
        </div>
        <div className="max-w-xl space-y-2 relative z-10">
          <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase inline-flex items-center gap-1.5 backdrop-blur-sm">
            <Sparkles size={12} />
            Leaderboard & Hadiah
          </span>
          <h3 className="font-extrabold text-xl md:text-2xl">
            Tukarkan Sampahmu Menjadi Hadiah Menarik! 🎁
          </h3>
          <p className="text-xs text-amber-50 leading-relaxed font-medium">
            Kumpulkan poin sebanyak-banyaknya dengan memilah sampah secara tepat. Lihat posisimu di leaderboard nasional dan tukarkan dengan merchandise ramah lingkungan.
          </p>
        </div>
      </section>

      {/* GRID SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEADERBOARD CARD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-500" size={20} />
            <h4 className="font-extrabold text-sm text-slate-800">Top Pemilah Sampah Bulan Ini</h4>
          </div>

          <div className="divide-y divide-slate-50">
            {topUsers.map((u) => (
              <div key={u.rank} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    u.rank === 1 ? "bg-amber-100 text-amber-600" :
                    u.rank === 2 ? "bg-slate-100 text-slate-600" :
                    u.rank === 3 ? "bg-orange-100 text-orange-600" :
                    "bg-slate-50 text-slate-500"
                  }`}>
                    {u.rank}
                  </span>

                  <span className="text-base shrink-0">{u.avatar}</span>
                  <span className="text-xs font-bold text-slate-800">{u.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                  <Award size={12} className="text-amber-500" />
                  <span>{u.points} Pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REWARDS CARD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Gift className="text-emerald-500" size={20} />
            <h4 className="font-extrabold text-sm text-slate-800">Hadiah Penukaran Poin</h4>
          </div>

          <div className="space-y-3">
            {rewards.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">{r.title}</h5>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                      {r.stock}
                    </span>
                  </div>
                </div>
                <button className="flex flex-col items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-600 border border-emerald-200 hover:border-emerald-300 font-bold px-3 py-1.5 rounded-xl text-xs active:scale-95 transition-all shadow-sm cursor-pointer">
                  <span>Tukar</span>
                  <span className="text-[9px] text-amber-600 font-extrabold">{r.cost} Pts</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
