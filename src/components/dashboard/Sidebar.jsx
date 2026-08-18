"use client";

import "./Sidebar.css";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

import {
  LayoutDashboard,
  ScanSearch,
  BookOpen,
  BotMessageSquare,
  BarChart3,
  Trophy,
  User,
  Settings,
  LogOut,
  Leaf,
  X,
} from "lucide-react";

export default function Sidebar({
  isOpen = false,
  onClose = () => {},
}) {
  const pathname = usePathname();
  const router = useRouter();

  // =====================================================
  // MENU
  // =====================================================

  const menus = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Scan Sampah",
      href: "/scan",
      icon: ScanSearch,
    },
    {
      name: "Edukasi Sampah",
      href: "/edukasi",
      icon: BookOpen,
    },
    {
      name: "Chat AI",
      href: "/CICI",
      icon: BotMessageSquare,
    },
    {
      name: "Statistik",
      href: "/statistik",
      icon: BarChart3,
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: Trophy,
    },
  ];

  const accountMenus = [
    {
      name: "Profil",
      href: "/profil",
      icon: User,
    },
    {
      name: "Pengaturan",
      href: "/pengaturan",
      icon: Settings,
    },
  ];

  // =====================================================
  // LOGOUT — SUPABASE
  // =====================================================

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  // =====================================================
  // ACTIVE MENU
  // =====================================================

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  // =====================================================
  // MENU ITEM
  // =====================================================

  const renderMenuItem = (menu, index, group) => {
    const Icon = menu.icon;
    const active = isActive(menu.href);

    return (
      <Link
        key={menu.href}
        href={menu.href}
        className="sidebar-link"
        onClick={onClose}
      >
        <motion.div
          className={`sidebar-item ${
            active ? "active" : ""
          }`}
          initial={{
            opacity: 0,
            x: -8,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.25,
            delay: index * 0.04,
          }}
          whileHover={{
            x: 4,
          }}
          whileTap={{
            scale: 0.98,
          }}
        >
          <span className="sidebar-icon">
            <Icon
              size={19}
              strokeWidth={active ? 2.5 : 2}
            />
          </span>

          <span className="sidebar-item-text">
            {menu.name}
          </span>

          {active && (
            <motion.span
              layoutId={`sidebar-active-${group}`}
              className="sidebar-active-indicator"
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
            />
          )}
        </motion.div>
      </Link>
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* MOBILE OVERLAY */}

      {isOpen && (
        <motion.div
          className="sidebar-overlay"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >

        {/* =================================================
            MOBILE CLOSE BUTTON
        ================================================= */}

        <button
          className="sidebar-mobile-close"
          onClick={onClose}
          aria-label="Tutup menu"
        >
          <X size={18} />
        </button>


        {/* =================================================
            LOGO
        ================================================= */}

        <div className="sidebar-logo">

          <div className="sidebar-logo-icon">

            <img
              src="/asset/images/logo.png"
              alt="TongCi"
              className="sidebar-logo-img"
            />

          </div>

          <div className="sidebar-brand-text">

            <h2>
              Tong<span>Ci</span>
            </h2>

            <p>
              Sampah Cinta ❤️
            </p>

          </div>

        </div>


        {/* =================================================
            MAIN MENU
        ================================================= */}

        <div className="sidebar-section">

          <p className="sidebar-section-title">
            MENU UTAMA
          </p>

          <nav className="sidebar-menu">

            {menus.map((menu, index) =>
              renderMenuItem(
                menu,
                index,
                "main"
              )
            )}

          </nav>

        </div>


        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div className="sidebar-section sidebar-account-section">

          <p className="sidebar-section-title">
            AKUN
          </p>

          <nav className="sidebar-menu">

            {accountMenus.map((menu, index) =>
              renderMenuItem(
                menu,
                index,
                "account"
              )
            )}

          </nav>

        </div>


        {/* =================================================
            MOTIVATION
        ================================================= */}

        <motion.div
          className="sidebar-motivation"

          initial={{
            opacity: 0,
            y: 10,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
        >

          <div className="motivation-icon">
            <Leaf size={16} />
          </div>

          <div className="motivation-content">

            <strong>
              Ayo jaga bumi! 🌱
            </strong>

            <p>
              Setiap aksi kecilmu
              punya dampak besar.
            </p>

          </div>

        </motion.div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="sidebar-footer">

          <motion.button
            className="logout-btn"
            onClick={handleLogout}

            whileHover={{
              x: 4,
            }}

            whileTap={{
              scale: 0.97,
            }}

            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >

            <LogOut size={19} />

            <span>
              Logout
            </span>

          </motion.button>

          <p className="sidebar-copyright">
            © 2026 TongCi
          </p>

        </div>

      </aside>
    </>
  );
}