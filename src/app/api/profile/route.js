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
    console.error("[Profile API GET Server Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

// PUT /api/profile
export async function PUT(req) {
  try {
    const body = await req.json();
    const { userId, user_id, id, ...updateFields } = body;

    const targetUserId = userId || user_id || id;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "userId wajib disertakan dalam request body." },
        { status: 400 }
      );
    }

    // Filter allowed profile fields to avoid unwanted updates
    const allowedKeys = [
      "full_name",
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
      "avatar_url",
    ];

    const payload = {
      updated_at: new Date().toISOString(),
    };

    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(updateFields, key)) {
        payload[key] = updateFields[key];
      }
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", targetUserId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("[Profile API PUT Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
      data: data,
    });
  } catch (err) {
    console.error("[Profile API PUT Server Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server: " + (err?.message || err) },
      { status: 500 }
    );
  }
}
