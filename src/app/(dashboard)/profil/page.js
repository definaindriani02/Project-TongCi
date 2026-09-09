"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  CalendarDays,
  Edit3,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Recycle,
  ScanLine,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilPage() {
  const [profile, setProfile] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [recentScans, setRecentScans] = useState([]);
  const [userRank, setUserRank] = useState("-");
  const [recycledKg, setRecycledKg] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let scanChannel = null;
    let historyChannel = null;
    let profileChannel = null;

    const fetchScanData = async (userId) => {
      // 1. Hitung Total Scan & Estimasi Berat (Kg)
      let count = 0;
      const { count: historyCount, error: historyCountErr } = await supabase
        .from("scan_history")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (!historyCountErr && typeof historyCount === "number") {
        count = historyCount;
      } else {
        const { count: scansCount, error: scanCountErr } = await supabase
          .from("scans")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);

        if (!scanCountErr && typeof scansCount === "number") {
          count = scansCount;
        }
      }

      if (isMounted) {
        setScanCount(count);
        setRecycledKg((count * 0.15).toFixed(1).replace(".", ","));
      }

      // 2. Ambil Riwayat Scan Terbaru (4 item)
      let recentList = [];
      const { data: historyData, error: historyErr } = await supabase
        .from("scan_history")
        .select("id, waste_name, item_name, category, points_earned, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!historyErr && historyData && historyData.length > 0) {
        recentList = historyData.map((item) => ({
          id: item.id,
          item_name: item.item_name || item.waste_name || "Sampah Terdeteksi",
          category: item.category || "Anorganik",
          points_awarded: item.points_earned ?? 18,
          points_earned: item.points_earned ?? 18,
          created_at: item.created_at,
        }));
      } else {
        try {
          const { data: recent, error: recentError } = await supabase
            .from("scans")
            .select("id, item_name, category, points_awarded, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(4);

          if (!recentError && recent && recent.length > 0) {
            recentList = recent;
          }
        } catch (e) {
          // Abaikan fallback error
        }
      }

      if (isMounted) {
        setRecentScans(recentList);
      }
    };

    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          if (isMounted) setLoading(false);
          return;
        }

        const userId = session.user.id;
        const userEmail = session.user.email;

        // Ambil Data Profiles dari Supabase
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (profileError) {
          console.error("Gagal ambil profile:", profileError);
        }

        const currentProfile = profileData || {
          id: userId,
          full_name:
            session.user.user_metadata?.full_name ||
            userEmail?.split("@")[0] ||
            "Pengguna",
          email: userEmail,
          phone_number: "-",
          gender: "-",
          birth_date: "-",
          address: "-",
          points: 0,
          total_scan: 0,
        };

        if (isMounted) {
          setProfile(currentProfile);
        }

        // Ambil data scan (realtime synced logic dengan Dashboard)
        await fetchScanData(userId);

        // Hitung Ranking Leaderboard
        const { data: allProfiles, error: rankError } = await supabase
          .from("profiles")
          .select("id, points")
          .order("points", { ascending: false });

        if (!rankError && allProfiles && isMounted) {
          const rankIndex = allProfiles.findIndex((p) => p.id === userId);
          if (rankIndex !== -1) {
            setUserRank(`#${rankIndex + 1}`);
          }
        }

        // Realtime Subscription: Profile Changes
        profileChannel = supabase
          .channel(`profil-profile-rt-${userId}-${Date.now()}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "profiles",
              filter: `id=eq.${userId}`,
            },
            (payload) => {
              if (payload.new && isMounted) {
                setProfile(payload.new);
              }
            }
          )
          .subscribe();

        // Realtime Subscription: Scan History Changes
        historyChannel = supabase
          .channel(`profil-history-rt-${userId}-${Date.now()}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "scan_history",
              filter: `user_id=eq.${userId}`,
            },
            async () => {
              await fetchScanData(userId);
            }
          )
          .subscribe();

        // Realtime Subscription: Scans Table Changes
        scanChannel = supabase
          .channel(`profil-scans-rt-${userId}-${Date.now()}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "scans",
              filter: `user_id=eq.${userId}`,
            },
            async () => {
              await fetchScanData(userId);
            }
          )
          .subscribe();
      } catch (err) {
        console.error("Error loading profile page:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
      if (profileChannel) supabase.removeChannel(profileChannel);
      if (historyChannel) supabase.removeChannel(historyChannel);
      if (scanChannel) supabase.removeChannel(scanChannel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Format tanggal lahir & riwayat
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "-") return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Inisial untuk Avatar Icon
  const getInitials = (name) => {
    if (!name) return "TC";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-bold text-slate-400">
        Memuat profil...
      </div>
    );
  }

  const profileItems = [
    ["Nama", profile?.full_name || "-", UserRound],
    ["Email", profile?.email || "-", Mail],
    ["Nomor HP", profile?.phone_number || profile?.phone || "-", Phone],
    ["Jenis Kelamin", profile?.gender || "-", UserRound],
    ["Tanggal Lahir", formatDate(profile?.birth_date), CalendarDays],
    ["Alamat", profile?.address || "-", MapPin],
  ];

  const stats = [
    ["Total Scan", `${scanCount}`, ScanLine, "text-emerald-600 bg-emerald-50"],
    ["Total Poin", (profile?.points || 0).toLocaleString("id-ID"), Award, "text-amber-600 bg-amber-50"],
    ["Level User", (profile?.points || 0) > 500 ? "Eco Hero" : "Eco Warrior", ShieldCheck, "text-violet-600 bg-violet-50"],
    ["Rank Leaderboard", userRank, Award, "text-sky-600 bg-sky-50"],
    ["Sampah Didaur Ulang", `${recycledKg} kg`, Recycle, "text-teal-600 bg-teal-50"],
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <section>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 md:text-3xl">
          Profil Saya
        </h1>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Kelola informasi akun Anda.
        </p>
      </section>

      {/* Banner Profil */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white shadow-md md:p-8">
        <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/10" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white text-xl font-extrabold text-emerald-600 shadow-lg">
              {getInitials(profile?.full_name)}
            </div>
            <div className="text-center sm:text-left">
              <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider">
                <ShieldCheck size={11} /> TongCi Member
              </div>
              <h2 className="text-xl font-extrabold">{profile?.full_name}</h2>
              <p className="mt-1 text-xs font-medium text-emerald-50">
                {profile?.email}
              </p>
            </div>
          </div>

          <Link
            href="/settings#akun"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-emerald-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-50 active:scale-95"
          >
            <Edit3 size={14} /> Edit Profil
          </Link>
        </div>
      </section>

      {/* Detail Profil & Statistik */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Card Informasi Pribadi */}
        <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-5 text-sm font-extrabold text-slate-800">
            Informasi Pribadi
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {profileItems.map(([label, value, Icon]) => (
              <div
                key={label}
                className={`${
                  label === "Alamat" ? "sm:col-span-2" : ""
                } rounded-2xl bg-slate-50/70 p-3 transition-colors hover:bg-emerald-50/60`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <Icon size={12} className="text-emerald-500" />
                  {label}
                </div>
                <p className="mt-1.5 text-xs font-bold text-slate-700">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* Card Statistik Pengguna */}
        <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-5 text-sm font-extrabold text-slate-800">
            Statistik Pengguna
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {stats.map(([label, value, Icon, colors]) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 transition-all hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-sm"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors}`}
                >
                  <Icon size={17} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-slate-700">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Riwayat Aktivitas Real-Time */}
      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800">
              Riwayat Aktivitas
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              Aktivitas scan sampah terbaru Anda.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-extrabold text-emerald-600">
            {recentScans.length} Aktivitas
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead className="border-y border-slate-100 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Jenis Sampah</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentScans.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-xs font-medium text-slate-400"
                  >
                    Belum ada riwayat scan sampah.
                  </td>
                </tr>
              ) : (
                recentScans.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-emerald-50/40"
                  >
                    <td className="px-4 py-3 text-xs font-medium text-slate-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-700">
                      {item.item_name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-extrabold text-emerald-700">
                        Berhasil
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-extrabold text-amber-600">
                      +{item.points_awarded || 0} Pts
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
        <Link
          href="/settings#akun"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-bold text-emerald-600 transition-all hover:-translate-y-0.5 hover:bg-emerald-50 active:scale-95"
        >
          <Edit3 size={14} /> Edit Profil
        </Link>
        <Link
          href="/settings#keamanan"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-bold text-emerald-600 transition-all hover:-translate-y-0.5 hover:bg-emerald-50 active:scale-95"
        >
          <LockKeyhole size={14} /> Ubah Password
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-4 py-2.5 text-xs font-bold text-pink-600 transition-all hover:-translate-y-0.5 hover:bg-pink-100 active:scale-95"
        >
          <LogOut size={14} /> Logout
        </button>
      </section>
    </div>
  );
}