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
// 2. HELPER SEND NOTIFICATION
// =========================================================
async function sendNotification(userId, title, message, type) {
  if (!userId) return;

  try {
    const { error } = await supabase.from("notifications").insert([
      {
        user_id: userId,
        title: title,
        message: message,
        type: type,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("[TongCi] Insert notification error:", error.message);
    } else {
      console.log("[TongCi] Notification sent successfully to user:", userId);
    }
  } catch (err) {
    console.error("[TongCi] Gagal kirim notif:", err);
  }
}

// =========================================================
// 3. GEMINI SETUP (@google/genai)
// =========================================================
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey: apiKey.trim() }) : null;
const MODEL_NAME = "gemini-3.6-flash";

// =========================================================
// 4. POST HANDLER
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
  "weight_gram": 200,
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
1. category HANYA salah satu dari: "Organik", "Plastik", "Kertas", "Logam", "B3".
2. weight_gram adalah estimasi berat benda dalam gram (100 - 500 gram).
3. confidence harus berupa angka 0 - 100.
4. Total dari percentages harus 100.
5. item_name menjelaskan nama spesifik benda.
6. disposal_instructions menjelaskan cara membuang/mendaur ulang.
7. HANYA keluarkan JSON murni tanpa markdown.
`;

      const imagePart = {
        inlineData: {
          data: rawBase64,
          mimeType: mimeType,
        },
      };

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [scanPrompt, imagePart],
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text;

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
          weight_gram: 200,
          confidence: 80,
          disposal_instructions: "Pisahkan sampah ini sesuai jenis materialnya.",
          percentages: { Organik: 0, Plastik: 100, Kertas: 0, Logam: 0 },
        };
      }

      const allowedCategories = ["Organik", "Plastik", "Kertas", "Logam", "B3"];
      if (!allowedCategories.includes(parsedData.category)) {
        parsedData.category = "Plastik";
      }

      if (
        typeof parsedData.weight_gram !== "number" ||
        isNaN(parsedData.weight_gram) ||
        parsedData.weight_gram <= 0
      ) {
        const cat = parsedData.category.toLowerCase();
        if (cat === "organik") parsedData.weight_gram = 300;
        else if (cat === "plastik") parsedData.weight_gram = 200;
        else if (cat === "kertas") parsedData.weight_gram = 150;
        else if (cat === "logam") parsedData.weight_gram = 400;
        else if (cat === "b3") parsedData.weight_gram = 250;
        else parsedData.weight_gram = 200;
      } else {
        parsedData.weight_gram = Math.round(parsedData.weight_gram);
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

      // =====================================================
      // SIMPAN KE LOG & KIRIM NOTIFIKASI OTOMATIS
      // =====================================================
      if (body.userId) {
        try {
          // Hitung estimasi poin (misal tiap 10 gram = 1 poin, minimal 1 poin)
          const pointsEarned = Math.max(1, Math.round(parsedData.weight_gram / 10));

          // 1. Simpan ke tabel waste_logs
          const { error: logErr } = await supabase.from("waste_logs").insert([
            {
              user_id: body.userId,
              category: parsedData.category,
              weight_gram: parsedData.weight_gram,
            },
          ]);

          if (logErr) {
            console.error("[TongCi] Insert waste_logs failed:", logErr.message);
          } else {
            console.log("[TongCi] Insert waste_logs success:", {
              user_id: body.userId,
              category: parsedData.category,
              weight_gram: parsedData.weight_gram,
            });
          }

          // 2. Kirim Notifikasi Scan Berhasil
          await sendNotification(
            body.userId,
            `Scan ${parsedData.category} Berhasil! 🎉`,
            `Kamu berhasil mendeteksi ${parsedData.item_name} (~${parsedData.weight_gram}g). Terus jaga lingkungan ya!`,
            "scan"
          );

          // 3. Kirim Notifikasi Penambahan Poin
          await sendNotification(
            body.userId,
            `Poin Bertambah! 🪙`,
            `Selamat! Kamu mendapatkan +${pointsEarned} Pts dari scan ${parsedData.item_name}.`,
            "points"
          );

        } catch (insertErr) {
          console.error("[TongCi] Insert log / notification error:", insertErr);
        }
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