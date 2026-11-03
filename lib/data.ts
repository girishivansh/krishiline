// Krishi-Line v2 — FINAL data model, built to the cover PDF + updated workflow.
// ONE source of truth: every total, chart, receipt and payment figure is
// derived from the lists below, so screens can never disagree.
// Rate card (per quintal): Grade 1 Premium ₹1,850 · Grade 2 Standard ₹1,700
// Grade 3 Lower ₹1,550. Deductions (cover p.4): Hamali ₹100/quintal
// (= ₹1/kg) + Other ₹200 per completed booking. Net = Gross − Hamali − Other.
// Yield ceiling (cover p.2/p.6): 60 quintals per acre → Ramesh, 2.0 acres,
// is eligible for 120 quintals = 12,000 kg for the season.

export type BookingStatus = "Confirmed" | "Completed" | "In Yard";
export type PaymentStatus = "Paid" | "Processing" | "Estimated" | "On Hold";
export type WarehouseStatus = "Pending" | "Approved" | "Flagged";
export type Grade = "1" | "2" | "3";
export const GRADE_LABEL: Record<Grade, string> = { "1": "Grade 1 (Premium)", "2": "Grade 2 (Standard)", "3": "Grade 3 (Lower)" };
export const GRADE_PRICES: Record<Grade, number> = { "1": 1850, "2": 1700, "3": 1550 };

export interface Booking {
  id: string; batchNo: string; token: string; receiptId: string | null;
  farmer: string; village: string;
  date: string; displayDate: string;
  centre: string; centreShort: string;
  crop: string; quantityKg: number; grade: Grade; pricePerQuintal: number;
  status: BookingStatus; paymentStatus: PaymentStatus; utr: string | null; slot: string;
  trolley?: string; bags?: number;
  warehouseStatus?: WarehouseStatus;
}

export const FARMER = {
  name: "Ramesh Patil", farmerId: "KL-FARMER-001", village: "Kahan", taluka: "Nashik",
  district: "Nashik, Maharashtra", phone: "98XXX-XXX34", phoneEnding: "1234",
  gat: "142/A", verified: true, landAcres: 2.0, eligibleQuintals: 120, yieldCeilingKg: 12000,
};

export const CENTRES = [
  { id: "Nashik-1", name: "Nashik Procurement Center - 1", capacityTonnes: 1000, bookedTonnesToday: 864, slotsBooked: 108, slotCapacity: 120 },
  { id: "Nashik-2", name: "Nashik Procurement Center - 2", capacityTonnes: 1000, bookedTonnesToday: 712, slotsBooked: 84, slotCapacity: 100 },
  { id: "Nashik-3", name: "Nashik Procurement Center - 3", capacityTonnes: 1000, bookedTonnesToday: 655, slotsBooked: 71, slotCapacity: 90 },
  { id: "Kalwan", name: "Kalwan Procurement Center", capacityTonnes: 600, bookedTonnesToday: 402, slotsBooked: 52, slotCapacity: 70 },
  { id: "Dindori", name: "Dindori Procurement Center", capacityTonnes: 600, bookedTonnesToday: 388, slotsBooked: 49, slotCapacity: 70 },
  { id: "Igatpuri", name: "Igatpuri Procurement Center", capacityTonnes: 600, bookedTonnesToday: 351, slotsBooked: 44, slotCapacity: 70 },
];

export const SLOTS = ["08:00 AM - 12:00 PM", "12:00 PM - 04:00 PM", "04:00 PM - 08:00 PM"];
export const DEMO_OTP = "123456";

// Other farmers' batches on 22 Oct 2026 — the shared queue for Clerk /
// Warehouse / Accountant / Collector screens (cover pp. 3–5, 7).
export const DISTRICT_BATCHES: Booking[] = [
  { id: "B-2001", batchNo: "B00125", token: "KLN12350", receiptId: "R-2026-B00125", farmer: "Suresh Jadhav", village: "Kahan", date: "2026-10-22", displayDate: "22 Oct 2026", centre: "Nashik Procurement Center - 1", centreShort: "Nashik - 1", crop: "Onion", quantityKg: 980, grade: "2", pricePerQuintal: 1700, status: "Completed", paymentStatus: "Paid", warehouseStatus: "Approved", utr: "DEMO-UTR-886252", slot: "08:00 AM - 12:00 PM", trolley: "MH-15-TR-7842", bags: 45 },
  { id: "B-2002", batchNo: "B00126", token: "KLN12351", receiptId: "R-2026-B00126", farmer: "Sunil Pawar", village: "Dindori", date: "2026-10-22", displayDate: "22 Oct 2026", centre: "Nashik Procurement Center - 1", centreShort: "Nashik - 1", crop: "Onion", quantityKg: 1100, grade: "1", pricePerQuintal: 1850, status: "Completed", paymentStatus: "Processing", warehouseStatus: "Pending", utr: null, slot: "08:00 AM - 12:00 PM", trolley: "MH-15-TR-7843", bags: 50 },
  { id: "B-2003", batchNo: "B00127", token: "KLN12352", receiptId: "R-2026-B00127", farmer: "Vilas Shinde", village: "Dindori", date: "2026-10-22", displayDate: "22 Oct 2026", centre: "Nashik Procurement Center - 2", centreShort: "Nashik - 2", crop: "Onion", quantityKg: 1020, grade: "3", pricePerQuintal: 1550, status: "Completed", paymentStatus: "On Hold", warehouseStatus: "Flagged", utr: null, slot: "12:00 PM - 04:00 PM", trolley: "MH-15-TR-7844", bags: 46 },
  { id: "B-2004", batchNo: "B00128", token: "KLN12353", receiptId: null, farmer: "Mahesh Kale", village: "Kahan", date: "2026-10-22", displayDate: "22 Oct 2026", centre: "Nashik Procurement Center - 1", centreShort: "Nashik - 1", crop: "Onion", quantityKg: 900, grade: "2", pricePerQuintal: 1700, status: "In Yard", paymentStatus: "Estimated", warehouseStatus: "Pending", utr: null, slot: "12:00 PM - 04:00 PM", trolley: "MH-15-TR-7845", bags: 41 },
];

// Ramesh's season bookings. 8 bookings, 9,540 kg = 95.4 quintals of the
// 120-quintal ceiling (79.5% used). The 22 Oct booking is the cover's
// receipt example: token KLN12345, batch B00124, 1,250 kg, Grade 1.
export const RAMESH_BOOKINGS: Booking[] = [
  { id: "B-1001", batchNo: "B00101", token: "KLN12301", receiptId: "R-2026-B00101", farmer: "Ramesh Patil", village: "Kahan", date: "2026-08-18", displayDate: "18 Aug 2026", centre: "Nashik Procurement Center - 2", centreShort: "Nashik - 2", crop: "Onion", quantityKg: 1240, grade: "3", pricePerQuintal: 1550, status: "Completed", paymentStatus: "Paid", warehouseStatus: "Approved", utr: "DEMO-UTR-884120", slot: "08:00 AM - 12:00 PM" },
  { id: "B-1002", batchNo: "B00102", token: "KLN12302", receiptId: "R-2026-B00102", farmer: "Ramesh Patil", village: "Kahan", date: "2026-08-27", displayDate: "27 Aug 2026", centre: "Nashik Procurement Center - 1", centreShort: "Nashik - 1", crop: "Onion", quantityKg: 1220, grade: "2", pricePerQuintal: 1700, status: "Completed", paymentStatus: "Paid", warehouseStatus: "Approved", utr: "DEMO-UTR-884291", slot: "08:00 AM - 12:00 PM" },
  { id: "B-1003", batchNo: "B00103", token: "KLN12303", receiptId: "R-2026-B00103", farmer: "Ramesh Patil", village: "Kahan", date: "2026-09-12", displayDate: "12 Sep 2026", centre: "Nashik Procurement Center - 1", centreShort: "Nashik - 1", crop: "Onion", quantityKg: 1320, grade: "1", pricePerQuintal: 1850, status: "Completed", paymentStatus: "Paid", warehouseStatus: "Approved", utr: "DEMO-UTR-885013", slot: "08:00 AM - 12:00 PM" },
  { id: "B-1004", batchNo: "B00104", token: "KLN12304", receiptId: "R-2026-B00104", farmer: "Ramesh Patil", village: "Kahan", date: "2026-09-20", displayDate: "20 Sep 2026", centre: "Nashik Procurement Center - 3", centreShort: "Nashik - 3", crop: "Onion", quantityKg: 1100, grade: "3", pricePerQuintal: 1550, status: "Completed", paymentStatus: "Paid", warehouseStatus: "Approved", utr: "DEMO-UTR-885104", slot: "12:00 PM - 04:00 PM" },
  { id: "B-1005", batchNo: "B00105", token: "KLN12305", receiptId: "R-2026-B00105", farmer: "Ramesh Patil", village: "Kahan", date: "2026-10-05", displayDate: "05 Oct 2026", centre: "Nashik Procurement Center - 1", centreShort: "Nashik - 1", crop: "Onion", quantityKg: 1430, grade: "1", pricePerQuintal: 1850, status: "Completed", paymentStatus: "Paid", warehouseStatus: "Approved", utr: "DEMO-UTR-886207", slot: "08:00 AM - 12:00 PM" },
  { id: "B-1006", batchNo: "B00106", token: "KLN12306", receiptId: "R-2026-B00106", farmer: "Ramesh Patil", village: "Kahan", date: "2026-10-14", displayDate: "14 Oct 2026", centre: "Nashik Procurement Center - 2", centreShort: "Nashik - 2", crop: "Onion", quantityKg: 980, grade: "2", pricePerQuintal: 1700, status: "Completed", paymentStatus: "Processing", warehouseStatus: "Pending", utr: null, slot: "08:00 AM - 12:00 PM" },
  { id: "B-1007", batchNo: "B00124", token: "KLN12345", receiptId: "R-2026-B00124", farmer: "Ramesh Patil", village: "Kahan", date: "2026-10-22", displayDate: "22 Oct 2026", centre: "Nashik Procurement Center - 1", centreShort: "Nashik - 1", crop: "Onion", quantityKg: 1250, grade: "1", pricePerQuintal: 1850, status: "Completed", paymentStatus: "Paid", warehouseStatus: "Approved", utr: "DEMO-UTR-886241", slot: "08:00 AM - 12:00 PM", trolley: "MH-15-TR-7841", bags: 57 },
  { id: "B-1008", batchNo: "B00129", token: "KLN12360", receiptId: null, farmer: "Ramesh Patil", village: "Kahan", date: "2026-11-09", displayDate: "09 Nov 2026", centre: "Nashik Procurement Center - 1", centreShort: "Nashik - 1", crop: "Onion", quantityKg: 1000, grade: "1", pricePerQuintal: 1850, status: "Confirmed", paymentStatus: "Estimated", warehouseStatus: "Pending", utr: null, slot: "08:00 AM - 12:00 PM" },
];

// Unified Seed Bookings combining Ramesh's history and the district 22 Oct queue
export const SEED_BOOKINGS: Booking[] = [
  ...RAMESH_BOOKINGS,
  ...DISTRICT_BATCHES,
];

export const grossFor = (b: { quantityKg: number; pricePerQuintal: number }) => Math.round((b.quantityKg / 100) * b.pricePerQuintal);
export const hamaliFor = (b: { quantityKg: number }) => b.quantityKg; // ₹100/quintal = ₹1/kg
export const otherFor = () => 200;
export const netFor = (b: { quantityKg: number; pricePerQuintal: number }) => grossFor(b) - hamaliFor(b) - otherFor();
export const amountFor = grossFor; // backwards-compatible alias: receipts show gross, payments show net
export const totalKg = (list: { quantityKg: number }[]) => list.reduce((s, b) => s + b.quantityKg, 0);
export const totalGross = (list: { quantityKg: number; pricePerQuintal: number }[]) => list.reduce((s, b) => s + grossFor(b), 0);
export const totalNet = (list: { quantityKg: number; pricePerQuintal: number }[]) => list.reduce((s, b) => s + netFor(b), 0);
export const totalAmount = totalGross;

export interface LandParcel { survey: string; village: string; areaAcres: number; crop: string; owner: string; status: "Verified" | "Pending"; }
export const LAND_PARCELS: LandParcel[] = [
  { survey: "142/A", village: "Kahan", areaAcres: 2.0, crop: "Onion", owner: "Ramesh Patil", status: "Verified" },
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const kgFmt = (n: number) => n.toLocaleString("en-IN") + " kg";
export const qtlFmt = (kg: number) => (kg / 100).toLocaleString("en-IN") + " quintals";

// ---- FPO (cover p.6) ----
export interface FpoMember { name: string; village: string; acres: number; eligibleQuintals: number; status: "Verified" | "Pending"; }
export const FPO_MEMBERS: FpoMember[] = [
  { name: "Ramesh Patil", village: "Kahan", acres: 2.0, eligibleQuintals: 120, status: "Verified" },
  { name: "Suresh Jadhav", village: "Kahan", acres: 1.5, eligibleQuintals: 90, status: "Verified" },
  { name: "Sunil Pawar", village: "Dindori", acres: 3.0, eligibleQuintals: 180, status: "Pending" },
  { name: "Vilas Shinde", village: "Dindori", acres: 1.0, eligibleQuintals: 60, status: "Verified" },
];
export const FPO_GROUP_BOOKINGS = [
  { date: "22 Oct 2026", slot: "08:00 AM - 12:00 PM", farmers: 3, qtyQuintals: 390, centre: "Nashik - 1", status: "In Progress" },
  { date: "25 Oct 2026", slot: "12:00 PM - 04:00 PM", farmers: 5, qtyQuintals: 520, centre: "Nashik - 1", status: "Confirmed" },
  { date: "28 Oct 2026", slot: "08:00 AM - 12:00 PM", farmers: 4, qtyQuintals: 430, centre: "Nashik - 1", status: "Completed" },
];

// ---- Collector district view (cover p.5) ----
// District demo totals are illustrative district scope, separate from
// Ramesh's personal bookings. The 5 centres shown total 17,050 quintals;
// the other 7 centres make up the remaining 7,510 quintals = 24,560 total.
export const DISTRICT = { centres: 12, quintalsProcured: 24560, farmers: 8240, grade1Pct: 32, grade2Pct: 48, grade3Pct: 20 };
export const CENTRE_COMPARISON = [
  { centre: "Nashik-1", qtyQuintals: 4520, grade1Pct: 28, status: "Normal" },
  { centre: "Nashik-2", qtyQuintals: 3890, grade1Pct: 72, status: "High Risk" },
  { centre: "Kalwan", qtyQuintals: 2980, grade1Pct: 31, status: "Normal" },
  { centre: "Dindori", qtyQuintals: 3250, grade1Pct: 26, status: "Normal" },
  { centre: "Igatpuri", qtyQuintals: 2410, grade1Pct: 68, status: "Watch" },
];
export const SUSPICIOUS = [
  { batchNo: "B00124", farmer: "Ramesh Patil", issue: "Abnormal Grade-1", risk: "High Risk" },
  { batchNo: "B00156", farmer: "Suresh Jadhav", issue: "Qty exceeds land limit", risk: "High Risk" },
  { batchNo: "B00178", farmer: "Vilas Shinde", issue: "Mismatch pattern", risk: "High Risk" },
];
export const INVESTIGATIONS = [
  { centre: "Nashik-2", issue: "High Grade-1", status: "In Progress" },
  { centre: "Kalwan", issue: "Fake Entries", status: "Resolved" },
  { centre: "Dindori", issue: "Land Limit Exceeded", status: "In Progress" },
  { centre: "Nashik-3", issue: "Weight Mismatch", status: "Resolved" },
  { centre: "Nashik-1", issue: "Abnormal Grade-1", status: "In Progress" },
  { centre: "Igatpuri", issue: "Qty exceeds land limit", status: "New" },
];

// ---- Mock database (workflow Step 1B) ----
export const MOCK_DB = {
  farmers: [
    { farmerId: "KL-FARMER-001", name: "Ramesh Patil", village: "Kahan", phoneEnding: "1234" },
    { farmerId: "KL-FARMER-002", name: "Suresh Jadhav", village: "Kahan", phoneEnding: "5678" },
    { farmerId: "KL-FARMER-003", name: "Sunil Pawar", village: "Dindori", phoneEnding: "9012" },
    { farmerId: "KL-FARMER-004", name: "Vilas Shinde", village: "Dindori", phoneEnding: "3456" },
  ],
  land: [
    { farmerId: "KL-FARMER-001", village: "Kahan", gat: "142/A", acres: 2.0, holder: "Ramesh Patil" },
    { farmerId: "KL-FARMER-002", village: "Kahan", gat: "87/B", acres: 1.5, holder: "Suresh Jadhav" },
    { farmerId: "KL-FARMER-003", village: "Dindori", gat: "203/C", acres: 3.0, holder: "Sunil Pawar" },
    { farmerId: "KL-FARMER-004", village: "Dindori", gat: "61/D", acres: 1.0, holder: "Vilas Shinde" },
  ],
  crops: [
    { farmerId: "KL-FARMER-001", village: "Kahan", gat: "142/A", season: "Rabi 2026", crop: "Onion" },
    { farmerId: "KL-FARMER-002", village: "Kahan", gat: "87/B", season: "Rabi 2026", crop: "Onion" },
    { farmerId: "KL-FARMER-003", village: "Dindori", gat: "203/C", season: "Rabi 2026", crop: "Onion" },
    { farmerId: "KL-FARMER-004", village: "Dindori", gat: "61/D", season: "Rabi 2026", crop: "Onion" },
  ],
};
