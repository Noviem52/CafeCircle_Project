import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Search as SearchIcon, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import AuthModal from "../components/AuthModal.tsx";
import CafeCard from "../components/CafeCard.tsx";
import { useAppContext } from "../context/AppContext.tsx";
import * as api from "../lib/api";
import { adaptCafe, type DisplayCafe } from "../lib/adapters";

export default function Favorites() {
    const { favorites, toggleFavorite, getRating, user, setAuthModalOpen } =
        useAppContext();
    const [favoriteCafes, setFavoriteCafes] = useState<DisplayCafe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            if (favorites.length === 0) {
                setFavoriteCafes([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const cafes = await api.getFavoriteCafes();
                setFavoriteCafes(cafes.map(adaptCafe));
            } catch {
                setFavoriteCafes([]);
            } finally {
                setLoading(false);
            }
        };

        void loadFavorites();
    }, [favorites]);

    const handleClearAll = async () => {
        await Promise.all(
            favoriteCafes.map((cafe: DisplayCafe) => toggleFavorite(cafe._id))
        );
        toast.success("Cleared all favorite cafés");
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-surface flex flex-col pt-20">
                <Navbar />
                <AuthModal />

                <main className="grow max-w-7xl w-full mx-auto flex flex-col items-center justify-center px-6 py-24 text-center">
                    <Heart size={40} className="mb-6 text-secondary" />

                    <h1 className="font-display text-3xl font-medium text-primary">
                        Your favourite cafés
                    </h1>

                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-on-surface/55">
                        Favourites are saved to your account, so they follow you
                        to any device. Sign in to start your collection.
                    </p>

                    <button
                        type="button"
                        onClick={() => setAuthModalOpen(true)}
                        className="mt-8 cursor-pointer bg-primary px-8 py-3.5 text-[11px] font-medium uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary"
                    >
                        SIGN IN
                    </button>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />
            <AuthModal />

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
                {}
                <div className="mb-10 flex flex-col gap-4 border-b border-outline-variant/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-secondary">
                            YOUR CAFÉ COLLECTION
                        </span>

                        <h1 className="font-display text-3xl font-medium text-primary md:text-4xl">
                            Favorite Cafés
                        </h1>

                        <p className="mt-2 text-sm text-on-surface/55">
                            {favoriteCafes.length === 0
                                ? "You have not saved any cafés yet."
                                : `${favoriteCafes.length} café${
                                      favoriteCafes.length === 1 ? "" : "s"
                                  } saved to your collection.`}
                        </p>
                    </div>

                    {favoriteCafes.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="flex cursor-pointer items-center gap-2 self-start rounded-md border border-outline-variant/40 px-4 py-2.5 text-[10px] font-medium uppercase tracking-widest text-on-surface/55 transition-colors hover:border-error hover:text-error sm:self-auto"
                        >
                            <Trash2 size={14} />
                            Clear All
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-outline-variant/30 border-t-secondary" />
                    </div>
                ) : favoriteCafes.length === 0 ? (
                    <div className="rounded-md border border-outline-variant/20 bg-surface-container-lowest p-12 text-center md:p-20">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container">
                            <Heart
                                size={26}
                                className="text-on-secondary-container"
                            />
                        </div>

                        <h2 className="mb-3 font-display text-xl font-medium text-primary">
                            No Favorite Cafés Yet
                        </h2>

                        <p className="mx-auto mb-8 max-w-sm text-xs leading-relaxed text-on-surface/55">
                            Tap the heart icon on any café to save it here.
                            Your favorites stay on this device so you can come
                            back to them anytime.
                        </p>

                        <Link
                            to="/search"
                            className="inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-[10px] font-medium uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary hover:text-on-secondary"
                        >
                            <SearchIcon size={14} />
                            Browse Cafés
                        </Link>
                    </div>
                ) : (
                    <>
                        {}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {favoriteCafes.map((cafe: DisplayCafe) => (
                                <CafeCard
                                    key={cafe._id || cafe.slug}
                                    cafe={cafe}
                                />
                            ))}
                        </div>

                        {}
                        <section className="mt-14 rounded-md border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8">
                            <h2 className="mb-5 text-xs font-medium uppercase tracking-wider text-primary">
                                Your Ratings
                            </h2>

                            <div className="space-y-3">
                                {favoriteCafes.map((cafe: DisplayCafe) => {
                                    const myRating = getRating(cafe._id);

                                    return (
                                        <div
                                            key={`rating-${cafe._id}`}
                                            className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/10 pb-3 last:border-b-0 last:pb-0"
                                        >
                                            <Link
                                                to={`/cafe/${cafe.slug}`}
                                                className="text-sm text-on-surface transition-colors hover:text-secondary"
                                            >
                                                {cafe.name}
                                            </Link>

                                            <div className="flex items-center gap-5">
                                                <span className="flex items-center gap-1 text-[11px] text-on-surface/55">
                                                    Café rating
                                                    <Star
                                                        size={11}
                                                        fill="currentColor"
                                                        className="text-secondary"
                                                    />
                                                    <span className="font-medium text-on-surface">
                                                        {Number(
                                                            cafe.rating ?? 0
                                                        ).toFixed(1)}
                                                    </span>
                                                </span>

                                                <span className="flex items-center gap-1 text-[11px] text-on-surface/55">
                                                    You
                                                    {myRating > 0 ? (
                                                        <span className="flex items-center gap-0.5 text-secondary">
                                                            {[1, 2, 3, 4, 5].map(
                                                                (value) => (
                                                                    <Star
                                                                        key={value}
                                                                        size={11}
                                                                        fill={
                                                                            myRating >=
                                                                            value
                                                                                ? "currentColor"
                                                                                : "none"
                                                                        }
                                                                        className={
                                                                            myRating >=
                                                                            value
                                                                                ? ""
                                                                                : "text-outline-variant"
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="italic text-on-surface/40">
                                                            not rated
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
