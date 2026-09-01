"use client";

import React, { useMemo, useState } from "react";
import { Award, ChevronLeft, ChevronRight, Crown, Medal, Search, Sparkles, Trophy } from "lucide-react";

const users = [
  { rank: 1, name: "Defina Indriani", initials: "DI", scans: 84, points: 1840, level: "Eco Hero", tone: "bg-rose-100 text-rose-600" },
  { rank: 2, name: "Budi Santoso", initials: "BS", scans: 71, points: 1620, level: "Top Contributor", tone: "bg-sky-100 text-sky-600" },
  { rank: 3, name: "Amelia Putri", initials: "AP", scans: 65, points: 1480, level: "Eco Hero", tone: "bg-violet-100 text-violet-600" },
  { rank: 4, name: "Rizky Ramadhan", initials: "RR", scans: 58, points: 1290, level: "Top 10", tone: "bg-orange-100 text-orange-600" },
  { rank: 5, name: "Siti Rahma", initials: "SR", scans: 51, points: 1170, level: "Top 10", tone: "bg-pink-100 text-pink-600" },
  { rank: 6, name: "Dimas Pratama", initials: "DP", scans: 47, points: 1050, level: "Contributor", tone: "bg-cyan-100 text-cyan-600" },
  { rank: 7, name: "Nadia Lestari", initials: "NL", scans: 43, points: 970, level: "Contributor", tone: "bg-amber-100 text-amber-600" },
  { rank: 8, name: "Fajar Nugroho", initials: "FN", scans: 39, points: 880, level: "Contributor", tone: "bg-emerald-100 text-emerald-600" },
];

const medals = [
  { user: users[1], label: "Juara 2", icon: Medal, classes: "from-slate-100 to-slate-50 border-slate-200 text-slate-500", order: "md:order-1" },
  { user: users[0], label: "Juara 1", icon: Crown, classes: "from-amber-100 to-yellow-50 border-amber-200 text-amber-600", order: "md:order-2" },
  { user: users[2], label: "Juara 3", icon: Medal, classes: "from-orange-100 to-amber-50 border-orange-200 text-orange-600", order: "md:order-3" },
];

function Avatar({ user, large = false }) {
  return <div className={`${large ? "h-16 w-16 text-lg" : "h-9 w-9 text-[11px]"} ${user.tone} rounded-full flex items-center justify-center font-extrabold ring-4 ring-white shadow-sm shrink-0`}>{user.initials}</div>;
}

export default function Leaderboard() {
  const [filter, setFilter] = useState("Bulanan");
  const [query, setQuery] = useState("");
  const visibleUsers = useMemo(() => users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase())), [query]);

  return <div className="space-y-6 pb-4">
    <section className="flex flex-col gap-2">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600"><Sparkles size={12} /> Komunitas TongCi</span>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 md:text-3xl">Leaderboard</h1>
      <p className="text-xs font-medium text-slate-500">Lihat pengguna dengan kontribusi terbesar dalam menjaga lingkungan.</p>
    </section>

    <section className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
      {medals.map(({ user, label, icon: Icon, classes, order }) => <article key={label} className={`${order} relative overflow-hidden rounded-3xl border bg-gradient-to-br ${classes} p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}>
        <Icon className="absolute right-4 top-4 opacity-25" size={44} />
        <div className="relative flex items-center gap-4"><Avatar user={user} large /><div><p className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">{label}</p><h2 className="mt-1 text-sm font-extrabold text-slate-800">{user.name}</h2><p className="mt-1 flex items-center gap-1 text-xs font-extrabold"><Award size={13} /> {user.points.toLocaleString("id-ID")} Poin</p></div></div>
      </article>)}
    </section>

    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-2"><Trophy className="text-amber-500" size={20} /><h2 className="text-sm font-extrabold text-slate-800">Peringkat Pengguna</h2></div><p className="mt-1 text-[11px] text-slate-400">Peringkat diperbarui secara berkala berdasarkan kontribusi.</p></div><div className="flex flex-col gap-3 sm:flex-row"><label className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari pengguna..." className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition focus:border-emerald-400 sm:w-48" /></label><div className="flex rounded-xl bg-slate-100 p-1">{["Mingguan", "Bulanan", "Sepanjang Waktu"].map((item) => <button onClick={() => setFilter(item)} key={item} className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-all ${filter === item ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-emerald-600"}`}>{item}</button>)}</div></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left"><thead className="border-y border-slate-100 bg-slate-50/70 text-[10px] font-extrabold uppercase tracking-wider text-slate-400"><tr><th className="px-4 py-3">Ranking</th><th className="px-4 py-3">Pengguna</th><th className="px-4 py-3 text-center">Total Scan</th><th className="px-4 py-3 text-center">Total Poin</th><th className="px-4 py-3">Level</th></tr></thead><tbody className="divide-y divide-slate-50">{visibleUsers.map((user) => <tr key={user.rank} className="transition-colors hover:bg-emerald-50/40"><td className="px-4 py-3"><span className={`${user.rank <= 3 ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"} flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold`}>{user.rank}</span></td><td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar user={user} /><span className="text-xs font-bold text-slate-700">{user.name}</span></div></td><td className="px-4 py-3 text-center text-xs font-bold text-slate-600">{user.scans}x</td><td className="px-4 py-3 text-center text-xs font-extrabold text-amber-600">{user.points.toLocaleString("id-ID")}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${user.level === "Eco Hero" ? "bg-emerald-100 text-emerald-700" : user.level === "Top Contributor" ? "bg-violet-100 text-violet-700" : user.level === "Top 10" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{user.level}</span></td></tr>)}{visibleUsers.length === 0 && <tr><td colSpan="5" className="px-4 py-10 text-center text-xs text-slate-400">Pengguna tidak ditemukan.</td></tr>}</tbody></table></div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><p className="text-[11px] font-medium text-slate-400">Menampilkan {visibleUsers.length} pengguna</p><div className="flex gap-2"><button className="rounded-lg border border-slate-200 p-1.5 text-slate-400 transition hover:border-emerald-300 hover:text-emerald-600"><ChevronLeft size={15} /></button><button className="rounded-lg border border-slate-200 p-1.5 text-slate-400 transition hover:border-emerald-300 hover:text-emerald-600"><ChevronRight size={15} /></button></div></div>
    </section>
  </div>;
}
