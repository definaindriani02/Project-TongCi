import React from 'react';

export default function About() {
  const benefits = [
    "Identifikasi sampah real-time dengan akurasi tinggi",
    "Konten edukasi dari pakar lingkungan terpercaya",
    "Program reward untuk setiap aksi peduli lingkungan"
  ];

  // Data 4 Orang Anggota Tim Pembuat Website
  const teamMembers = [
    { name: "Nama Anggota 1", role: "Project Manager / Hacker", img: "👤" },
    { name: "Nama Anggota 2", role: "UI/UX Designer / Hipster", img: "🎨" },
    { name: "Nama Anggota 3", role: "Frontend Developer", img: "💻" },
    { name: "Nama Anggota 4", role: "Backend Developer", img: "⚙️" }
  ];

  return (
    <section id="tentang-kami" style={styles.section}>
      <div style={styles.container}>
        {/* --- Bagian Mengapa TongCi --- */}
        <div style={styles.visualSide}>
          <div style={styles.cloudVisual}>
            <div style={styles.mascotCircle}>
              <span style={{ fontSize: '60px' }}>♻️</span>
            </div>
          </div>
        </div>

        <div style={styles.contentSide}>
          <span style={styles.topBadge}>MENGAPA TONGCI?</span>
          <h2 style={styles.mainTitle}>Mengapa<br />Memilih TongCi?</h2>
          <p style={styles.description}>
            TongCi hadir sebagai solusi digital berbasis kecerdasan buatan untuk membantu masyarakat Indonesia memahami dan menerapkan pengelolaan sampah dengan bijak.
          </p>
          <ul style={styles.benefitList}>
            {benefits.map((benefit, index) => (
              <li key={index} style={styles.benefitItem}>
                <span style={styles.checkIcon}>✓</span>
                <span style={styles.benefitText}>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- Bagian Baru: Profil 4 Anggota Tim --- */}
      <div style={styles.teamSection}>
        <div style={styles.teamHeader}>
          <span style={styles.topBadge}>TIM KAMI</span>
          <h2 style={styles.teamMainTitle}>Sosok di Balik TongCi</h2>
          <p style={styles.teamSubtitle}>Tim berdedikasi yang merancang dan mengembangkan platform untuk masa depan bumi.</p>
        </div>
        
        <div style={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div key={index} style={styles.teamCard}>
              <div style={styles.avatarContainer}>
                {/* Kamu bisa mengganti emoji ini dengan tag <img src="/path-foto.jpg" /> nanti */}
                <span style={{ fontSize: '40px' }}>{member.img}</span>
              </div>
              <h3 style={styles.memberName}>{member.name}</h3>
              <p style={styles.memberRole}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: { padding: '100px 0 60px 0', backgroundColor: '#F9FBF9', overflow: 'hidden' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', marginBottom: '100px' },
  visualSide: { width: '100%', display: 'flex', justifyContent: 'center' },
  cloudVisual: { width: '100%', maxWidth: '450px', height: '350px', backgroundColor: '#FFFFFF', borderRadius: '32px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' },
  mascotCircle: { width: '140px', height: '140px', borderRadius: '50%', backgroundColor: '#E8F5E9', border: '4px solid #4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  contentSide: { display: 'flex', flexDirection: 'column', gap: '20px' },
  topBadge: { color: '#4CAF50', fontWeight: '700', fontSize: '13px', letterSpacing: '1px' },
  mainTitle: { fontSize: '42px', fontWeight: '800', color: '#1B3A24', lineHeight: '1.15', margin: 0 },
  description: { color: '#4A5568', fontSize: '16px', lineHeight: '1.7', margin: 0 },
  benefitList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' },
  benefitItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  checkIcon: { width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#E8F5E9', color: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' },
  benefitText: { fontSize: '15px', color: '#2D3748', fontWeight: '500' },
  
  // Style Tambahan untuk Tim
  teamSection: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
  teamHeader: { textAlign: 'center', marginBottom: '50px' },
  teamMainTitle: { fontSize: '36px', fontWeight: '800', color: '#1B3A24', margin: '8px 0 0 0' },
  teamSubtitle: { fontSize: '15px', color: '#718096', marginTop: '8px' },
  teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' },
  teamCard: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '30px 20px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', transition: 'transform 0.2s' },
  avatarContainer: { width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#F7FAFC', margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' },
  memberName: { fontSize: '18px', fontWeight: '700', color: '#2D3748', margin: '0 0 6px 0' },
  memberRole: { fontSize: '14px', color: '#4CAF50', fontWeight: '600', margin: 0 }
};