"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  CalendarDays,
  Check,
  Edit3,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Recycle,
  ScanLine,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

const stats = [
  ["Total Scan", "42", ScanLine, "text-emerald-600 bg-emerald-50"],
  ["Total Poin", "1.240", Award, "text-amber-600 bg-amber-50"],
  ["Level User", "Eco Hero", ShieldCheck, "text-violet-600 bg-violet-50"],
  ["Rank Leaderboard", "#8", Award, "text-sky-600 bg-sky-50"],
  ["Sampah Didaur Ulang", "6,3 kg", Recycle, "text-teal-600 bg-teal-50"],
];

const activities = [
  ["28 Jul 2026", "Botol Plastik", "Berhasil", "+20"],
  ["26 Jul 2026", "Kardus Bekas", "Berhasil", "+15"],
  ["22 Jul 2026", "Kaleng Minuman", "Berhasil", "+18"],
  ["18 Jul 2026", "Sisa Sayuran", "Berhasil", "+12"],
];

function ActionButton({ children, href, onClick, danger = false, icon: Icon }) {
  const classes = danger
    ? "border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100"
    : "border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-50";

  const content = (
    <>
      {Icon && <Icon size={14} />}
      {children}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all hover:-translate-y-0.5 active:scale-95 ${classes}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all hover:-translate-y-0.5 active:scale-95 ${classes}`}
    >
      {content}
    </button>
  );
}

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false);

  // State Profil Interaktif
  const [profile, setProfile] = useState({
    nama: "Defina Indriani",
    email: "defina.indriani@email.com",
    phone: "+62 812-3456-7890",
    gender: "Perempuan",
    birthDate: "12 Mei 2001",
    address: "Semarang, Jawa Tengah",
  });

  // Fungsi membuat Inisial Nama (contoh: Defina Indriani -> DI)
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const profileFields = [
    { label: "Nama", name: "nama", value: profile.nama, icon: UserRound },
    { label: "Email", name: "email", value: profile.email, icon: Mail, type: "email" },
    { label: "Nomor HP", name: "phone", value: profile.phone, icon: Phone },
    { label: "Jenis Kelamin", name: "gender", value: profile.gender, icon: UserRound },
    { label: "Tanggal Lahir", name: "birthDate", value: profile.birthDate, icon: CalendarDays },
    { label: "Alamat", name: "address", value: profile.address, icon: MapPin, fullWidth: true },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <section>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 md:text-3xl">Profil Saya</h1>
        <p className="mt-1 text-xs font-medium text-slate-500">Kelola informasi akun Anda.</p>
      </section>

      {/* Banner Profil */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white shadow-md md:p-8">
        <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/10" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            {/* Avatar Inisial Dinamis */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white text-xl font-extrabold text-emerald-600 shadow-lg">
              {getInitials(profile.nama)}
            </div>
            <div className="text-center sm:text-left">
              <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider">
                <ShieldCheck size={11} /> TongCi Member
              </div>
              <h2 className="text-xl font-extrabold">{profile.nama}</h2>
              <p className="mt-1 text-xs font-medium text-emerald-50">{profile.email}</p>
            </div>
          </div>

          {/* Tombol Toggle Edit Modal / Inline */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 ${
              isEditing
                ? "bg-amber-400 text-slate-900 hover:bg-amber-300"
                : "bg-white text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            {isEditing ? (
              <>
                <Check size={14} /> Simpan Profil
              </>
            ) : (
              <>
                <Edit3 size={14} /> Edit Profil
              </>
            )}
          </button>
        </div>
      </section>

      {/* Detail Profil & Statistik */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Card Informasi Pribadi */}
        <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-800">Informasi Pribadi</h2>
            {isEditing && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700">
                Mode Edit
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {profileFields.map(({ label, name, value, icon: Icon, type = "text", fullWidth }) => (
              <div
                key={label}
                className={`${
                  fullWidth ? "sm:col-span-2" : ""
                } rounded-2xl bg-slate-50/70 p-3 transition-colors hover:bg-emerald-50/60`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <Icon size={12} className="text-emerald-500" />
                  {label}
                </div>

                {/* Switch antara Text Biasa atau Input Field */}
                {isEditing ? (
                  <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                ) : (
                  <p className="mt-1.5 text-xs font-bold text-slate-700">{value}</p>
                )}
              </div>
            ))}
          </div>
        </article>

        {/* Card Statistik Pengguna */}
        <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-5 text-sm font-extrabold text-slate-800">Statistik Pengguna</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {stats.map(([label, value, Icon, colors]) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 transition-all hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-sm"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors}`}>
                  <Icon size={17} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400">{label}</p>
                  <p className="mt-0.5 text-sm font-extrabold text-slate-700">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Riwayat Aktivitas */}
      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800">Riwayat Aktivitas</h2>
            <p className="mt-1 text-[11px] text-slate-400">Aktivitas scan sampah terbaru Anda.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-extrabold text-emerald-600">
            4 Aktivitas
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead className="border-y border-slate-100 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Jenis Sampah</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activities.map(([date, type, status, points]) => (
                <tr key={`${date}-${type}`} className="transition-colors hover:bg-emerald-50/40">
                  <td className="px-4 py-3 text-xs font-medium text-slate-500">{date}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-700">{type}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-extrabold text-emerald-700">
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-extrabold text-amber-600">{points} Pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
        <ActionButton onClick={() => setIsEditing(!isEditing)} icon={Edit3}>
          {isEditing ? "Selesai Edit" : "Edit Profil"}
        </ActionButton>
        <ActionButton href="/settings#keamanan" icon={LockKeyhole}>
          Ubah Password
        </ActionButton>
        <ActionButton href="/login" danger icon={LogOut}>
          Logout
        </ActionButton>
      </section>
    </div>
  );
}