import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/profile?userId=xxx
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

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("[Profile API GET Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    console.error("[Profile API Server Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server: " + (err?.message || err) },
      { status: 500 }
    );
  }
}

// PUT /api/profile
export async function PUT(req) {
  try {
    const body = await req.json();
    const { userId, ...updateFields } = body;

    const targetUserId = userId || body.id;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "userId wajib disertakan." },
        { status: 400 }
      );
    }

    // Filter allowed columns to prevent updating restricted/invalid fields
    const allowedFields = [
      "full_name",
      "email",
      "phone_number",
      "birth_date",
      "gender",
      "address",
      "notif_scan",
      "notif_points",
      "notif_promo",
      "notif_app_update",
      "lang",
      "privacy_public_profile",
      "privacy_show_rank",
      "privacy_public_activity",
      "points",
      "total_scan",
    ];

    const cleanPayload = {};
    Object.keys(updateFields).forEach((key) => {
      if (allowedFields.includes(key) && updateFields[key] !== undefined) {
        cleanPayload[key] = updateFields[key];
      }
    });

    cleanPayload.updated_at = new Date().toISOString();

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update(cleanPayload)
      .eq("id", targetUserId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("[Profile API PUT Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile,
    });
  } catch (err) {
    console.error("[Profile API Server Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server: " + (err?.message || err) },
      { status: 500 }
    );
  }
}
