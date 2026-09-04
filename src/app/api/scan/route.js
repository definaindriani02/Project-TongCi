import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

// =========================================================
// 1. SUPABASE SETUP
// =========================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// =========================================================
// 2. GEMINI SETUP (@google/genai)
// =========================================================
const apiKey = process.env.GEMINI_API_KEY;

// Inisialisasi SDK @google/genai
const ai = apiKey ? new GoogleGenAI({ apiKey: apiKey.trim() }) : null;

// PERBAIKAN: Gunakan model resmi terbaru sesuai pesan error
const MODEL_NAME = "gemini-3.6-flash";
// =========================================================
// 3. POST HANDLER
// =========================================================
export async function POST(req) {
  try {
    const body = await req.json();

    if (!ai) {
      return NextResponse.json(
        { error: "API Key Gemini tidak ditemukan di .env.local!" },
        { status: 500 }
      );
    }

    // =====================================================
    // A. CHAT CICI
    // =====================================================
    if (body.isChat) {
      const { message, userId, sessionId } = body;

      if (!message || !message.trim()) {
        return NextResponse.json(
          { error: "Pesan kosong" },
          { status: 400 }
        );
      }

      const prompt = `
Anda adalah "CiCi", asisten AI resmi aplikasi TongCi.
TongCi adalah aplikasi yang membantu pengguna memahami dan memilah sampah.

Anda hanya boleh membantu topik berikut:
- Pemilahan sampah (Organik, Plastik, Kertas, Logam, B3)
- Daur ulang, Pengomposan, 3R (Reduce, Reuse, Recycle)
- Kebersihan dan kelestarian lingkungan, Bank sampah
- Fitur aplikasi TongCi

Jika pengguna menyapa, jawab dengan ramah.
Jika pertanyaan tidak berkaitan dengan sampah atau lingkungan, tolak dengan sopan dan arahkan kembali ke topik tersebut.
Gunakan Bahasa Indonesia yang ramah, singkat, jelas, dan mudah dipahami.

Pertanyaan pengguna:
"${message.trim()}"
`;

      // Pemanggilan API menggunakan SDK @google/genai
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

      const replyText = response.text;

      let activeSessionId = sessionId;

      if (userId) {
        if (!activeSessionId) {
          const { data: newSession, error: sessionError } = await supabase
            .from("chat_sessions")
            .insert({
              user_id: userId,
              title: message.trim().slice(0, 30),
            })
            .select()
            .single();

          if (sessionError) {
            console.error("[TongCi] Session error:", sessionError);
          }

          if (newSession) {
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
            console.error("[TongCi] Chat message error:", messageError);
          }
        }
      }

      return NextResponse.json({
        success: true,
        reply: replyText,
        sessionId: activeSessionId || null,
      });
    }

    // =====================================================
    // B. AI SCAN GAMBAR SAMPAH
    // =====================================================
    if (body.image) {
      let rawBase64 = body.image;
      let mimeType = "image/jpeg";

      // Sanitasi Data URL & Base64
      if (rawBase64.includes(";base64,")) {
        const parts = rawBase64.split(";base64,");
        mimeType = parts[0].replace("data:", "") || "image/jpeg";
        rawBase64 = parts[1];
      }

      rawBase64 = rawBase64.replace(/\s/g, "");

      const scanPrompt = `
Analisis gambar sampah ini untuk aplikasi TongCi.
Identifikasi benda yang terlihat pada gambar dan tentukan kategori sampahnya.

Berikan response HANYA dalam format JSON dengan struktur:
{
  "category": "Plastik",
  "item_name": "Botol Plastik",
  "confidence": 95,
  "disposal_instructions": "Pisahkan dari sampah lain dan masukkan ke tempat sampah plastik atau bank sampah.",
  "percentages": {
    "Organik": 0,
    "Plastik": 95,
    "Kertas": 3,
    "Logam": 2
  }
}

ATURAN:
1. category HANYA salah satu dari: "Organik", "Plastik", "Kertas", "Logam".
2. confidence harus berupa angka 0 - 100.
3. Total dari percentages harus 100.
4. item_name menjelaskan nama spesifik benda.
5. disposal_instructions menjelaskan cara membuang/mendaur ulang.
6. HANYA keluarkan JSON murni tanpa markdown.
`;

      // Format objek inlineData untuk SDK @google/genai
      const imagePart = {
        inlineData: {
          data: rawBase64,
          mimeType: mimeType,
        },
      };

      // Eksekusi generateContent pada SDK @google/genai
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [scanPrompt, imagePart],
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text;

      // Sanitasi JSON String
      let cleanJsonText = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const firstBracket = cleanJsonText.indexOf("{");
      const lastBracket = cleanJsonText.lastIndexOf("}");

      if (firstBracket !== -1 && lastBracket !== -1) {
        cleanJsonText = cleanJsonText.substring(firstBracket, lastBracket + 1);
      }

      let parsedData;
      try {
        parsedData = JSON.parse(cleanJsonText);
      } catch (parseError) {
        console.error("[TongCi AI Scan] Fallback JSON parse:", parseError);
        parsedData = {
          category: "Plastik",
          item_name: "Sampah Terdeteksi",
          confidence: 80,
          disposal_instructions: "Pisahkan sampah ini sesuai jenis materialnya.",
          percentages: { Organik: 0, Plastik: 100, Kertas: 0, Logam: 0 },
        };
      }

      // Validasi struktur data
      const allowedCategories = ["Organik", "Plastik", "Kertas", "Logam"];
      if (!allowedCategories.includes(parsedData.category)) {
        parsedData.category = "Plastik";
      }
      if (typeof parsedData.confidence !== "number") {
        parsedData.confidence = 80;
      }
      if (!parsedData.item_name) {
        parsedData.item_name = "Sampah Terdeteksi";
      }
      if (!parsedData.disposal_instructions) {
        parsedData.disposal_instructions = "Pisahkan sampah sesuai jenis materialnya.";
      }

      return NextResponse.json(parsedData);
    }

    return NextResponse.json(
      { error: "Payload tidak valid. Kirim message atau image." },
      { status: 400 }
    );
  } catch (err) {
    console.error("[TongCi Backend Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memproses request: " + (err?.message || "Kesalahan pada server."),
      },
      { status: 500 }
    );
  }
}