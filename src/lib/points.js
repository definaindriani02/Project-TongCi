// =========================================================
// TONGCI - ATURAN POIN SCAN & KATALOG GAMIFIKASI DIGITAL
// =========================================================

/**
 * Aturan Poin Berdasarkan Kategori Sampah yang Di-scan:
 * - Sampah Organik: +3 Poin
 * - Sampah Anorganik: +5 Poin
 * - Sampah B3: +10 Poin
 */
export const CATEGORY_POINTS = {
  Organik: 3,
  Anorganik: 5,
  Plastik: 5,
  Kertas: 5,
  Logam: 5,
  B3: 10,
};

/**
 * Helper untuk menghitung poin dari kategori sampah
 * @param {string} category 
 * @returns {number}
 */
export const getPointsForCategory = (category = "") => {
  if (!category) return 5;
  const cleanCat = category.trim();

  // Pencocokan langsung
  if (CATEGORY_POINTS[cleanCat] !== undefined) {
    return CATEGORY_POINTS[cleanCat];
  }

  // Pencocokan fleksibel (case-insensitive & kata kunci)
  const lower = cleanCat.toLowerCase();
  if (lower.includes("b3") || lower.includes("bahaya") || lower.includes("elektronik") || lower.includes("medis") || lower.includes("racun")) {
    return 10;
  }
  if (lower.includes("organik") && !lower.includes("anorganik")) {
    return 3;
  }
  if (lower.includes("anorganik") || lower.includes("plastik") || lower.includes("kertas") || lower.includes("logam") || lower.includes("besi") || lower.includes("kaleng") || lower.includes("aluminium")) {
    return 5;
  }

  return 5;
};

/**
 * KATALOG REWARD GAMIFIKASI DIGITAL TONGCI
 * Kategori:
 * - 'badge': Badge Eksklusif Profil
 * - 'certificate': Sertifikat Kontribusi Hijau Digital
 * - 'frame': Frame Avatar Profil Eco-Warrior
 */
export const GAMIFICATION_REWARDS = [
  // ================= BADGE EKSKLUSIF =================
  {
    id: "badge_eco_warrior",
    title: "Badge Eco-Warrior",
    category: "badge",
    categoryLabel: "Badge Eksklusif",
    pointsCost: 50,
    icon: "🛡️",
    badgeCode: "ECO-WARRIOR",
    rarity: "Common",
    rarityColor: "#22c55e",
    description: "Lencana pengakuan bagi pemilah sampah yang aktif menjaga kebersihan lingkungan.",
    benefits: "Ditampilkan di profil dan menandai status eco-warrior aktif.",
  },
  {
    id: "badge_master_kompos",
    title: "Badge Master Kompos",
    category: "badge",
    categoryLabel: "Badge Eksklusif",
    pointsCost: 100,
    icon: "🌱",
    badgeCode: "COMPOST-MASTER",
    rarity: "Rare",
    rarityColor: "#3b82f6",
    description: "Penghargaan khusus atas konsistensi memilah sampah organik untuk pembuatan kompos.",
    benefits: "Lencana keahlian organik di kartu profil & leaderboard.",
  },
  {
    id: "badge_plastic_ninja",
    title: "Badge Plastic Ninja",
    category: "badge",
    categoryLabel: "Badge Eksklusif",
    pointsCost: 150,
    icon: "🥷",
    badgeCode: "PLASTIC-NINJA",
    rarity: "Epic",
    rarityColor: "#a855f7",
    description: "Lencana keberanian menyelamatkan lingkungan dari limbah anorganik dan plastik sekali pakai.",
    benefits: "Efek animasi spesial di samping nama pengguna pada profil.",
  },
  {
    id: "badge_zero_waste_hero",
    title: "Badge Zero-Waste Legend",
    category: "badge",
    categoryLabel: "Badge Eksklusif",
    pointsCost: 300,
    icon: "👑",
    badgeCode: "ZERO-WASTE-LEGEND",
    rarity: "Legendary",
    rarityColor: "#eab308",
    description: "Gelar tertinggi untuk pahlawan bumi pelopor gaya hidup bebas sampah dan keberlanjutan.",
    benefits: "Lencana emas mahkota legendaris dan gelar kehormatan profil.",
  },

  // ================= SERTIFIKAT HIJAU =================
  {
    id: "cert_sahabat_bumi",
    title: "Sertifikat Sahabat Bumi 2026",
    category: "certificate",
    categoryLabel: "Sertifikat Hijau",
    pointsCost: 100,
    icon: "📜",
    badgeCode: "CERT-EARTH-2026",
    rarity: "Rare",
    rarityColor: "#3b82f6",
    issuer: "Komunitas TongCi Lestari",
    description: "Sertifikat digital resmi atas komitmen memilah sampah rumah tangga secara berkesinambungan.",
    benefits: "Dokumen digital resmi dengan nomor sertifikat terverifikasi yang bisa diunduh.",
  },
  {
    id: "cert_carbon_reducer",
    title: "Sertifikat Pengurang Emisi Karbon",
    category: "certificate",
    categoryLabel: "Sertifikat Hijau",
    pointsCost: 200,
    icon: "🍃",
    badgeCode: "CERT-CARBON-CUT",
    rarity: "Epic",
    rarityColor: "#a855f7",
    issuer: "Aliansi Aksi Iklim TongCi",
    description: "Pengakuan validasi atas peran aktif mengurangi beban TPA dan menekan pelepasan gas metana.",
    benefits: "Sertifikat penghargaan digital prestisius untuk portofolio lingkungan.",
  },
  {
    id: "cert_duta_lestari",
    title: "Sertifikat Duta Hijau Lestari",
    category: "certificate",
    categoryLabel: "Sertifikat Hijau",
    pointsCost: 400,
    icon: "🌟",
    badgeCode: "CERT-GREEN-AMBASSADOR",
    rarity: "Legendary",
    rarityColor: "#eab308",
    issuer: "Dewan Pengawas Lingkungan TongCi",
    description: "Sertifikat tingkat tertinggi sebagai Duta Keberlanjutan Lingkungan Hidup Digital TongCi.",
    benefits: "Sertifikat emas eksklusif bertanda tangan digital dan nomor registrasi kehormatan.",
  },

  // ================= FRAME PROFIL ECO-WARRIOR =================
  {
    id: "frame_emerald_leaf",
    title: "Frame Daun Zamrud",
    category: "frame",
    categoryLabel: "Frame Profil",
    pointsCost: 80,
    icon: "🌿",
    badgeCode: "FRAME-EMERALD",
    rarity: "Common",
    rarityColor: "#22c55e",
    frameBorderClass: "frame-style-emerald",
    description: "Bingkai foto profil bernuansa dedaunan hijau alami yang segar dan elegan.",
    benefits: "Dapat dipasang menghiasi avatar profil Anda di seluruh halaman aplikasi.",
  },
  {
    id: "frame_golden_eco",
    title: "Frame Emas Eco-Champion",
    category: "frame",
    categoryLabel: "Frame Profil",
    pointsCost: 250,
    icon: "✨",
    badgeCode: "FRAME-GOLDEN",
    rarity: "Epic",
    rarityColor: "#eab308",
    frameBorderClass: "frame-style-golden",
    description: "Bingkai foto profil beraksen emas bercahaya untuk pemilah sampah berdedikasi tinggi.",
    benefits: "Aura kilauan emas di foto avatar profil Anda.",
  },
  {
    id: "frame_cyber_green",
    title: "Frame Neon Bio-Guardian",
    category: "frame",
    categoryLabel: "Frame Profil",
    pointsCost: 350,
    icon: "💚",
    badgeCode: "FRAME-NEON-BIO",
    rarity: "Legendary",
    rarityColor: "#10b981",
    frameBorderClass: "frame-style-neon",
    description: "Bingkai futuristik dengan efek gradasi neon pelindung biosfer modern.",
    benefits: "Pulsing glow neon hijau futuristik di sekitar foto profil.",
  },
];
