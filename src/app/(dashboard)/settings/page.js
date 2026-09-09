"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  Eye,
  LockKeyhole,
  Monitor,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  name,
  disabled = false,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold text-slate-600">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 ${
          disabled ? "cursor-not-allowed bg-slate-50 text-slate-400" : ""
        }`}
      />
    </label>
  );
}

function Section({ id, title, description, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-6 border-b border-slate-100 pb-7 last:border-0 last:pb-0"
    >
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
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  // State Profil Akun (realtime dari Supabase profiles)
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    birth_date: "",
    gender: "-",
    address: "",
  });

  // State Password
  const [passwords, setPasswords] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  // State Switches / Toggles (Notifikasi & Privasi)
  const [switches, setSwitches] = useState({
    notif_scan: true,
    notif_points: true,
    notif_promo: false,
    notif_app_update: true,
    privacy_public_profile: true,
    privacy_show_rank: true,
    privacy_public_activity: false,
  });

  // State Tampilan / Bahasa
  const [language, setLanguage] = useState("id");

  // State Feedback UI
  const [toast, setToast] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  // Load User Data & Profile dari Supabase
  useEffect(() => {
    let isMounted = true;
    let profileChannel = null;

    const initSettings = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          if (isMounted) setLoading(false);
          return;
        }

        const uid = session.user.id;
        const uEmail = session.user.email;
        if (isMounted) setUserId(uid);

        // Fetch Supabase profiles
        const { data: profData, error: profError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", uid)
          .maybeSingle();

        if (profError) {
          console.error("Gagal mengambil data profil:", profError);
        }

        if (isMounted) {
          if (profData) {
            setProfile({
              full_name:
                profData.full_name ||
                session.user.user_metadata?.full_name ||
                "",
              email: profData.email || uEmail || "",
              phone_number: profData.phone_number || profData.phone || "",
              birth_date: profData.birth_date || "",
              gender: profData.gender || "-",
              address: profData.address || "",
            });

            setSwitches({
              notif_scan: profData.notif_scan ?? true,
              notif_points: profData.notif_points ?? true,
              notif_promo: profData.notif_promo ?? false,
              notif_app_update: profData.notif_app_update ?? true,
              privacy_public_profile: profData.privacy_public_profile ?? true,
              privacy_show_rank: profData.privacy_show_rank ?? true,
              privacy_public_activity: profData.privacy_public_activity ?? false,
            });

            setLanguage(profData.lang || "id");
          } else {
            setProfile({
              full_name:
                session.user.user_metadata?.full_name ||
                uEmail?.split("@")[0] ||
                "",
              email: uEmail || "",
              phone_number: "",
              birth_date: "",
              gender: "-",
              address: "",
            });
          }
        }

        // Realtime listener untuk profil
        profileChannel = supabase
          .channel(`settings-profile-rt-${uid}-${Date.now()}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "profiles",
              filter: `id=eq.${uid}`,
            },
            (payload) => {
              if (payload.new && isMounted) {
                const updated = payload.new;
                setProfile((prev) => ({
                  ...prev,
                  full_name: updated.full_name ?? prev.full_name,
                  email: updated.email ?? prev.email,
                  phone_number:
                    updated.phone_number ?? updated.phone ?? prev.phone_number,
                  birth_date: updated.birth_date ?? prev.birth_date,
                  gender: updated.gender ?? prev.gender,
                  address: updated.address ?? prev.address,
                }));

                setSwitches({
                  notif_scan: updated.notif_scan ?? true,
                  notif_points: updated.notif_points ?? true,
                  notif_promo: updated.notif_promo ?? false,
                  notif_app_update: updated.notif_app_update ?? true,
                  privacy_public_profile: updated.privacy_public_profile ?? true,
                  privacy_show_rank: updated.privacy_show_rank ?? true,
                  privacy_public_activity:
                    updated.privacy_public_activity ?? false,
                });

                if (updated.lang) setLanguage(updated.lang);
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.error("Error init settings:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initSettings();

    return () => {
      isMounted = false;
      if (profileChannel) supabase.removeChannel(profileChannel);
    };
  }, []);

  const go = (item) => {
    setActive(item);
    document
      .getElementById(item.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handler Perubahan Input Profil
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Simpan perubahan profil ke Supabase via PUT /api/profile
  const handleSaveProfile = async () => {
    if (!userId) {
      alert("Sesi pengguna tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      setSavingAccount(true);

      const payload = {
        userId,
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        birth_date: profile.birth_date,
        gender: profile.gender,
        address: profile.address,
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok || resData.error) {
        // Fallback langsung update Supabase client
        const { error: directError } = await supabase
          .from("profiles")
          .update({
            full_name: profile.full_name,
            phone_number: profile.phone_number,
            birth_date: profile.birth_date,
            gender: profile.gender,
            address: profile.address,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (directError) {
          alert("Gagal memperbarui profil: " + directError.message);
          return;
        }
      }

      showNotification("Informasi profil berhasil diperbarui! 🎉");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Terjadi kesalahan saat menyimpan profil: " + (err.message || err));
    } finally {
      setSavingAccount(false);
    }
  };

  // Ubah Password menggunakan API resmi Supabase Auth
  const handleSavePassword = async () => {
    if (!passwords.newPass) {
      alert("Harap masukkan password baru!");
      return;
    }

    if (passwords.newPass.length < 6) {
      alert("Password baru minimal 6 karakter!");
      return;
    }

    if (passwords.newPass !== passwords.confirmPass) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }

    try {
      setSavingPass(true);

      const { error } = await supabase.auth.updateUser({
        password: passwords.newPass,
      });

      if (error) {
        alert("Gagal mengubah password: " + error.message);
        return;
      }

      showNotification("Password berhasil diubah!");
      setPasswords({ oldPass: "", newPass: "", confirmPass: "" });
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Terjadi kesalahan saat mengubah password.");
    } finally {
      setSavingPass(false);
    }
  };

  // Realtime update untuk Toggle Switch Notifikasi & Privasi
  const handleToggle = async (key) => {
    const newValue = !switches[key];

    // Update state lokal secara responsif
    setSwitches((prev) => ({ ...prev, [key]: newValue }));

    if (!userId) return;

    try {
      // Direct update ke Supabase secara realtime
      const { error } = await supabase
        .from("profiles")
        .update({
          [key]: newValue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error(`Gagal update switch ${key}:`, error);
        // Fallback via API Route
        await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            [key]: newValue,
          }),
        });
      }
    } catch (err) {
      console.error(`Error toggling ${key}:`, err);
    }
  };

  // Realtime update untuk Bahasa (Tampilan)
  const handleLanguageChange = async (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);

    if (!userId) return;

    try {
      await supabase
        .from("profiles")
        .update({
          lang: selectedLang,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    } catch (err) {
      console.error("Gagal update bahasa:", err);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    showNotification("Permintaan hapus akun dikirim.");
  };

  const renderOptions = (items) => (
    <div className="space-y-3">
      {items.map(([label, text, key]) => (
        <div
          key={key}
          className="flex items-center justify-between gap-5 rounded-2xl bg-slate-50/80 px-4 py-3"
        >
          <div>
            <p className="text-xs font-bold text-slate-700">{label}</p>
            <p className="mt-0.5 text-[10px] text-slate-400">{text}</p>
          </div>
          <Toggle
            enabled={!!switches[key]}
            onChange={() => handleToggle(key)}
          />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-bold text-slate-400">
        Memuat pengaturan...
      </div>
    );
  }

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
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 md:text-3xl">
          Pengaturan
        </h1>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Kelola preferensi akun dan aplikasi.
        </p>
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
          {/* Tab Akun */}
          <Section
            id="akun"
            title="Akun"
            description="Perbarui informasi dasar untuk akun TongCi Anda."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Nama Lengkap"
                name="full_name"
                value={profile.full_name}
                onChange={handleProfileChange}
                placeholder="Masukkan nama lengkap"
              />
              <Field
                label="Email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                disabled={true}
              />
              <Field
                label="Nomor HP"
                name="phone_number"
                value={profile.phone_number}
                onChange={handleProfileChange}
                placeholder="+62 812-xxxx-xxxx"
              />
              <Field
                label="Tanggal Lahir"
                type="date"
                name="birth_date"
                value={profile.birth_date}
                onChange={handleProfileChange}
              />
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold text-slate-600">
                  Jenis Kelamin
                </span>
                <select
                  name="gender"
                  value={profile.gender || "-"}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                >
                  <option value="-">- Pilih Jenis Kelamin -</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[11px] font-bold text-slate-600">
                  Alamat
                </span>
                <textarea
                  name="address"
                  rows={2}
                  value={profile.address || ""}
                  onChange={handleProfileChange}
                  placeholder="Masukkan alamat lengkap Anda"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={savingAccount}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-100 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 active:scale-95 disabled:opacity-50"
            >
              <Save size={14} />
              {savingAccount ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </Section>

          {/* Tab Keamanan */}
          <Section
            id="keamanan"
            title="Keamanan"
            description="Gunakan kata sandi yang kuat untuk melindungi akun Anda."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Password Lama"
                type="password"
                name="oldPass"
                value={passwords.oldPass}
                onChange={handlePasswordChange}
                placeholder="••••••••"
              />
              <Field
                label="Password Baru"
                type="password"
                name="newPass"
                value={passwords.newPass}
                onChange={handlePasswordChange}
                placeholder="••••••••"
              />
              <Field
                label="Konfirmasi Password"
                type="password"
                name="confirmPass"
                value={passwords.confirmPass}
                onChange={handlePasswordChange}
                placeholder="••••••••"
              />
            </div>
            <button
              type="button"
              onClick={handleSavePassword}
              disabled={savingPass}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 active:scale-95 disabled:opacity-50"
            >
              <LockKeyhole size={14} />
              {savingPass ? "Memproses..." : "Ubah Password"}
            </button>
          </Section>

          {/* Tab Notifikasi */}
          <Section
            id="notifikasi"
            title="Notifikasi"
            description="Pilih informasi yang ingin Anda terima."
          >
            {renderOptions([
              ["Notifikasi Scan", "Dapatkan kabar setelah scan diproses.", "notif_scan"],
              ["Notifikasi Poin", "Kabar saat poin berhasil ditambahkan.", "notif_points"],
              ["Email Promosi", "Penawaran dan reward terbaru dari TongCi.", "notif_promo"],
              ["Update Aplikasi", "Informasi fitur dan pembaruan aplikasi.", "notif_app_update"],
            ])}
          </Section>

          {/* Tab Tampilan */}
          <Section
            id="tampilan"
            title="Tampilan"
            description="Sesuaikan pengalaman visual aplikasi."
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold text-slate-600">
                    Bahasa
                  </span>
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </label>
              </div>
            </div>
          </Section>

          {/* Tab Privasi */}
          <Section
            id="privasi"
            title="Privasi"
            description="Atur visibilitas informasi Anda di komunitas TongCi."
          >
            {renderOptions([
              [
                "Profil Publik",
                "Izinkan pengguna lain melihat profil Anda.",
                "privacy_public_profile",
              ],
              [
                "Tampilkan Ranking",
                "Tampilkan nama Anda di leaderboard.",
                "privacy_show_rank",
              ],
              [
                "Riwayat Aktivitas Publik",
                "Bagikan aktivitas kontribusi terbaru Anda.",
                "privacy_public_activity",
              ],
            ])}
          </Section>

          {/* Zona Berbahaya */}
          <section className="rounded-2xl border border-pink-100 bg-pink-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xs font-extrabold text-pink-700">
                  Zona Berbahaya
                </h2>
                <p className="mt-1 text-[10px] leading-relaxed text-pink-600">
                  Menghapus akun akan menghilangkan data dan riwayat secara
                  permanen.
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
          <div className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800">
                Konfirmasi Hapus Akun
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Apakah kamu yakin ingin menghapus akun ini? Semua poin dan riwayat
              scan kamu akan hilang permanen.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAccount}
                className="rounded-xl bg-pink-500 px-4 py-2 text-xs font-bold text-white hover:bg-pink-600"
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