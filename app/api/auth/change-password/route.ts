import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromCookie, verifyPassword, hashPassword } from "@/lib/server/auth";
import { authDb } from "@/lib/server/db";

export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUserFromCookie();
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Authentication required to change password." },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const fullUser = authDb.getUserById(auth.user.id);
    if (!fullUser) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 404 }
      );
    }

    const isMatch = await verifyPassword(currentPassword, fullUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect current password." },
        { status: 401 }
      );
    }

    const passwordHash = await hashPassword(newPassword);
    authDb.updateUser(fullUser.id, { passwordHash });

    authDb.logAudit({
      userId: fullUser.id,
      identifier: fullUser.identifier,
      action: "CHANGE_PASSWORD",
      status: "SUCCESS",
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to change password. Please try again." },
      { status: 500 }
    );
  }
}
