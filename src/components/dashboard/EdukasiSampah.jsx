"use client";
import "./EdukasiSampah.css";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const articles = [
  {
    category: "PLASTIK",
    title: "Kenali Jenis Sampah Plastik di Sekitarmu",
    description:
      "Kenali jenis plastik dan cara membuangnya dengan benar.",
    time: "4 menit",
    emoji: "♻️",
  },
  {
    category: "ORGANIK",
    title: "Sampah Organik Bisa Jadi Apa?",
    description:
      "Pelajari cara sederhana mengolah sampah organik.",
    time: "3 menit",
    emoji: "🌱",
  },
  {
    category: "3R",
    title: "Mulai Kebiasaan 3R dari Rumah",
    description:
      "Langkah kecil untuk mengurangi sampah setiap hari.",
    time: "5 menit",
    emoji: "🌍",
  },
];

export default function EdukasiSampah() {
  return (
    <section className="edukasi-dashboard">

      {/* HEADER */}

      <div className="edukasi-dashboard-header">

        <div>

          <span className="edukasi-dashboard-label">
            BELAJAR BARENG TONCCI
          </span>

          <h2>
            Edukasi Sampah 📚
          </h2>

          <p>
            Tambah pengetahuanmu tentang lingkungan.
          </p>

        </div>

        <Link
          href="/edukasi"
          className="edukasi-dashboard-link"
        >
          Lihat semua
          <ArrowRight size={14} />
        </Link>

      </div>


      {/* CARDS */}

      <div className="edukasi-dashboard-grid">

        {articles.map((article, index) => (

          <motion.article
            key={article.title}
            className="edukasi-dashboard-card"

            initial={{
              opacity: 0,
              y: 15,
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

            {/* IMAGE / VISUAL */}

            <div className="edukasi-dashboard-visual">

              <span className="edukasi-dashboard-emoji">
                {article.emoji}
              </span>

              <div className="edukasi-dashboard-sparkle">
                <Sparkles size={12} />
              </div>

            </div>


            {/* CONTENT */}

            <div className="edukasi-dashboard-body">

              <span className="edukasi-dashboard-category">
                {article.category}
              </span>

              <h3>
                {article.title}
              </h3>

              <p>
                {article.description}
              </p>


              <div className="edukasi-dashboard-footer">

                <span>
                  <Clock3 size={11} />
                  {article.time}
                </span>

                <span className="edukasi-read">
                  Baca
                  <ArrowRight size={12} />
                </span>

              </div>

            </div>

          </motion.article>

        ))}

      </div>

    </section>
  );
}