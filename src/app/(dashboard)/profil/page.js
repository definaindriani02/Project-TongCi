"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Award, Clock, History, Cpu } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndScans = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setLoading(false);
          return;
        }

        setUser(session.user);

        // Fetch profiles
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (prof) setProfile(prof);

        // Fetch scans
        const { data: scanHistory } = await supabase
          .from("scans")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });
        
        if (scanHistory) setScans(scanHistory);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndScans();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-bold">Memuat profil Anda...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center py-16 space-y-4">
        <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto text-2xl">
          🔒
        </div>
        <h3 className="font-bold text-base text-slate-800">Akses Terbatas</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-normal">
          Silakan masuk menggunakan akun Anda untuk mengelola riwayat scan dan menukarkan poin hadiah.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-100 cursor-pointer"
          >
            Masuk Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* USER CARD */}
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl font-extrabold shadow-inner shrink-0">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-800">{user.email.split("@")[0]}</h3>
            <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-center md:justify-start gap-1 mt-0.5">
              <User size={12} /> {user.email}
            </p>
          </div>
        </div>

        <div className="flex gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-4 py-2 rounded-2xl text-xs font-extrabold text-amber-700">
            <Award size={16} className="text-amber-500" />
            <span>{profile?.points || 0} Pts</span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 border border-pink-100 hover:border-pink-200 px-4 py-2 rounded-2xl text-xs font-bold text-pink-600 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </section>

      {/* SCAN HISTORY SECTION */}
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <History className="text-emerald-500" size={20} />
          <h4 className="font-extrabold text-sm text-slate-800">Riwayat Scan Klasifikasi</h4>
        </div>

        {scans.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <span className="text-3xl">📸</span>
            <h5 className="font-bold text-xs text-slate-700">Belum ada riwayat scan</h5>
            <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-normal">
              Ayo ambil foto sampah pertama Anda menggunakan fitur scan AI di menu Klasifikasi AI!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {scans.map((scan) => (
              <div key={scan.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{scan.item_name}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      scan.category === "Organik" ? "bg-emerald-50 text-emerald-600" :
                      scan.category === "Plastik" ? "bg-sky-50 text-sky-600" :
                      scan.category === "Kertas" ? "bg-amber-50 text-amber-600" :
                      "bg-slate-50 text-slate-600"
                    }`}>
                      {scan.category}
                    </span>
                    <span className="text-[9px] font-extrabold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Cpu size={8} /> {scan.confidence}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                    {scan.disposal_instructions}
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 shrink-0">
                  <Clock size={12} />
                  <span>{new Date(scan.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
