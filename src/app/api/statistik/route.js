import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const { userId, category, weight, imageUrl } = await req.json();

    if (!userId || !category) {
      return NextResponse.json(
        { error: "Data userId dan category wajib diisi." },
        { status: 400 }
      );
    }

    // Memasukkan data ke tabel 'statistik' sesuai struktur kolom Supabase kamu
    const { data, error } = await supabase.from("statistik").insert([
      {
        user_id: userId,
        category: category,
        weight: weight || 0.5,
        image_url: imageUrl || null,
      },
    ]);

    if (error) {
      console.error("[Statistik Insert Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Data statistik berhasil disimpan!",
    });
  } catch (err) {
    console.error("[Statistik API Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}