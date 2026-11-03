import { NextRequest, NextResponse } from "next/server";
import { authDb } from "@/lib/server/db";

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();

    if (!identifier || typeof identifier !== "string") {
      return NextResponse.json(
        { success: false, message: "Please provide your Employee ID, Mobile Number, or Email." },
        { status: 400 }
      );
    }

    const clean = identifier.trim();
    const user = authDb.getUserByIdentifier(clean);

    if (!user) {
      // Return ambiguous success for security, but informative message
      return NextResponse.json({
        success: true,
        message: "If an account matches this identifier in the state registry, password recovery instructions have been initiated.",
      });
    }

    const resetToken = authDb.createPasswordResetToken(user.id);
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

    authDb.logAudit({
      userId: user.id,
      identifier: user.identifier,
      action: "FORGOT_PASSWORD_REQUEST",
      status: "SUCCESS",
      details: "Password reset token generated",
      ip,
    });

    const resetUrl = `/reset-password?token=${resetToken.token}`;

    return NextResponse.json({
      success: true,
      message: `Password reset instructions generated for ${user.name}. Click the reset link or use the token below to set a new password.`,
      resetToken: resetToken.token,
      resetUrl,
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
