"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Award, ChevronLeft, ChevronRight, Crown, Medal, Search, Sparkles, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Pastikan path lib supabase kamu sesuai

// Helper untuk menentukan warna avatar berdasarkan nama/id
const TONES = [
  "bg-sky-100 text-sky-600",
  "bg-rose-100 text-rose-600",
  "bg-emerald-100 text-emerald-600",
  "bg-violet-100 text-violet-600",
  "bg-pink-100 text-pink-600",
  "bg-orange-100 text-orange-600",
  "bg-cyan-100 text-cyan-600",
];

function getTone(idStr) {
  let hash = 0;
  for (let i = 0; i < (idStr || "").length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TONES[Math.abs(hash) % TONES.length];
}

// Helper untuk menentukan Level Pengguna berdasarkan Poin
function getLevel(points = 0) {
  if (points >= 5000) return "Eco Hero";
  if (points >= 2000) return "Top Contributor";
  if (points >= 500) return "Top 10";
  return "Contributor";
}

// Helper untuk mendapatkan inisial nama
function getInitials(name = "") {
  if (!name) return "TC";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function Avatar({ user, large = false }) {
  return (
    <div className={`${large ? "h-14 w-14 md:h-16 md:w-16 text-base md:text-lg" : "h-9 w-9 text-[11px]"} ${user.tone} rounded-full flex items-center justify-center font-extrabold ring-4 ring-white shadow-sm shrink-0`}>
      {user.initials}
    </div>
  );
}

export default function Leaderboard() {
  const [filter, setFilter] = useState("Sepanjang Waktu");
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Ambil data User Login dan Fetch Profil awal
  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        // Cek user login saat ini
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }

        // Fetch data profil dari Supabase
        await fetchLeaderboardData();
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, [filter]);

  // 2. Fungsi Fetch Data dari Database Supabase
  const fetchLeaderboardData = async () => {
    let queryBuilder = supabase
      .from("profiles")
      .select("id, full_name, email, points, total_scan, created_at")
      .order("points", { ascending: false });

    // Filter berdasarkan rentang waktu jika ada
    if (filter === "Mingguan") {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      queryBuilder = queryBuilder.gte("created_at", oneWeekAgo);
    } else if (filter === "Bulanan") {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      queryBuilder = queryBuilder.gte("created_at", oneMonthAgo);
    }

    const { data, error } = await queryBuilder;

    if (!error && data) {
      // Map data Supabase ke struktur yang dipakai UI
      const formattedData = data.map((item, index) => ({
        id: item.id,
        rank: index + 1,
        name: item.full_name || item.email?.split("@")[0] || "Pengguna TongCi",
        initials: getInitials(item.full_name || item.email),
        scans: item.total_scan || 0,
        points: item.points || 0,
        level: getLevel(item.points),
        tone: getTone(item.id),
        isCurrentUser: item.id === currentUserId,
      }));
      setProfiles(formattedData);
    }
  };

  // 3. Listener Realtime Supabase (Otomatis update saat ada perubahan data di DB)
  useEffect(() => {
    const channel = supabase
      .channel("realtime_leaderboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => {
          // Jika ada perubahaan poin/profile di database, panggil fungsi reload
          fetchLeaderboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, filter]);

  // 4. Filter data berdasarkan pencarian
  const visibleUsers = useMemo(() => {
    return profiles.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [profiles, query]);

  // 5. Cari data posisi user sendiri
  const currentUserData = useMemo(() => {
    return profiles.find((u) => u.id === currentUserId);
  }, [profiles, currentUserId]);

  // 6. Susun Top 3 Podium (Juara 1 di tengah untuk layar sedang/besar)
  const medals = useMemo(() => {
    if (profiles.length < 3) return [];
    return [
      { user: profiles[1], label: "Juara 2", icon: Medal, classes: "from-slate-100 to-slate-50 border-slate-200 text-slate-500", order: "order-2 md:order-1" },
      { user: profiles[0], label: "Juara 1", icon: Crown, classes: "from-amber-100 to-yellow-50 border-amber-300 text-amber-600 md:scale-105 shadow-md", order: "order-1 md:order-2" },
      { user: profiles[2], label: "Juara 3", icon: Medal, classes: "from-orange-100 to-amber-50 border-orange-200 text-orange-600", order: "order-3 md:order-3" },
    ];
  }, [profiles]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="animate-pulse text-xs font-bold text-slate-400">Memuat peringkat realtime...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <section className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
          <Sparkles size={12} /> Komunitas TongCi Realtime
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 md:text-3xl">Leaderboard</h1>
        <p className="text-xs font-medium text-slate-500">Lihat pengguna dengan kontribusi terbesar dalam menjaga lingkungan.</p>
      </section>

      {/* Podium Top 3 */}
      {medals.length > 0 && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 items-end">
          {medals.map(({ user, label, icon: Icon, classes, order }) => (
            <article key={label} className={`${order} relative overflow-hidden rounded-3xl border bg-gradient-to-br ${classes} p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}>
              <Icon className="absolute right-4 top-4 opacity-25" size={44} />
              <div className="relative flex items-center gap-4">
                <Avatar user={user} large />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">{label}</p>
                  <h2 className="mt-1 text-sm font-extrabold text-slate-800">{user.name}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs font-extrabold">
                    <Award size={13} /> {user.points.toLocaleString("id-ID")} Poin
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Card Peringkat Saya (Sticky Visual) */}
      {currentUserData && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-extrabold text-white">
              #{currentUserData.rank}
            </span>
            <Avatar user={currentUserData} />
            <div>
              <p className="text-xs font-bold text-slate-800">
                {currentUserData.name} <span className="text-[10px] text-emerald-600 font-extrabold">(Kamu)</span>
              </p>
              <p className="text-[10px] text-slate-500">{currentUserData.scans} Kali Scan Sampah</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-emerald-700">{currentUserData.points.toLocaleString("id-ID")} Pts</span>
            <p className="text-[9px] font-bold text-emerald-600">{currentUserData.level}</p>
          </div>
        </section>
      )}

      {/* Main Table Area */}
      <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
        {/* Controls Bar */}
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="text-amber-500" size={20} />
              <h2 className="text-sm font-extrabold text-slate-800">Peringkat Pengguna</h2>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Peringkat diperbarui secara langsung berdasarkan poin di database.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search Input */}
            <label className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari pengguna..."
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition focus:border-emerald-400 sm:w-48"
              />
            </label>

            {/* Filter Buttons */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              {["Mingguan", "Bulanan", "Sepanjang Waktu"].map((item) => (
                <button
                  onClick={() => setFilter(item)}
                  key={item}
                  className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-all ${
                    filter === item ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-emerald-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabel Responsive */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-y border-slate-100 bg-slate-50/70 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Ranking</th>
                <th className="px-4 py-3">Pengguna</th>
                <th className="px-4 py-3 text-center">Total Scan</th>
                <th className="px-4 py-3 text-center">Total Poin</th>
                <th className="px-4 py-3">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visibleUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`transition-colors ${user.isCurrentUser ? "bg-emerald-50/80 font-bold" : "hover:bg-slate-50"}`}
                >
                  <td className="px-4 py-3">
                    <span className={`${user.rank <= 3 ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"} flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold`}>
                      {user.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar user={user} />
                      <span className="text-xs font-bold text-slate-700">
                        {user.name} {user.isCurrentUser && <span className="text-[10px] text-emerald-600">(Kamu)</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-bold text-slate-600">{user.scans}x</td>
                  <td className="px-4 py-3 text-center text-xs font-extrabold text-amber-600">{user.points.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${
                      user.level === "Eco Hero"
                        ? "bg-emerald-100 text-emerald-700"
                        : user.level === "Top Contributor"
                        ? "bg-violet-100 text-violet-700"
                        : user.level === "Top 10"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {user.level}
                    </span>
                  </td>
                </tr>
              ))}
              {visibleUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-xs text-slate-400">
                    Pengguna tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-[11px] font-medium text-slate-400">Menampilkan {visibleUsers.length} pengguna</p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 p-1.5 text-slate-400 transition hover:border-emerald-300 hover:text-emerald-600">
              <ChevronLeft size={15} />
            </button>
            <button className="rounded-lg border border-slate-200 p-1.5 text-slate-400 transition hover:border-emerald-300 hover:text-emerald-600">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}