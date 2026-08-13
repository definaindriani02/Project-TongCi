import React from 'react';

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.logo}>
          Tong<span style={{ color: '#FF6FA7' }}>Ci</span>
        </div>
        <ul style={styles.menu}>
          <li><a href="#beranda" style={styles.link}>Beranda</a></li>
          <li><a href="#fitur" style={styles.link}>Fitur</a></li>
          <li><a href="#tentang-kami" style={styles.link}>Tentang Kami</a></li>
        </ul>
        <a href="/login" style={styles.btn}>Masuk</a>
      </div>
    </nav>
  );
}

const styles = {
  nav: { backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 1000, padding: '15px 0' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '24px', fontWeight: '800', color: '#1B3A24' },
  menu: { display: 'flex', listStyle: 'none', gap: '30px', margin: 0, padding: 0 },
  link: { textDecoration: 'none', color: '#4A5568', fontWeight: '500', fontSize: '15px' },
  btn: { textDecoration: 'none', backgroundColor: '#4CAF50', color: '#fff', padding: '8px 20px', borderRadius: '20px', fontWeight: '600', fontSize: '14px' }
};