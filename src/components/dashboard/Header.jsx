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
  profile = null,
  user = null,
}) {
  const displayName =
    profile?.full_name ||
    profile?.username ||
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Sobat Bumi";

  const initial = displayName ? displayName.charAt(0).toUpperCase() : "S";

  const avatarUrl =
    profile?.avatar_url ||
    profile?.image_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture;

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

          <div className="header-avatar" style={{ borderRadius: "50%", overflow: "hidden" }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              initial
            )}
          </div>

          <div className="header-profile-info">

            <strong>
              {displayName}
            </strong>

            <span>
              {profile?.level || profile?.role || "Eco Beginner"}
            </span>

          </div>

        </motion.div>

      </div>

    </header>
  );
}