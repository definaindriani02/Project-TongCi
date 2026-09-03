"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, ChevronDown, User } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import "./AsistenAI.css";

const CICI_MASCOT_PATH = "/asset/images/CICI.png";

const QUICK_QUESTIONS = [
  "Cara olah minyak jelantah?",
  "Berapa poin sekali scan sampah?",
  "Sampah baterai masuk kategori apa?",
];

const CICI_SYSTEM_INSTRUCTION = `
Kamu adalah "CiCi", maskot dan asisten AI interaktif untuk aplikasi pemilahan sampah bernama TongCi.
Tugas utama kamu adalah membantu pengguna memahami pengolahan sampah, pemilahan (Organik, Anorganik, B3), tips daur ulang, dan fitur aplikasi TongCi.

Aturan Utama:
1. Gunakan nada bicara yang ramah, sopan, komunikatif, ceria, dan peduli lingkungan.
2. Jika pengguna bertanya tentang topik di luar sampah, lingkungan, daur ulang, atau aplikasi TongCi, TOLAK DENGAN SOPAN.
3. Jelaskan bahwa kamu adalah CiCi yang khusus fokus pada isu sampah & lingkungan, lalu arahkan kembali pengguna untuk bertanya seputar sampah/lingkungan.
4. Jawablah secara ringkas, padat, mudah dipahami, dan gunakan emoji secukupnya agar menarik.
`;

export default function AsistenAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      sender: "bot",
      text: "Halo! Aku CiCi 🌿, maskot & asisten pintar TongCi. Kamu bisa tanya apa saja seputar pemilahan sampah, tips daur ulang, atau fitur TongCi!",
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const fetchAIResponse = async (userQuery) => {
    try {
      // Membaca variabel dengan prefix NEXT_PUBLIC_
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (!apiKey) {
        console.error("API Key belum terdeteksi di NEXT_PUBLIC_GEMINI_API_KEY");
        return "Waduh, CiCi belum terhubung ke kunci AI nih. Pastikan nama variabel di .env.local sudah diawali NEXT_PUBLIC_ lalu restart npm run dev ya! 🌿";
      }

      // Inisialisasi SDK tepat saat ada input
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userQuery,
        config: {
          systemInstruction: CICI_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      return response.text || "Maaf, CiCi kurang paham. Bisa diulangi pertanyaannya?";
    } catch (err) {
      console.error("Gemini Error:", err);
      return "Waduh, koneksi CiCi lagi terganggu nih. Coba tanyakan lagi sebentar lagi ya! 🌿";
    }
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const time = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    const replyText = await fetchAIResponse(query);

    const botMsg = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: replyText,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="asisten-ai-wrapper">
      <motion.button
        className={`asisten-fab ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <ChevronDown size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              className="fab-content"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <div className="fab-mascot-img">
                <img src={CICI_MASCOT_PATH} alt="CiCi" />
              </div>
              <span className="fab-badge">Tanya CiCi</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="asisten-chat-card"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div className="chat-header">
              <div className="header-info">
                <div className="avatar-bot-mascot">
                  <img src={CICI_MASCOT_PATH} alt="CiCi Mascot" />
                  <span className="online-indicator" />
                </div>
                <div>
                  <h4>CiCi AI Assistant 🌿</h4>
                  <p>Maskot & Asisten Kelola Sampah</p>
                </div>
              </div>

              <button
                className="btn-chat-close"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-row ${
                    msg.sender === "user" ? "user-row" : "bot-row"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="msg-avatar-mascot">
                      <img src={CICI_MASCOT_PATH} alt="CiCi" />
                    </div>
                  )}

                  <div className="msg-bubble-group">
                    <div className="msg-bubble">
                      <p>{msg.text}</p>
                    </div>
                    <span className="msg-time">{msg.time}</span>
                  </div>

                  {msg.sender === "user" && (
                    <div className="msg-avatar user">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="message-row bot-row">
                  <div className="msg-avatar-mascot">
                    <img src={CICI_MASCOT_PATH} alt="CiCi" />
                  </div>
                  <div className="msg-bubble typing-bubble">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="chat-suggestions">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  className="btn-suggestion"
                  onClick={() => handleSend(q)}
                >
                  <Sparkles size={12} />
                  <span>{q}</span>
                </button>
              ))}
            </div>

            <form
              className="chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                placeholder="Tanyakan ke CiCi..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button
                type="submit"
                className="btn-chat-send"
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}