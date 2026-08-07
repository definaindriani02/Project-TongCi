"use client";

import React, { useState } from "react";
import { 
  ChevronRight, 
  CheckCircle2, 
  ArrowDownWideNarrow, 
  RefreshCw, 
  Recycle 
} from "lucide-react";
import Image from "next/image";

export default function EdukasiPage() {
  const [activeTab, setActiveTab] = useState("organik");
  const [openIdx, setOpenIdx] = useState(null);

  // Database Konten Edukasi
  const educationContent = {
    organik: [
      { 
        title: "Apa itu sampah organik?", 
        p1: "Sampah organik adalah jenis limbah yang berasal dari makhluk hidup, baik tumbuhan maupun hewan, yang sifatnya mudah membusuk dan terurai secara alami oleh mikroorganisme. Contoh paling umum di lingkungan rumah tangga meliputi sisa sayuran, buah-buahan, tulang, daun kering, serta sisa makanan dapur.",
        p2: "Meskipun mudah terurai, penumpukan sampah organik yang tidak dikelola dengan baik di TPA dapat memicu timbulnya gas metana yang merusak lapisan atmosfer. Oleh karena itu, pemilahan sampah organik sangat penting agar bisa dimanfaatkan kembali menjadi pupuk kompos atau pakan maggot."
      },
      { 
        title: "Cara mengompos sampah organik?", 
        p1: "Mengompos merupakan cara terbaik untuk mendaur ulang sampah organik langsung dari dapur rumah. Prosesnya cukup sederhana, yaitu dengan mencampurkan sampah basah (seperti sisa sayuran) sebagai sumber nitrogen, dengan sampah kering (seperti daun kering atau serbuk gergaji) sebagai sumber karbon.",
        p2: "Semua bahan tersebut dimasukkan ke dalam wadah komposter khusus yang memiliki sirkulasi udara yang baik dan dijaga kelembapannya. Dalam waktu sekitar 4 hingga 6 minggu, mikroorganisme akan mengubah sampah tersebut menjadi pupuk hitam kaya nutrisi yang siap menyuburkan tanaman kamu."
      },
      { 
        title: "Manfaat kompos organik", 
        p1: "Penggunaan pupuk kompos organik memiliki dampak yang sangat luar biasa bagi kesehatan struktur tanah jangka panjang. Berbeda dengan pupuk kimia yang bisa mengeraskan tanah, kompos justru memperbaiki porositas, meningkatkan daya ikat air, dan menghidupkan mikroba baik di dalam tanah.",
        p2: "Selain menyuburkan tanaman, memproduksi kompos sendiri di rumah juga membantu mengurangi beban volume sampah yang dikirim ke TPA secara drastis. Ini adalah langkah nyata yang bisa kita lakukan untuk mengurangi emisi gas rumah kaca dari sektor limbah domestik."
      }
    ],
    plastik: [
      { 
        title: "Jenis plastik yang bisa didaur ulang?", 
        p1: "Tidak semua jenis plastik diciptakan sama, dan kode segitiga di bawah kemasan menentukan apakah bahan tersebut aman didaur ulang atau tidak. Jenis plastik yang paling mudah dan sering diterima oleh bank sampah atau pabrik daur ulang adalah PET (kode 1) pada botol air mineral dan HDPE (kode 2) pada botol sampo.",
        p2: "Sementara itu, plastik jenis PVC (kode 3) dan Styrofoam (kode 6) sangat sulit bahkan hampir tidak bisa didaur ulang karena kandungan kimianya yang berbahaya. Mengetahui perbedaan kode ini membantu kita lebih bijak dalam memilah sampah anorganik sehari-hari."
      },
      { 
        title: "Cara membersihkan plastik sebelum daur ulang?", 
        p1: "Langkah krusial sebelum menyetorkan sampah plastik ke bank sampah adalah memastikan kondisinya dalam keadaan bersih dan kering. Sisa makanan atau cairan minyak yang masih menempel pada wadah plastik dapat memicu timbulnya bakteri, bau menyengat, dan berisiko merusak seluruh batch daur ulang di pabrik.",
        p2: "Kamu hanya perlu membilas wadah plastik menggunakan sedikit air mengalir, melepaskan stiker label jika memungkinkan, lalu menjemurnya hingga benar-benar kering. Setelah bersih, remas atau pipihkan botol plastik tersebut agar tidak memakan banyak ruang saat disimpan."
      },
      { 
        title: "Berapa lama plastik terurai?", 
        p1: "Plastik konvensional terbuat dari polimer sintetis berbahan dasar minyak bumi yang ikatannya sangat kuat, sehingga mikroorganisme alami tidak mampu mengurainya dengan cepat. Sebuah botol plastik yang kita buang hari ini diperkirakan membutuhkan waktu antara 450 hingga 500 tahun untuk hancur.",
        p2: "Bahkan ketika hancur pun, plastik tidak benar-benar kembali ke alam, melainkan berubah menjadi remahan super kecil yang disebut mikroplastik. Mikroplastik ini mencemari tanah serta sumber air, dan berisiko masuk ke dalam tubuh kita melalui rantai makanan."
      }
    ],
    kertas: [
      { 
        title: "Proses mendaur ulang kertas di rumah", 
        p1: "Mendaur ulang kertas bekas menjadi kertas baru yang estetis bisa menjadi kegiatan yang sangat menyenangkan di rumah. Prosesnya dimulai dengan merobek kertas-kertas bekas (seperti koran atau hvs) menjadi potongan kecil, kemudian merendamnya di dalam air semalaman hingga menjadi lunak.",
        p2: "Setelah lunak, kertas diblender hingga menjadi bubur halus, dicampur dengan air di bak datar, lalu dicetak menggunakan screen sablon. Lembaran bubur kertas yang terjaring kemudian dikeringkan di atas kain penyerap untuk menghasilkan kertas daur ulang bertekstur unik."
      },
      { 
        title: "Jenis kertas yang tidak boleh masuk tempat sampah daur ulang", 
        p1: "Meskipun berbahan dasar serat kayu, ada beberapa jenis kertas yang sudah terkontaminasi atau dilapisi bahan lain sehingga tidak bisa didaur ulang. Contoh utamanya adalah kertas struk belanja (kertas termal) karena mengandung zat kimia BPA, serta kertas yang berlapis lilin atau plastik seperti paper cup.",
        p2: "Kertas bekas pembungkus makanan yang sudah terkena noda minyak pekat (seperti kardus pizza) juga harus dipisahkan ke tempat sampah residu. Minyak dari makanan dapat merusak ikatan serat kertas selama proses penggilingan ulang di pabrik."
      },
      { 
        title: "Dampak pengurangan penggunaan kertas terhadap hutan", 
        p1: "Industri pembuatan kertas konvensional membutuhkan jutaan pohon setiap tahunnya sebagai bahan baku utama untuk mendapatkan serat selulosa. Dengan beralih ke gaya hidup digital dan mengurangi pemborosan kertas, kita secara langsung menekan angka penebangan pohon di hutan alam.",
        p2: "Setiap ton kertas yang berhasil kita hemat atau daur ulang setara dengan menyelamatkan sekitar 17 pohon dewasa dan ribuan liter air bersih. Menjaga kelestarian hutan berarti mempertahankan paru-paru bumi yang berfungsi menyerap emisi karbon global."
      }
    ],
    logam: [
      { 
        title: "Cara memilah sampah kaleng dan besi", 
        p1: "Sampah logam seperti kaleng minuman aluminium, kaleng susu kental manis, atau tutup botol besi memiliki nilai jual daur ulang yang sangat stabil. Langkah pertama memilahnya adalah memastikan bagian dalam kaleng sudah dibilas bersih dari sisa sirup atau susu agar tidak mengundang semut.",
        p2: "Jika memungkinkan, pisahkan komponen logam berdasarkan jenisnya (aluminium biasanya lebih ringan dan tidak menempel pada magnet, sedangkan besi menempel kuat). Menyatukan sampah logam dalam satu wadah khusus memudahkan pemrosesan di fasilitas peleburan."
      },
      { 
        title: "Bahaya membuang sampah elektronik sembarangan", 
        p1: "Sampah elektronik atau e-waste, seperti baterai bekas, kabel, charger rusak, hingga komponen HP, masuk ke dalam kategori limbah B3 (Bahan Berbahaya dan Beracun). Komponen di dalamnya mengandung logam berat berbahaya seperti timbal, raksa, kadmium, dan lithium.",
        p2: "Jika e-waste dibuang ke tempat sampah biasa dan berakhir di TPA, logam berat tersebut dapat bocor, merembes ke dalam tanah, dan mencemari cadangan air tanah warga sekitar. Efek racun ini sangat berbahaya bagi kesehatan ginjal dan sistem saraf manusia."
      },
      { 
        title: "Tempat penyaluran limbah logam dan baterai bekas", 
        p1: "Mengingat sifatnya yang beracun, limbah elektronik dan baterai bekas tidak boleh dicampur dengan sampah harian rumah tangga. Saat ini sudah banyak dropbox khusus e-waste yang disediakan oleh pemerintah kota atau komunitas lingkungan di pusat perbelanjaan dan area publik.",
        p2: "Kamu bisa mengumpulkan baterai bekas di dalam satu botol kering, lalu menyalurkannya ke posko pengolahan sampah B3 terdekat. Limbah yang terkumpul di sana akan ditangani oleh instansi profesional agar logam beratnya bisa diekstraksi dengan aman."
      }
    ]
  };

  const tabs = [
    { id: "organik", name: "Organik", icon: "🥬", activeBg: "bg-[#22C55E] text-white shadow-sm", inactiveBg: "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20" },
    { id: "plastik", name: "Plastik", icon: "🧴", activeBg: "bg-sky-500 text-white shadow-sm", inactiveBg: "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20" },
    { id: "kertas", name: "Kertas", icon: "📦", activeBg: "bg-amber-500 text-white shadow-sm", inactiveBg: "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20" },
    { id: "logam", name: "Logam", icon: "🥫", activeBg: "bg-slate-500 text-white shadow-sm", inactiveBg: "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20" },
  ];

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto">
      {/* Section Pilihan Judul Edukasi */}
      <section className="bg-white rounded-3xl p-8 border border-[#22C55E]/20 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">Edukasi Sampah 📚</h3>
          <p className="text-xs text-[#22C55E] font-semibold mt-1">Pelajari cara mengelola sampah dengan benar!</p>
        </div>
        
        {/* Tab Filter */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              suppressHydrationWarning
              onClick={() => {
                setActiveTab(tab.id);
                setOpenIdx(null);
              }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all active:scale-95 duration-200 cursor-pointer ${
                activeTab === tab.id ? tab.activeBg : tab.inactiveBg
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* List Accordion Artikel */}
        <div className="space-y-3 pt-2">
          {educationContent[activeTab] && educationContent[activeTab].map((item, idx) => (
            <div 
              key={idx}
              className="w-full bg-white border border-[#22C55E]/20 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
            >
              <button 
                type="button"
                suppressHydrationWarning
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-[#22C55E]/5 transition-all duration-200 group text-left"
              >
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#22C55E] transition-colors">
                  {item.title}
                </span>
                <ChevronRight 
                  size={16} 
                  className={`text-[#22C55E] transition-transform duration-200 ${openIdx === idx ? 'rotate-90' : ''}`} 
                />
              </button>

              {openIdx === idx && (
                <div className="px-5 pb-5 pt-1 space-y-3 text-slate-600 text-xs border-t border-dashed border-[#22C55E]/20 bg-[#22C55E]/5">
                  <p className="leading-relaxed font-normal">{item.p1}</p>
                  <p className="leading-relaxed font-normal">{item.p2}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3R Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center"><ArrowDownWideNarrow size={20} /></div>
          <span className="inline-block bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Reduce</span>
          <h4 className="font-bold text-xs text-slate-800">Kurangi penggunaan produk sekali pakai.</h4>
          <ul className="space-y-2 text-[11px] text-slate-600 font-semibold">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#22C55E]" /> Bawa tas belanja sendiri</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#22C55E]" /> Hindari sedotan plastik</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><RefreshCw size={20} /></div>
          <span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Reuse</span>
          <h4 className="font-bold text-xs text-slate-800">Gunakan kembali barang yang masih bisa dipakai.</h4>
          <ul className="space-y-2 text-[11px] text-slate-600 font-semibold">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#22C55E]" /> Gunakan botol minum sendiri</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#22C55E]" /> Perbaiki barang rusak</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-[#22C55E]/10 text-[#22C55E] rounded-xl flex items-center justify-center"><Recycle size={20} /></div>
          <span className="inline-block bg-pink-50 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Recycle</span>
          <h4 className="font-bold text-xs text-slate-800">Daur ulang agar menjadi bahan baru.</h4>
          <ul className="space-y-2 text-[11px] text-slate-600 font-semibold">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#22C55E]" /> Pilah sampah berdasarkan jenis</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#22C55E]" /> Bersihkan sebelum didaur ulang</li>
          </ul>
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