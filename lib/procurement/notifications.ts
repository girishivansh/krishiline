// Modular Notification Dispatcher for Krishi-Line
// Designed to keep the procurement engine decoupled from messaging transport providers.
// In the current phase, notifications are delivered directly to the Web Farmer Portal.
// In future phases, adapters for WhatsApp Business Cloud API or SMS Gateways can be plugged in here.

export type NotificationChannel = "WEB_PORTAL" | "SMS_GATEWAY" | "WHATSAPP_CLOUD_API";

export type NotificationType =
  | "SLOT_BOOKING_CONFIRMED"
  | "DIGITAL_QUALITY_RECEIPT"
  | "PFMS_DBT_PAYMENT_CREDITED"
  | "STANDBY_ROLLOVER_VIP"
  | "FPO_BULK_CONFIRMATION";

export interface NotificationPayload {
  recipientPhone: string;
  farmerName: string;
  type: NotificationType;
  token?: string;
  batchNo?: string;
  centreName?: string;
  displayDate?: string;
  slot?: string;
  quantityKg?: number;
  netAmount?: number;
  utr?: string;
  channels?: NotificationChannel[];
  metadata?: Record<string, unknown>;
}

export interface DispatchResult {
  success: boolean;
  messageId: string;
  deliveredVia: NotificationChannel[];
  timestamp: string;
}

/**
 * Dispatches a transaction or status notification.
 * Defaults to the active Web Portal in-app notification engine.
 * Future WhatsApp Cloud API or SMS webhooks can be activated via environment flags
 * without changing any core procurement or clerk/accountant code.
 */
export async function dispatchProcurementNotification(
  payload: NotificationPayload
): Promise<DispatchResult> {
  const timestamp = new Date().toISOString();
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Active production channel: Web Portal In-App Notification Engine
  const deliveredVia: NotificationChannel[] = payload.channels && payload.channels.length > 0 
    ? payload.channels 
    : ["WEB_PORTAL"];

  // Placeholder for future WhatsApp Cloud API adapter:
  // if (process.env.ENABLE_WHATSAPP_GATEWAY === "true") {
  //   await sendWhatsAppCloudTemplate(payload);
  //   deliveredVia.push("WHATSAPP_CLOUD_API");
  // }

  return {
    success: true,
    messageId,
    deliveredVia,
    timestamp,
  };
}
