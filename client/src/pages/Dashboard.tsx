import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import CafeCard from "../components/CafeCard.tsx";
import AuthModal from "../components/AuthModal.tsx";
import {
    CalendarIcon,
    UsersIcon,
    ClockIcon,
    MapPinIcon,
    CalendarDaysIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import * as api from "../lib/api";
import { adaptCafe } from "../lib/adapters";
import type { DisplayCafe } from "../lib/adapters";
import type { BookingRow } from "../lib/types";
import { errorMessage } from "../lib/types";

export default function Dashboard() {
    const { user } = useAppContext();

    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [recommendations, setRecommendations] = useState<DisplayCafe[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoadingBookings(true);

                const [reservations, tables, cafes] = await Promise.all([
                    api.getReservations(),
                    api.getTables(),
                    api.getCafes(),
                ]);

                const tableById = new Map(tables.map((t) => [t.id, t]));
                const cafeById = new Map(cafes.map((c) => [c.id, c]));

                const mapped = reservations.map((reservation) => {
                    const table = tableById.get(reservation.table_id);
                    const cafe = table ? cafeById.get(table.cafe_id) : undefined;
                    const dt = new Date(reservation.reservation_time);

                    return {
                        _id: String(reservation.id),
                        date: dt.toISOString().slice(0, 10),
                        time: dt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                        guests: reservation.party_size,
                        status: reservation.status,
                        cafe: cafe
                            ? adaptCafe(cafe)
                            : { name: "Café", cuisine: "", location: "", image: "", slug: "" },
                    };
                });

                setBookings(mapped);
            } catch {
                toast.error("Couldn't load your reservations.");
            } finally {
                setLoadingBookings(false);
            }
        };

        if (user) {
            void fetchBookings();
        }
    }, [user]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const cafes = await api.getCafes();
                setRecommendations(cafes.map(adaptCafe));
            } catch {
                setRecommendations([]);
            }
        };

        void fetchRecommendations();
    }, []);

    const handleCancelBooking = async (bookingId: string) => {
        if (
            !window.confirm(
                "Are you sure you want to cancel this café reservation?"
            )
        ) {
            return;
        }

        try {
            await api.cancelReservation(Number(bookingId));

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status: "cancelled" }
                        : booking
                )
            );

            toast.success("Café reservation cancelled successfully.");
        } catch (error: unknown) {
            toast.error(
                errorMessage(error, "Unable to cancel café reservation.")
            );
        }
    };

    if (!user) {
        return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);

        return (
            bookingDate >= today && booking.status === "confirmed"
        );
    });

    const pastBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);

        return (
            bookingDate < today || booking.status !== "confirmed"
        );
    });

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />
            <AuthModal />

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
                <div className="grow space-y-10">
                    {}
                    <div className="pb-4 border-b border-outline-variant/10">
                        <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary">
                            Welcome back, {user.name.split(" ")[0]}
                        </h2>

                        <p className="text-xs text-on-surface/55 mt-1.5">
                            Manage your upcoming café reservations and coffee
                            experiences.
                        </p>
                    </div>

                    <div className="space-y-10">
                        {}
                        <div className="space-y-4">
                            <h3 className="font-display text-lg font-medium text-primary">
                                Upcoming Café Reservations
                            </h3>

                            {loadingBookings ? (
                                <div className="bg-surface-container-lowest border border-outline-variant/10 p-12 text-center flex justify-center">
                                    <div className="w-6 h-6 border-2 border-outline-variant/30 border-t-secondary rounded-full animate-spin" />
                                </div>
                            ) : upcomingBookings.length === 0 ? (
                                <div className="bg-surface-container-lowest border border-outline-variant/10 p-12 text-center rounded-md">
                                    <CalendarDaysIcon
                                        size={36}
                                        className="mx-auto text-outline-variant mb-2"
                                    />

                                    <p className="text-xs text-on-surface/55 italic">
                                        No upcoming café reservations
                                        scheduled.
                                    </p>

                                    <Link
                                        to="/search"
                                        className="inline-block mt-4 bg-primary hover:bg-secondary text-on-primary text-[10px] font-medium tracking-widest uppercase px-6 py-2.5 transition-colors"
                                    >
                                        Find a Café
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingBookings.map((booking) => (
                                        <div
                                            key={booking._id}
                                            className="bg-surface-container-lowest border border-outline-variant/20 rounded-md p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0 bg-surface">
                                                    <img loading="lazy" decoding="async"
                                                        src={
                                                            booking.cafe
                                                                ?.image
                                                        }
                                                        alt={`${booking.cafe?.name || "Café"} image`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-medium text-secondary tracking-widest uppercase">
                                                        {
                                                            booking.cafe
                                                                ?.cuisine
                                                        }
                                                    </span>

                                                    <h4 className="font-display text-base font-medium text-primary">
                                                        {
                                                            booking.cafe
                                                                ?.name
                                                        }
                                                    </h4>

                                                    <p className="text-xs text-on-surface/55 flex items-center gap-1">
                                                        <MapPinIcon size={12} />
                                                        {
                                                            booking.cafe
                                                                ?.location
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-6 text-xs text-on-surface bg-surface-container-low p-4 rounded-md border border-outline-variant/10 w-full md:w-auto">
                                                <div className="flex items-center gap-2 pr-4 md:border-r border-outline-variant/20">
                                                    <CalendarIcon
                                                        size={14}
                                                        className="text-secondary"
                                                    />

                                                    <span className="font-medium">
                                                        {new Date(
                                                            booking.date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 pr-4 md:border-r border-outline-variant/20">
                                                    <ClockIcon
                                                        size={14}
                                                        className="text-secondary"
                                                    />

                                                    <span className="font-medium">
                                                        {booking.time}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <UsersIcon
                                                        size={14}
                                                        className="text-secondary"
                                                    />

                                                    <span className="font-medium">
                                                        {booking.guests}{" "}
                                                        {booking.guests === 1
                                                            ? "Guest"
                                                            : "Guests"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 w-full md:w-auto justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCancelBooking(
                                                            booking._id
                                                        )
                                                    }
                                                    className="px-5 py-2.5 text-[10px] font-medium tracking-widest uppercase text-error hover:bg-error-container/20 border border-outline-variant/40 rounded-sm cursor-pointer transition-colors"
                                                >
                                                    Cancel Reservation
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {}
                        <div className="space-y-4">
                            {!loadingBookings &&
                                pastBookings.length !== 0 && (
                                    <>
                                        <h3 className="font-display text-lg font-medium text-primary">
                                            Café Reservation History
                                        </h3>

                                        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-md overflow-hidden shadow-sm">
                                            <table className="w-full text-left text-xs border-collapse">
                                                <thead>
                                                    <tr className="bg-surface-container-low border-b border-outline-variant/10 text-[10px] font-medium tracking-wider text-on-surface/55 uppercase">
                                                        <th className="p-4">
                                                            Café
                                                        </th>
                                                        <th className="p-4">
                                                            Date & Time
                                                        </th>
                                                        <th className="p-4">
                                                            Guests
                                                        </th>
                                                        <th className="p-4">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="divide-y divide-outline-variant/10">
                                                    {pastBookings.map(
                                                        (booking) => (
                                                            <tr
                                                                key={booking._id}
                                                                className="hover:bg-surface/50"
                                                            >
                                                                <td className="p-4 font-medium text-primary">
                                                                    <Link
                                                                        to={`/cafe/${booking.cafe?.slug}`}
                                                                        className="hover:text-secondary"
                                                                    >
                                                                        {
                                                                            booking
                                                                                .cafe
                                                                                ?.name
                                                                        }
                                                                    </Link>
                                                                </td>

                                                                <td className="p-4">
                                                                    {new Date(
                                                                        booking.date
                                                                    ).toLocaleDateString()}{" "}
                                                                    at{" "}
                                                                    {
                                                                        booking.time
                                                                    }
                                                                </td>

                                                                <td className="p-4">
                                                                    {
                                                                        booking.guests
                                                                    }{" "}
                                                                    {booking.guests ===
                                                                    1
                                                                        ? "Guest"
                                                                        : "Guests"}
                                                                </td>

                                                                <td className="p-4">
                                                                    <span
                                                                        className={`inline-block py-0.5 px-2 text-[9px] font-medium tracking-wider uppercase rounded-sm ${
                                                                            booking.status ===
                                                                            "confirmed"
                                                                                ? "bg-secondary-container/30 text-on-secondary-container"
                                                                                : booking.status ===
                                                                                    "completed"
                                                                                  ? "bg-green-100 text-green-800"
                                                                                  : "bg-error-container text-on-error-container"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            booking.status
                                                                        }
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>

                    {}
                    {recommendations.length > 0 && (
                        <div className="space-y-4 pt-10 border-t border-outline-variant/10">
                            <h3 className="font-display text-lg font-medium text-primary">
                                Recommended Cafés for You
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recommendations
                                    .slice(0, 3)
                                    .map((cafe) => (
                                        <CafeCard
                                            key={cafe._id}
                                            cafe={cafe}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
