import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

// =========================================================
// SUPABASE CLIENT
// =========================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// =========================================================
// GEMINI CLIENT (@google/genai)
// =========================================================
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey: apiKey.trim() }) : null;

// Model sesuai permintaan dari API Google
const MODEL_NAME = "gemini-3.6-flash";

// =========================================================
// SYSTEM INSTRUCTION CICI
// =========================================================
const CICI_INSTRUCTION = `
Anda adalah "CiCi", asisten AI resmi untuk aplikasi pemilah sampah bernama "TongCi".

IDENTITAS:
Nama Anda adalah CiCi.
Anda adalah asisten lingkungan yang ramah dan membantu pengguna memahami pengelolaan sampah.

TOPIK YANG BOLEH DIBAHAS:
- Pemilahan sampah (organik, plastik, kertas, logam, B3, elektronik)
- Reduce, Reuse, Recycle, daur ulang, pengomposan, bank sampah
- Kebersihan lingkungan, kelestarian lingkungan, edukasi lingkungan
- Cara membuang sampah dan tips mengurangi sampah
- Aplikasi TongCi dan fitur-fiturnya

ATURAN:
1. Jika pengguna menyapa (contoh: "Halo", "Hai", "Selamat pagi"), jawab ramah dan perkenalkan diri sebagai CiCi.
2. Jika pengguna bertanya tentang sampah/lingkungan, berikan jawaban yang jelas, praktis, dan mudah dipahami.
3. Jika pertanyaan di luar topik sampah, daur ulang, atau aplikasi TongCi, jawab dengan sopan:
   "Maaf, aku adalah CiCi dari TongCi. Aku lebih fokus membantu pertanyaan seputar sampah, daur ulang, dan lingkungan. 🌱💚"
4. Gunakan Bahasa Indonesia yang ramah, santun, dan alami.
5. Gunakan emoji secukupnya agar terasa ramah.
6. Jawaban harus singkat dan langsung ke inti masalah, kecuali pengguna meminta penjelasan detail.
`;

// =========================================================
// POST CHAT HANDLER
// =========================================================
export async function POST(req) {
  try {
    if (!ai) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY tidak ditemukan di environment variables!" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { message, userId, sessionId } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Panggil Gemini AI
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: message.trim(),
      config: {
        systemInstruction: CICI_INSTRUCTION,
      },
    });

    const replyText = response.text;

    if (!replyText) {
      throw new Error("Gemini tidak mengembalikan respon.");
    }

    // Penanganan Supabase
    let activeSessionId = sessionId || null;
    const validUserId = userId && userId !== "guest" ? userId : null;

    if (!activeSessionId) {
      const sessionPayload = {
        title: message.trim().slice(0, 30),
      };

      if (validUserId) {
        sessionPayload.user_id = validUserId;
      }

      const { data: newSession, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert(sessionPayload)
        .select()
        .single();

      if (sessionError) {
        console.error("[TongCi Chat] Gagal membuat session:", sessionError.message);
      } else if (newSession) {
        activeSessionId = newSession.id;
      }
    }

    if (activeSessionId) {
      const { error: messageError } = await supabase
        .from("chat_messages")
        .insert([
          {
            session_id: activeSessionId,
            sender: "user",
            content: message.trim(),
          },
          {
            session_id: activeSessionId,
            sender: "assistant",
            content: replyText,
          },
        ]);

      if (messageError) {
        console.error("[TongCi Chat] Gagal menyimpan pesan:", messageError.message);
      }
    }

    return NextResponse.json({
      success: true,
      reply: replyText,
      sessionId: activeSessionId,
    });

  } catch (error) {
    console.error("[TongCi Chat Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memproses pesan: " + (error?.message || "Terjadi kesalahan server."),
      },
      { status: 500 }
    );
  }
}