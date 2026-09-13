'use client';

import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Award, Sparkles, Info, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let channel;

    const initNotifications = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const currentUserId = session.user.id;
          setUserId(currentUserId);

          // 1. Fetch data awal notifikasi
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', currentUserId)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching notifications:', error);
          } else {
            setNotifications(data || []);
          }

          // 2. Realtime Listener dengan Channel ID Unik
          const channelId = `realtime-notif-page-${currentUserId}-${Date.now()}`;
          channel = supabase
            .channel(channelId)
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${currentUserId}`,
              },
              (payload) => {
                if (payload.eventType === 'INSERT') {
                  setNotifications((prev) => {
                    // Hindari duplikasi jika item sudah ada
                    if (prev.some((n) => n.id === payload.new.id)) return prev;
                    return [payload.new, ...prev];
                  });
                } else if (payload.eventType === 'UPDATE') {
                  setNotifications((prev) =>
                    prev.map((item) =>
                      item.id === payload.new.id ? payload.new : item
                    )
                  );
                }
              }
            )
            .subscribe();
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    initNotifications();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Fungsi tandai semua sudah dibaca
  const markAllAsRead = async () => {
    if (!userId || notifications.length === 0) return;

    const previousNotifications = [...notifications];

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, is_read: true }))
    );

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Gagal update status di Supabase:', error.message);
      setNotifications(previousNotifications);
      alert('Gagal menandai notifikasi: ' + error.message);
    }
  };

  // Diperbarui: Mendukung tipe 'points' dan 'poin'
  const getIcon = (type) => {
    switch (type) {
      case 'scan':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'points':
      case 'poin':
        return <Award className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#22C55E]" />
            Notifikasi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau semua kabar dan informasi aktivitas TongCi kamu di sini.
          </p>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-semibold text-[#22C55E] hover:text-[#1ea850] bg-[#22C55E]/10 hover:bg-[#22C55E]/20 px-3 py-2 rounded-lg transition cursor-pointer"
          >
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mb-2" />
          <p className="text-sm font-semibold">Mempersiapkan notifikasi...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition ${
                  !item.is_read
                    ? 'bg-[#22C55E]/5 border-[#22C55E]/20'
                    : 'bg-white border-slate-100'
                }`}
              >
                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm mt-0.5 shrink-0">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-800 text-sm truncate">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {formatTime(item.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.message || item.desc}
                  </p>
                </div>

                {!item.is_read && (
                  <span className="w-2.5 h-2.5 bg-[#22C55E] rounded-full mt-2 shrink-0 animate-pulse" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-500">
                Belum ada notifikasi baru
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}