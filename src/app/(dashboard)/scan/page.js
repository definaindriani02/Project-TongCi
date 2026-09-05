"use client";

import React, { useState, useRef, useEffect } from "react";
import { Cpu, Camera, Upload, RefreshCw, CheckCircle, Save, X, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function KlasifikasiAI() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  
  // App UI State: "idle" | "camera" | "analyzing" | "result"
  const [scanState, setScanState] = useState("idle");
  const [selectedImage, setSelectedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [pointsSaved, setPointsSaved] = useState(false);

  // Refs for media devices
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  const categories = [
    { name: "Organik", desc: "Tempat sampah hijau", color: "bg-[#22C55E]", text: "text-[#22C55E]", border: "border-[#22C55E]/30", icon: "🥬" },
    { name: "Plastik", desc: "Tempat sampah biru", color: "bg-sky-500", text: "text-sky-700", border: "border-sky-200", icon: "🧴" },
    { name: "Kertas", desc: "Tempat sampah kuning", color: "bg-amber-500", text: "text-amber-700", border: "border-amber-200", icon: "📦" },
    { name: "Logam", desc: "Tempat sampah abu", color: "bg-slate-500", text: "text-slate-700", border: "border-slate-200", icon: "🥫" },
  ];

  useEffect(() => {
    // Check current authenticated user and profile points
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (prof) setProfile(prof);
      }
    };
    checkUser();
  }, []);

  // CAMERA UTILS
  const startCamera = async () => {
    setScanState("camera");
    setErrorMsg("");
    setSuccessMsg("");
    setPointsSaved(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Gagal membuka kamera:", err);
      setErrorMsg("Kamera tidak dapat diakses. Pastikan izin kamera sudah diberikan atau silakan unggah foto dari galeri.");
      setScanState("idle");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL("image/jpeg", 0.8); // Kompresi ringan agar upload lebih cepat
      
      stopCamera();
      setSelectedImage(base64Image);
      analyzeImage(base64Image);
    }
  };

  // FILE UPLOAD UTILS
  const triggerFileUpload = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setPointsSaved(false);
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setSelectedImage(base64Image);
        analyzeImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  // PERBAIKAN: SEND TO GEMINI API
  const analyzeImage = async (base64Img) => {
    setScanState("analyzing");
    setErrorMsg("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Img }),
      });

      // Parsing aman untuk menangkap detail error dari backend
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Gagal menganalisa gambar. Server merespon dengan status " + res.status);
      }

      setScanResult(data);
      setScanState("result");
    } catch (err) {
      console.error("Analysis Error:", err);
      setErrorMsg(err.message || "Terjadi kesalahan saat klasifikasi gambar.");
      setScanState("idle");
    }
  };

  // SAVE RESULTS FOR POINTS VIA SUPABASE RPC
  const saveScanPoints = async () => {
    if (!user) {
      setErrorMsg("Kamu harus masuk (Login) terlebih dahulu untuk mengklaim poin!");
      return;
    }
    if (!scanResult || saving || pointsSaved) return;

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Panggil fungsi RPC claim_scan_points di Supabase Database
      const { data, error } = await supabase.rpc("claim_scan_points", {
        p_waste_name: scanResult.item_name || "Sampah Terdeteksi",
        p_category: scanResult.category || "Anorganik",
        p_points_earned: 18,
        p_image_url: null,
      });

      if (error) throw error;

      // Update state lokal profil agar tampilan UI langsung berubah
      if (data) {
        setProfile((prev) => ({
          ...prev,
          points: data.points,
          total_scan: data.total_scan,
        }));
      }

      setPointsSaved(true);
      setSuccessMsg(`Poin berhasil diklaim! +18 Pts ditambahkan ke akun Anda.`);
    } catch (err) {
      console.error("Gagal menyimpan poin:", err?.message || err);
      setErrorMsg("Gagal menyimpan poin ke database: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setSaving(false);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setScanResult(null);
    setErrorMsg("");
    setSuccessMsg("");
    setPointsSaved(false);
    setScanState("idle");
  };

  return (
    <div className="space-y-6">
      
      {/* SCANNER CONTAINER */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#22C55E]/20 shadow-sm min-h-[420px] flex flex-col justify-between relative overflow-hidden">
        
        {/* Header scanner */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#22C55E]/10 text-[#22C55E] rounded-xl">
            <Cpu size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
              Klasifikasi Sampah AI 🤖
            </h3>
            <p className="text-xs text-[#22C55E] font-semibold mt-0.5">
              Foto sampahmu, AI akan mengidentifikasi jenisnya!
            </p>
          </div>
          {scanState !== "idle" && (
            <button
              onClick={() => {
                stopCamera();
                resetScanner();
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* BANNERS */}
        {errorMsg && (
          <div className="my-4 bg-pink-50 border border-pink-100 p-3.5 rounded-2xl flex items-start gap-2.5 text-pink-700 text-xs font-semibold">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="my-4 bg-[#22C55E]/10 border border-[#22C55E]/20 p-3.5 rounded-2xl flex items-start gap-2.5 text-[#22C55E] text-xs font-semibold">
            <CheckCircle size={16} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* WORKSPACE STATES */}
        
        {/* STATE 1: IDLE */}
        {scanState === "idle" && (
          <div className="flex flex-col items-center justify-center my-auto py-8 text-center">
            <div className="w-20 h-20 bg-[#22C55E]/10 rounded-full flex items-center justify-center border border-[#22C55E]/20 text-4xl mb-4 relative">
              🗑️
              <span className="absolute -bottom-1 -right-1 text-base">🔍</span>
            </div>

            <h4 className="font-extrabold text-slate-800 mb-1 text-sm">Upload Foto Sampah</h4>
            <p className="text-[11px] text-slate-400 font-semibold mb-6 max-w-xs">
              Unggah file atau potret sampah secara langsung menggunakan kamera.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                onClick={triggerFileUpload}
                className="flex-1 bg-[#22C55E] hover:bg-[#1ea850] active:scale-95 transition-all text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#22C55E]/20 cursor-pointer"
              >
                <Upload size={16} /> Upload Foto
              </button>
              <button
                onClick={startCamera}
                className="flex-1 bg-white hover:bg-slate-50 border border-[#22C55E] text-[#22C55E] hover:text-[#1ea850] font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Camera size={16} /> Buka Kamera
              </button>
            </div>
            {/* Hidden Input for Files */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* STATE 2: LIVE CAMERA FEED */}
        {scanState === "camera" && (
          <div className="flex flex-col items-center justify-center my-auto py-4 relative w-full max-w-md mx-auto">
            <div className="w-full aspect-[4/3] rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden relative shadow-inner">
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={capturePhoto}
                className="bg-[#22C55E] hover:bg-[#1ea850] active:scale-95 transition-all text-white font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#22C55E]/20 cursor-pointer"
              >
                <Camera size={16} /> Ambil Foto
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  setScanState("idle");
                }}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 font-bold text-xs py-2.5 px-6 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: ANALYZING AI */}
        {scanState === "analyzing" && (
          <div className="flex flex-col items-center justify-center my-auto py-8">
            {selectedImage && (
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-6 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            
            <h4 className="font-extrabold text-slate-800 mb-1 text-sm animate-pulse">Menganalisis gambar...</h4>
            <p className="text-xs text-[#22C55E] font-bold mb-6 flex items-center gap-1">
              CiCi sedang bekerja keras 🔍
            </p>

            <div className="w-64 bg-[#22C55E]/20 h-2 rounded-full overflow-hidden">
              <div className="bg-[#22C55E] h-full w-2/3 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* STATE 4: SCAN RESULT */}
        {scanState === "result" && scanResult && (
          <div className="flex flex-col my-auto py-4 space-y-6">
            
            {/* Success box */}
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
              scanResult.category === "Organik" ? "bg-[#22C55E]/10 border-[#22C55E]/20" :
              scanResult.category === "Plastik" ? "bg-sky-50/50 border-sky-100" :
              scanResult.category === "Kertas" ? "bg-amber-50/50 border-amber-100" :
              "bg-slate-50/50 border-slate-100"
            }`}>
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-2xl shadow-sm shrink-0">
                {categories.find(c => c.name === scanResult.category)?.icon || "♻️"}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-800">
                  Sampah {scanResult.category} 
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ml-2 inline-block ${
                    scanResult.category === "Organik" ? "bg-[#22C55E]/20 text-[#22C55E]" :
                    scanResult.category === "Plastik" ? "bg-sky-100 text-sky-700" :
                    scanResult.category === "Kertas" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {scanResult.confidence}% akurat
                  </span>
                </h4>
                <p className="text-xs font-bold text-slate-700">Nama item: {scanResult.item_name}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  {scanResult.disposal_instructions}
                </p>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3.5 bg-slate-50/30 border border-slate-100 rounded-2xl p-5">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Klasifikasi</h5>
              <div className="space-y-3">
                {categories.map((cat) => {
                  const val = scanResult.percentages?.[cat.name] || 0;
                  return (
                    <div key={cat.name} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700 w-16 text-left">{cat.name}</span>
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`${cat.color} h-full rounded-full`} style={{ width: `${val}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{val}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={resetScanner}
                className="flex-1 bg-[#22C55E] hover:bg-[#1ea850] active:scale-95 transition-all text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#22C55E]/20 cursor-pointer"
              >
                <RefreshCw size={16} /> Analisis Lagi
              </button>
              
              <button
                onClick={saveScanPoints}
                disabled={pointsSaved || saving}
                className="flex-1 bg-white hover:bg-slate-50 border border-[#22C55E] text-[#22C55E] hover:text-[#1ea850] font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 cursor-pointer"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
                ) : pointsSaved ? (
                  <>
                    <CheckCircle size={16} className="text-[#22C55E]" /> Tersimpan
                  </>
                ) : (
                  <>
                    <Save size={16} /> Simpan +18 pts
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </section>

      {/* GRID KATEGORI SAMPAH BAWAH */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-200 cursor-pointer"
          >
            <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center text-2xl text-white mb-3 shadow-sm`}>
              {cat.icon}
            </div>
            <h4 className="font-extrabold text-xs text-slate-800">{cat.name}</h4>
            <p className="text-[10px] text-[#22C55E] font-bold mt-1">{cat.desc}</p>
          </div>
        ))}
      </section>

    </div>
  );
}