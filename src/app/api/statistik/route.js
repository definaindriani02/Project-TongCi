import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "Parameter userId wajib diisi." },
        { status: 400 }
      );
    }

    const { data: logs, error } = await supabase
      .from("waste_logs")
      .select("category, weight_gram, created_at")
      .eq("user_id", userId);

    if (error) {
      console.error("[Statistik API Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let organikGram = 0;
    let plastikGram = 0;
    let kertasGram = 0;
    let logamB3Gram = 0;

    if (logs && logs.length > 0) {
      logs.forEach((log) => {
        const cat = (log.category || "").trim();
        const weight = Number(log.weight_gram) || 0;
        const catLower = cat.toLowerCase();

        if (catLower === "organik") {
          organikGram += weight;
        } else if (catLower === "plastik") {
          plastikGram += weight;
        } else if (catLower === "kertas") {
          kertasGram += weight;
        } else if (
          catLower === "logam" ||
          catLower === "b3" ||
          catLower.includes("logam") ||
          catLower.includes("b3")
        ) {
          logamB3Gram += weight;
        }
      });
    }

    const organikKg = organikGram / 1000;
    const plastikKg = plastikGram / 1000;
    const kertasKg = kertasGram / 1000;
    const logamB3Kg = logamB3Gram / 1000;
    const totalKg = organikKg + plastikKg + kertasKg + logamB3Kg;

    let organikPercent = 0;
    let plastikPercent = 0;
    let kertasPercent = 0;
    let logamB3Percent = 0;

    if (totalKg > 0) {
      organikPercent = Math.round((organikKg / totalKg) * 100);
      plastikPercent = Math.round((plastikKg / totalKg) * 100);
      kertasPercent = Math.round((kertasKg / totalKg) * 100);
      logamB3Percent = Math.round((logamB3Kg / totalKg) * 100);
    }

    const totalCarbonKg = totalKg * 2.5;

    return NextResponse.json({
      success: true,
      data: {
        organikKg: parseFloat(organikKg.toFixed(1)),
        plastikKg: parseFloat(plastikKg.toFixed(1)),
        kertasKg: parseFloat(kertasKg.toFixed(1)),
        logamB3Kg: parseFloat(logamB3Kg.toFixed(1)),
        totalKg: parseFloat(totalKg.toFixed(1)),
        organikPercent,
        plastikPercent,
        kertasPercent,
        logamB3Percent,
        totalCarbonKg: totalCarbonKg.toFixed(1),
      },
    });
  } catch (err) {
    console.error("[Statistik API Server Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId, category, weight, weight_gram, imageUrl } = await req.json();

    if (!userId || !category) {
      return NextResponse.json(
        { error: "Data userId dan category wajib diisi." },
        { status: 400 }
      );
    }

    const calculatedWeightGram = weight_gram || (weight ? Math.round(weight * 1000) : 200);

    const { data, error } = await supabase.from("waste_logs").insert([
      {
        user_id: userId,
        category: category,
        weight_gram: calculatedWeightGram,
      },
    ]);

    if (error) {
      console.error("[Statistik Insert Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Data statistik berhasil disimpan ke waste_logs!",
    });
  } catch (err) {
    console.error("[Statistik API Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}