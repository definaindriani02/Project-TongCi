"use client";

import "./Header.css";

import { motion } from "framer-motion";
import {
  Menu,
  Bell,
  Search,
} from "lucide-react";

export default function Header({
  onMenuClick = () => {},
}) {
  return (
    <header className="dashboard-header">

      {/* ==========================================
          LEFT
      ========================================== */}

      <div className="header-left">

        <motion.button
          type="button"
          className="header-menu-button"
          onClick={onMenuClick}
          whileTap={{ scale: 0.92 }}
          aria-label="Buka atau tutup sidebar"
        >
          <Menu size={18} />
        </motion.button>

        <h1 className="header-page-title">
          Dashboard
        </h1>

      </div>


      {/* ==========================================
          SEARCH
      ========================================== */}

      <div className="header-search">

        <Search size={13} />

        <input
          type="text"
          placeholder="Cari fitur, tips, informasi..."
          aria-label="Pencarian"
        />

      </div>


      {/* ==========================================
          RIGHT ACTIONS
      ========================================== */}

      <div className="header-actions">

        {/* NOTIFICATION */}

        <motion.button
          type="button"
          className="header-notification"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Notifikasi"
        >
          <Bell size={16} />

          <span className="notification-dot" />
        </motion.button>


        {/* PROFILE */}

        <motion.div
          className="header-profile"
          whileHover={{ y: -1 }}
        >

          <div className="header-avatar">
            A
          </div>

          <div className="header-profile-info">

            <strong>
              Sobat Bumi
            </strong>

            <span>
              Eco Beginner
            </span>

          </div>

        </motion.div>

      </div>

    </header>
  );
}