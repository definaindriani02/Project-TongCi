"use client";

import React from "react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1b2e1e", color: "#b3c7b6", padding: "60px 24px 30px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Kontainer Utama 2 Kolom Seimbang */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "48px",
            marginBottom: "40px",
          }}
        >
          {/* Kolom Kiri: Logo TongCi & Deskripsi */}
          <div style={{ maxWidth: "480px", minWidth: "280px", flex: "1 1 380px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <img
                src="/asset/images/logo.png"
                alt="TongCi"
                style={{ width: "36px", height: "36px", objectFit: "contain" }}
              />
              <div>
                <h3 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", margin: 0, lineHeight: 1.2 }}>
                  Tong<span style={{ color: "#FF6FA7" }}>Ci</span>
                </h3>
                <span style={{ fontSize: "11px", color: "#88a38d", fontWeight: "500", letterSpacing: "0.5px" }}>
                  Tong Sampah Cinta
                </span>
              </div>
            </div>
            <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#b3c7b6", margin: 0 }}>
              Platform pengelolaan sampah berbasis AI untuk menciptakan Indonesia yang lebih bersih dan berkelanjutan.
            </p>
          </div>

          {/* Kolom Kanan: Navigasi */}
          <div style={{ minWidth: "160px" }}>
            <h4 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", marginBottom: "16px", letterSpacing: "0.5px" }}>
              Navigasi
            </h4>
            <ul style={styles.list}>
              <li>
                <a href="#beranda" style={styles.link}>
                  Beranda
                </a>
              </li>
              <li>
                <a href="#fitur" style={styles.link}>
                  Fitur
                </a>
              </li>
              <li>
                <a href="#cara-kerja" style={styles.link}>
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#tentang" style={styles.link}>
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Pembatas & Hak Cipta */}
        <div style={{ borderTop: "1px solid #2d4431", paddingTop: "24px", textAlign: "center", fontSize: "13px", color: "#88a38d" }}>
          <p style={{ margin: 0 }}>
            &copy; 2026 TongCi. Dibuat dengan <span style={{ color: "#FF6FA7" }}>❤</span> untuk bumi yang lebih baik.
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  link: {
    color: "#b3c7b6",
    textDecoration: "none",
    fontSize: "14px",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
};