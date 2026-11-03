// Krishi-Line RBAC (Role-Based Access Control) Definitions
// Defines roles, operational permissions, dashboard redirects, and navigation restrictions.

export type UserRole =
  | "clerk"
  | "warehouse"
  | "accountant"
  | "collector"
  | "fpo"
  | "admin"
  | "farmer";

export interface RoleConfig {
  role: UserRole;
  title: string;
  department: string;
  badge: string;
  defaultDashboard: string;
  allowedPrefixes: string[];
  permissions: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  clerk: {
    role: "clerk",
    title: "Government Mandi Clerk",
    department: "Mandi Physical Operations",
    badge: "MANDI · 02",
    defaultDashboard: "/roles/clerk",
    allowedPrefixes: ["/roles/clerk"],
    permissions: [
      "procurement:weigh",
      "procurement:grade",
      "receipt:generate",
      "sticker:print",
    ],
  },
  warehouse: {
    role: "warehouse",
    title: "Warehouse Supervisor",
    department: "Gate Security & Storage",
    badge: "WAREHOUSE · 03",
    defaultDashboard: "/roles/warehouse",
    allowedPrefixes: ["/roles/warehouse"],
    permissions: [
      "gate:verify",
      "fifo:reorder",
      "batch:green_pass",
      "batch:orange_scan",
      "unload:approve",
      "batch:flag_mismatch",
    ],
  },
  accountant: {
    role: "accountant",
    title: "Center Accountant",
    department: "Treasury & Mandi Finance",
    badge: "FINANCE · 04",
    defaultDashboard: "/roles/accountant",
    allowedPrefixes: ["/roles/accountant"],
    permissions: [
      "ledger:view",
      "deductions:calculate",
      "bank:verify",
      "signature:apply",
      "pfms:submit_dbt",
    ],
  },
  collector: {
    role: "collector",
    title: "Collector Admin Staff",
    department: "District Vigilance Directorate",
    badge: "VIGILANCE · 05",
    defaultDashboard: "/roles/collector",
    allowedPrefixes: ["/roles/collector"],
    permissions: [
      "district:overview",
      "variance:alarm_view",
      "investigation:raise",
      "treasury:freeze_batch",
      "reports:reconcile_csv",
    ],
  },
  fpo: {
    role: "fpo",
    title: "FPO Cooperative Manager",
    department: "Farmer Producer Organization",
    badge: "COOPERATIVE · 06",
    defaultDashboard: "/roles/fpo",
    allowedPrefixes: ["/roles/fpo"],
    permissions: [
      "roster:upload_csv",
      "land:cross_verify",
      "slot:group_booking",
      "capacity:track_tonnes",
    ],
  },
  admin: {
    role: "admin",
    title: "System Administrator",
    department: "State Agriculture & IT Portal",
    badge: "ADMIN · 00",
    defaultDashboard: "/roles/admin",
    allowedPrefixes: ["/roles/admin", "/roles/clerk", "/roles/warehouse", "/roles/accountant", "/roles/collector", "/roles/fpo"],
    permissions: [
      "admin:all",
      "officials:manage",
      "users:block_unblock",
      "security:audit_logs",
    ],
  },
  farmer: {
    role: "farmer",
    title: "Farmer / Producer",
    department: "Producer Community",
    badge: "FARMER · 01",
    defaultDashboard: "/farmer/whatsapp",
    allowedPrefixes: ["/farmer"],
    permissions: [
      "farmer:register",
      "slot:book",
      "token:view_qr",
      "receipt:download",
      "status:track_payment",
    ],
  },
};

/**
 * Checks if a role is permitted to access a given URL pathname.
 */
export function isRouteAllowedForRole(role: UserRole, pathname: string): boolean {
  // Public routes always allowed
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/workflow" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico"
  ) {
    return true;
  }

  // Admin has overarching vigilance and audit access to institutional roles
  if (role === "admin") {
    return true;
  }

  const config = ROLE_CONFIGS[role];
  if (!config) return false;

  return config.allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
}
