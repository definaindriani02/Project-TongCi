"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Menggunakan Link bawaan Next.js
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("notif_scan, notif_points, notif_promo, notif_app_update")
          .eq("id", session.user.id)
          .maybeSingle();

        const { data: allNotifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", session.user.id);

        if (allNotifs && profile) {
          const activeNotifs = allNotifs.filter((item) => {
            if (item.type === "scan" && !profile.notif_scan) return false;
            if (item.type === "points" && !profile.notif_points) return false;
            if (item.type === "promo" && !profile.notif_promo) return false;
            if (item.type === "app_update" && !profile.notif_app_update) return false;
            return true;
          });

          setNotifCount(activeNotifs.length);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a href="#beranda" className="logo">
          <img src="/asset/images/logo.png" alt="TongCi" />
          <div className="logo-text">
            <h2>TongCi</h2>
            <span>Tong Sampah Cinta</span>
          </div>
        </a>

        {/* Menu */}
        <nav className="nav-menu">
          <a href="#beranda">Beranda</a>
          <a href="#fitur">Fitur</a>
          <a href="#cara-kerja">Cara Kerja</a>
          <a href="#tentang">Tentang Kami</a>
        </nav>

        {/* Action Buttons */}
        <div className="nav-action">
          {/* TOMBOL NOTIFIKASI MENGGUNAKAN LINK */}
          <Link
            href="/notifications"
            className="btn-notif"
            title="Notifikasi"
            onClick={() => console.log("Lonceng diklik!")}
          >
            <Bell size={20} style={{ pointerEvents: "none" }} />
            {notifCount > 0 && <span className="notif-badge"></span>}
          </Link>

          <a href="/login" className="btn-login">
            Login
          </a>

          <a href="/register" className="btn-register">
            Register →
          </a>
        </div>
      </div>
    </header>
  );
}