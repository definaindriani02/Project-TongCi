"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  History,
  Camera,
  Gift,
  Search,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Inbox,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Helper badge kategori
const getCategoryInfo = (category = "") => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("organik") && !cat.includes("anorganik")) {
    return { label: "Organik", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "🥬" };
  }
  if (cat.includes("plastik")) {
    return { label: "Plastik", bg: "bg-sky-50 text-sky-700 border-sky-200", icon: "🧴" };
  }
  if (cat.includes("kertas")) {
    return { label: "Kertas", bg: "bg-amber-50 text-amber-700 border-amber-200", icon: "📦" };
  }
  if (cat.includes("logam") || cat.includes("besi") || cat.includes("kaleng")) {
    return { label: "Logam", bg: "bg-slate-100 text-slate-700 border-slate-300", icon: "🥫" };
  }
  if (cat.includes("b3") || cat.includes("bahaya") || cat.includes("elektronik")) {
    return { label: "B3 / Bahaya", bg: "bg-rose-50 text-rose-700 border-rose-200", icon: "⚠️" };
  }
  if (cat.includes("reward") || cat.includes("tukar") || cat.includes("klaim")) {
    return { label: "Reward", bg: "bg-pink-50 text-pink-700 border-pink-200", icon: "🎁" };
  }
  return { label: category || "Anorganik", bg: "bg-blue-50 text-blue-700 border-blue-200", icon: "♻️" };
};

// Helper format tanggal
const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function RiwayatPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'scan' | 'reward'
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);

  const fetchActivities = async (uid) => {
    try {
      setLoading(true);
      const targetUserId = uid || userId;
      if (!targetUserId) return;

      const { data, error } = await supabase
        .from("scan_history")
        .select("*")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setActivities(data);
      } else {
        console.error("Gagal mengambil riwayat:", error);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let channel = null;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const uid = session.user.id;
      setUserId(uid);
      await fetchActivities(uid);

      // Realtime subscription
      channel = supabase
        .channel(`riwayat-page-${uid}-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "scan_history",
            filter: `user_id=eq.${uid}`,
          },
          () => {
            fetchActivities(uid);
          }
        )
        .subscribe();
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Filter Data
  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const isReward =
        (item.category || "").toLowerCase().includes("reward") ||
        (item.points_earned !== null && item.points_earned < 0);

      // Filter Tab
      if (activeTab === "scan" && isReward) return false;
      if (activeTab === "reward" && !isReward) return false;

      // Filter Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (item.item_name || item.waste_name || "").toLowerCase();
        const cat = (item.category || "").toLowerCase();
        return name.includes(q) || cat.includes(q);
      }

      return true;
    });
  }, [activities, activeTab, searchQuery]);

  // Statistik Ringkasan
  const stats = useMemo(() => {
    let totalScan = 0;
    let totalPointsEarned = 0;
    let totalPointsRedeemed = 0;

    activities.forEach((item) => {
      const pts = item.points_earned || 0;
      const isReward =
        (item.category || "").toLowerCase().includes("reward") || pts < 0;

      if (isReward) {
        totalPointsRedeemed += Math.abs(pts);
      } else {
        totalScan += 1;
        totalPointsEarned += pts;
      }
    });

    return { totalScan, totalPointsEarned, totalPointsRedeemed };
  }, [activities]);

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto pb-12">
      {/* HEADER SECTION */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#22C55E]/10 text-[#22C55E] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <History size={13} />
              Aktivitas Pengguna
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1.5">
            Riwayat Aktivitas Lengkap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Pantau seluruh catatan pemilahan sampah dan penukaran poin reward kamu secara transparan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => fetchActivities()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Muat ulang riwayat"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-[#22C55E]" : ""} />
            Refresh
          </button>
          <Link
            href="/scan"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#22C55E] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs shadow-emerald-200 transition-all active:scale-95"
          >
            <Camera size={14} />
            Scan Sampah Baru
          </Link>
        </div>
      </section>

      {/* STATS OVERVIEW CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Camera size={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400">Total Scan Sampah</span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">
              {stats.totalScan.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-semibold text-slate-500">kali</span>
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ArrowUpRight size={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400">Poin Diperoleh</span>
            <h3 className="text-xl font-extrabold text-amber-600 mt-0.5">
              +{stats.totalPointsEarned.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-semibold text-slate-500">Pts</span>
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <Gift size={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400">Poin Ditukarkan</span>
            <h3 className="text-xl font-extrabold text-pink-600 mt-0.5">
              -{stats.totalPointsRedeemed.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-semibold text-slate-500">Pts</span>
            </h3>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH BAR */}
      <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* TABS */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-slate-800 shadow-2xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Semua ({activities.length})
            </button>
            <button
              onClick={() => setActiveTab("scan")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "scan"
                  ? "bg-white text-[#22C55E] shadow-2xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Camera size={13} />
              Scan Sampah ({stats.totalScan})
            </button>
            <button
              onClick={() => setActiveTab("reward")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "reward"
                  ? "bg-white text-pink-600 shadow-2xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Gift size={13} />
              Penukaran Poin
            </button>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama item atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3.5 text-xs text-slate-700 outline-none focus:border-[#22C55E] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* LIST / TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Waktu</th>
                <th className="px-5 py-3.5">Nama Aktivitas / Item</th>
                <th className="px-5 py-3.5">Kategori</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-3 w-28 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-3.5 w-40 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-20 bg-slate-100 rounded-full" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-16 bg-slate-100 rounded-full" /></td>
                    <td className="px-5 py-4 text-right"><div className="h-3.5 w-14 bg-slate-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2.5">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Inbox size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700">Belum Ada Riwayat Aktivitas</h4>
                      <p className="text-xs text-slate-400">
                        {searchQuery
                          ? "Tidak ditemukan aktivitas yang cocok dengan kata kunci pencarian."
                          : "Mulai scan sampah atau tukarkan poin hadiah untuk melihat riwayat aktivitas di sini."}
                      </p>
                      {!searchQuery && (
                        <Link
                          href="/scan"
                          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#22C55E] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-600 transition-all"
                        >
                          <Camera size={14} /> Scan Sekarang
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredActivities.map((item, idx) => {
                  const catInfo = getCategoryInfo(item.category);
                  const pts = item.points_earned ?? 0;
                  const isDeduction =
                    pts < 0 || (item.category || "").toLowerCase().includes("reward");

                  return (
                    <motion.tr
                      key={item.id || idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                      className="hover:bg-emerald-50/30 transition-colors"
                    >
                      {/* Tanggal */}
                      <td className="px-5 py-4 text-slate-500 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{formatDateTime(item.created_at)}</span>
                        </div>
                      </td>

                      {/* Nama Item */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{catInfo.icon}</span>
                          <span className="font-bold text-slate-800">
                            {item.item_name || item.waste_name || "Aktivitas"}
                          </span>
                        </div>
                      </td>

                      {/* Kategori Badge */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${catInfo.bg}`}
                        >
                          {catInfo.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                          Selesai
                        </span>
                      </td>

                      {/* Poin (+ / -) */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <span
                          className={`text-xs font-extrabold ${
                            isDeduction ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {isDeduction
                            ? `${pts > 0 ? `-${pts}` : pts} Pts`
                            : `+${pts} Pts`}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
