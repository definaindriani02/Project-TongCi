"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

const DEFAULT_MESSAGES = [
  {
    sender: "cici",
    text: "Halo! Aku CiCi, asisten lingkungan pintarmu. 🤖💚\nAda yang bisa kubantu hari ini? Kamu bisa tanya seputar pemilahan sampah, tips daur ulang, atau cara membuat kompos!",
  },
];

// Batasan masa retensi riwayat chat 24 jam (dalam milidetik)
const CHAT_RETENTION_MS = 24 * 60 * 60 * 1000;

function getStorageKey(uid) {
  return uid ? `tongci_chat_history_${uid}` : "tongci_chat_history";
}

function saveChatHistory(msgs, sId, uid) {
  if (typeof window === "undefined") return;
  try {
    const key = getStorageKey(uid);
    const payload = {
      messages: msgs,
      sessionId: sId || null,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.error("Gagal menyimpan riwayat chat:", err);
  }
}

function loadChatHistory(uid) {
  if (typeof window === "undefined") return null;
  try {
    const key = getStorageKey(uid);
    const raw =
      localStorage.getItem(key) ||
      (uid ? localStorage.getItem("tongci_chat_history") : null);
    if (!raw) return null;

    const data = JSON.parse(raw);
    const now = Date.now();
    const lastUpdated =
      data.lastUpdated ||
      (data.messages?.length > 0 &&
        data.messages[data.messages.length - 1]?.timestamp) ||
      0;

    // Bersihkan jika riwayat chat sudah melewati masa retensi 24 jam sejak pesan terakhir
    if (now - lastUpdated > CHAT_RETENTION_MS) {
      localStorage.removeItem(key);
      if (uid) localStorage.removeItem("tongci_chat_history");
      return null;
    }

    // Saring pesan yang masih berada dalam kurun waktu 24 jam
    const validMessages = (data.messages || []).filter((msg) => {
      if (!msg.timestamp) return true;
      return now - msg.timestamp <= CHAT_RETENTION_MS;
    });

    if (validMessages.length === 0) {
      localStorage.removeItem(key);
      return null;
    }

    return {
      messages: validMessages,
      sessionId: data.sessionId || null,
    };
  } catch (err) {
    console.error("Gagal memuat riwayat chat:", err);
    return null;
  }
}

export default function ChatPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const chatEndRef = useRef(null);

  // Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. Ambil data user yang sedang login dari Supabase & muat riwayat chat
  useEffect(() => {
    let isMounted = true;

    async function initUserAndChat() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const currentUid = user?.id || null;
        if (isMounted && currentUid) {
          setUserId(currentUid);
        }

        // Muat riwayat chat yang tersimpan (dengan batasan 24 jam)
        const saved = loadChatHistory(currentUid);
        if (isMounted && saved && saved.messages && saved.messages.length > 0) {
          setMessages(saved.messages);
          if (saved.sessionId) {
            setSessionId(saved.sessionId);
          }
        }
      } catch (err) {
        console.warn("User belum terautentikasi atau gagal memuat chat:", err.message);
        if (isMounted) {
          const saved = loadChatHistory(null);
          if (saved && saved.messages && saved.messages.length > 0) {
            setMessages(saved.messages);
            if (saved.sessionId) {
              setSessionId(saved.sessionId);
            }
          }
        }
      }
    }

    initUserAndChat();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // 2. Fungsi Mengirim Pesan
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    const userMsg = {
      sender: "user",
      text: userText,
      timestamp: Date.now(),
    };

    const updatedWithUser = [...messages, userMsg];
    setMessages(updatedWithUser);
    saveChatHistory(updatedWithUser, sessionId, userId);
    setLoading(true);

    try {
      // Mengirim request ke API Backend (/api/chat)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isChat: true,
          message: userText,
          userId: userId || null,
          sessionId: sessionId || null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        const aiMsg = {
          sender: "cici",
          text: data.reply,
          timestamp: Date.now(),
        };

        const currentSessionId = data.sessionId || sessionId;
        if (data.sessionId && !sessionId) {
          setSessionId(data.sessionId);
        }

        setMessages((prev) => {
          const updated = [...prev, aiMsg];
          saveChatHistory(updated, currentSessionId, userId);
          return updated;
        });
      } else {
        const errorMsg = {
          sender: "cici",
          text:
            "Maaf ya, terjadi kesalahan: " +
            (data.error || "Gagal merespon."),
          timestamp: Date.now(),
        };
        setMessages((prev) => {
          const updated = [...prev, errorMsg];
          saveChatHistory(updated, sessionId, userId);
          return updated;
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      const connErrMsg = {
        sender: "cici",
        text: `Terjadi kendala koneksi: ${err.message}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => {
        const updated = [...prev, connErrMsg];
        saveChatHistory(updated, sessionId, userId);
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-emerald-50/50 border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative bg-white border border-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <Image
              src="/CICI.png"
              alt="CiCi"
              fill
              sizes="40px"
              className="object-contain p-1"
            />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              CiCi - Tanya AI
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h4>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              Siap membantumu pilah sampah
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
          <Sparkles size={10} className="text-emerald-500" /> Powered by Gemini
        </span>
      </div>

      {/* Messages Window */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 max-w-[80%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 shadow-sm ${msg.sender === "user"
                  ? "bg-emerald-500 text-white"
                  : "bg-white border border-slate-100"
                }`}
            >
              {msg.sender === "user" ? "👤" : "🤖"}
            </div>

            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line font-medium shadow-sm border ${msg.sender === "user"
                  ? "bg-emerald-500 text-white border-emerald-600 rounded-tr-none"
                  : "bg-white text-slate-800 border-slate-100 rounded-tl-none"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Indicator Loading */}
        {loading && (
          <div className="flex items-start gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-sm shrink-0 shadow-sm animate-pulse">
              🤖
            </div>
            <div className="p-3 bg-white text-slate-500 border border-slate-100 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5">
              <span>CiCi sedang mengetik</span>
              <span className="flex gap-0.5">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-0"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-slate-100 flex gap-2 items-center bg-white"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan jenis sampah, tips mengompos..."
          disabled={loading}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-100 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none shrink-0 cursor-pointer"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}