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
import AsistenAI from "@/components/dashboard/AsistenAI";

import { supabase } from "@/lib/supabase";

import "./dashboard.css";

export default function Dashboard() {
  const router = useRouter();

  // SIDEBAR
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // USER DATA
  const [profile, setProfile] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DASHBOARD DATA
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. GET SESSION & PROTEKSI AUTH
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          router.push("/login");
          return;
        }

        const userId = session.user.id;

        // 2. FETCH PROFILE
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Gagal mengambil profile:", profileError);
        } else {
          setProfile(profileData);
        }

        // 3. FETCH TOTAL SCAN
        const { count, error: scanCountError } = await supabase
          .from("scans")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);

        if (scanCountError) {
          console.error("Gagal menghitung scan:", scanCountError);
        } else {
          setScanCount(count || 0);
        }

        // 4. FETCH RECENT SCANS
        const { data: recentData, error: recentError } = await supabase
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
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentError) {
          console.error("Gagal mengambil aktivitas:", recentError);
        } else {
          setRecentScans(recentData || []);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

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
        <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        {/* CONTENT */}
        <main className="dashboard-content">
          {/* HERO DASHBOARD */}
          <HeroDashboard profile={profile} loading={loading} />

          {/* STATISTIK */}
          <StatistikDashboard
            points={profile?.points || 0}
            scanCount={scanCount}
            loading={loading}
          />

          {/* AKTIVITAS & ASISTEN AI CARD */}
          <section className="dashboard-activity-grid">
            <AktivitasTerkini scans={recentScans} loading={loading} />

            <div className="dashboard-ai-card">
              <div className="dashboard-ai-icon">✨</div>
              <div>
                <span>ASISTEN AI</span>
                <h3>Tanya CiCi 💚</h3>
                <p>Butuh bantuan tentang sampah? CiCi siap membantu.</p>
              </div>
            </div>
          </section>

          {/* TIPS 3R */}
          <Tips3R />

          {/* REWARD */}
          <Reward points={profile?.points || 0} loading={loading} />
        </main>
      </div>

      {/* FLOATING CICI */}
      <AsistenAI />
    </div>
  );
}