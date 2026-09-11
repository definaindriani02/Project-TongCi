"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Bell, Award, X, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

const SEARCH_ITEMS = [
  {
    name: "Dashboard",
    desc: "Ringkasan data, hero, statistik & aktivitas",
    href: "/dashboard",
    category: "Menu",
    icon: "📊",
    keywords: ["beranda", "home", "dashboard", "ringkasan", "utama"],
  },
  {
    name: "Klasifikasi AI / Scan Sampah",
    desc: "Identifikasi jenis sampah dengan kamera AI",
    href: "/scan",
    category: "Fitur AI",
    icon: "📷",
    keywords: ["scan", "kamera", "foto", "ai", "klasifikasi", "deteksi", "analisis"],
  },
  {
    name: "Edukasi Sampah",
    desc: "Panduan pemilahan sampah organik, anorganik, B3",
    href: "/edukasi",
    category: "Edukasi",
    icon: "📖",
    keywords: ["edukasi", "belajar", "panduan", "artikel", "jenis", "sampah", "tips"],
  },
  {
    name: "Statistik & Dampak Hijau",
    desc: "Lihat komposisi sampah & reduksi emisi karbon CO2",
    href: "/statistik",
    category: "Laporan",
    icon: "🌱",
    keywords: ["statistik", "data", "grafik", "karbon", "co2", "dampak", "lingkungan"],
  },
  {
    name: "Leaderboard & Peringkat",
    desc: "Peringkat pahlawan lingkungan & poin komunitas",
    href: "/leaderboard",
    category: "Komunitas",
    icon: "🏆",
    keywords: ["leaderboard", "peringkat", "rank", "juara", "top", "kompetisi"],
  },
  {
    name: "Katalog Hadiah / Tukar Reward",
    desc: "Tukarkan poin ke saldo e-wallet, voucher, atau merch",
    href: "/dashboard#reward",
    category: "Reward",
    icon: "🎁",
    keywords: ["reward", "hadiah", "tukar", "poin", "voucher", "gopay", "ovo", "klaim"],
  },
  {
    name: "Riwayat Aktivitas",
    desc: "Catatan lengkap riwayat scan sampah & penukaran reward",
    href: "/riwayat",
    category: "Aktivitas",
    icon: "📜",
    keywords: ["riwayat", "history", "log", "aktivitas", "catatan", "semua"],
  },
  {
    name: "CiCi Chat AI",
    desc: "Tanya jawab cerdas seputar daur ulang sampah",
    href: "/chat",
    category: "Chat AI",
    icon: "💬",
    keywords: ["chat", "cici", "bot", "tanya", "ai", "konsultasi"],
  },
  {
    name: "Profil Pengguna",
    desc: "Informasi akun, statistik personal, dan badge",
    href: "/profil",
    category: "Akun",
    icon: "👤",
    keywords: ["profil", "profile", "akun", "biodata", "saya", "user"],
  },
  {
    name: "Pengaturan Akun",
    desc: "Kelola kata sandi, notifikasi, dan tampilan",
    href: "/settings",
    category: "Pengaturan",
    icon: "⚙️",
    keywords: ["pengaturan", "settings", "password", "keamanan", "notifikasi", "bahasa"],
  },
  {
    name: "Notifikasi",
    desc: "Pemberitahuan aktivitas, poin, dan promo terbaru",
    href: "/notifications",
    category: "Notifikasi",
    icon: "🔔",
    keywords: ["notifikasi", "pesan", "pemberitahuan", "lonceng", "unread"],
  },
];

export default function Header({ sidebarOpen, setSidebarOpen, title = "" }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [points, setPoints] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0); // <-- State untuk hitung notif unread
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchContainerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let profileChannel = null;
    let notifChannel = null;

    // Helper untuk mengambil jumlah notifikasi unread dari Supabase
    const fetchUnreadCount = async (userId) => {
      try {
        const { count, error } = await supabase
          .from("notifications") // Pastikan nama tabel kamu 'notifications'
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("is_read", false); // Hanya hitung yang BELUM dibaca

        if (!error && count !== null) {
          setUnreadCount(count);
        }
      } catch (err) {
        console.error("Gagal mengambil unread notifications:", err);
      }
    };

    const checkUserAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const currentUser = session.user;
        setUser(currentUser);

        // Fetch profile
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (prof) {
          setProfile(prof);
          setPoints(prof.points || 0);
        } else {
          setPoints(0);
        }

        // Fetch Unread Notifications awal
        fetchUnreadCount(currentUser.id);

        // Setup realtime listener for profile updates
        const channelId = `header-profile-${currentUser.id}-${Date.now()}`;
        profileChannel = supabase
          .channel(channelId)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "profiles",
              filter: `id=eq.${currentUser.id}`,
            },
            (payload) => {
              if (payload.new) {
                setProfile(payload.new);
                setPoints(payload.new.points || 0);
              }
            }
          )
          .subscribe();

        // Setup realtime listener untuk NOTIFIKASI
        const notifChannelId = `header-notif-${currentUser.id}-${Date.now()}`;
        notifChannel = supabase
          .channel(notifChannelId)
          .on(
            "postgres_changes",
            {
              event: "*", // Listen INSERT, UPDATE, DELETE
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${currentUser.id}`,
            },
            () => {
              // Setiap ada update/insert di tabel notifications, refresh hitungan
              fetchUnreadCount(currentUser.id);
            }
          )
          .subscribe();
      }
    };

    checkUserAndProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUnreadCount(session.user.id);
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        if (prof) {
          setProfile(prof);
          setPoints(prof.points || 0);
        }
      } else {
        setUser(null);
        setProfile(null);
        setPoints(0);
        setUnreadCount(0);
      }
    });

    return () => {
      subscription?.unsubscribe();
      if (profileChannel) supabase.removeChannel(profileChannel);
      if (notifChannel) supabase.removeChannel(notifChannel);
    };
  }, []);

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Pengguna";

  const getInitial = () => {
    if (!displayName) return "T";
    return displayName.charAt(0).toUpperCase();
  };

  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture;

  const getPageTitle = () => {
    if (title) return title;
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname?.startsWith("/edukasi")) return "Edukasi Sampah";
    if (pathname === "/scan") return "Klasifikasi AI";
    if (pathname === "/statistik") return "Statistik";
    if (pathname === "/leaderboard") return "Leaderboard & Reward";
    if (pathname === "/riwayat") return "Riwayat Aktivitas";
    if (pathname === "/chat") return "CiCi Chat AI";
    if (pathname === "/profil" || pathname === "/profile")
      return "Profil Pengguna";
    if (pathname === "/settings") return "Pengaturan";
    if (pathname === "/notifications") return "Notifikasi";
    return "TongCi";
  };

  // Search logic & filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return SEARCH_ITEMS.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.some((kw) => kw.includes(q))
      );
    });
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (item) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(item.href);
  };

  const handleSearchKeyDown = (e) => {
    if (!isSearchOpen || searchResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelectResult(searchResults[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-2 sm:gap-4 border-b border-slate-100 bg-white/95 backdrop-blur-md px-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="cursor-pointer rounded-lg p-1.5 text-emerald-700 transition-all hover:bg-slate-50 hover:text-emerald-500 active:scale-95"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <h2 className="hidden text-xs font-bold tracking-wide text-emerald-800 sm:block md:text-sm truncate">
          {getPageTitle()}
        </h2>
      </div>

      <div ref={searchContainerRef} className="relative max-w-[180px] xs:max-w-[240px] sm:max-w-md flex-1">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 sm:left-4 sm:h-4 sm:w-4 text-emerald-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => {
            if (searchQuery.trim()) setIsSearchOpen(true);
          }}
          onKeyDown={handleSearchKeyDown}
          placeholder="Cari fitur, menu, panduan..."
          className="w-full rounded-full border border-emerald-100/60 bg-emerald-50/40 py-1.5 sm:py-2 pl-8 sm:pl-10 pr-8 text-[11px] sm:text-xs text-emerald-800 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setIsSearchOpen(false);
            }}
            className="absolute right-3 top-2 sm:top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={14} />
          </button>
        )}

        {/* SEARCH DROPDOWN POPOVER */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between px-3">
              <span>Hasil Pencarian Fitur</span>
              <span className="text-emerald-600 font-bold">{searchResults.length} Ditemukan</span>
            </div>

            <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
              {searchResults.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs font-bold text-slate-700">Tidak ada fitur yang cocok</p>
                  <p className="text-[11px] text-slate-400 mt-1">Coba kata kunci lain seperti: scan, edukasi, reward, profil</p>
                </div>
              ) : (
                searchResults.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.href + item.name}
                      type="button"
                      onClick={() => handleSelectResult(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        isSelected ? "bg-emerald-50 text-emerald-900" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0 p-1.5 rounded-lg bg-white border border-slate-100 shadow-2xs">
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100/60 text-emerald-700">
                          {item.category}
                        </span>
                        <ArrowRight size={12} className="text-slate-300" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {user && (
          <Link
            href="/profil"
            className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-amber-700 transition-colors hover:bg-amber-100 shrink-0"
          >
            <Award size={14} className="text-amber-500 shrink-0" />
            <span>{points.toLocaleString("id-ID")} Pts</span>
          </Link>
        )}

        {/* Tombol Lonceng Notifikasi yang Dinamis */}
        <Link
          href="/notifications"
          className="relative cursor-pointer p-1 text-emerald-500 transition-transform hover:text-emerald-600 active:scale-95 shrink-0"
          title="Notifikasi"
        >
          <Bell size={20} />
          
          {/* Titik merah HANYA dirender jika unreadCount > 0 */}
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white"></span>
          )}
        </Link>

        {user ? (
          <Link
            href="/profil"
            title={`Profil: ${displayName}`}
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-500 text-xs sm:text-sm font-extrabold text-white shadow-sm transition-all hover:bg-emerald-600"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitial()
            )}
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-emerald-500 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white transition-colors hover:bg-emerald-600 shrink-0"
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}