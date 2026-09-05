"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/dashboard/Header";
import HeroDashboard from "@/components/dashboard/HeroDashboard";
import StatistikDashboard from "@/components/dashboard/StatistikDashboard";
import AktivitasTerkini from "@/components/dashboard/AktivitasTerkini";
import Tips3R from "@/components/dashboard/Tips3R";
import Reward from "@/components/dashboard/Reward";

import { supabase } from "@/lib/supabase";

import "./dashboard.css";

export default function Dashboard() {
  const router = useRouter();

  // SIDEBAR
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        // PROFILE
        // ==========================================

        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Gagal mengambil profile:", profileError);
        } else if (isMounted) {
          setProfile(profileData);
        }

        // ==========================================
        // TOTAL SCAN
        // ==========================================

        const {
          count,
          error: scanCountError,
        } = await supabase
          .from("scans")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", userId);

        if (scanCountError) {
          console.error(
            "Gagal menghitung total scan:",
            scanCountError
          );
        } else if (isMounted) {
          setScanCount(count || 0);
        }

        // ==========================================
        // AKTIVITAS TERKINI
        // ==========================================

        const {
          data: recentData,
          error: recentError,
        } = await supabase
          .from("scans")
          .select(`
            id,
            item_name,
            category,
            confidence,
            points_awarded,
            created_at
          `)
          .eq("user_id", userId)
          .order("created_at", {
            ascending: false,
          })
          .limit(5);

        if (recentError) {
          console.error(
            "Gagal mengambil aktivitas:",
            recentError
          );
        } else if (isMounted) {
          setRecentScans(recentData || []);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    const initializeDashboard = async () => {
      try {
        setLoading(true);

        // ==========================================
        // GET AUTH USER
        // ==========================================

        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !currentUser) {
          router.push("/login");
          return;
        }

        if (!isMounted) return;

        setUser(currentUser);

        const userId = currentUser.id;

        // ==========================================
        // INITIAL FETCH
        // ==========================================

        await fetchDashboardData(userId);

        if (!isMounted) return;

        setLoading(false);

        // ==========================================
        // REALTIME SCANS
        // ==========================================

        scanChannel = supabase
          .channel(`dashboard-scans-${userId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "scans",
              filter: `user_id=eq.${userId}`,
            },
            async () => {
              console.log("Realtime: data scan berubah");

              await fetchDashboardData(userId);
            }
          )
          .subscribe((status) => {
            console.log(
              "Status realtime scans:",
              status
            );
          });

        // ==========================================
        // REALTIME PROFILE
        // ==========================================

        profileChannel = supabase
          .channel(`dashboard-profile-${userId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "profiles",
              filter: `id=eq.${userId}`,
            },
            (payload) => {
              console.log(
                "Realtime: profile berubah",
                payload
              );

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
            console.log(
              "Status realtime profile:",
              status
            );
          });
      } catch (error) {
        console.error(
          "Gagal memuat dashboard:",
          error
        );

        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeDashboard();

    // ==========================================
    // CLEANUP REALTIME
    // ==========================================

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

  // ==========================================
  // REDEEM REWARD
  // ==========================================

  const handleRedeemSuccess = (cost) => {
    setProfile((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        points: Math.max(
          0,
          (prev.points || 0) - cost
        ),
      };
    });
  };

  return (
    <div className="dashboard-layout">
      {/* BACKGROUND ORBS */}
      <div className="dashboard-bg-orb orb-one" />
      <div className="dashboard-bg-orb orb-two" />

      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* MAIN CONTAINER */}
      <div className="dashboard-main">
        {/* HEADER */}
        <Header
          onMenuClick={() =>
            setSidebarOpen((prev) => !prev)
          }
          user={user}
          profile={profile}
        />

        {/* CONTENT */}
        <main className="dashboard-content">
          {/* HERO DASHBOARD */}
          <HeroDashboard
            profile={profile}
            user={user}
            loading={loading}
          />

          {/* STATISTIK */}
          <StatistikDashboard
            points={profile?.points || 0}
            scanCount={scanCount}
            loading={loading}
          />

          {/* AKTIVITAS TERKINI */}
          <AktivitasTerkini
            scans={recentScans}
            loading={loading}
          />

          {/* TIPS 3R */}
          <Tips3R />

          {/* REWARD */}
          <Reward
            points={profile?.points || 0}
            loading={loading}
            onRedeemSuccess={handleRedeemSuccess}
          />
        </main>
      </div>
    </div>
  );
}