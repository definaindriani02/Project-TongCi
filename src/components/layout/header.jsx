"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Header({ sidebarOpen, setSidebarOpen, title = "" }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [points, setPoints] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const pathname = usePathname();

  // Fungsi untuk mengambil dan memfilter notifikasi berdasarkan preferensi profil
  const fetchNotifications = async (userId, currentProfile) => {
    if (!userId) return;

    try {
      // Jika profile belum dikirim, ambil dari database
      let prof = currentProfile;
      if (!prof) {
        const { data } = await supabase
          .from("profiles")
          .select("notif_scan, notif_points, notif_promo, notif_app_update")
          .eq("id", userId)
          .maybeSingle();
        prof = data;
      }

      // Ambil daftar notifikasi
      const { data: allNotifs } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId);

      if (allNotifs && prof) {
        // Filter notifikasi sesuai toggle preferensi profil
        const activeNotifs = allNotifs.filter((item) => {
          if (item.type === "scan" && !prof.notif_scan) return false;
          if (item.type === "points" && !prof.notif_points) return false;
          if (item.type === "promo" && !prof.notif_promo) return false;
          if (item.type === "app_update" && !prof.notif_app_update) return false;
          return true;
        });

        setNotifCount(activeNotifs.length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    let profileChannel = null;

    const checkUserAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
          fetchNotifications(currentUser.id, prof);
        } else {
          setPoints(0);
        }

        // Setup realtime listener for profile updates safely
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
                fetchNotifications(currentUser.id, payload.new);
              }
            }
          )
          .subscribe();
      }
    };

    checkUserAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        if (prof) {
          setProfile(prof);
          setPoints(prof.points || 0);
          fetchNotifications(session.user.id, prof);
        }
      } else {
        setUser(null);
        setProfile(null);
        setPoints(0);
        setNotifCount(0);
      }
    });

    return () => {
      subscription?.unsubscribe();
      if (profileChannel) {
        supabase.removeChannel(profileChannel);
      }
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
    if (pathname === "/chat") return "CiCi Chat AI";
    if (pathname === "/profil" || pathname === "/profile") return "Profil Pengguna";
    if (pathname === "/settings") return "Pengaturan";
    return "TongCi";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-emerald-700 hover:text-emerald-500 p-1.5 rounded-lg hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <h2 className="font-bold text-emerald-800 text-sm tracking-wide hidden sm:block">
          {getPageTitle()}
        </h2>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-2.5 h-4 w-4 text-emerald-500" />
        <input
          type="text"
          placeholder="Cari fitur, tips, informasi..."
          className="w-full pl-10 pr-4 py-2 bg-emerald-50/40 border border-emerald-100/60 rounded-full text-xs text-emerald-800 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <Link href="/profil" className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors">
            <Award size={14} className="text-amber-500" />
            <span>{points.toLocaleString("id-ID")} Pts</span>
          </Link>
        )}

        {/* PERBAIKAN: Tombol Notifikasi sekarang berupa Link aktif */}
        <Link
          href="/notifications"
          className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full relative cursor-pointer transition-colors"
          title="Notifikasi"
        >
          <Bell size={20} />
          {notifCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full ring-2 ring-white"></span>
          )}
        </Link>

        {user ? (
          <Link
            href="/profil"
            title={`Profil: ${displayName}`}
            className="w-9 h-9 bg-emerald-500 text-white font-extrabold rounded-full flex items-center justify-center text-sm hover:bg-emerald-600 transition-all shadow-sm overflow-hidden shrink-0"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              getInitial()
            )}
          </Link>
        ) : (
          <Link
            href="/login"
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}