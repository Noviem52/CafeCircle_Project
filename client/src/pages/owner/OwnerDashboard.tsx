import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, SettingsIcon, Coffee } from "lucide-react";
import { useAppContext } from "../../context/AppContext.tsx";
import Navbar from "../../components/Navbar.tsx";
import Footer from "../../components/Footer.tsx";
import Loader from "../../components/Loader.tsx";
import CafeWizard from "../../components/owner/CafeWizard.tsx";
import PendingApproval from "../../components/owner/PendingApproval.tsx";
import RequestRejected from "../../components/owner/RequestRejected.tsx";
import OwnerBookings from "../../components/owner/OwnerBookings.tsx";
import OwnerProfileDetails from "../../components/owner/OwnerProfileDetails.tsx";
import * as api from "../../lib/api";
import { adaptCafe } from "../../lib/adapters";
import type { DisplayCafe } from "../../lib/adapters";
import type { BookingRow } from "../../lib/types";

export default function OwnerDashboard() {
    const { logout } = useAppContext();
    const navigate = useNavigate();

    const handleSignOut = () => {
        logout();
        navigate("/");
    };

    const [cafe, setCafe] = useState<DisplayCafe | null>(null);
    const [totalSeats, setTotalSeats] = useState(0);
    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<
        "bookings" | "details"
    >("bookings");

    const fetchOwnerData = async () => {
        try {
            setLoading(true);
            const [cafes, ownerReservations] = await Promise.all([
                api.getMyCafes(),
                api.getOwnerReservations(),
            ]);

            const cafe = cafes.length > 0 ? cafes[0] : null;
            setCafe(cafe ? adaptCafe(cafe) : null);

            if (cafe) {
                const tables = await api.getTables(cafe.id);
                setTotalSeats(tables.reduce((sum, t) => sum + t.capacity, 0));
            }

            setBookings(
                ownerReservations.map((r) => {
                    const dt = new Date(r.reservation_time);
                    return {
                        _id: String(r.id),
                        bookingId: `RES-${r.id}`,
                        user: { name: r.user_name, email: r.user_email },
                        date: dt.toISOString().slice(0, 10),
                        time: dt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                        guests: r.party_size,
                        status: r.status,
                    };
                })
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchOwnerData();
    }, []);

    if (loading) {
        return <Loader text="Loading Café Owner Dashboard..." />;
    }

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
                {}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/10 pb-8 mb-8">
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl text-primary flex items-center gap-3">
                            <Coffee
                                size={28}
                                className="text-secondary"
                            />
                            Café Owner Portal
                        </h1>

                        <p className="text-xs text-on-surface/55 mt-1.5">
                            Manage your café profile, seating capacity, and
                            guest reservations.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="bg-error-container hover:bg-error-container/85 text-error px-4 py-2 text-[10px] font-medium tracking-widest uppercase transition-colors cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>

                {}
                {!cafe ? (
                    <CafeWizard setCafe={setCafe} />
                ) : cafe.status === "pending" ? (
                    <PendingApproval cafe={cafe} />
                ) : cafe.status === "rejected" ? (
                    <RequestRejected cafeName={cafe.name} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {}
                        <aside className="lg:col-span-3 space-y-6 bg-surface-container-lowest border border-outline-variant/20 p-6 rounded-md shadow-sm h-fit">
                            <div className="flex items-center gap-3.5 border-b border-outline-variant/10 pb-5">
                                <span className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-base">
                                    {cafe.name?.charAt(0) || "C"}
                                </span>

                                <div>
                                    <h4 className="font-display font-medium text-primary text-base line-clamp-1">
                                        {cafe.name}
                                    </h4>

                                    <span className="text-[9px] text-secondary tracking-widest uppercase bg-secondary-container/20 px-2 py-0.5 rounded-sm inline-block mt-0.5">
                                        APPROVED CAFÉ
                                    </span>
                                </div>
                            </div>

                            <nav className="flex flex-col gap-1.5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab("bookings")
                                    }
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${
                                        activeTab === "bookings"
                                            ? "bg-primary text-on-primary"
                                            : "text-on-surface/55 hover:bg-surface"
                                    }`}
                                >
                                    <CalendarIcon size={14} />
                                    Café Reservations ({bookings.length})
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab("details")
                                    }
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${
                                        activeTab === "details"
                                            ? "bg-primary text-on-primary"
                                            : "text-on-surface/55 hover:bg-surface"
                                    }`}
                                >
                                    <SettingsIcon size={14} />
                                    Café Profile Details
                                </button>
                            </nav>
                        </aside>

                        {}
                        <div className="lg:col-span-9 space-y-8">
                            {activeTab === "bookings" && (
                                <OwnerBookings
                                    bookings={bookings}
                                    setBookings={setBookings}
                                    totalSeats={totalSeats}
                                />
                            )}

                            {activeTab === "details" && (
                                <OwnerProfileDetails
                                    cafe={cafe}
                                    onSaved={setCafe}
                                />
                            )}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
