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

// DELETE /api/profile?userId=xxx
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get("userId") || searchParams.get("user_id");

    if (!userId) {
      try {
        const body = await req.json();
        userId = body.userId || body.user_id || body.id;
      } catch (e) {
        // Body opsional jika userId ada di query param
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Parameter userId wajib disertakan." },
        { status: 400 }
      );
    }

    // 1. Bersihkan seluruh data pengguna dari tabel-tabel terkait
    try {
      await supabase.from("notifications").delete().eq("user_id", userId);
      await supabase.from("scan_history").delete().eq("user_id", userId);
      await supabase.from("waste_logs").delete().eq("user_id", userId);
      await supabase.from("chat_messages").delete().eq("user_id", userId);
      await supabase.from("chat_sessions").delete().eq("user_id", userId);
      await supabase.from("scans").delete().eq("user_id", userId);
    } catch (cleanErr) {
      console.warn("[Profile DELETE Data Cleanup Warning]:", cleanErr);
    }

    // 2. Hapus data di tabel profiles
    const { error: profileDeleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileDeleteError) {
      console.warn("[Profile DELETE Profile Table Error]:", profileDeleteError);
    }

    // 3. Hapus akun pengguna secara permanen dari Supabase Auth
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      console.error("[Profile DELETE Auth Admin Error]:", authDeleteError);
      return NextResponse.json(
        { error: "Gagal menghapus akun dari sistem autentikasi: " + authDeleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Akun dan seluruh data pengguna berhasil dihapus secara permanen.",
    });
  } catch (err) {
    console.error("[Profile API DELETE Server Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat menghapus akun: " + (err?.message || err) },
      { status: 500 }
    );
  }
}

