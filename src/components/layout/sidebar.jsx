"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Scan,
  BarChart3,
  Gift,
  MessageSquare,
  User,
  Settings
} from "lucide-react";

function SidebarLink({ icon, label, href, active, sidebarOpen }) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-xl text-xs font-semibold transition-all duration-200 ${
        sidebarOpen ? "px-4 py-2 gap-3" : "p-2 justify-center"
      } ${
        active
          ? "bg-emerald-500 text-white shadow-md shadow-emerald-100 scale-[1.02]"
          : "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
        active ? "bg-white/20" : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
      }`}>
        {icon}
      </div>
      {sidebarOpen && <span>{label}</span>}
    </Link>
  );
}

export default function Sidebar({ sidebarOpen = true }) {
  const pathname = usePathname();

  const links = [
    { icon: <LayoutDashboard size={16} />, label: "Dashboard", href: "/dashboard" },
    { icon: <BookOpen size={16} />, label: "Edukasi Sampah", href: "/edukasi" },
    { icon: <Scan size={16} />, label: "Klasifikasi AI", href: "/scan" },
    { icon: <BarChart3 size={16} />, label: "Statistik", href: "/statistik" },
    { icon: <Gift size={16} />, label: "Leaderboard", href: "/leaderboard" },
    { icon: <MessageSquare size={16} />, label: "Chat AI", href: "/chat" },
    { icon: <User size={16} />, label: "Profil", href: "/profil" }
  ];

  return (
    <aside className={`bg-white border-r border-slate-100 flex flex-col justify-between p-4 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20 items-center"}`}>
      <div className="w-full">
        {/* Logo Utama */}
        <div className={`flex items-center gap-3 py-2 mb-2 ${sidebarOpen ? "px-2" : "justify-center"}`}>
          <div className="w-14 h-14 relative flex-shrink-0">
            <Image src="/logo.png" alt="TongCi Logo" fill sizes="56px" className="object-contain scale-110" priority />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-lg text-emerald-600 leading-none tracking-wide">TongCi</h1>
              <span className="text-xs text-pink-500 font-bold drop-shadow-sm">Sampah Cinta 💕</span>
            </div>
          )}
        </div>

        {/* Navigasi */}
        <nav className="space-y-1 w-full">
          {links.map((link) => {
            // Check active state (starts with or exact match)
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <SidebarLink
                key={link.href}
                icon={link.icon}
                label={link.label}
                href={link.href}
                active={isActive}
                sidebarOpen={sidebarOpen}
              />
            );
          })}
        </nav>
      </div>

      {/* Banner Bawah */}
      {sidebarOpen ? (
        <Link href="/chat" className="bg-emerald-50/50 rounded-2xl p-3 flex items-center gap-3 border border-emerald-100/50 hover:scale-[1.01] transition-transform w-full mt-4">
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image src="/logo.png" alt="CiCi mini" fill sizes="40px" className="object-contain" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-800">CiCi siap bantu! 💕</p>
            <p className="text-[10px] text-emerald-600 font-medium">Klik Chat AI untuk tanya</p>
          </div>
        </Link>
      ) : (
        <Link href="/chat" className="w-10 h-10 relative flex-shrink-0 mt-4 mb-2">
          <Image src="/logo.png" alt="CiCi mini" fill sizes="40px" className="object-contain" />
        </Link>
      )}
    </aside>
  );
}
