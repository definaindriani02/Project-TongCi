"use client";

import "./StatistikDashboard.css";

import { motion } from "framer-motion";
import {
  Award,
  ScanSearch,
  Recycle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

export default function StatistikDashboard({
  points = 0,
  scanCount = 0,
  loading = false,
}) {
  // Format Angka ke Standar Indonesia (misal: 1.000)
  const formattedPoints = points.toLocaleString("id-ID");
  const formattedScanCount = scanCount.toLocaleString("id-ID");
  const estimatedRecycle = (scanCount * 0.15).toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });

  const stats = [
    {
      title: "Poin Terkumpul",
      value: formattedPoints,
      suffix: "Pts",
      description: "Total poin yang kamu kumpulkan",
      icon: Award,
      type: "points",
    },
    {
      title: "Total Scan",
      value: formattedScanCount,
      suffix: "Kali",
      description: "Sampah yang berhasil dianalisis",
      icon: ScanSearch,
      type: "scan",
    },
    {
      title: "Estimasi Daur Ulang",
      value: estimatedRecycle,
      suffix: "Kg",
      description: "Perkiraan sampah yang terkelola",
      icon: Recycle,
      type: "recycle",
    },
  ];

  return (
    <section className="dashboard-statistik">
      {/* HEADING */}
      <motion.div
        className="statistik-heading"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <div className="statistik-heading-content">
          <span className="statistik-label">PERFORMA KAMU</span>
          <h2>Jejak Kebaikanmu 🌱</h2>
          <p>Lihat kontribusimu dalam menjaga lingkungan bersama TongCi.</p>
        </div>

        <motion.div
          className="statistik-growth"
          whileHover={{ y: -2, scale: 1.03 }}
        >
          <TrendingUp size={15} />
          <span>Terus berkembang!</span>
        </motion.div>
      </motion.div>

      {/* STATISTIC CARDS */}
      <div className="statistik-grid">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.article
              key={item.title}
              className={`statistik-card statistik-${item.type}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              whileHover={{ y: -5 }}
            >
              {/* TOP */}
              <div className="statistik-card-top">
                <div className="statistik-icon">
                  <Icon size={20} strokeWidth={2} />
                </div>

                <div className="statistik-arrow">
                  <ArrowUpRight size={14} />
                </div>
              </div>

              {/* CONTENT */}
              <div className="statistik-content">
                <span className="statistik-title">{item.title}</span>

                <div className="statistik-value">
                  {loading ? (
                    <div className="statistik-skeleton skeleton-value" />
                  ) : (
                    <>
                      <strong>{item.value}</strong>
                      <span>{item.suffix}</span>
                    </>
                  )}
                </div>

                <p className="statistik-description">{item.description}</p>
              </div>

              {/* DECORATION */}
              <div className="statistik-decoration">
                {item.type === "points" && "✦"}
                {item.type === "scan" && "⌁"}
                {item.type === "recycle" && "♻"}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}