"use client";

import "./Features.css";
import { motion } from "framer-motion";
import { ScanLine, BookOpen, Trophy } from "lucide-react";

const features = [
  {
    icon: <ScanLine size={30} />,
    title: "AI Scan Sampah",
    desc: "Upload foto sampah dan dapatkan identifikasi jenis otomatis menggunakan teknologi AI canggih.",
    color: "green",
  },
  {
    icon: <BookOpen size={30} />,
    title: "Edukasi Interaktif",
    desc: "Pelajari jenis sampah, cara pengelolaan, dan dampak lingkungan melalui konten yang menarik.",
    color: "blue",
  },
  {
    icon: <Trophy size={30} />,
    title: "Reward & Poin",
    desc: "Dapatkan poin setiap memilah sampah dan tukarkan dengan hadiah menarik dari mitra TongCi.",
    color: "pink",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
    },
  },
};

export default function Features() {
  return (
    <section className="features" id="fitur">
      <div className="features-container">

        <motion.span
          className="section-tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          FITUR UNGGULAN
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: .1 }}
          viewport={{ once: true }}
        >
          Semua yang Kamu Butuhkan
        </motion.h2>

        <motion.p
          className="section-desc"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: .2 }}
          viewport={{ once: true }}
        >
          Platform lengkap untuk membantu kamu menjadi pahlawan lingkungan di era digital.
        </motion.p>

        <motion.div
          className="feature-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((itemData, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{
                y: -14,
                scale: 1.02,
              }}
              className={`feature-card ${itemData.color}`}
            >

              <div className="icon-box">
                {itemData.icon}
              </div>

              <h3>{itemData.title}</h3>

              <p>{itemData.desc}</p>

              <a href="#">
                Pelajari lebih
                <span>→</span>
              </a>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}