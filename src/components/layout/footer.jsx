import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1b2e1e', color: '#b3c7b6', padding: '60px 20px 30px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 15px 0' }}>Tong<span style={{ color: '#FF6FA7' }}>Ci</span></h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', maxWidth: '360px' }}>Platform pengelolaan sampah berbasis AI untuk menciptakan Indonesia yang lebih bersih dan berkelanjutan.</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '15px' }}>Platform</h4>
            <ul style={styles.list}>
              <li><a href="/dashboard" style={styles.link}>Dashboard</a></li>
              <li><a href="/edukasi" style={styles.link}>Edukasi</a></li>
              <li><a href="/scan" style={styles.link}>Klasifikasi AI</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '15px' }}>Perusahaan</h4>
            <ul style={styles.list}>
              <li><a href="#tentang-kami" style={styles.link}>Tentang Kami</a></li>
              <li><a href="#" style={styles.link}>Komunitas</a></li>
              <li><a href="#" style={styles.link}>Hubungi Kami</a></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #2d4431', paddingTop: '20px', textAlign: 'center', fontSize: '13px' }}>
          <p>&copy; 2026 TongCi. Dibuat dengan <span style={{ color: '#FF6FA7' }}>❤</span> untuk bumi yang lebih baik.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' },
  link: { color: '#b3c7b6', textDecoration: 'none', fontSize: '14px' }
};