"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, ChevronRight, Leaf, Sparkles, Inbox } from "lucide-react";
import "./AktivitasTerkini.css";

// Helper untuk format kategori sampah & badge style
const getCategoryBadge = (category = "") => {
  const cat = category.toLowerCase();
  if (cat.includes("organik")) {
    return { label: "Organik", className: "badge-organik", icon: "🌱" };
  }
  if (cat.includes("anorganik") || cat.includes("plastik") || cat.includes("kertas")) {
    return { label: "Anorganik", className: "badge-anorganik", icon: "♻️" };
  }
  if (cat.includes("b3") || cat.includes("bahaya") || cat.includes("elektronik")) {
    return { label: "B3 / Bahaya", className: "badge-b3", icon: "⚠️" };
  }
  return { label: category || "Umum", className: "badge-default", icon: "📦" };
};

// Helper format tanggal sederhana
const formatTimeAgo = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m yang lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j yang lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}hr yang lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};

export default function AktivitasTerkini({ scans = [], loading = false }) {
  return (
    <div className="aktivitas-terkini-container">
      {/* HEADER */}
      <div className="aktivitas-header">
        <div className="aktivitas-header-title">
          <div className="aktivitas-title-icon">
            <Clock size={18} />
          </div>
          <div>
            <h3>Aktivitas Terkini</h3>
            <p>Riwayat pemilahan sampah terbaru</p>
          </div>
        </div>

        <button className="btn-see-all">
          <span>Lihat Semua</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* CONTENT LIST */}
      <div className="aktivitas-list">
        {loading ? (
          // SKELETON LOADING
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="aktivitas-item skeleton-item">
              <div className="skeleton-thumb" />
              <div className="skeleton-text-group">
                <div className="skeleton-text skeleton-title" />
                <div className="skeleton-text skeleton-subtitle" />
              </div>
              <div className="skeleton-badge" />
            </div>
          ))
        ) : scans.length === 0 ? (
          // EMPTY STATE
          <motion.div
            className="aktivitas-empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="empty-icon">
              <Inbox size={32} />
            </div>
            <h4>Belum Ada Aktivitas</h4>
            <p>Mulai memilah dan scan sampah pertamamu untuk mengumpulkan poin!</p>
          </motion.div>
        ) : (
          // DATA SCANS
          scans.map((item, index) => {
            const badge = getCategoryBadge(item.category);

            return (
              <motion.div
                key={item.id || index}
                className="aktivitas-item"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* ICON / BADGE AVATAR */}
                <div className="item-avatar">
                  <span>{badge.icon}</span>
                </div>

                {/* DETAILS */}
                <div className="item-details">
                  <h4 className="item-name">{item.item_name || "Sampah Terdeteksi"}</h4>
                  <div className="item-meta">
                    <span className="item-time">{formatTimeAgo(item.created_at)}</span>
                    {item.confidence && (
                      <>
                        <span className="meta-dot">•</span>
                        <span className="item-confidence">
                          Akurasi {Math.round(item.confidence * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* CATEGORY & POINTS */}
                <div className="item-right">
                  <span className={`category-badge ${badge.className}`}>
                    {badge.label}
                  </span>
                  <span className="item-points">
                    +{item.points_awarded || 10} Pts
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}