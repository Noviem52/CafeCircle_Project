import type { DisplayCafe } from "./adapters";

export interface BookingGuest {
    name: string;
    email: string;
}

export interface BookingCafeSummary {
    name?: string;
    slug?: string;
    image?: string;
    cuisine?: string;
    location?: string;
}

export interface BookingRow {
    _id: string;
    bookingId?: string;
    user?: BookingGuest;
    cafe?: BookingCafeSummary;
    date: string;
    time: string;
    guests: number;
    status: string;
    specialRequests?: string;
}

export interface ConfirmedBooking {
    id: number;
    bookingId?: string;
    name: string;
    email: string;
    phone: string;
    occasion: string;
    specialRequests: string;
    guests: number;
    date: string;
    time: string;
    cafeName?: string;
    status: string;
}

export interface SlotAvailability {
    time: string;
    availableSeats: number;
    isAvailable: boolean;
}

export interface AdminCafeRow {
    _id: string;
    slug: string;
    name: string;
    description?: string | null;
    cuisine?: string | null;
    address: string;
    location: string;
    status: string;
    totalSeats: number;
    owner?: { name: string; email: string };
}

export interface AdminStatsData {
    users: { totalUsers: number; totalOwners: number };
    cafes: { total: number };
    bookings: { total: number };
    latestBookings: BookingRow[];
}

export type { DisplayCafe };

export function errorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
}
