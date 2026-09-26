import { resolveImageUrl } from "./api";
import type { Cafe, Review } from "./api";

const PLACEHOLDER_IMAGES = [
    "/cafe_1.jpg",
    "/cafe_2.jpg",
    "/cafe_3.jpg",
    "/cafe_4.jpg",
    "/cafe_5.jpg",
    "/cafe_6.jpg",
    "/cafe_7.jpg",
    "/cafe_8.jpg",
    "/cafe_9.jpg",
];

function placeholderImage(id: number): string {
    return PLACEHOLDER_IMAGES[id % PLACEHOLDER_IMAGES.length];
}

export function formatTime(value: string | null | undefined): string {
    if (!value) return "";
    const [hourStr, minuteStr] = value.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

export function formatHours(cafe: Pick<Cafe, "opening_time" | "closing_time">): string {
    return `${formatTime(cafe.opening_time)} - ${formatTime(cafe.closing_time)}`;
}

export function generateSlots(
    cafe: Pick<Cafe, "opening_time" | "closing_time">,
    stepMinutes = 30,
    slotLengthMinutes = 90
): string[] {
    const [openH, openM] = cafe.opening_time.split(":").map(Number);
    const [closeH, closeM] = cafe.closing_time.split(":").map(Number);

    let cursor = openH * 60 + openM;
    let closeMinutes = closeH * 60 + closeM;
    if (closeMinutes <= cursor) {
        closeMinutes += 24 * 60;
    }

    const slots: string[] = [];
    while (cursor + slotLengthMinutes <= closeMinutes) {
        const h = Math.floor(cursor / 60) % 24;
        const m = cursor % 60;
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
        cursor += stepMinutes;
    }
    return slots;
}

/**
 * Build an ISO timestamp that keeps the time the guest actually picked and
 * appends the browser's UTC offset, e.g. "2026-03-04T19:00:00+08:00".
 *
 * Date.toISOString() would rewrite 19:00 in Kuala Lumpur as 11:00 UTC, and the
 * API checks reservations against the cafe's local opening hours, so an in-hours
 * booking came back as "Cafe is closed at that time".
 */
export function toLocalIsoString(date: string, time: string): string {
    const pad = (value: number) => String(value).padStart(2, "0");
    const offsetMinutes = -new Date(`${date}T${time}:00`).getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const absolute = Math.abs(offsetMinutes);
    const offset = `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
    return `${date}T${time}:00${offset}`;
}

export interface DisplayCafe {
    id: number;
    ownerId: number | null;
    _id: string;
    name: string;
    slug: string;
    cuisine: string;
    priceRange: string;
    location: string;
    address: string;
    phone: string | null;
    description: string;
    image: string;
    opening_time: string;
    closing_time: string;
    hoursLabel: string;
    availableSlots: string[];
    status: Cafe["status"];
    rating: number;
    reviewCount: number;
    featured: boolean;
    exclusive: boolean;
    chef?: string;
    tags?: string[];
    totalSeats?: number;
}

export function adaptCafe(cafe: Cafe): DisplayCafe {
    return {
        id: cafe.id,
        ownerId: cafe.owner_id,
        _id: String(cafe.id),
        name: cafe.name,
        slug: cafe.slug,
        cuisine: cafe.cuisine || "Café",
        priceRange: cafe.price_range || "$$",
        location: cafe.address,
        address: cafe.address,
        phone: cafe.phone,
        description: cafe.description || "",
        image: resolveImageUrl(cafe.image_url) || placeholderImage(cafe.id),
        opening_time: cafe.opening_time,
        closing_time: cafe.closing_time,
        hoursLabel: formatHours(cafe),
        availableSlots: generateSlots(cafe),
        status: cafe.status,
        rating: 0,
        reviewCount: 0,
        featured: false,
        exclusive: false,
    };
}

export interface DisplayReview {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    visitedDate: string;
}

export function adaptReview(review: Review): DisplayReview {
    return {
        _id: String(review.id),
        userName: review.user_name || "Café Circle Guest",
        rating: review.rating,
        comment: review.comment || "",
        visitedDate: review.created_at,
    };
}

export function averageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
}
