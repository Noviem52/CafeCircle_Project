import { Link } from "react-router-dom";
import { Calendar, Users, Clock, MapPin, Check, Coffee } from "lucide-react";
import type { DisplayCafe } from "../../lib/adapters";
import type { ConfirmedBooking } from "../../lib/types";

interface BookingSuccessProps {
    confirmedBooking: ConfirmedBooking | null;
    cafe: DisplayCafe | null;
    date: string;
    slot: string;
    guests: string;
}

export default function BookingSuccess({
    confirmedBooking,
    cafe,
    date,
    slot,
    guests,
}: BookingSuccessProps) {
    if (!confirmedBooking || !cafe) {
        return null;
    }

    return (
        <div className="max-w-xl w-full bg-surface-container-lowest border border-outline-variant/20 p-10 text-center rounded-lg ambient-shadow space-y-8 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-secondary/15 rounded-full flex items-center justify-center text-secondary mx-auto">
                <Check size={32} />
            </div>

            <div className="space-y-3">
                <Coffee
                    size={24}
                    className="mx-auto text-secondary"
                />

                <h2 className="font-display text-3xl font-medium text-primary">
                    Café Reservation Confirmed
                </h2>

                <p className="text-xs text-on-surface/55 max-w-sm mx-auto leading-relaxed">
                    Your coffee experience has been successfully reserved at{" "}
                    <span className="text-primary font-medium">
                        {cafe.name}
                    </span>
                    .
                </p>
            </div>

            {}
            <div className="bg-surface-container-low p-6 rounded-md space-y-4 text-left border border-outline-variant/10">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant/10">
                    <span className="text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                        RESERVATION CODE
                    </span>

                    <span className="text-sm font-medium text-secondary">
                        {confirmedBooking.bookingId}
                    </span>
                </div>

                <div className="space-y-3 text-xs text-on-surface">
                    <div className="flex items-center gap-3">
                        <Calendar
                            size={14}
                            className="text-on-surface/55"
                        />

                        <span>
                            {new Date(date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Clock
                            size={14}
                            className="text-on-surface/55"
                        />

                        <span>{slot}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Users
                            size={14}
                            className="text-on-surface/55"
                        />

                        <span>
                            {guests}{" "}
                            {Number(guests) === 1 ? "Guest" : "Guests"}
                        </span>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin
                            size={14}
                            className="text-on-surface/55 mt-0.5"
                        />

                        <span>
                            {cafe.address ||
                                cafe.location ||
                                "Café address unavailable"}
                        </span>
                    </div>
                </div>
            </div>

            {}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                    to="/dashboard"
                    className="flex-1 bg-primary hover:bg-primary-container text-on-primary py-3.5 px-4 text-xs font-medium tracking-widest uppercase hover:text-secondary text-center cursor-pointer transition-colors"
                >
                    MY CAFÉ RESERVATIONS
                </Link>

                <Link
                    to="/search"
                    className="flex-1 border border-outline-variant/50 hover:border-primary text-primary py-3.5 px-4 text-xs font-medium tracking-widest uppercase text-center cursor-pointer transition-colors"
                >
                    DISCOVER MORE CAFÉS
                </Link>
            </div>
        </div>
    );
}
