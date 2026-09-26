import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import AuthModal from "../components/AuthModal.tsx";
import Loader from "../components/Loader.tsx";

import CafeHero from "../components/cafe/CafeHero.tsx";
import CafeInfo from "../components/cafe/CafeInfo.tsx";
import CafeReviews from "../components/cafe/CafeReviews.tsx";
import BookingWidget from "../components/cafe/BookingWidget.tsx";

import * as api from "../lib/api";
import type { Table } from "../lib/api";
import { adaptCafe, type DisplayCafe } from "../lib/adapters";
import type { SlotAvailability } from "../lib/types";

export default function CafeDetail() {
    const { slug } = useParams<{ slug: string }>();
    const { isAuthenticated, setAuthModalOpen } = useAppContext();
    const navigate = useNavigate();

    const [cafe, setCafe] = useState<DisplayCafe | null>(null);
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedGuests, setSelectedGuests] = useState("2");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [slotsAvailability, setSlotsAvailability] = useState<SlotAvailability[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        const fetchCafe = async () => {
            if (!slug) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const cafe = await api.getCafeBySlug(slug);
                setCafe(adaptCafe(cafe));
                const cafeTables = await api.getTables(cafe.id);
                setTables(cafeTables);
            } catch {
                setCafe(null);
            } finally {
                setLoading(false);
            }
        };

        void fetchCafe();
    }, [slug]);

    useEffect(() => {
        if (!cafe || !selectedDate) {
            setSlotsAvailability([]);
            return;
        }

        setLoadingSlots(true);
        const guestCount = Number(selectedGuests) || 1;
        const capacityAvailable = tables.some((t) => t.capacity >= guestCount);

        const slots = cafe.availableSlots.map((time) => ({
            time,
            availableSeats: capacityAvailable ? 20 : 0,
            isAvailable: capacityAvailable,
        }));

        setSlotsAvailability(slots);
        setLoadingSlots(false);
    }, [cafe, tables, selectedDate, selectedGuests]);

    if (loading) {
        return <Loader text="Loading Café Details..." />;
    }

    if (!cafe) {
        return (
            <div className="min-h-screen bg-surface flex flex-col pt-20">
                <Navbar />

                <main className="grow flex flex-col items-center justify-center px-6 text-center">
                    <h1 className="font-display text-2xl text-primary mb-3">
                        Café Not Found
                    </h1>

                    <p className="text-sm text-on-surface/55 mb-6">
                        We could not find the café you are looking for.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/search")}
                        className="bg-primary px-6 py-3 text-xs tracking-widest uppercase text-on-primary hover:bg-secondary transition-colors"
                    >
                        Browse Cafés
                    </button>
                </main>

                <Footer />
            </div>
        );
    }

    const handleReserveClick = () => {
        if (!selectedDate) {
            toast.error("Please select a reservation date.");
            return;
        }

        if (!selectedSlot) {
            toast.error("Please select a café reservation time.");
            return;
        }

        if (!isAuthenticated) {
            setAuthModalOpen(true);
            return;
        }

        const guestCount = Number(selectedGuests) || 1;
        const suitableTable = [...tables]
            .filter((t) => t.capacity >= guestCount)
            .sort((a, b) => a.capacity - b.capacity)[0];

        if (!suitableTable) {
            toast.error(
                "No table large enough for your party size at this café."
            );
            return;
        }

        navigate(
            `/booking/${cafe!.slug}?slot=${encodeURIComponent(
                selectedSlot
            )}&date=${encodeURIComponent(
                selectedDate
            )}&guests=${encodeURIComponent(
                selectedGuests
            )}&tableId=${suitableTable.id}`
        );
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />
            <AuthModal />

            {}
            <CafeHero cafe={cafe} />

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {}
                    <div className="lg:col-span-8 space-y-12">
                        <CafeInfo cafe={cafe} />
                        <CafeReviews cafe={cafe} />
                    </div>

                    {}
                    <div className="lg:col-span-4 lg:sticky lg:top-36">
                        <BookingWidget
                            cafe={cafe}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            selectedGuests={selectedGuests}
                            setSelectedGuests={setSelectedGuests}
                            selectedSlot={selectedSlot}
                            setSelectedSlot={setSelectedSlot}
                            slotsAvailability={slotsAvailability}
                            loadingSlots={loadingSlots}
                            isAuthenticated={isAuthenticated}
                            handleReserveClick={handleReserveClick}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
