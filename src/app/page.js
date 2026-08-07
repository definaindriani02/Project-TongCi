"use client";

import React from 'react';
import Navbar from '@/components/layout/navbar';
import Hero from '@/components/home/hero';
import Features from '@/components/home/features';
import About from '@/components/home/about';
import Footer from '@/components/layout/footer';

export default function LandingPage() {
  return (
    <div style={styles.pageWrapper}>
      {/* 1. Navigation Bar */}
      <Navbar />
      
      {/* 2. Main Content Area */}
      <main style={styles.mainContent}>
        {/* Section 1: Beranda (Hero) */}
        <Hero />
        
        {/* Section 2: Fitur Unggulan (Features) & Statistik */}
        <Features />
        
        {/* Section 3: Mengapa TongCi (About) & Poin Keunggulan */}
        <About />
      </main>
      
      {/* 3. Footer */}
      <Footer />
    </div>
  );
}

const styles = {
  pageWrapper: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#333333',
    scrollBehavior: 'smooth',
    backgroundColor: '#ffffff',
    margin: 0,
    padding: 0,
  },
  mainContent: {
    display: 'block',
    minHeight: '100vh',
    width: '100%',
    overflowX: 'hidden', // Mencegah terjadinya overflow horizontal yang merusak layout
  }
};