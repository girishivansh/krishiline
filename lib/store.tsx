"use client";
import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { SEED_BOOKINGS, type Booking } from "./data";

const KEY = "krishi-line-v2";

interface Store {
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  resetDemo: () => void;
}

const Ctx = createContext<Store>({
  bookings: SEED_BOOKINGS,
  addBooking: () => {},
  updateBooking: () => {},
  resetDemo: () => {},
});

function isValidBooking(item: unknown): item is Booking {
  if (!item || typeof item !== "object") return false;
  const b = item as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.batchNo === "string" &&
    typeof b.token === "string" &&
    typeof b.farmer === "string" &&
    typeof b.quantityKg === "number" &&
    !isNaN(b.quantityKg) &&
    typeof b.pricePerQuintal === "number"
  );
}

let cachedBookings: Booking[] | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function loadFromStorage(): Booking[] {
  if (typeof window === "undefined") return SEED_BOOKINGS;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isValidBooking)) {
        return parsed;
      }
    }
  } catch {
    // fallback on error
  }
  return SEED_BOOKINGS;
}

function getSnapshot(): Booking[] {
  if (cachedBookings === null) {
    cachedBookings = loadFromStorage();
  }
  return cachedBookings;
}

function getServerSnapshot(): Booking[] {
  return SEED_BOOKINGS;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cachedBookings = loadFromStorage();
      listener();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const bookings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<Store>(() => ({
    bookings,
    addBooking: (b) => {
      const next = [b, ...getSnapshot()];
      cachedBookings = next;
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      emitChange();
    },
    updateBooking: (id, patch) => {
      const next = getSnapshot().map((b) => (b.id === id ? { ...b, ...patch } : b));
      cachedBookings = next;
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      emitChange();
    },
    resetDemo: () => {
      cachedBookings = SEED_BOOKINGS;
      try {
        localStorage.setItem(KEY, JSON.stringify(SEED_BOOKINGS));
      } catch {
        // ignore storage errors
      }
      emitChange();
    },
  }), [bookings]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
