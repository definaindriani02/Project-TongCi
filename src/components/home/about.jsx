"use client";
import { useEffect } from "react";
import "./About.css";
import { CheckCircle } from "lucide-react";

export default function About() {
  useEffect(() => {
  const items = document.querySelectorAll(".about-content li");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  items.forEach((item) => observer.observe(item));

  return () => observer.disconnect();
}, []);
  return (
    <section className="about" id="tentang">
      <div className="circle c1"></div>
      <div className="circle c2"></div>
      <div className="circle c3"></div>
      <div className="circle c4"></div>
      <div className="about-container">

        {/* LEFT */}

        <div className="about-image">

          <div className="floating top-left">
            🌱 Ramah Lingkungan
          </div>

          <div className="floating top-right">
            🤖 Berbasis AI
          </div>

          <div className="glass-card">

            {/* Ganti nanti dengan gambar/logo */}
            <img
              src="/asset/images/logo.png"
              alt="TongCi"
            />

          </div>

          <div className="floating bottom-left">
            🎁 Reward & Poin
          </div>

          <div className="floating bottom-right">
            📚 Edukasi Gratis
          </div>

        </div>



        {/* RIGHT */}

        <div className="about-content">

          <span className="about-tag">
            TENTANG KAMI
          </span>

          <h2>
            Mengapa
            <br />
            <span>TongCi?</span>
          </h2>

          <p>
            TongCi hadir sebagai solusi digital berbasis AI untuk membantu
            masyarakat memahami cara memilah sampah dengan mudah, cepat,
            dan menyenangkan.
          </p>

          <p>
            Melalui edukasi interaktif, identifikasi otomatis,
            dan sistem reward, kami ingin membangun kebiasaan baik
            dalam menjaga lingkungan.
          </p>

          <ul>

            <li>
              <CheckCircle size={20}/>
              Akurasi AI hingga 98%
            </li>

            <li>
              <CheckCircle size={20}/>
              Edukasi dari materi terpercaya
            </li>

            <li>
              <CheckCircle size={20}/>
              Reward untuk setiap aksi
            </li>

            <li>
              <CheckCircle size={20}/>
              Cocok untuk sekolah & masyarakat
            </li>

          </ul>

          <a href="/register" className="about-btn">
            Bergabung Sekarang →
          </a>

        </div>

      </div>

    </section>
  );
}