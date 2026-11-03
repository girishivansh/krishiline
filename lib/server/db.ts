// Server-side persistent Auth Database for Krishi-Line
// Stores users, sessions, password reset tokens, and security audit logs in data/auth_db.json
import fs from "fs";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { type UserRole } from "@/lib/auth/rbac";

export type AccountStatus = "Active" | "Inactive" | "Blocked";

export interface User {
  id: string;
  identifier: string; // unique lookup (Employee ID, Phone number, or Email)
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  roleTitle: string;
  centre?: string;
  passwordHash: string;
  status: AccountStatus;
  failedLoginAttempts: number;
  lockUntil?: number; // epoch ms
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Session {
  id: string;
  token: string;
  userId: string;
  role: UserRole;
  expiresAt: number; // epoch ms
  createdAt: number;
  rememberMe: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface PasswordResetToken {
  token: string;
  userId: string;
  expiresAt: number;
  used: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId?: string;
  identifier?: string;
  action: string;
  status: "SUCCESS" | "FAILED" | "BLOCKED";
  details?: string;
  ip?: string;
}

interface AuthDatabase {
  users: User[];
  sessions: Session[];
  resetTokens: PasswordResetToken[];
  auditLogs: AuditLog[];
}

const DB_PATH = path.join(process.cwd(), "data", "auth_db.json");

function getInitialSeedUsers(): User[] {
  const salt = bcrypt.genSaltSync(10);
  const defaultHash = bcrypt.hashSync("Password@123", salt);
  const now = new Date().toISOString();

  return [
    {
      id: "usr_clerk_1001",
      identifier: "EMP-1001",
      name: "Sanjay Deshmukh",
      email: "sanjay.deshmukh@krishiline.gov.in",
      phone: "9876540001",
      role: "clerk",
      roleTitle: "Government Mandi Clerk",
      centre: "Nashik Procurement Center - 1",
      passwordHash: defaultHash,
      status: "Active",
      failedLoginAttempts: 0,
      emailVerified: true,
      phoneVerified: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr_wh_1002",
      identifier: "EMP-1002",
      name: "Anil Pawar",
      email: "anil.pawar@krishiline.gov.in",
      phone: "9876540002",
      role: "warehouse",
      roleTitle: "Warehouse Supervisor",
      centre: "Nashik Procurement Center - 1",
      passwordHash: defaultHash,
      status: "Active",
      failedLoginAttempts: 0,
      emailVerified: true,
      phoneVerified: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr_acct_1003",
      identifier: "EMP-1003",
      name: "Meera Joshi",
      email: "meera.joshi@krishiline.gov.in",
      phone: "9876540003",
      role: "accountant",
      roleTitle: "Center Accountant",
      centre: "Nashik Procurement Center - 1",
      passwordHash: defaultHash,
      status: "Active",
      failedLoginAttempts: 0,
      emailVerified: true,
      phoneVerified: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr_coll_1004",
      identifier: "EMP-1004",
      name: "Rahul Verma",
      email: "rahul.verma@krishiline.gov.in",
      phone: "9876540004",
      role: "collector",
      roleTitle: "Collector Admin Staff",
      centre: "Nashik District Headquarters",
      passwordHash: defaultHash,
      status: "Active",
      failedLoginAttempts: 0,
      emailVerified: true,
      phoneVerified: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr_fpo_01",
      identifier: "EMP-FPO-01",
      name: "Kisan Cooperative FPO",
      email: "manager@kisanfpo.org",
      phone: "9876540005",
      role: "fpo",
      roleTitle: "FPO Cooperative Manager",
      centre: "Nashik Agro Cluster",
      passwordHash: defaultHash,
      status: "Active",
      failedLoginAttempts: 0,
      emailVerified: true,
      phoneVerified: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr_admin_01",
      identifier: "EMP-ADMIN-01",
      name: "District Administrator",
      email: "admin@krishiline.gov.in",
      phone: "9876540000",
      role: "admin",
      roleTitle: "System Administrator",
      centre: "State IT / Agriculture Dept",
      passwordHash: defaultHash,
      status: "Active",
      failedLoginAttempts: 0,
      emailVerified: true,
      phoneVerified: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr_farmer_01",
      identifier: "KL-FARMER-001",
      name: "Ramesh Patil",
      email: "ramesh.patil@kahan.farmer.in",
      phone: "9876541234",
      role: "farmer",
      roleTitle: "Farmer / Producer",
      centre: "Nashik Procurement Center - 1",
      passwordHash: defaultHash,
      status: "Active",
      failedLoginAttempts: 0,
      emailVerified: true,
      phoneVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

// Read database from file, initializing if absent
function readDb(): AuthDatabase {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed.users)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read auth database, initializing new:", err);
  }

  const initialDb: AuthDatabase = {
    users: getInitialSeedUsers(),
    sessions: [],
    resetTokens: [],
    auditLogs: [],
  };
  writeDb(initialDb);
  return initialDb;
}

// Atomically write database to file to prevent corruption
function writeDb(db: AuthDatabase): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${DB_PATH}.${Date.now()}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), "utf-8");
    fs.renameSync(tempPath, DB_PATH);
  } catch (err) {
    console.error("Failed to write auth database:", err);
  }
}

// Database helper functions
export const authDb = {
  getUserById(id: string): User | null {
    const db = readDb();
    return db.users.find((u) => u.id === id) ?? null;
  },

  getUserByIdentifier(identifier: string): User | null {
    const db = readDb();
    const clean = identifier.trim().toLowerCase();
    return (
      db.users.find(
        (u) =>
          u.identifier.toLowerCase() === clean ||
          (u.email && u.email.toLowerCase() === clean) ||
          (u.phone && u.phone === clean)
      ) ?? null
    );
  },

  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt" | "failedLoginAttempts" | "status"> & { status?: AccountStatus }): User {
    const db = readDb();
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      status: user.status ?? "Active",
      failedLoginAttempts: 0,
      createdAt: now,
      updatedAt: now,
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
  },

  updateUser(id: string, patch: Partial<User>): User | null {
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    const updated: User = {
      ...db.users[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    db.users[idx] = updated;
    writeDb(db);
    return updated;
  },

  recordFailedLogin(userId: string): { attempts: number; isLocked: boolean; lockUntil?: number } {
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx === -1) return { attempts: 0, isLocked: false };

    const user = db.users[idx];
    const attempts = (user.failedLoginAttempts || 0) + 1;
    let lockUntil: number | undefined = undefined;
    let isLocked = false;

    // Lock account for 15 minutes after 5 failed attempts
    if (attempts >= 5) {
      lockUntil = Date.now() + 15 * 60 * 1000;
      isLocked = true;
    }

    user.failedLoginAttempts = attempts;
    user.lockUntil = lockUntil;
    user.updatedAt = new Date().toISOString();
    writeDb(db);

    return { attempts, isLocked, lockUntil };
  },

  resetFailedLogins(userId: string): void {
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      db.users[idx].failedLoginAttempts = 0;
      db.users[idx].lockUntil = undefined;
      db.users[idx].lastLoginAt = new Date().toISOString();
      writeDb(db);
    }
  },

  createSession(userId: string, role: UserRole, rememberMe: boolean, ipAddress?: string, userAgent?: string): Session {
    const db = readDb();
    // 30 days if rememberMe, else 2 hours
    const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
    const now = Date.now();
    const session: Session = {
      id: `sess_${crypto.randomBytes(8).toString("hex")}`,
      token: crypto.randomBytes(32).toString("hex"),
      userId,
      role,
      createdAt: now,
      expiresAt: now + duration,
      rememberMe,
      ipAddress,
      userAgent,
    };

    // Clean up expired sessions periodically
    db.sessions = db.sessions.filter((s) => s.expiresAt > now);
    db.sessions.push(session);
    writeDb(db);
    return session;
  },

  getSession(token: string): { session: Session; user: User } | null {
    if (!token) return null;
    const db = readDb();
    const now = Date.now();
    const session = db.sessions.find((s) => s.token === token && s.expiresAt > now);
    if (!session) return null;

    const user = db.users.find((u) => u.id === session.userId);
    if (!user || user.status !== "Active") return null;

    return { session, user };
  },

  deleteSession(token: string): void {
    const db = readDb();
    db.sessions = db.sessions.filter((s) => s.token !== token);
    writeDb(db);
  },

  deleteUserSessions(userId: string): void {
    const db = readDb();
    db.sessions = db.sessions.filter((s) => s.userId !== userId);
    writeDb(db);
  },

  createPasswordResetToken(userId: string): PasswordResetToken {
    const db = readDb();
    const now = Date.now();
    // Invalidate existing unused tokens for this user
    db.resetTokens = db.resetTokens.filter((t) => t.userId !== userId || t.expiresAt < now);

    const token: PasswordResetToken = {
      token: crypto.randomBytes(32).toString("hex"),
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: now + 15 * 60 * 1000, // 15 mins expiry
      used: false,
    };
    db.resetTokens.push(token);
    writeDb(db);
    return token;
  },

  verifyAndConsumeResetToken(tokenStr: string): string | null {
    const db = readDb();
    const now = Date.now();
    const item = db.resetTokens.find((t) => t.token === tokenStr && !t.used && t.expiresAt > now);
    if (!item) return null;

    item.used = true;
    writeDb(db);
    return item.userId;
  },

  logAudit(log: Omit<AuditLog, "id" | "timestamp">): void {
    const db = readDb();
    const newLog: AuditLog = {
      ...log,
      id: `log_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      timestamp: new Date().toISOString(),
    };
    db.auditLogs.unshift(newLog);
    // Keep max 500 audit logs
    if (db.auditLogs.length > 500) {
      db.auditLogs = db.auditLogs.slice(0, 500);
    }
    writeDb(db);
  },

  listUsers(): Omit<User, "passwordHash">[] {
    const db = readDb();
    return db.users.map((u) => {
      const copy = { ...u };
      delete (copy as Partial<User>).passwordHash;
      return copy as Omit<User, "passwordHash">;
    });
  },

  listAuditLogs(): AuditLog[] {
    const db = readDb();
    return db.auditLogs.slice(0, 100);
  },
};
