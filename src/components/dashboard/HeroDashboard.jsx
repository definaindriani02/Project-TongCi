"use client";

import "./HeroDashboard.css";

import { motion } from "framer-motion";
import {
  ScanSearch,
  ArrowRight,
  Sparkles,
  Leaf,
} from "lucide-react";
import Link from "next/link";

export default function HeroDashboard() {
  return (
    <section className="hero-dashboard">

      {/* BACKGROUND DECORATION */}
      <div className="hero-dashboard-glow hero-glow-one" />
      <div className="hero-dashboard-glow hero-glow-two" />

      <div className="hero-dashboard-content">

        {/* ==========================================
            LEFT CONTENT
        ========================================== */}

        <motion.div
          className="hero-dashboard-text"

          initial={{
            opacity: 0,
            x: -25,
          }}

          animate={{
            opacity: 1,
            x: 0,
          }}

          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >

          <div className="hero-dashboard-badge">
            <span className="hero-badge-icon">
              <Sparkles size={12} />
            </span>

            <span>
              Misi kecil, dampak besar
            </span>
          </div>


          <h2>
            Yuk, mulai
            <br />

            <span>
              jaga bumi
            </span>
            {" "}hari ini! 🌱
          </h2>


          <p>
            Kenali sampahmu, pilih cara membuang
            yang tepat, dan ikut berkontribusi
            menjaga lingkungan bersama TongCi.
          </p>


          <div className="hero-dashboard-actions">

            <Link
              href="/scan"
              className="hero-scan-button"
            >

              <span className="hero-scan-icon">
                <ScanSearch size={17} />
              </span>

              <span>
                Scan Sampah
              </span>

              <ArrowRight
                size={16}
                className="hero-arrow"
              />

            </Link>


            <div className="hero-mini-info">

              <div className="hero-mini-icon">
                <Leaf size={14} />
              </div>

              <span>
                Satu langkah hari ini
              </span>

            </div>

          </div>

        </motion.div>


        {/* ==========================================
            CICI AREA
        ========================================== */}

        <motion.div
          className="hero-cici-area"

          initial={{
            opacity: 0,
            scale: 0.88,
          }}

          animate={{
            opacity: 1,
            scale: 1,
          }}

          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: "easeOut",
          }}
        >

          {/* Decorative circles */}

          <div className="cici-orbit orbit-one" />
          <div className="cici-orbit orbit-two" />


          {/* Floating leaves */}

          <motion.span
            className="hero-floating-leaf leaf-one"

            animate={{
              y: [0, -8, 0],
              rotate: [0, 8, 0],
            }}

            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🌿
          </motion.span>


          <motion.span
            className="hero-floating-leaf leaf-two"

            animate={{
              y: [0, 7, 0],
              rotate: [0, -8, 0],
            }}

            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          >
            🍃
          </motion.span>


          {/* ======================================
              CICI PLACEHOLDER

              NANTI GANTI DIV INI DENGAN:
              <img src="/asset/images/cici.png" ... />

              atau component maskot CiCi.
          ====================================== */}

          <motion.div
            className="cici-placeholder"

            animate={{
              y: [0, -7, 0],
            }}

            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >

            <div className="cici-placeholder-inner">

              <span className="cici-placeholder-face">
                🌱
              </span>

              <span className="cici-placeholder-text">
                CiCi
              </span>

            </div>

          </motion.div>


          {/* Speech bubble */}

          <motion.div
            className="cici-speech"

            initial={{
              opacity: 0,
              y: 8,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.8,
              duration: 0.5,
            }}
          >
            <span>
              Semangat! 🌱
            </span>
          </motion.div>

        </motion.div>

      </div>

    </section>
  );
}