"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import HeroDashboard from "@/components/dashboard/HeroDashboard";
import StatistikDashboard from "@/components/dashboard/StatistikDashboard";
import AktivitasTerkini from "@/components/dashboard/AktivitasTerkini";
import Tips3R from "@/components/dashboard/Tips3R";
import EdukasiSampah from "@/components/dashboard/EdukasiSampah";
import Reward from "@/components/dashboard/Reward";
import AsistenAI from "@/components/dashboard/AsistenAI";

import { supabase } from "@/lib/supabase";

import "./dashboard.css";

export default function Dashboard() {

  // ==========================================
  // SIDEBAR
  // ==========================================

  const [sidebarOpen, setSidebarOpen] = useState(false);


  // ==========================================
  // DATA USER
  // ==========================================

  const [profile, setProfile] = useState(null);

  const [scanCount, setScanCount] = useState(0);

  const [recentScans, setRecentScans] = useState([]);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // AMBIL DATA DARI SUPABASE
  // ==========================================

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        setLoading(true);


        // --------------------------------------
        // CEK USER YANG SEDANG LOGIN
        // --------------------------------------

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();


        if (sessionError) {
          throw sessionError;
        }


        // Kalau belum login
        if (!session?.user) {
          setLoading(false);
          return;
        }


        const userId = session.user.id;


        // ======================================
        // AMBIL PROFILE
        // ======================================

        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();


        if (profileError) {
          console.error(
            "Gagal mengambil profile:",
            profileError
          );
        } else {
          setProfile(profileData);
        }


        // ======================================
        // HITUNG TOTAL SCAN
        // ======================================

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
            "Gagal menghitung scan:",
            scanCountError
          );

        } else {

          setScanCount(count || 0);

        }


        // ======================================
        // AMBIL 5 AKTIVITAS TERBARU
        // ======================================

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

        } else {

          setRecentScans(recentData || []);

        }


      } catch (error) {

        console.error(
          "Dashboard error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchDashboardData();

  }, []);


  return (

    <div className="dashboard-layout">

      {/* =====================================
          BACKGROUND DECORATION
      ===================================== */}

      <div className="dashboard-bg-orb orb-one" />

      <div className="dashboard-bg-orb orb-two" />


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />


      {/* =====================================
          MAIN AREA
      ===================================== */}

      <div className="dashboard-main">

        <Header
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />


        <main className="dashboard-content">


          {/* =================================
              HERO
          ================================= */}

          <HeroDashboard
            profile={profile}
            loading={loading}
          />


          {/* =================================
              STATISTIK
          ================================= */}

          <StatistikDashboard
            points={profile?.points || 0}
            scanCount={scanCount}
          />


          {/* =================================
              AKTIVITAS + TIPS
          ================================= */}

          <section className="dashboard-two-column">

            <AktivitasTerkini
              scans={recentScans}
            />

            <Tips3R />

          </section>


          {/* =================================
              EDUKASI POPULER
          ================================= */}

          <EdukasiSampah />


          {/* =================================
              REWARD
          ================================= */}

          <Reward
            points={profile?.points || 0}/>


        </main>

      </div>


      {/* =====================================
          FLOATING AI
      ===================================== */}

      <AsistenAI />


    </div>

  );
}