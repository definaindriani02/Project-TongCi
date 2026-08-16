"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    if (password !== confirmPassword) {
      setErrorMsg("Kata sandi dan konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Pendaftaran berhasil! Silakan cek email konfirmasi Anda atau coba masuk langsung.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-50 via-teal-50/50 to-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6">
        
        {/* LOGO & HEADING */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 relative flex-shrink-0">
              <Image src="/logo.png" alt="TongCi Logo" fill sizes="48px" className="object-contain" priority />
            </div>
            <div className="text-left">
              <h1 className="font-extrabold text-lg text-emerald-600 leading-none tracking-wide">TongCi</h1>
              <span className="text-[10px] text-pink-500 font-bold">Sampah Cinta 💕</span>
            </div>
          </Link>
          <h2 className="font-extrabold text-lg text-slate-800 pt-2">Daftar Akun Baru</h2>
          <p className="text-xs text-slate-400 font-medium">Buat akun untuk menabung poin daur ulang sampah</p>
        </div>

        {/* FEEDBACK BANNERS */}
        {errorMsg && (
          <div className="bg-pink-50 border border-pink-100 p-3.5 rounded-2xl flex items-start gap-2.5 text-pink-700 text-xs font-semibold">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl flex items-start gap-2.5 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* REGISTRATION FORM */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-300" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:bg-white transition-all rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-300" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Buat kata sandi minimal 6 karakter"
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:bg-white transition-all rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Konfirmasi Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-300" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi Anda"
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:bg-white transition-all rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-emerald-100 flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Daftar Akun Baru"
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] font-semibold text-slate-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-emerald-600 font-bold hover:underline">
              Masuk Sekarang
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
