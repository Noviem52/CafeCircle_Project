import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar.tsx";
import Footer from "../../components/Footer.tsx";
import Loader from "../../components/Loader.tsx";
import { useAppContext } from "../../context/AppContext.tsx";
import {
    ShieldCheckIcon,
    CheckCircleIcon,
    BarChart3Icon,
} from "lucide-react";

import AdminApprovals from "../../components/admin/AdminApprovals.tsx";
import AdminStats from "../../components/admin/AdminStats.tsx";
import * as api from "../../lib/api";
import type { AdminCafeRow, AdminStatsData } from "../../lib/types";
import { errorMessage } from "../../lib/types";

export default function AdminDashboard() {
    const { logout } = useAppContext();
    const navigate = useNavigate();

    const handleSignOut = () => {
        logout();
        navigate("/");
    };

    const [cafes, setCafes] = useState<AdminCafeRow[]>([]);
    const [stats, setStats] = useState<AdminStatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"approvals" | "stats">(
        "approvals"
    );
    const [btnLoading, setBtnLoading] = useState<string | null>(null);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [cafeList, users, tables, reservations] = await Promise.all([
                api.getAllCafesAdmin(),
                api.getUsers(),
                api.getTables(),
                api.getReservations(),
            ]);

            const usersById = new Map(users.map((u) => [u.id, u]));
            const cafesById = new Map(cafeList.map((c) => [c.id, c]));
            const tablesById = new Map(tables.map((t) => [t.id, t]));
            const tablesByCafe = new Map<number, typeof tables>();
            for (const table of tables) {
                const list = tablesByCafe.get(table.cafe_id) || [];
                list.push(table);
                tablesByCafe.set(table.cafe_id, list);
            }

            setCafes(
                cafeList.map((cafe) => ({
                    _id: String(cafe.id),
                    slug: cafe.slug,
                    name: cafe.name,
                    description: cafe.description,
                    cuisine: cafe.cuisine,
                    address: cafe.address,
                    location: cafe.address,
                    status: cafe.status,
                    totalSeats: (tablesByCafe.get(cafe.id) || []).reduce(
                        (sum, t) => sum + t.capacity,
                        0
                    ),
                    owner: cafe.owner_id
                        ? usersById.get(cafe.owner_id)
                        : undefined,
                }))
            );

            const sortedReservations = [...reservations].sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            );

            const latestBookings = sortedReservations
                .slice(0, 8)
                .map((r) => {
                    const table = tablesById.get(r.table_id);
                    const cafe = table ? cafesById.get(table.cafe_id) : undefined;
                    const user = usersById.get(r.user_id);
                    const dt = new Date(r.reservation_time);

                    return {
                        _id: String(r.id),
                        bookingId: `RES-${r.id}`,
                        user: user ? { name: user.name, email: user.email } : undefined,
                        cafe: cafe ? { name: cafe.name } : undefined,
                        date: dt.toISOString().slice(0, 10),
                        time: dt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                        guests: r.party_size,
                        status: r.status,
                    };
                });

            setStats({
                users: {
                    totalUsers: users.length,
                    totalOwners: users.filter((u) => u.role === "owner").length,
                },
                cafes: { total: cafeList.length },
                bookings: { total: reservations.length },
                latestBookings,
            });
        } catch {
            toast.error("Couldn't load admin data.");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveStatus = async (
        cafeId: string,
        status: "approved" | "rejected"
    ) => {
        setBtnLoading(cafeId);

        try {
            const updated =
                status === "approved"
                    ? await api.approveCafe(Number(cafeId))
                    : await api.rejectCafe(Number(cafeId));

            setCafes((currentCafes) =>
                currentCafes.map((cafe) =>
                    cafe._id === cafeId
                        ? { ...cafe, status: updated.status }
                        : cafe
                )
            );

            toast.success(
                status === "approved" ? "Café approved." : "Café rejected."
            );
        } catch (error: unknown) {
            toast.error(errorMessage(error, "Couldn't update café status."));
        } finally {
            setBtnLoading(null);
        }
    };

    useEffect(() => {
        void fetchAdminData();
    }, []);

    if (loading) {
        return <Loader text="Loading Café Admin Console..." />;
    }

    const pendingCafes = cafes.filter(
        (cafe) => cafe.status === "pending"
    );

    const otherCafes = cafes.filter(
        (cafe) => cafe.status !== "pending"
    );

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
                {}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/10 pb-8 mb-8 text-left">
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl font-medium text-primary flex items-center gap-2">
                            <ShieldCheckIcon
                                size={28}
                                className="text-secondary"
                            />
                            Café Admin Console
                        </h1>

                        <p className="text-xs text-on-surface/55 mt-1.5">
                            Approve new café partners, review reservation
                            availability, and monitor Café Circle activity.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="bg-error-container hover:bg-error-container/85 text-error px-4 py-2 text-[10px] font-medium tracking-widest uppercase transition-colors rounded-sm cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {}
                    <aside className="lg:col-span-3 space-y-6 bg-surface-container-lowest border border-outline-variant/20 p-6 rounded-md shadow-sm h-fit">
                        <nav className="flex flex-col gap-1.5">
                            <button
                                type="button"
                                onClick={() => setActiveTab("approvals")}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${
                                    activeTab === "approvals"
                                        ? "bg-primary text-on-primary"
                                        : "text-on-surface/55 hover:bg-surface"
                                }`}
                            >
                                <CheckCircleIcon size={14} />
                                Café Approvals ({pendingCafes.length}{" "}
                                Pending)
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("stats")}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${
                                    activeTab === "stats"
                                        ? "bg-primary text-on-primary"
                                        : "text-on-surface/55 hover:bg-surface"
                                }`}
                            >
                                <BarChart3Icon size={14} />
                                Café Analytics & Stats
                            </button>
                        </nav>
                    </aside>

                    {}
                    <div className="lg:col-span-9 space-y-8">
                        {activeTab === "approvals" && (
                            <AdminApprovals
                                pendingCafes={pendingCafes}
                                otherCafes={otherCafes}
                                btnLoading={btnLoading}
                                onApproveStatus={handleApproveStatus}
                            />
                        )}

                        {activeTab === "stats" && stats && (
                            <AdminStats stats={stats} />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
