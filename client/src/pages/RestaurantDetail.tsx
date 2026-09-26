import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import AuthModal from "../components/AuthModal.tsx";
import Loader from "../components/Loader.tsx";

import RestaurantHero from "../components/restaurant/RestaurantHero.tsx";
import RestaurantInfo from "../components/restaurant/RestaurantInfo.tsx";
import RestaurantReviews from "../components/restaurant/RestaurantReviews.tsx";
import BookingWidget from "../components/restaurant/BookingWidget.tsx";

import {
    dummyAvailability,
    dummyRestaurant,
} from "../assets/assets.ts";

export default function RestaurantDetail() {
    const { slug } = useParams<{ slug: string }>();
    const { isAuthenticated, setAuthModalOpen } = useAppContext();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState<
        (typeof dummyRestaurant)[number] | null
    >(null);

    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedGuests, setSelectedGuests] = useState("2");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [slotsAvailability, setSlotsAvailability] = useState<
        typeof dummyAvailability
    >([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        const fetchCafe = async () => {
            const selectedCafe = dummyRestaurant.find(
                (cafe) => cafe.slug === slug
            );

            setRestaurant(selectedCafe || null);
            setLoading(false);
        };

        if (slug) {
            void fetchCafe();
        } else {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!restaurant?._id || !selectedDate) {
                setSlotsAvailability([]);
                return;
            }

            setLoadingSlots(true);

            try {
                setSlotsAvailability(dummyAvailability);
            } finally {
                setLoadingSlots(false);
            }
        };

        void fetchAvailability();
    }, [restaurant?._id, selectedDate]);

    if (loading) {
        return <Loader text="Loading Café Details..." />;
    }

    if (!restaurant) {
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

        navigate(
            `/booking/${restaurant.slug}?slot=${encodeURIComponent(
                selectedSlot
            )}&date=${encodeURIComponent(
                selectedDate
            )}&guests=${encodeURIComponent(selectedGuests)}`
        );
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />

            <AuthModal />

            <RestaurantHero restaurant={restaurant} />

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 space-y-12">
                        <RestaurantInfo restaurant={restaurant} />

                        <RestaurantReviews restaurant={restaurant} />
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-36">
                        <BookingWidget
                            restaurant={restaurant}
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