import React from 'react';

export default function Hero() {
  return (
    <section id="beranda" style={styles.section}>
      <div style={styles.container}>
        
        {/* Sisi Kiri: Teks & Penjelasan */}
        <div style={styles.heroText}>
          <div style={styles.badge}>
            <span style={styles.badgeDot}></span> Platform Pengelolaan Sampah Berbasis AI
          </div>
          
          <h1 style={styles.title}>
            Buang Dengan Cinta,<br />
            <span style={styles.textGreen}>Kelola Dengan Cerdas</span>
          </h1>

          <p style={styles.description}>
            Belajar memilih, mengelola, dan mendaur ulang sampah dengan bantuan teknologi AI untuk menciptakan lingkungan yang lebih bersih dan masa depan yang lebih hijau.
          </p>
          
          <div style={styles.actions}>
            <a href="/register" style={styles.btnPrimary}>Mulai Sekarang →</a>
            <a href="#edukasi" style={styles.btnSecondary}>Pelajari Lebih Lanjut</a>
          </div>
          
          <div style={styles.proof}>
            <div style={styles.avatarGroup}>
              {['A', 'B', 'C', 'D'].map((char, i) => (
                <span key={i} style={{ ...styles.avatar, backgroundColor: i % 2 === 0 ? '#8BC34A' : '#FF6FA7' }}>{char}</span>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
              Bergabung bersama <strong style={{ color: '#4CAF50' }}>50.000+</strong> pengguna aktif
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Grid 4 Gambar (Aman dari Eror Next.js) */}
        <div style={styles.heroMedia}>
          <div style={styles.gridImages}>
            <div style={{ ...styles.imageWrapper, backgroundColor: '#E2F0D9' }}>
              <img src="/assets/images/hero-1.png" alt="Tempat sampah kompos" style={styles.imageItem} />
            </div>
            <div style={{ ...styles.imageWrapper, backgroundColor: '#FFE5ED' }}>
              <img src="/assets/images/hero-2.png" alt="Barisan tempat sampah umum" style={styles.imageItem} />
            </div>
            <div style={{ ...styles.imageWrapper, backgroundColor: '#E3F2FD' }}>
              <img src="/assets/images/hero-3.png" alt="Tumpukan botol plastik pilahan" style={styles.imageItem} />
            </div>
            <div style={{ ...styles.imageWrapper, backgroundColor: '#FFF3E0' }}>
              <img src="/assets/images/hero-4.png" alt="Tempat sampah pilah luar ruangan" style={styles.imageItem} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

const styles = {
  section: { 
    padding: '80px 0', 
    backgroundColor: '#E8F5E9', 
    backgroundImage: 'linear-gradient(135deg, #E8F5E9 0%, #FFFFFF 100%)', 
  },
  container: { 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '0 20px', 
    display: 'grid', 
    gridTemplateColumns: '1.1fr 0.9fr', 
    gap: '40px', 
    alignItems: 'center' 
  },
  heroText: { display: 'flex', flexDirection: 'column', gap: '24px' },
  badge: { 
    display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', 
    color: '#4CAF50', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', 
    fontWeight: '600', width: 'fit-content', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  badgeDot: { width: '8px', height: '8px', backgroundColor: '#4CAF50', borderRadius: '50%' },
  title: { fontSize: '52px', fontWeight: '800', color: '#1B3A24', lineHeight: '1.2', margin: 0, letterSpacing: '-1px' },
  textGreen: { color: '#4CAF50' },
  description: { fontSize: '16px', color: '#4A5568', lineHeight: '1.7', margin: 0, maxWidth: '520px' },
  actions: { display: 'flex', gap: '15px', alignItems: 'center' },
  btnPrimary: { 
    textDecoration: 'none', padding: '14px 28px', borderRadius: '25px', backgroundColor: '#4CAF50', 
    color: '#fff', fontWeight: '600', fontSize: '15px', boxShadow: '0 4px 14px rgba(76, 175, 80, 0.3)'
  },
  btnSecondary: { 
    textDecoration: 'none', padding: '14px 28px', borderRadius: '25px', backgroundColor: '#FFFFFF', 
    color: '#4CAF50', fontWeight: '600', fontSize: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  proof: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '15px' },
  avatarGroup: { display: 'flex', paddingLeft: '8px' },
  avatar: { 
    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold', border: '2px solid #fff', marginLeft: '-8px' 
  },
  heroMedia: { width: '100%' },
  gridImages: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  imageWrapper: {
    width: '100%',
    height: '180px',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
  },
  imageItem: { 
    width: '100%',
    height: '100%', 
    objectFit: 'cover',
  }
};