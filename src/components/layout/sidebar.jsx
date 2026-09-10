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
  User
} from "lucide-react";

function SidebarLink({ icon, label, href, active, sidebarOpen, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center rounded-xl text-xs font-semibold transition-all duration-200 ${
        sidebarOpen ? "px-4 py-2.5 gap-3" : "p-2 justify-center"
      } ${
        active
          ? "bg-[#22C55E] text-white shadow-md shadow-[#22C55E]/20 scale-[1.02]"
          : "text-slate-600 hover:bg-[#22C55E]/10 hover:text-[#22C55E]"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          active
            ? "bg-white/20 text-white"
            : "bg-[#22C55E]/10 text-[#22C55E] group-hover:bg-[#22C55E]/20"
        }`}
      >
        {icon}
      </div>
      {sidebarOpen && <span>{label}</span>}
    </Link>
  );
}

export default function Sidebar({ sidebarOpen = true, setSidebarOpen }) {
  const pathname = usePathname();

  const links = [
    { icon: <LayoutDashboard size={16} />, label: "Dashboard", href: "/dashboard" },
    { icon: <BookOpen size={16} />, label: "Edukasi Sampah", href: "/edukasi" },
    { icon: <Scan size={16} />, label: "Klasifikasi AI", href: "/scan" },
    { icon: <BarChart3 size={16} />, label: "Statistik", href: "/statistik" },
    { icon: <Gift size={16} />, label: "Leaderboard", href: "/leaderboard" },
    { icon: <MessageSquare size={16} />, label: "Chat AI", href: "/chat" },
    { icon: <User size={16} />, label: "Profil", href: "/profil" },
  ];

  const handleClose = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Dark Backdrop */}
      {sidebarOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Sidebar Container (Mobile Drawer Overlay & Desktop Fixed Sidebar) */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full">
          {/* Logo Utama */}
          <div className="flex items-center justify-between py-2 mb-2 px-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="TongCi Logo"
                  fill
                  sizes="48px"
                  className="object-contain scale-110"
                  priority
                />
              </div>
              <div>
                <h1 className="font-bold text-lg text-[#22C55E] leading-none tracking-wide">
                  TongCi
                </h1>
                <span className="text-xs text-pink-500 font-bold drop-shadow-sm">
                  Sampah Cinta 💕
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
              title="Tutup Navigasi"
            >
              ✕
            </button>
          </div>

          {/* Navigasi */}
          <nav className="space-y-1 w-full mt-2">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <SidebarLink
                  key={link.href}
                  icon={link.icon}
                  label={link.label}
                  href={link.href}
                  active={isActive}
                  sidebarOpen={true}
                  onNavigate={handleLinkClick}
                />
              );
            })}
          </nav>
        </div>

        {/* Banner Bawah */}
        <Link
          href="/chat"
          onClick={handleLinkClick}
          className="bg-emerald-50/50 rounded-2xl p-3 flex items-center gap-3 border border-emerald-100/50 hover:scale-[1.01] transition-transform w-full mt-4"
        >
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image
              src="/logo.png"
              alt="CiCi mini"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-800">
              CiCi siap bantu! 💕
            </p>
            <p className="text-[10px] text-emerald-600 font-medium">
              Klik Chat AI untuk tanya
            </p>
          </div>
        </Link>
      </aside>
    </>
  );
}
