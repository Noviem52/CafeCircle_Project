import React from "react";
import { Calendar, Users, Clock } from "lucide-react";
import toast from "react-hot-toast";
import * as api from "../../lib/api";
import type { BookingRow } from "../../lib/types";
import { errorMessage } from "../../lib/types";

interface OwnerBookingsProps {
    bookings: BookingRow[];
    setBookings: React.Dispatch<React.SetStateAction<BookingRow[]>>;
    totalSeats: number;
}

export default function OwnerBookings({
    bookings,
    setBookings,
    totalSeats,
}: OwnerBookingsProps) {
    const handleUpdateBookingStatus = async (
        bookingId: string,
        newStatus: "completed" | "cancelled"
    ) => {
        try {
            await api.updateReservationStatus(Number(bookingId), newStatus);

            setBookings((prev) =>
                prev.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status: newStatus }
                        : booking
                )
            );

            toast.success(`Café reservation updated to ${newStatus}`);
        } catch (error: unknown) {
            toast.error(
                errorMessage(error, "Unable to update reservation status")
            );
        }
    };

    return (
        <div className="space-y-6 text-left">
            <div className="flex justify-between items-center">
                <h3 className="font-display text-lg font-medium text-primary">
                    Café Reservations
                </h3>

                <span className="text-xs text-on-surface/55">
                    Café capacity: {totalSeats} seats
                </span>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant/10 p-12 text-center rounded-md">
                    <Calendar
                        size={32}
                        className="mx-auto text-outline-variant mb-2"
                    />

                    <p className="text-xs text-on-surface/55 italic">
                        No café reservations found.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-surface-container-lowest border border-outline-variant/20 rounded-md p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                        >
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-display text-base font-medium text-primary">
                                        {booking.user?.name}
                                    </h4>

                                    <span className="text-[9px] text-on-surface/50 border border-outline-variant/30 px-1.5 py-0.5">
                                        {booking.bookingId}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface/55">
                                    <span className="flex items-center gap-1">
                                        <Users size={12} />
                                        {booking.guests}{" "}
                                        {booking.guests === 1
                                            ? "Guest"
                                            : "Guests"}
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {booking.time}
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(
                                            booking.date
                                        ).toLocaleDateString()}
                                    </span>
                                </div>

                                {booking.specialRequests && (
                                    <p className="text-xs text-secondary/80 bg-secondary/5 px-3 py-1.5 rounded-sm border-l-2 border-secondary mt-2">
                                        <strong>Café requests:</strong>{" "}
                                        {booking.specialRequests}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                                <span
                                    className={`text-[9px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-sm ${
                                        booking.status === "confirmed"
                                            ? "bg-blue-100 text-blue-800"
                                            : booking.status === "completed"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-error-container text-on-error-container"
                                    }`}
                                >
                                    {booking.status}
                                </span>

                                {booking.status === "confirmed" && (
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleUpdateBookingStatus(
                                                    booking._id,
                                                    "completed"
                                                )
                                            }
                                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[9px] font-medium tracking-wider uppercase transition-colors rounded-sm cursor-pointer"
                                        >
                                            Mark Completed
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleUpdateBookingStatus(
                                                    booking._id,
                                                    "cancelled"
                                                )
                                            }
                                            className="px-3 py-1.5 bg-error hover:bg-error/85 text-white text-[9px] font-medium tracking-wider uppercase transition-colors rounded-sm cursor-pointer"
                                        >
                                            Cancel Reservation
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
