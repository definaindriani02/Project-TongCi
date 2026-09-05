"use client";

import "./CaraKerja.css";
import {
  User,
  ScanLine,
  BookOpen,
  Trophy,
  Camera,
  Bot,
  BadgeCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <User size={28} />,
    title: "Daftar Akun",
    desc: "Buat akun gratis dalam hitungan detik menggunakan email atau Google.",
    color: "green",
  },
  {
    number: "02",
    icon: <ScanLine size={28} />,
    title: "Scan Sampah",
    desc: "Foto sampahmu dan biarkan AI TongCi mengidentifikasi jenis dan cara pengelolaannya.",
    color: "blue",
  },
  {
    number: "03",
    icon: <BookOpen size={28} />,
    title: "Pelajari & Pilah",
    desc: "Ikuti panduan edukasi interaktif lalu pilah sampah sesuai kategori yang tepat.",
    color: "yellow",
  },
  {
    number: "04",
    icon: <Trophy size={28} />,
    title: "Kumpulkan Poin",
    desc: "Setiap aksi peduli lingkungan menghasilkan poin yang bisa ditukar hadiah nyata.",
    color: "pink",
  },
];

export default function CaraKerja() {
  return (
    <section className="caraKerja" id="cara-kerja">
      <div className="cara-container">

        <span className="section-tag">
          CARA KERJA
        </span>

        <h2>
          Mudah, Cepat, dan Menyenangkan
        </h2>

        <p className="section-desc">
          Hanya 4 langkah untuk mulai berkontribusi bagi lingkungan yang lebih
          bersih bersama TongCi.
        </p>

        <div className="steps-wrapper">

          <div className="line"></div>

          {steps.map((step, index) => (
            <div className="step" key={index}>

              <div className={`step-icon ${step.color}`}>
                {step.icon}
              </div>

              <span className="step-number">
                {step.number}
              </span>

              <h3>{step.title}</h3>

              <p>{step.desc}</p>

            </div>
          ))}
        </div>

        <div className="bottom-card">

          <div className="bottom-item green-bg">
            <Camera size={28} />
            <span>Upload foto sampah</span>
          </div>

          <div className="bottom-item blue-bg">
            <Bot size={28} />
            <span>AI analisis otomatis</span>
          </div>

          <div className="bottom-item pink-bg">
            <BadgeCheck size={28} />
            <span>Dapat panduan & poin</span>
          </div>

        </div>

      </div>
    </section>
  );
}