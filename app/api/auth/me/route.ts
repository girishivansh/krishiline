import { NextResponse } from "next/server";
import { getCurrentUserFromCookie } from "@/lib/server/auth";

export async function GET() {
  try {
    const data = await getCurrentUserFromCookie();
    if (!data) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: data.user,
      expiresAt: data.session.expiresAt,
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Auth check API error:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
