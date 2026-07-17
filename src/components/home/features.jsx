import React from 'react';

export default function Features() {
  const cards = [
    { title: "Deteksi Otomatis", desc: "Scan sampahmu menggunakan kamera HP, AI kami akan langsung tahu jenisnya.", icon: "📸" },
    { title: "Edukasi Interaktif", desc: "Akses materi mengasyikkan seputar cara mengolah sampah organik & anorganik.", icon: "📚" },
    { title: "Poin & Hadiah", desc: "Kumpulkan poin dari setiap sampah yang kamu pilah dan tukarkan dengan hadiah.", icon: "🎁" }
  ];

  return (
    <section id="fitur" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Fitur Utama TongCi</h2>
          <p style={styles.subtitle}>Nikmati kemudahan menjaga bumi dengan dukungan teknologi modern terintegrasi.</p>
        </div>
        <div style={styles.grid}>
          {cards.map((card, idx) => (
            <div key={idx} style={styles.card}>
              <div style={styles.icon}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDesc}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: { padding: '80px 0', backgroundColor: '#ffffff' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
  header: { textAlign: 'center', marginBottom: '50px' },
  title: { fontSize: '36px', fontWeight: '800', color: '#1B3A24', margin: '0 0 10px 0' },
  subtitle: { fontSize: '16px', color: '#718096', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' },
  card: { padding: '40px 30px', borderRadius: '20px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0', textAlign: 'center' },
  icon: { fontSize: '40px', marginBottom: '20px' },
  cardTitle: { fontSize: '20px', fontWeight: '700', color: '#2D3748', margin: '0 0 12px 0' },
  cardDesc: { fontSize: '14px', color: '#4A5568', lineHeight: '1.6', margin: 0 }
};