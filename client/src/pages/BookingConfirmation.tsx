import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import Loader from "../components/Loader.tsx";
import BookingSuccess from "../components/booking/BookingSuccess.tsx";
import BookingSummary from "../components/booking/BookingSummary.tsx";
import BookingForm from "../components/booking/BookingForm.tsx";
import * as api from "../lib/api";
import { adaptCafe, toLocalIsoString, type DisplayCafe } from "../lib/adapters";
import type { ConfirmedBooking } from "../lib/types";
import { errorMessage } from "../lib/types";

export default function BookingConfirmation() {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams] = useSearchParams();
    const { user } = useAppContext();
    const navigate = useNavigate();

    const [cafe, setCafe] = useState<DisplayCafe | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [occasion, setOccasion] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");

    const slot = searchParams.get("slot") || "";
    const date = searchParams.get("date") || "";
    const guests = searchParams.get("guests") || "2";
    const tableId = searchParams.get("tableId") || "";

    useEffect(() => {
        if (!user) {
            return;
        }

        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone || "");
    }, [user]);

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
            } catch {
                setCafe(null);
            } finally {
                setLoading(false);
            }
        };

        void fetchCafe();
    }, [slug]);

    const handleConfirmSubmit = async (
        event: FormEvent<Element>
    ): Promise<void> => {
        event.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter your name.");
            return;
        }

        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        if (!phone.trim()) {
            toast.error("Please enter your phone number.");
            return;
        }

        if (!slot || !date) {
            toast.error(
                "Reservation details are missing. Please return to the café page."
            );
            return;
        }

        if (!tableId) {
            toast.error(
                "No table was selected. Please return to the café page and choose a time again."
            );
            return;
        }

        try {
            setConfirming(true);

            const created = await api.createReservation({
                table_id: Number(tableId),
                reservation_time: toLocalIsoString(date, slot),
                party_size: Number(guests),
            });

            const booking = {
                id: created.id,
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                occasion: occasion.trim(),
                specialRequests: specialRequests.trim(),
                guests: Number(guests),
                date,
                time: slot,
                cafeName: cafe?.name,
                status: created.status,
            };

            setConfirmedBooking(booking);
            toast.success("Café reservation confirmed!");
        } catch (error: unknown) {
            toast.error(
                errorMessage(error, "Unable to confirm café reservation.")
            );
        } finally {
            setConfirming(false);
        }
    };

    if (loading) {
        return <Loader text="Retrieving café details..." />;
    }

    if (!cafe) {
        return (
            <div className="min-h-screen bg-surface flex flex-col">
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

    if (confirmedBooking) {
        return (
            <div className="min-h-screen bg-surface flex flex-col pt-20">
                <Navbar />

                <main className="grow flex items-center justify-center py-12 px-6">
                    <BookingSuccess
                        confirmedBooking={confirmedBooking}
                        cafe={cafe}
                        date={date}
                        slot={slot}
                        guests={guests}
                    />
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
                <div className="flex items-center gap-2 mb-10 pb-4 border-b border-outline-variant/10 text-xs text-on-surface/55">
                    <Link
                        to={`/cafe/${cafe.slug}`}
                        className="hover:text-primary transition-colors"
                    >
                        {cafe.name}
                    </Link>

                    <ChevronRight size={14} />

                    <span className="text-primary">
                        Café Details & Confirmation
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-5">
                        <BookingSummary
                            cafe={cafe}
                            date={date}
                            slot={slot}
                            guests={guests}
                        />
                    </div>

                    <div className="lg:col-span-7">
                        <BookingForm
                            name={name}
                            setName={setName}
                            email={email}
                            setEmail={setEmail}
                            phone={phone}
                            setPhone={setPhone}
                            occasion={occasion}
                            setOccasion={setOccasion}
                            specialRequests={specialRequests}
                            setSpecialRequests={setSpecialRequests}
                            confirming={confirming}
                            onSubmit={handleConfirmSubmit}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
