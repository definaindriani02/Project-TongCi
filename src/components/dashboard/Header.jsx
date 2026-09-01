"use client";

import "./Header.css";

import { motion } from "framer-motion";
import {
  Menu,
  Bell,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function Header({
  onMenuClick = () => {},
}) {
  return (
    <header className="dashboard-header">

      {/* ==========================================
          MOBILE MENU
      ========================================== */}

      <motion.button
        className="header-menu-button"
        onClick={onMenuClick}
        whileTap={{ scale: 0.92 }}
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </motion.button>


      {/* ==========================================
          WELCOME
      ========================================== */}

      <div className="header-welcome">

        <span className="header-mini-label">
          TONCCI DASHBOARD
        </span>

        <h1>
          Hai, Sobat Bumi! 🌱
        </h1>

        <p>
          Yuk lanjutkan perjalanan kecilmu
          untuk bumi yang lebih baik.
        </p>

      </div>


      {/* ==========================================
          RIGHT SIDE
      ========================================== */}

      <div className="header-actions">

        {/* NOTIFICATION */}

        <motion.button
          className="header-notification"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Notifikasi"
        >
          <Bell size={18} />

          <span className="notification-dot" />
        </motion.button>


        {/* PROFILE */}

        <motion.div
          className="header-profile"
          whileHover={{ y: -2 }}
        >

          <div className="header-avatar">
            <span>🌱</span>
          </div>

          <div className="header-profile-info">

            <strong>
              Sobat Bumi
            </strong>

            <span>
              Eco Beginner
            </span>

          </div>

          <ChevronDown
            size={15}
            className="header-chevron"
          />

        </motion.div>

      </div>

    </header>
  );
}