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

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

// =========================================================
// GEMINI CLIENT
// =========================================================

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey.trim(),
    })
  : null;

// =========================================================
// GEMINI MODEL
// =========================================================

const MODEL_NAME = "gemini-3.6-flash";

// =========================================================
// SYSTEM INSTRUCTION CICI
// =========================================================

const CICI_INSTRUCTION = `
Anda adalah "CiCi", asisten AI resmi untuk aplikasi
pemilah sampah bernama "TongCi".

IDENTITAS:
Nama Anda adalah CiCi.
Anda adalah asisten lingkungan yang ramah dan membantu
pengguna memahami pengelolaan sampah.

TOPIK YANG BOLEH DIBAHAS:

- Pemilahan sampah
- Sampah organik
- Sampah plastik
- Sampah kertas
- Sampah logam
- Sampah B3
- Sampah elektronik
- Reduce, Reuse, Recycle
- Daur ulang
- Pengomposan
- Pengelolaan sampah rumah tangga
- Bank sampah
- Kebersihan lingkungan
- Kelestarian lingkungan
- Cara membuang sampah
- Tips mengurangi sampah
- Edukasi lingkungan
- Aplikasi TongCi
- Fitur aplikasi TongCi
- Identitas CiCi

ATURAN:

1. Jika pengguna menyapa seperti:
   "Halo", "Hai", "Selamat pagi", atau "Siapa kamu?",
   jawab dengan ramah dan jelaskan bahwa kamu adalah CiCi.

2. Jika pengguna bertanya tentang sampah atau lingkungan,
   berikan jawaban yang jelas, ramah, dan mudah dipahami.

3. Jika pengguna bertanya tentang suatu benda,
   jelaskan kategori sampahnya dan cara membuang atau
   mendaur ulangnya jika memungkinkan.

4. Jika pengguna bertanya mengenai cara memilah sampah,
   berikan langkah-langkah praktis.

5. Jika pertanyaan tidak berhubungan dengan sampah,
   lingkungan, daur ulang, atau aplikasi TongCi,
   jangan menjawab topik tersebut.

6. Untuk pertanyaan di luar topik, jawab dengan sopan:

   "Maaf, aku adalah CiCi dari TongCi. Aku lebih fokus
   membantu pertanyaan seputar sampah, daur ulang,
   dan lingkungan. 🌱💚"

7. Gunakan Bahasa Indonesia yang ramah dan natural.

8. Jangan mengaku sebagai manusia.

9. Jangan membuat informasi yang tidak diketahui.

10. Jawaban harus singkat dan mudah dipahami,
    kecuali pengguna meminta penjelasan lebih detail.

11. Gunakan emoji secukupnya agar terasa ramah.

Kamu adalah CiCi dari TongCi.
`;

// =========================================================
// POST CHAT
// =========================================================

export async function POST(req) {
  try {
    // =====================================================
    // CEK API KEY
    // =====================================================

    if (!ai) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GEMINI_API_KEY tidak ditemukan di .env.local!",
        },
        {
          status: 500,
        }
      );
    }

    // =====================================================
    // AMBIL BODY
    // =====================================================

    const body = await req.json();

    const message = body.message;
    const userId = body.userId;
    const sessionId = body.sessionId;

    // =====================================================
    // VALIDASI MESSAGE
    // =====================================================

    if (!message || !message.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Pesan kosong.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // BUAT PROMPT
    // =====================================================

    const prompt = `
${CICI_INSTRUCTION}

PERTANYAAN PENGGUNA:
"${message.trim()}"

Jawab pertanyaan pengguna sebagai CiCi.
`;

    // =====================================================
    // GEMINI INTERACTIONS API
    // =====================================================

    console.log(
      `[TongCi Chat] Menggunakan model: ${MODEL_NAME}`
    );

    const interaction = await ai.interactions.create({
      model: MODEL_NAME,
      input: prompt,
    });

    // =====================================================
    // AMBIL RESPONSE
    // =====================================================

    const replyText = interaction.output_text;

    if (!replyText) {
      throw new Error(
        "Gemini tidak mengembalikan jawaban."
      );
    }

    console.log(
      "[TongCi Chat] Response berhasil."
    );

    // =====================================================
    // SUPABASE SESSION
    // =====================================================

    let activeSessionId = sessionId;

    if (userId) {
      // ---------------------------------------------------
      // BUAT SESSION BARU
      // ---------------------------------------------------

      if (!activeSessionId) {
        const {
          data: newSession,
          error: sessionError,
        } = await supabase
          .from("chat_sessions")
          .insert({
            user_id: userId,
            title: message.trim().slice(0, 30),
          })
          .select()
          .single();

        if (sessionError) {
          console.error(
            "[TongCi] Gagal membuat session:",
            sessionError
          );
        }

        if (newSession) {
          activeSessionId = newSession.id;
        }
      }

      // ---------------------------------------------------
      // SIMPAN PESAN
      // ---------------------------------------------------

      if (activeSessionId) {
        const {
          error: messageError,
        } = await supabase
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
          console.error(
            "[TongCi] Gagal menyimpan pesan:",
            messageError
          );
        }
      }
    }

    // =====================================================
    // RESPONSE KE FRONTEND
    // =====================================================

    return NextResponse.json({
      success: true,
      reply: replyText,
      sessionId: activeSessionId || null,
    });

  } catch (error) {
    // =====================================================
    // ERROR HANDLER
    // =====================================================

    console.error(
      "[TongCi Chat Error]:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Gagal memproses pesan: " +
          (error?.message ||
            "Kesalahan server."),
      },
      {
        status: 500,
      }
    );
  }
}