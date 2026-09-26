import { Calendar, Coffee, Clock, MapPin, Users } from "lucide-react";
import type { DisplayCafe } from "../../lib/adapters";

interface BookingSummaryProps {
    cafe: DisplayCafe | null;
    date: string;
    slot: string;
    guests: string;
}

export default function BookingSummary({
    cafe,
    date,
    slot,
    guests,
}: BookingSummaryProps) {
    if (!cafe) {
        return null;
    }

    return (
        <div className="space-y-6 rounded-md border border-outline-variant/20 bg-surface-container-lowest p-6 text-left shadow-sm">
            <h3 className="flex items-center gap-2 border-b border-outline-variant/10 pb-3 font-display text-lg text-primary">
                <Coffee size={18} className="text-secondary" />
                Café Reservation Summary
            </h3>

            {}
            <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-surface">
                    <img loading="lazy" decoding="async"
                        src={cafe.image}
                        alt={`${cafe.name} café`}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-secondary">
                        {cafe.cuisine || "Specialty Coffee"}
                    </span>

                    <h4 className="font-display text-base font-medium leading-tight text-primary">
                        {cafe.name}
                    </h4>

                    <p className="flex items-center gap-1 text-xs text-on-surface/55">
                        <MapPin size={12} />
                        {cafe.location ||
                            cafe.address ||
                            "Café location unavailable"}
                    </p>
                </div>
            </div>

            {}
            <div className="space-y-3 border-b border-t border-outline-variant/10 py-5 text-xs text-on-surface">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-on-surface/55">
                        <Calendar size={14} />
                        Café Date
                    </span>

                    <span>
                        {date
                            ? new Date(date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                              })
                            : "Date unavailable"}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-on-surface/55">
                        <Clock size={14} />
                        Coffee Time
                    </span>

                    <span>{slot || "Time unavailable"}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-on-surface/55">
                        <Users size={14} />
                        Party Size
                    </span>

                    <span>
                        {guests} {Number(guests) === 1 ? "Guest" : "Guests"}
                    </span>
                </div>
            </div>

            {}
            <div className="space-y-2">
                <h5 className="text-[10px] font-medium uppercase tracking-wider text-primary">
                    CAFÉ RESERVATION POLICY
                </h5>

                <p className="text-xs leading-relaxed text-on-surface/55">
                    We hold café reservations for a maximum of 15 minutes.
                    Cancellations or changes can be made free of charge up to
                    24 hours in advance.
                </p>
            </div>
        </div>
    );
}
