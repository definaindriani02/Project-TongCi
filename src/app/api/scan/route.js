import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey.trim()) : null;

// Daftar model cadangan jika model utama sedang sibuk (503) atau 404
const MODEL_CANDIDATES = [
  "gemini-2.0-flash",
  "gemini-3.5-flash",
  "gemini-3.6-flash"
];

function base64ToGenerativePart(base64Str) {
  if (!base64Str) return null;
  let mimeType = "image/jpeg";
  let data = base64Str;

  if (base64Str.includes(";base64,")) {
    const parts = base64Str.split(";base64,");
    mimeType = parts[0].replace("data:", "") || "image/jpeg";
    data = parts[1];
  }

  return {
    inlineData: { data, mimeType },
  };
}

// Fungsi helper untuk mencoba model lain otomatis jika server sibuk
async function generateWithFallback(contents) {
  let lastError = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      console.log(`[TongCi AI] Memproses dengan model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(contents);
      console.log(`[TongCi AI] BERHASIL dengan model: ${modelName}`);
      return result;
    } catch (err) {
      console.warn(`[TongCi AI] Model ${modelName} kendala (${err.status || err.message}), mencoba model cadangan...`);
      lastError = err;
    }
  }

  throw lastError;
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!genAI) {
      return NextResponse.json(
        { error: "API Key Gemini tidak ditemukan di .env.local!" },
        { status: 500 }
      );
    }

    // =========================================================
    // 1. LOGIKA CHATBOT CICI
    // =========================================================
    if (body.isChat) {
      const { message } = body;
      if (!message) return NextResponse.json({ error: "Pesan kosong" }, { status: 400 });

      const prompt = `Anda adalah "CiCi", asisten AI resmi untuk aplikasi pemilah sampah "TongCi".
Tugas utama Anda adalah MEMBANTU PENGGUNA HANYA DALAM TOPIK:
- Pemilahan sampah (Organik, Plastik, Kertas, Logam, B3, dsb.)
- Cara daur ulang (Reduce, Reuse, Recycle) dan pengomposan.
- Pengelolaan limbah rumah tangga dan kelestarian lingkungan hidup di Indonesia.
- Pertanyaan umum/sapaan ringan tentang aplikasi TongCi dan identitas Anda sebagai CiCi.

ATURAN KETAT:
1. Jika pengguna menyapa (seperti "Halo", "Hai", "Siapa kamu?"), jawablah dengan ramah dan jelaskan bahwa Anda adalah CiCi yang siap membantu seputar sampah dan lingkungan.
2. Jika pengguna menanyakan hal yang TIDAK BERKAITAN dengan sampah, lingkungan, atau daur ulang (misalnya: matematika, koding, sejarah, film, politik, dsb.), JANGAN MENJAWAB pertanyaan tersebut.
3. Sebagai gantinya, berikan penolakan yang sopan, ramah, dan beri tahu pengguna bahwa Anda hanya bisa membantu menjawab pertanyaan terkait pemilahan sampah dan lingkungan hidup. Contoh respon penolakan:
   "Maaf ya! 🤖 Sebagai CiCi di TongCi, saya hanya bisa membantu menjawab pertanyaan seputar pemilahan sampah, daur ulang, dan kelestarian lingkungan hidup. Ada yang ingin kamu tanyakan tentang sampah atau lingkungan?"

Pertanyaan Pengguna: "${message}"`;

      const result = await generateWithFallback(prompt);
      return NextResponse.json({ reply: result.response.text() });
    }

    // =========================================================
    // 2. LOGIKA KLASIFIKASI GAMBAR (SCAN SAMPAH)
    // =========================================================
    const { image } = body;
    if (!image) {
      return NextResponse.json({ error: "Gambar tidak ditemukan dalam request." }, { status: 400 });
    }

    const imagePart = base64ToGenerativePart(image);
    if (!imagePart) {
      return NextResponse.json({ error: "Format gambar tidak valid." }, { status: 400 });
    }

    const prompt = `Identifikasi gambar sampah ini. Tentukan kategori sampahnya apakah "Organik", "Plastik", "Kertas", atau "Logam". 
Berikan nama item spesifik dan instruksi pembuangan singkat di Indonesia.
Kembalikan WAJIB format JSON Murni tanpa teks markdown (seperti \`\`\`json) atau penjelasan tambahan di luar JSON. Format JSON yang harus dikembalikan:
{
  "category": "Organik",
  "item_name": "Nama item spesifik",
  "confidence": 95,
  "disposal_instructions": "Langkah pembuangan singkat",
  "percentages": { "Organik": 95, "Plastik": 5, "Kertas": 0, "Logam": 0 }
}`;

    const result = await generateWithFallback([prompt, imagePart]);
    let responseText = result.response.text();

    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsedData = JSON.parse(responseText);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("[TongCi AI] Gagal parse JSON:", responseText);
      return NextResponse.json(
        { error: "Format hasil analisa AI tidak valid, silakan coba lagi." },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error("================ LOG ERROR SCAN ================");
    console.error(err);
    console.error("================================================");
    return NextResponse.json(
      { error: "Gagal menganalisa gambar: " + (err.message || "Terjadi kesalahan pada server.") },
      { status: 500 }
    );
  }
}