"use client";

import React from "react";
import Navbar from "@/components/layout/navbar";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import CaraKerja from "@/components/home/CaraKerja";
import About from "@/components/home/about";
import Footer from "@/components/layout/footer";


export default function LandingPage() {
  return (
    <div style={styles.pageWrapper}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Hero */}
        <Hero />

        {/* Fitur */}
        <Features />

        {/* Cara Kerja */}
        <CaraKerja />

        {/* Mengapa Memilih TongCi */}
        <About />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

const styles = {
  pageWrapper: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: "#333333",
    backgroundColor: "#ffffff",
    margin: 0,
    padding: 0,
    scrollBehavior: "smooth",
  },

  mainContent: {
    display: "block",
    width: "100%",
    minHeight: "100vh",
    overflowX: "hidden",
  },
};