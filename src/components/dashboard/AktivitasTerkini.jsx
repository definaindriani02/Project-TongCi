"use client";
import "./AktivitasTerkini.css";
import { motion } from "framer-motion";
import {
  ScanSearch,
  ArrowRight,
  Recycle,
  Clock3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function AktivitasTerkini({ scans = [] }) {

  const getCategoryStyle = (category = "") => {
    const value = category.toLowerCase();

    if (
      value.includes("organik") ||
      value.includes("organic")
    ) {
      return {
        className: "activity-category organic",
        icon: "🌿",
      };
    }

    if (
      value.includes("plastik") ||
      value.includes("plastic")
    ) {
      return {
        className: "activity-category plastic",
        icon: "♻️",
      };
    }

    if (
      value.includes("kertas") ||
      value.includes("paper")
    ) {
      return {
        className: "activity-category paper",
        icon: "📄",
      };
    }

    if (
      value.includes("kaca") ||
      value.includes("glass")
    ) {
      return {
        className: "activity-category glass",
        icon: "🫙",
      };
    }

    if (
      value.includes("logam") ||
      value.includes("metal")
    ) {
      return {
        className: "activity-category metal",
        icon: "🥫",
      };
    }

    return {
      className: "activity-category default",
      icon: "🗑️",
    };
  };


  const formatDate = (date) => {

    if (!date) return "Baru saja";

    const scanDate = new Date(date);

    if (Number.isNaN(scanDate.getTime())) {
      return "Baru saja";
    }

    return scanDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };


  return (
    <section className="aktivitas-section">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="aktivitas-header">

        <div>

          <span className="aktivitas-label">
            RIWAYAT AKTIVITAS
          </span>

          <h2>
            Aktivitas Terbaru
          </h2>

          <p>
            Perjalanan kecilmu menuju bumi yang lebih bersih.
          </p>

        </div>


        <Link
          href="/statistik"
          className="aktivitas-see-all"
        >
          Lihat semua

          <ArrowRight size={14} />

        </Link>

      </div>


      {/* =========================================
          EMPTY STATE
      ========================================= */}

      {scans.length === 0 ? (

        <motion.div
          className="aktivitas-empty"

          initial={{
            opacity: 0,
            y: 10,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}
        >

          <div className="empty-icon">
            <ScanSearch size={24} />
          </div>

          <div>

            <h3>
              Belum ada aktivitas
            </h3>

            <p>
              Yuk mulai scan sampah pertamamu dan
              dapatkan poin!
            </p>

          </div>

          <Link
            href="/scan"
            className="empty-button"
          >
            Mulai Scan
            <ArrowRight size={14} />
          </Link>

        </motion.div>

      ) : (

        /* =========================================
           ACTIVITY LIST
        ========================================= */

        <div className="aktivitas-list">

          {scans.slice(0, 5).map((scan, index) => {

            const categoryStyle =
              getCategoryStyle(scan.category);

            return (

              <motion.div
                key={scan.id || index}
                className="aktivitas-item"

                initial={{
                  opacity: 0,
                  x: -12,
                }}

                whileInView={{
                  opacity: 1,
                  x: 0,
                }}

                viewport={{
                  once: true,
                  amount: 0.2,
                }}

                transition={{
                  duration: 0.4,
                  delay: index * 0.07,
                }}

                whileHover={{
                  x: 4,
                }}
              >

                {/* ICON */}

                <div className="activity-icon-wrapper">

                  <div
                    className={
                      categoryStyle.className
                    }
                  >
                    {categoryStyle.icon}
                  </div>

                </div>


                {/* INFO */}

                <div className="activity-info">

                  <div className="activity-title-row">

                    <h3>
                      {scan.item_name ||
                        "Sampah terdeteksi"}
                    </h3>

                    <span className="activity-ai-badge">
                      <Sparkles size={9} />
                      AI
                    </span>

                  </div>


                  <div className="activity-meta">

                    <span>
                      {scan.category ||
                        "Tidak diketahui"}
                    </span>

                    <span className="meta-dot">
                      •
                    </span>

                    <span>
                      <Clock3 size={10} />
                      {formatDate(scan.created_at)}
                    </span>

                  </div>

                </div>


                {/* POINT */}

                <div className="activity-points">

                  <span>
                    +
                    {scan.points_awarded || 0}
                  </span>

                  <small>
                    Pts
                  </small>

                </div>

              </motion.div>
            );
          })}

        </div>
      )}

    </section>
  );
}