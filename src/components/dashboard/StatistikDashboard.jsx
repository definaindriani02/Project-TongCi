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
}) {
  const stats = [
    {
      title: "Poin Terkumpul",
      value: points,
      suffix: "Pts",
      description: "Total poin yang kamu kumpulkan",
      icon: Award,
      type: "points",
    },
    {
      title: "Total Scan",
      value: scanCount,
      suffix: "Kali",
      description: "Sampah yang berhasil dianalisis",
      icon: ScanSearch,
      type: "scan",
    },
    {
      title: "Estimasi Daur Ulang",
      value: (scanCount * 0.15).toFixed(2),
      suffix: "Kg",
      description: "Perkiraan sampah yang terkelola",
      icon: Recycle,
      type: "recycle",
    },
  ];

  return (
    <section className="dashboard-statistik">

      {/* HEADER */}

      <div className="statistik-heading">

        <div>
          <span className="statistik-label">
            PERFORMA KAMU
          </span>

          <h2>
            Jejak Kebaikanmu 🌱
          </h2>

          <p>
            Lihat kontribusimu dalam menjaga lingkungan bersama TongCi.
          </p>
        </div>

        <motion.div
          className="statistik-growth"
          whileHover={{ scale: 1.04 }}
        >
          <TrendingUp size={16} />

          <span>
            Terus berkembang!
          </span>
        </motion.div>

      </div>


      {/* STAT CARDS */}

      <div className="statistik-grid">

        {stats.map((item, index) => {

          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              className={`statistik-card statistik-${item.type}`}

              initial={{
                opacity: 0,
                y: 18,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              viewport={{
                once: true,
                amount: 0.2,
              }}

              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}

              whileHover={{
                y: -5,
              }}
            >

              {/* TOP */}

              <div className="statistik-card-top">

                <div className="statistik-icon">
                  <Icon size={21} />
                </div>

                <div className="statistik-arrow">
                  <ArrowUpRight size={15} />
                </div>

              </div>


              {/* CONTENT */}

              <div className="statistik-content">

                <p className="statistik-title">
                  {item.title}
                </p>

                <div className="statistik-value">

                  <span>
                    {item.value}
                  </span>

                  <small>
                    {item.suffix}
                  </small>

                </div>

                <p className="statistik-description">
                  {item.description}
                </p>

              </div>


              {/* DECORATION */}

              <div className="statistik-decoration">
                {item.type === "points" && "✦"}
                {item.type === "scan" && "⌁"}
                {item.type === "recycle" && "♻"}
              </div>

            </motion.div>
          );

        })}

      </div>

    </section>
  );
}