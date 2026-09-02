"use client";

import React, { useState } from "react";
import { Bell, CheckCircle2, Eye, LockKeyhole, Monitor, Save, Trash2, UserRound, X } from "lucide-react";

const menu = [
  ["Akun", UserRound],
  ["Keamanan", LockKeyhole],
  ["Notifikasi", Bell],
  ["Tampilan", Monitor],
  ["Privasi", Eye],
];

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={enabled}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        enabled ? "bg-emerald-500" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// Fixed: Menggunakan value dan onChange dinamis
function Field({ label, type = "text", value, onChange, placeholder, name }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold text-slate-600">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
      />
    </label>
  );
}

function Section({ id, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-6 border-b border-slate-100 pb-7 last:border-0 last:pb-0">
      <div className="mb-5">
        <h2 className="text-sm font-extrabold text-slate-800">{title}</h2>
        <p className="mt-1 text-[11px] text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState("Akun");

  // 1. State Profil Akun
  const [profile, setProfile] = useState({
    nama: "Nadia Lestari",
    email: "nadia.lestari@email.com",
    phone: "+62 812-3456-7890",
  });

  // 2. State Password
  const [passwords, setPasswords] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  // 3. State Switches / Toggles
  const [switches, setSwitches] = useState({
    scan: true,
    points: true,
    promo: false,
    update: true,
    public: true,
    ranking: true,
    history: false,
  });

  // State Feedback UI
  const [toast, setToast] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggle = (key) => setSwitches((current) => ({ ...current, [key]: !current[key] }));

  const go = (item) => {
    setActive(item);
    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Handlers
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    showNotification("Informasi profil berhasil diperbarui! 🎉");
  };

  const handleSavePassword = () => {
    if (!passwords.oldPass || !passwords.newPass) {
      alert("Harap isi password lama dan password baru!");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }
    showNotification("Password berhasil diubah!");
    setPasswords({ oldPass: "", newPass: "", confirmPass: "" });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    showNotification("Permintaan hapus akun dikirim.");
  };

  const renderOptions = (items) => (
    <div className="space-y-3">
      {items.map(([label, text, key]) => (
        <div key={key} className="flex items-center justify-between gap-5 rounded-2xl bg-slate-50/80 px-4 py-3">
          <div>
            <p className="text-xs font-bold text-slate-700">{label}</p>
            <p className="mt-0.5 text-[10px] text-slate-400">{text}</p>
          </div>
          <Toggle enabled={switches[key]} onChange={() => toggle(key)} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative space-y-6 pb-4 transition-colors duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xl animate-bounce">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      <section>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 md:text-3xl">Pengaturan</h1>
        <p className="mt-1 text-xs font-medium text-slate-500">Kelola preferensi akun dan aplikasi.</p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[210px_minmax(0,1fr)]">
        {/* Navigation Sidebar */}
        <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-3 shadow-sm">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {menu.map(([item, Icon]) => (
              <button
                key={item}
                type="button"
                onClick={() => go(item)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-all ${
                  active === item
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                <Icon size={15} />
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Form */}
        <div className="space-y-7 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
          {/* Akun */}
          <Section id="akun" title="Akun" description="Perbarui informasi dasar untuk akun TongCi Anda.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama" name="nama" value={profile.nama} onChange={handleProfileChange} />
              <Field label="Email" type="email" name="email" value={profile.email} onChange={handleProfileChange} />
              <Field label="Nomor HP" name="phone" value={profile.phone} onChange={handleProfileChange} />
            </div>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-100 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 active:scale-95"
            >
              <Save size={14} /> Simpan Perubahan
            </button>
          </Section>

          {/* Keamanan */}
          <Section id="keamanan" title="Keamanan" description="Gunakan kata sandi yang kuat untuk melindungi akun Anda.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Password Lama" type="password" name="oldPass" value={passwords.oldPass} onChange={handlePasswordChange} placeholder="••••••••" />
              <Field label="Password Baru" type="password" name="newPass" value={passwords.newPass} onChange={handlePasswordChange} placeholder="••••••••" />
              <Field label="Konfirmasi Password" type="password" name="confirmPass" value={passwords.confirmPass} onChange={handlePasswordChange} placeholder="••••••••" />
            </div>
            <button
              type="button"
              onClick={handleSavePassword}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 active:scale-95"
            >
              <LockKeyhole size={14} /> Ubah Password
            </button>
          </Section>

          {/* Notifikasi */}
          <Section id="notifikasi" title="Notifikasi" description="Pilih informasi yang ingin Anda terima.">
            {renderOptions([
              ["Notifikasi Scan", "Dapatkan kabar setelah scan diproses.", "scan"],
              ["Notifikasi Poin", "Kabar saat poin berhasil ditambahkan.", "points"],
              ["Email Promosi", "Penawaran dan reward terbaru dari TongCi.", "promo"],
              ["Update Aplikasi", "Informasi fitur dan pembaruan aplikasi.", "update"],
            ])}
          </Section>

          {/* Tampilan */}
          <Section id="tampilan" title="Tampilan" description="Sesuaikan pengalaman visual aplikasi.">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-1.5 block text-[11px] font-bold text-slate-600">Bahasa & Ukuran Font</span>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-400">
                    <option>Bahasa Indonesia · Sedang</option>
                    <option>English · Medium</option>
                  </select>
                </label>
              </div>
            </div>
          </Section>

          {/* Privasi */}
          <Section id="privasi" title="Privasi" description="Atur visibilitas informasi Anda di komunitas TongCi.">
            {renderOptions([
              ["Profil Publik", "Izinkan pengguna lain melihat profil Anda.", "public"],
              ["Tampilkan Ranking", "Tampilkan nama Anda di leaderboard.", "ranking"],
              ["Riwayat Aktivitas Publik", "Bagikan aktivitas kontribusi terbaru Anda.", "history"],
            ])}
          </Section>

          {/* Zona Berbahaya */}
          <section className="rounded-2xl border border-pink-100 bg-pink-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xs font-extrabold text-pink-700">Zona Berbahaya</h2>
                <p className="mt-1 text-[10px] leading-relaxed text-pink-600">
                  Menghapus akun akan menghilangkan data dan riwayat secara permanen.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-pink-600 active:scale-95"
              >
                <Trash2 size={14} /> Hapus Akun
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Modal Hapus Akun */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-slate-800">Konfirmasi Hapus Akun</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah kamu yakin ingin menghapus akun ini? Semua poin dan riwayat scan kamu akan hilang permanen.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-pink-500 text-xs font-bold text-white hover:bg-pink-600"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
