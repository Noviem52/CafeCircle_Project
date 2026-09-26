import { Calendar, Coffee, ShieldCheck, Users } from "lucide-react";
import type { AdminStatsData, BookingRow } from "../../lib/types";

interface AdminStatsProps {
    stats: AdminStatsData;
}

export default function AdminStats({ stats }: AdminStatsProps) {
    if (!stats) {
        return null;
    }

    const kpiCards = [
        {
            title: "Café Members",
            value: stats.users?.totalUsers ?? 0,
            icon: Users,
        },
        {
            title: "Café Owners",
            value: stats.users?.totalOwners ?? 0,
            icon: ShieldCheck,
        },
        {
            title: "Total Cafés",
            value: stats.cafes?.total ?? 0,
            icon: Coffee,
        },
        {
            title: "Reservations",
            value: stats.bookings?.total ?? 0,
            icon: Calendar,
        },
    ];

    return (
        <div className="space-y-8 text-left">
            {}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {kpiCards.map(({ title, value, icon: Icon }) => (
                    <div
                        key={title}
                        className="space-y-2 rounded-md border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm"
                    >
                        <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                            <Icon size={12} className="text-secondary" />
                            {title}
                        </span>

                        <h4 className="font-display text-2xl font-medium text-primary">
                            {value}
                        </h4>
                    </div>
                ))}
            </div>

            {}
            <div className="space-y-4">
                <h3 className="font-display text-lg font-medium text-primary">
                    Recent Café Reservation Activity
                </h3>

                {!stats.latestBookings?.length ? (
                    <p className="text-xs italic text-on-surface/40">
                        No café reservations have been recorded on the
                        platform.
                    </p>
                ) : (
                    <div className="overflow-hidden rounded-md border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant/10 bg-surface-container-low text-[10px] uppercase tracking-wider text-on-surface/55">
                                    {[
                                        "Reference",
                                        "Member",
                                        "Café",
                                        "Reservation Details",
                                        "Status",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            className={`p-4 ${
                                                header === "Status"
                                                    ? "text-right"
                                                    : ""
                                            }`}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-outline-variant/10">
                                {stats.latestBookings.map((booking: BookingRow) => (
                                    <tr
                                        key={booking._id}
                                        className="hover:bg-surface/50"
                                    >
                                        <td className="p-4 text-primary">
                                            {booking.bookingId ||
                                                booking._id}
                                        </td>

                                        <td className="p-4">
                                            <div className="text-primary">
                                                {booking.user?.name ||
                                                    "Unknown Member"}
                                            </div>

                                            <div className="text-[10px] text-on-surface/50">
                                                {booking.user?.email || "—"}
                                            </div>
                                        </td>

                                        <td className="p-4 text-primary">
                                            {booking.cafe?.name ||
                                                "Deleted Café"}
                                        </td>

                                        <td className="p-4 text-on-surface/55">
                                            {booking.date
                                                ? new Date(
                                                      booking.date
                                                  ).toLocaleDateString()
                                                : "Date unavailable"}{" "}
                                            at {booking.time || "Time unavailable"}{" "}
                                            • {booking.guests || 0}{" "}
                                            {booking.guests === 1
                                                ? "Guest"
                                                : "Guests"}
                                        </td>

                                        <td className="p-4 text-right">
                                            <span
                                                className={`inline-block rounded-sm px-2 py-0.5 text-[9px] uppercase tracking-wider ${
                                                    booking.status ===
                                                    "confirmed"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : booking.status ===
                                                            "completed"
                                                          ? "bg-green-100 text-green-800"
                                                          : "bg-error-container text-on-error-container"
                                                }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
