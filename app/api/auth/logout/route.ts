import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authDb } from "@/lib/server/db";
import { SESSION_COOKIE_NAME, clearSessionCookie } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      const data = authDb.getSession(token);
      if (data) {
        authDb.logAudit({
          userId: data.user.id,
          identifier: data.user.identifier,
          action: "LOGOUT",
          status: "SUCCESS",
          ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1",
        });
      }
      authDb.deleteSession(token);
    }

    await clearSessionCookie();

    return NextResponse.json({ success: true, message: "Logged out successfully." });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Logout API error:", error);
    await clearSessionCookie();
    return NextResponse.json({ success: true, message: "Logged out." });
  }
}
