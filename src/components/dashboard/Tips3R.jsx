"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Trash2,
  Recycle,
} from "lucide-react";
import "./Tips3R.css";

// Data Tips 3R
const TIPS_DATA = {
  reduce: {
    title: "Reduce (Kurangi)",
    icon: Trash2,
    color: "#e67e22",
    bgColor: "#fef5ec",
    borderColor: "#fbe3d0",
    tips: [
      {
        id: 1,
        title: "Bawa Kantong Belanja Sendiri",
        desc: "Gunakan totebag kain saat berbelanja untuk mengurangi penggunaan kantong plastik sekali pakai.",
        impact: "Hemat ~5 kantong plastik/minggu",
      },
      {
        id: 2,
        title: "Gunakan Botol Minum Tumbler",
        desc: "Hindari membeli air kemasan botol plastik PET dengan selalu membawa botol air minum ulang.",
        impact: "Hemat ~15 botol/bulan",
      },
      {
        id: 3,
        title: "Pilih Produk Tanpa Kemasan Berlebih",
        desc: "Prioritaskan membeli bahan segar dibanding makanan dalam kemasan plastik berlapis.",
        impact: "Mengurangi sampah kemasan 30%",
      },
    ],
  },
  reuse: {
    title: "Reuse (Gunakan Kembali)",
    icon: RefreshCw,
    color: "#3498db",
    bgColor: "#f0f7fc",
    borderColor: "#d4e8f7",
    tips: [
      {
        id: 1,
        title: "Kreasikan Wadah Makanan & Botol",
        desc: "Gunakan kembali toples kaca atau kemasan bekas sebagai tempat bumbu, pot tanaman, atau wadah barang kecil.",
        impact: "Perpanjang masa pakai produk",
      },
      {
        id: 2,
        title: "Manfaatkan Pakaian Bekas Jadi Lap",
        desc: "Kaos berbahan katun yang sudah tidak terpakai bisa dipotong dan dijadikan kain pembersih rumah.",
        impact: "Kurangi pembelian tisu dapur",
      },
      {
        id: 3,
        title: "Gunakan Dus Bekas untuk Penyimpanan",
        desc: "Kardus bekas paket belanja online bisa dirapi dan dipercantik untuk menyimpan dokumen atau mainan.",
        impact: "Hemat biaya tempat penyimpanan",
      },
    ],
  },
  recycle: {
    title: "Recycle (Daur Ulang)",
    icon: Recycle,
    color: "#2ecc71",
    bgColor: "#f0faf4",
    borderColor: "#d1f2dd",
    tips: [
      {
        id: 1,
        title: "Pilah Sampah Organik & Anorganik",
        desc: "Pastikan sampah tidak tercampur agar mempermudah proses daur ulang di Bank Sampah lokal.",
        impact: "Tingkatkan efisiensi daur ulang",
      },
      {
        id: 2,
        title: "Olah Sisa Makanan Jadi Kompos",
        desc: "Kulit buah dan sisa sayuran bisa diolah menjadi pupuk kompos alami untuk tanaman di rumah.",
        impact: "Kurangi emisi gas metana TPA",
      },
      {
        id: 3,
        title: "Bersihkan Kemasan Sebelum Dibuang",
        desc: "Bilas botol susu/jus bekas dari sisa cairan sebelum dimasukkan ke tempat sampah anorganik.",
        impact: "Mencegah bau & kontaminasi",
      },
    ],
  },
};

export default function Tips3R() {
  const [activeTab, setActiveTab] = useState("reduce");

  const currentCategory = TIPS_DATA[activeTab];

  return (
    <section className="tips-3r-container">
      {/* HEADER */}
      <div className="tips-3r-header">
        <div className="tips-header-text">
          <div className="tips-badge">
            <Lightbulb size={14} />
            <span>EDUKASI LINGKUNGAN</span>
          </div>
          <h2>Panduan & Tips 3R 🌱</h2>
          <p>Langkah mudah sehari-hari untuk menjaga bumi tetap lestari.</p>
        </div>

        {/* TAB BUTTONS */}
        <div className="tips-tabs">
          {Object.keys(TIPS_DATA).map((key) => {
            const item = TIPS_DATA[key];
            const Icon = item.icon;
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                className={`tab-btn ${isActive ? "active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                <Icon size={16} />
                <span>{item.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT CARDS GRID */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="tips-grid"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {currentCategory.tips.map((tip) => (
            <div
              key={tip.id}
              className="tip-card"
              style={{
                backgroundColor: currentCategory.bgColor,
                borderColor: currentCategory.borderColor,
              }}
            >
              <div className="tip-card-header">
                <span
                  className="tip-tag"
                  style={{
                    color: currentCategory.color,
                    backgroundColor: "#ffffff",
                  }}
                >
                  Tip #{tip.id}
                </span>
                <span className="tip-impact">✨ {tip.impact}</span>
              </div>

              <h4 className="tip-title">{tip.title}</h4>
              <p className="tip-desc">{tip.desc}</p>

              <div className="tip-footer">
                <button
                  className="btn-learn-more"
                  style={{ color: currentCategory.color }}
                >
                  <span>Praktekkan sekarang</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}