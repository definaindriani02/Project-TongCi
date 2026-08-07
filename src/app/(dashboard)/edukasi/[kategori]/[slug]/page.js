"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Clock, 
  Tag, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles 
} from "lucide-react";

export default function EdukasiSlugPage({ params }) {
  // Dalam implementasi nyata, data ini diambil berdasarkan `params.slug`
  const article = {
    title: "Cara Mengompos Sampah Organik di Rumah Tanpa Bau",
    category: "Organik",
    readTime: "5 menit baca",
    publishedAt: "24 Mei 2026",
    author: "Tim Edukasi CiCi",
    heroImage: "/images/composting.jpg", // Ganti sesuai aset gambar kamu
    summary: "Mengompos adalah cara efektif menekan volume limbah rumah tangga sekaligus menghasilkan pupuk alami kaya nutrisi untuk tanaman.",
    content: [
      {
        type: "paragraph",
        text: "Sampah organik dapur seperti sisa sayuran, kulit buah, dan ampas kopi sering kali berakhir membusuk di TPA dan menghasilkan gas metana. Padahal, dengan teknik pengomposan yang tepat, kamu bisa mengubah limbah tersebut menjadi pupuk kompos berkualitas tinggi tanpa menimbulkan bau tak sedap."
      },
      {
        type: "heading",
        text: "Prinsip Utama: Keseimbangan Unsur C dan N"
      },
      {
        type: "paragraph",
        text: "Kunci utama sukses mengompos terletak pada rasio antara bahan 'hijau' (tinggi Nitrogen) dan bahan 'cokelat' (tinggi Karbon). Idealnya, gunakan perbandingan 1 bagian bahan hijau dan 2 bagian bahan cokelat."
      },
      {
        type: "list",
        items: [
          "Bahan Hijau (Nitrogen): Sisa sayuran, kulit buah, potongan rumput segar, ampas teh/kopi.",
          "Bahan Cokelat (Karbon): Daun kering, serbuk gergaji, kardus bekas dicacah, ranting kecil."
        ]
      },
      {
        type: "callout",
        title: "Tips Bebas Bau",
        text: "Selalu lapisi tumpukan bahan hijau basah dengan bahan cokelat kering di bagian paling atas. Langkah sederhana ini mengunci kelembapan dan mencegah lalat bertelur."
      },
      {
        type: "heading",
        text: "Langkah-Langkah Mengompos"
      },
      {
        type: "steps",
        steps: [
          "Cacah bahan organik menjadi ukuran kecil (2–5 cm) agar proses penguraian mikroba lebih cepat.",
          "Siapkan wadah komposter yang memiliki lubang sirkulasi udara di bagian samping dan bawah.",
          "Masukkan lapisan bahan cokelat kering dasar tebal 5–10 cm sebagai drainase.",
          "Tambahkan campuran sampah dapur basah, lalu tutup kembali dengan lapisan bahan cokelat.",
          "Aduk seminggu sekali untuk memberi pasokan oksigen bagi bakteri aerobik."
        ]
      }
    ],
    relatedArticles: [
      { slug: "apa-itu-sampah-organik", title: "Apa itu Sampah Organik?", category: "Organik" },
      { slug: "manfaat-kompos-organik", title: "Manfaat Luar Biasa Kompos untuk Struktur Tanah", category: "Organik" }
    ]
  };

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8 pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/edukasi" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#22C55E] transition-colors bg-white px-4 py-2.5 rounded-full border border-slate-100 shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Edukasi</span>
        </Link>

        <div className="flex items-center gap-2">
          <button 
            type="button" 
            className="p-2.5 bg-white border border-slate-100 rounded-full text-slate-600 hover:text-[#22C55E] shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Simpan Artikel"
          >
            <Bookmark size={16} />
          </button>
          <button 
            type="button" 
            className="p-2.5 bg-white border border-slate-100 rounded-full text-slate-600 hover:text-[#22C55E] shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Bagikan"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="bg-white rounded-3xl p-6 sm:p-10 border border-[#22C55E]/20 shadow-sm space-y-8">
        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold px-3 py-1 rounded-full">
              <Tag size={12} />
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-medium">
              <Clock size={12} />
              {article.readTime}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 text-xs font-medium">{article.publishedAt}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
            {article.title}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {article.summary}
          </p>
        </header>

        {/* Dynamic Content Renderer */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {article.content.map((block, idx) => {
            if (block.type === "paragraph") {
              return <p key={idx} className="font-normal">{block.text}</p>;
            }

            if (block.type === "heading") {
              return (
                <h2 key={idx} className="text-lg font-bold text-slate-800 pt-4 border-b border-slate-100 pb-2">
                  {block.text}
                </h2>
              );
            }

            if (block.type === "list") {
              return (
                <ul key={idx} className="space-y-2 pl-2">
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-[#22C55E] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            if (block.type === "callout") {
              return (
                <div key={idx} className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-2xl p-5 space-y-1">
                  <div className="flex items-center gap-2 text-[#22C55E] font-bold text-xs sm:text-sm">
                    <Lightbulb size={18} />
                    <span>{block.title}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{block.text}</p>
                </div>
              );
            }

            if (block.type === "steps") {
              return (
                <div key={idx} className="space-y-3 pt-2">
                  {block.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-[#22C55E] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {stepIdx + 1}
                      </span>
                      <p className="text-xs text-slate-700 font-medium self-center">{step}</p>
                    </div>
                  ))}
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Footer / Author Tag */}
        <footer className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Ditulis oleh <strong className="text-slate-700">{article.author}</strong></span>
          <span className="flex items-center gap-1 text-[#22C55E] font-semibold">
            <Sparkles size={14} /> CiCi EcoEdu
          </span>
        </footer>
      </article>

      {/* Artikel Terkait */}
      <section className="space-y-4">
        <h3 className="font-bold text-base text-slate-800">Artikel Terkait 📖</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {article.relatedArticles.map((rel, idx) => (
            <Link 
              key={idx} 
              href={`/edukasi/${rel.slug}`}
              className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-[#22C55E]/40 shadow-sm transition-all duration-200 group block"
            >
              <span className="text-[10px] font-bold bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded-md inline-block mb-2">
                {rel.category}
              </span>
              <h4 className="font-bold text-xs text-slate-800 group-hover:text-[#22C55E] transition-colors leading-snug">
                {rel.title}
              </h4>
            </Link>
          ))}
        </div>
      </section>

      {/* Floating Action AI Button */}
      <button 
        type="button"
        suppressHydrationWarning
        className="fixed bottom-6 right-6 bg-[#22C55E] text-white pl-4 pr-6 py-3 rounded-full shadow-lg flex items-center gap-4 hover:bg-[#1ea850] hover:scale-105 transition-all duration-200 font-bold text-xs border border-[#22C55E]/40 z-50 group cursor-pointer"
      >
        <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
          <Image src="/logo.png" alt="CiCi float" fill sizes="32px" className="object-contain scale-[1.8] origin-center" />
        </div>
        <span className="tracking-wide">CiCi Tanya AI</span>
      </button>
    </div>
  );
}