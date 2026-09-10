'use client';

import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Award, Sparkles, Info, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // 1. Fetch data awal
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const currentUserId = session.user.id;
          setUserId(currentUserId);

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
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // 2. Realtime Subscription (Dengarkan INSERT dan UPDATE)
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`realtime-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Dengarkan SEMUA event (INSERT & UPDATE)
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications((prev) => [payload.new, ...prev]);
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Fungsi tandai semua sudah dibaca
  const markAllAsRead = async () => {
    if (!userId || notifications.length === 0) return;

    // Snapshot data lama jika nanti update DB gagal (rollback)
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
      // Kembalikan ke state semula jika RLS / DB menolak
      setNotifications(previousNotifications);
      alert('Gagal menandai notifikasi: ' + error.message);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'scan':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
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
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            Notifikasi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau semua kabar dan informasi aktivitas TongCi kamu di sini.
          </p>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition cursor-pointer"
          >
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
          <p className="text-sm">Mempersiapkan notifikasi...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition ${
                  !item.is_read
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="p-2 bg-white rounded-lg border shadow-sm mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-gray-400">
                      {formatTime(item.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.message || item.desc}
                  </p>
                </div>

                {!item.is_read && (
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border">
              <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-500">
                Belum ada notifikasi baru
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}