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
  const [unreadCount, setUnreadCount] = useState(0); // <-- State untuk hitung notif unread
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
    if (pathname === "/chat") return "CiCi Chat AI";
    if (pathname === "/profil" || pathname === "/profile")
      return "Profil Pengguna";
    if (pathname === "/settings") return "Pengaturan";
    if (pathname === "/notifications") return "Notifikasi";
    return "TongCi";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-100 bg-white px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="cursor-pointer rounded-lg p-1.5 text-emerald-700 transition-all hover:bg-slate-50 hover:text-emerald-500 active:scale-95"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <h2 className="hidden text-sm font-bold tracking-wide text-emerald-800 sm:block">
          {getPageTitle()}
        </h2>
      </div>

      <div className="relative max-w-md flex-1">
        <Search className="absolute left-4 top-2.5 h-4 w-4 text-emerald-500" />
        <input
          type="text"
          placeholder="Cari fitur, tips, informasi..."
          className="w-full rounded-full border border-emerald-100/60 bg-emerald-50/40 py-2 pl-10 pr-4 text-xs text-emerald-800 transition-colors focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <Link
            href="/profil"
            className="flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-100"
          >
            <Award size={14} className="text-amber-500" />
            <span>{points.toLocaleString("id-ID")} Pts</span>
          </Link>
        )}

        {/* Tombol Lonceng Notifikasi yang Dinamis */}
        <Link
          href="/notifications"
          className="relative cursor-pointer p-1 text-emerald-500 transition-transform hover:text-emerald-600 active:scale-95"
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
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-500 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-emerald-600"
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
            className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-600"
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}