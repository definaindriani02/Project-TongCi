'use client';

import React from 'react';
import './HeroDashboard.css';

const HeroDashboard = ({ profile, loading }) => {
  // Ambil nama dari profile Supabase
  const displayName =
    profile?.full_name ||
    profile?.username ||
    profile?.name ||
    'Sobat Bumi';

  return (
    <div className="hero-dashboard">
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      <div className="hero-dashboard-content">
        <div className="hero-dashboard-text">
          <div className="hero-dashboard-badge">
            <span className="hero-badge-icon">✨</span>
            <span>Aksi kecil, dampak besar</span>
          </div>

          <h1 className="hero-title">
            {loading ? (
              <span>Memuat...</span>
            ) : (
              <>
                Selamat Datang, <span>{displayName}!</span> <span className="hero-leaf">🌿</span>
              </>
            )}
          </h1>

          <p className="hero-subtitle">
            Jadikan setiap pilihan sampah sebagai langkah nyata untuk bumi yang lebih hijau.
          </p>

          <div className="hero-dashboard-actions">
            <button className="btn-primary">
              <span className="btn-icon">📷</span> Klasifikasi Sampah
            </button>
            <button className="btn-secondary">
              <span className="btn-icon">📖</span> Pelajari Tips
            </button>
          </div>
        </div>

        <div className="hero-cici-area">
          <div className="cici-speech">
            <span>{loading ? 'Hai!' : `Hai ${displayName}! Aku CiCi 💚`}</span>
          </div>

          <div className="cici-orbit orbit-one"></div>
          <div className="cici-orbit orbit-two"></div>

          <span className="hero-floating-leaf leaf-one">🍃</span>
          <span className="hero-floating-leaf leaf-two">🌱</span>

          <div className="mascot-wrapper">
            <img
              src="/asset/images/CICI.png"
              alt="Cici Mascot"
              className="hero-mascot-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboard;