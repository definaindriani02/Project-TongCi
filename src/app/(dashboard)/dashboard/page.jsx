"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import HeroDashboard from "@/components/dashboard/HeroDashboard";
import StatistikDashboard from "@/components/dashboard/StatistikDashboard";
import AktivitasTerkini from "@/components/dashboard/AktivitasTerkini";
import Tips3R from "@/components/dashboard/Tips3R";
import Reward from "@/components/dashboard/Reward";

import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();

  // USER DATA
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // SCAN DATA
  const [scanCount, setScanCount] = useState(0);
  const [recentScans, setRecentScans] = useState([]);

  // LOADING
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let scanChannel = null;
    let profileChannel = null;

    const fetchDashboardData = async (userId) => {
      try {
        // ==========================================
        // 1. PROFILE & AUTO-UPSERT FOR NEW USERS (OAuth / Register)
        // ==========================================
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        let currentProfile = profileData;

        if (!currentProfile) {
          // If no profile entry exists yet, auto-create one connected with profiles table
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          const defaultName =
            currentUser?.user_metadata?.full_name ||
            currentUser?.user_metadata?.name ||
            currentUser?.email?.split("@")[0] ||
            "Sobat TongCi";
          const defaultAvatar =
            currentUser?.user_metadata?.avatar_url ||
            currentUser?.user_metadata?.picture ||
            null;

          const newProfilePayload = {
            id: userId,
            full_name: defaultName,
            email: currentUser?.email || "",
            points: 0,
            total_scan: 0,
            avatar_url: defaultAvatar,
          };

          const { data: createdProfile, error: createError } = await supabase
            .from("profiles")
            .upsert(newProfilePayload)
            .select()
            .maybeSingle();

          if (!createError && createdProfile) {
            currentProfile = createdProfile;
          } else {
            currentProfile = newProfilePayload;
          }
        }

        if (isMounted) {
          setProfile(currentProfile);
        }

        // ==========================================
        // 2. TOTAL SCAN & ESTIMATED RECYCLING
        // ==========================================
        let count = 0;
        const { count: historyCount, error: historyCountErr } = await supabase
          .from("scan_history")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);

        if (!historyCountErr && typeof historyCount === "number") {
          count = historyCount;
        } else {
          // Fallback ke tabel scans
          const { count: scansCount, error: scanCountError } = await supabase
            .from("scans")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);

          if (!scanCountError && typeof scansCount === "number") {
            count = scansCount;
          }
        }

        if (isMounted) {
          setScanCount(count || 0);
        }

        // ==========================================
        // 3. AKTIVITAS TERKINI (RECENT SCANS)
        // ==========================================
        let recentScansList = [];
        const { data: historyData, error: historyErr } = await supabase
          .from("scan_history")
          .select("id, waste_name, item_name, category, confidence, points_earned, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(6);

        if (!historyErr && historyData && historyData.length > 0) {
          recentScansList = historyData.map((item) => ({
            id: item.id,
            item_name: item.item_name || item.waste_name || "Sampah Terdeteksi",
            waste_name: item.waste_name || item.item_name || "Sampah Terdeteksi",
            category: item.category || "Anorganik",
            confidence: item.confidence ?? 85,
            points_awarded: item.points_earned ?? 18,
            points_earned: item.points_earned ?? 18,
            created_at: item.created_at,
          }));
        } else {
          // Fallback jika tabel scans ada
          try {
            const { data: recentData, error: recentError } = await supabase
              .from("scans")
              .select("id, item_name, category, confidence, points_awarded, created_at")
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .limit(6);

            if (!recentError && recentData && recentData.length > 0) {
              recentScansList = recentData;
            }
          } catch (e) {
            // Abaikan fallback error
          }
        }

        if (isMounted) {
          setRecentScans(recentScansList || []);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    const initializeDashboard = async () => {
      try {
        setLoading(true);

        // GET AUTH USER
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        const currentUser = session?.user;

        if (sessionError || !currentUser) {
          router.push("/login");
          return;
        }

        if (!isMounted) return;

        setUser(currentUser);
        const userId = currentUser.id;

        // INITIAL FETCH
        await fetchDashboardData(userId);

        if (!isMounted) return;

        setLoading(false);

        // ==========================================
        // REALTIME SUBSCRIPTION FOR SCAN HISTORY & SCANS
        // ==========================================
        scanChannel = supabase
          .channel(`dashboard-scans-rt-${userId}-${Date.now()}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "scan_history",
              filter: `user_id=eq.${userId}`,
            },
            async () => {
              console.log("Realtime: data scan_history berubah");
              await fetchDashboardData(userId);
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "scans",
              filter: `user_id=eq.${userId}`,
            },
            async () => {
              console.log("Realtime: data scans berubah");
              await fetchDashboardData(userId);
            }
          )
          .subscribe((status) => {
            console.log("Status Realtime Scans:", status);
          });

        // ==========================================
        // REALTIME SUBSCRIPTION FOR PROFILE
        // ==========================================
        profileChannel = supabase
          .channel(`dashboard-profile-rt-${userId}-${Date.now()}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "profiles",
              filter: `id=eq.${userId}`,
            },
            (payload) => {
              console.log("Realtime: profile berubah", payload);
              if (payload.eventType === "DELETE") {
                setProfile(null);
                return;
              }
              if (payload.new) {
                setProfile(payload.new);
              }
            }
          )
          .subscribe((status) => {
            console.log("Status Realtime Profile:", status);
          });
      } catch (error) {
        console.error("Gagal memuat dashboard:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeDashboard();

    return () => {
      isMounted = false;
      if (scanChannel) {
        supabase.removeChannel(scanChannel);
      }
      if (profileChannel) {
        supabase.removeChannel(profileChannel);
      }
    };
  }, [router]);

  // REDEEM REWARD HANDLER
  const handleRedeemSuccess = async (cost) => {
    if (!user) return;

    const currentPoints = profile?.points ?? profile?.poin ?? 0;
    const newPoints = Math.max(0, currentPoints - cost);

    // Update local state immediately
    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        points: newPoints,
        poin: newPoints,
      };
    });

    // Save permanently to Supabase profiles table
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ points: newPoints })
        .eq("id", user.id);

      if (error) {
        console.error("Gagal menyimpan poin ke Supabase:", error);
      }
    } catch (err) {
      console.error("Error saat update poin di Supabase:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto">
      {/* HERO DASHBOARD */}
      <HeroDashboard profile={profile} user={user} loading={loading} />

      {/* STATISTIK DASHBOARD (REALTIME) */}
      <StatistikDashboard
        points={profile?.points || 0}
        scanCount={scanCount}
        loading={loading}
      />

      {/* AKTIVITAS TERKINI (REALTIME & REDESIGNED) */}
      <AktivitasTerkini scans={recentScans} loading={loading} />

      {/* TIPS 3R */}
      <Tips3R />

      {/* REWARD */}
      <Reward
        points={profile?.points || 0}
        loading={loading}
        onRedeemSuccess={handleRedeemSuccess}
      />
    </div>
  );
}
