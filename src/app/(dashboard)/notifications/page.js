"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, CheckCircle2, Award, Tag, Info } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setLoading(false);
          return;
        }

        // 1. Ambil preferensi profil
        const { data: profile } = await supabase
          .from("profiles")
          .select("notif_scan, notif_points, notif_promo, notif_app_update")
          .eq("id", session.user.id)
          .maybeSingle();

        // 2. Ambil semua notifikasi user
        const { data: list, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching notifications:", error.message);
        }

        if (list) {
          // 3. Filter sesuai preferensi profil (default to true jika kolom belum ada)
          const filtered = list.filter((n) => {
            if (!profile) return true;
            if (n.type === "scan" && profile.notif_scan === false) return false;
            if (n.type === "points" && profile.notif_points === false) return false;
            if (n.type === "promo" && profile.notif_promo === false) return false;
            if (n.type === "app_update" && profile.notif_app_update === false) return false;
            return true;
          });

          setNotifications(filtered);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "scan":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "points":
        return <Award className="w-5 h-5 text-amber-500" />;
      case "promo":
        return <Tag className="w-5 h-5 text-pink-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        Memuat notifikasi...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-emerald-600" />
        <h1 className="text-xl font-bold text-slate-800">Notifikasi</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-sm">
          Belum ada notifikasi baru.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-colors"
            >
              <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-800">
                  {notif.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  {new Date(notif.created_at).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}