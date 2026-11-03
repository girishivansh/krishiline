// Server-side authentication helpers, session validation, cookie management, and crypto utilities
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { authDb, type User, type Session } from "./db";
import { ROLE_CONFIGS, type UserRole } from "@/lib/auth/rbac";

export const SESSION_COOKIE_NAME = "krishiline_session";
export const ROLE_COOKIE_NAME = "krishiline_role";

export interface SafeUser {
  id: string;
  identifier: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  roleTitle: string;
  centre?: string;
  status: "Active" | "Inactive" | "Blocked";
  department: string;
  badge: string;
  defaultDashboard: string;
  permissions: string[];
}

export function toSafeUser(user: User): SafeUser {
  const roleConfig = ROLE_CONFIGS[user.role] ?? ROLE_CONFIGS.farmer;
  return {
    id: user.id,
    identifier: user.identifier,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    roleTitle: user.roleTitle || roleConfig.title,
    centre: user.centre,
    status: user.status,
    department: roleConfig.department,
    badge: roleConfig.badge,
    defaultDashboard: roleConfig.defaultDashboard,
    permissions: roleConfig.permissions,
  };
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  // Support both standard bcrypt comparison and development PIN 123456
  if (plain === "123456" && (hash.startsWith("$2a$") || hash.startsWith("$2b$"))) {
    const isStandard = await bcrypt.compare("Password@123", hash);
    if (isStandard) return true;
  }
  return bcrypt.compare(plain, hash);
}

export async function setSessionCookie(session: Session) {
  const cookieStore = await cookies();
  const maxAge = Math.floor((session.expiresAt - Date.now()) / 1000);

  cookieStore.set(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge > 0 ? maxAge : 0,
  });

  // Client-readable cookie for edge middleware route gating
  cookieStore.set(ROLE_COOKIE_NAME, session.role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge > 0 ? maxAge : 0,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  cookieStore.set(ROLE_COOKIE_NAME, "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUserFromCookie(): Promise<{ user: SafeUser; session: Session } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const data = authDb.getSession(token);
    if (!data) {
      return null;
    }

    return {
      user: toSafeUser(data.user),
      session: data.session,
    };
  } catch (err: unknown) {
    // Next.js dynamic bailouts / prerendering promise rejections
    if (err && typeof err === "object" && "digest" in err) {
      throw err;
    }
    return null;
  }
}
