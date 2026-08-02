"use client";

import { motion } from "framer-motion";
import "./hero.css";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: "easeOut",
    },
  }),
};

const floating = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Hero() {
  return (
    <section id="beranda" className="hero">
      {/* Background Blur */}
      <div className="hero-bg hero-bg-1"></div>
      <div className="hero-bg hero-bg-2"></div>

      <div className="hero-container">
        {/* ================= LEFT ================= */}

        <div className="hero-content">
          <motion.div
            className="hero-badge"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            whileHover={{
              scale: 1.05,
            }}
          >
            <span className="badge-dot"></span>
            <span>Platform Pengelolaan Sampah Berbasis AI</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.15}
          >
            Buang Dengan Cinta,
            <br />
            <span>Kelola Dengan Cerdas</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.3}
          >
            Belajar memilah, mengelola, dan mendaur ulang sampah dengan bantuan
            teknologi AI untuk menciptakan lingkungan yang lebih bersih dan masa
            depan yang lebih hijau.
          </motion.p>

          <motion.div
            className="hero-buttons"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.45}
          >
            <a href="/register" className="btn-primary">
              Mulai Sekarang
              <span className="arrow">→</span>
            </a>

            <a href="#fitur" className="btn-secondary">
              Pelajari Lebih Lanjut
            </a>
          </motion.div>

          {/* Trust */}
          <motion.div
            className="hero-trust"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.6}
          >
            <span>🤖 AI Scan</span>
            <span>♻ Edukasi Sampah</span>
            <span>🌱 Ramah Lingkungan</span>
          </motion.div>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="hero-images">
          <motion.div
            className="image-card"
            variants={floating}
            animate="animate"
            whileHover={{
              scale: 1.05,
              rotate: -2,
            }}
          >
            <img
              src="/asset/images/hero-1.jpeg"
              alt="Hero 1"
            />
          </motion.div>

          <motion.div
            className="image-card"
            variants={floating}
            animate="animate"
            transition={{
              delay: 0.5,
            }}
            whileHover={{
              scale: 1.05,
              rotate: 2,
            }}
          >
            <img
              src="/asset/images/hero-2.jpeg"
              alt="Hero 2"
            />
          </motion.div>

          <motion.div
            className="image-card"
            variants={floating}
            animate="animate"
            transition={{
              delay: 1,
            }}
            whileHover={{
              scale: 1.05,
              rotate: -2,
            }}
          >
            <img
              src="/asset/images/hero-3.jpeg"
              alt="Hero 3"
            />
          </motion.div>

          <motion.div
            className="image-card"
            variants={floating}
            animate="animate"
            transition={{
              delay: 1.5,
            }}
            whileHover={{
              scale: 1.05,
              rotate: 2,
            }}
          >
            <img
              src="/asset/images/hero-4.jpeg"
              alt="Hero 4"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
  
}
