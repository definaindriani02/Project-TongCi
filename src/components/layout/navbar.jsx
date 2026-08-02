"use client";

import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">

        {/* Logo */}
        <a href="#beranda" className="logo">
          <img
            src="/asset/images/logo.png"
            alt="TongCi"
          />

          <div className="logo-text">
            <h2>TongCi</h2>
            <span>Tong Sampah Cinta</span>
          </div>
        </a>

        {/* Menu */}
        <nav className="nav-menu">
          <a href="#beranda">Beranda</a>
          <a href="#fitur">Fitur</a>

          {/* PERBAIKAN */}
          <a href="#cara-kerja">Cara Kerja</a>

          <a href="#tentang">Tentang Kami</a>
        </nav>

        {/* Button */}
        <div className="nav-action">
          <a href="/login" className="btn-login">
            Login
          </a>

          <a href="/register" className="btn-register">
            Register →
          </a>
        </div>

      </div>
    </header>
  );
}