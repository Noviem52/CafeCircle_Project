import { useState } from "react";
import { Heart, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import type { DisplayCafe } from "../../lib/adapters";

interface CafeHeroProps {
    cafe: DisplayCafe | null;
}

export default function CafeHero({ cafe }: CafeHeroProps) {
    const { isFavorite, toggleFavorite, getRating, setRating, user } =
        useAppContext();
    const [hoveredStar, setHoveredStar] = useState(0);

    if (!cafe) return null;

    const favorited = isFavorite(cafe._id);
    const myRating = getRating(cafe._id);

    const cafeRating = Number(cafe.rating ?? 0);
    const cafeReviewCount = Number(cafe.reviewCount ?? 0);

    const handleFavoriteClick = async () => {
        if (!user) {
            toast("Sign in to save your favourite cafés");
            await toggleFavorite(cafe._id);
            return;
        }

        const saved = await toggleFavorite(cafe._id);

        if (!saved) {
            toast.error("Couldn't update your favourites. Try again.");
            return;
        }

        toast.success(
            favorited
                ? `Removed ${cafe.name} from favorites`
                : `Added ${cafe.name} to favorites`
        );
    };

    const handleRate = (value: number) => {
        setRating(cafe._id, value);
        toast.success(`You rated ${cafe.name} ${value} star${value > 1 ? "s" : ""}`);
    };

    return (
        <section className="relative h-[480px] w-full overflow-hidden text-left animate-in fade-in duration-500">
            <img loading="lazy" decoding="async" src={cafe.image} alt={cafe.name} className="w-full h-full object-cover brightness-[0.7]" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

            <button
                type="button"
                onClick={handleFavoriteClick}
                aria-label={
                    favorited
                        ? `Remove ${cafe.name} from favorites`
                        : `Add ${cafe.name} to favorites`
                }
                className="absolute top-24 right-6 md:right-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50 cursor-pointer"
            >
                <Heart
                    size={18}
                    className={favorited ? "text-secondary-container" : "text-white"}
                    fill={favorited ? "currentColor" : "none"}
                />
            </button>

            {}
            <div className="absolute bottom-0 inset-x-0 py-12">
                <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-[10px] font-medium tracking-widest text-secondary-container bg-secondary py-1 px-3 uppercase">
                                {cafe.cuisine}
                            </span>
                            {cafe.exclusive && (
                                <span className="text-[10px] font-medium tracking-widest text-on-primary bg-primary border border-white/20 py-1 px-3 uppercase">
                                    EXCLUSIVE CLUB
                                </span>
                            )}
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl font-medium text-white tracking-tight leading-tight">
                            {cafe.name}
                        </h1>

                        <div className="flex items-center gap-4 text-white/90 text-xs">
                            <div className="flex items-center gap-1 text-secondary-container">
                                <Star size={14} fill="currentColor" />
                                <span className="font-medium text-white">
                                    {cafeRating > 0 ? cafeRating.toFixed(1) : "New"}
                                </span>
                            </div>
                            <span>•</span>
                            <span>{cafeReviewCount} Reviews</span>
                            <span>•</span>
                            <span>Price: {cafe.priceRange}</span>
                        </div>

                        {}
                        <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] tracking-wider text-white/70 uppercase">
                                Your rating:
                            </span>
                            <div
                                className="flex items-center gap-0.5"
                                onMouseLeave={() => setHoveredStar(0)}
                            >
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => handleRate(value)}
                                        onMouseEnter={() => setHoveredStar(value)}
                                        aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                                        className="cursor-pointer p-0.5"
                                    >
                                        <Star
                                            size={16}
                                            className={
                                                (hoveredStar || myRating) >= value
                                                    ? "text-secondary-container"
                                                    : "text-white/40"
                                            }
                                            fill={
                                                (hoveredStar || myRating) >= value
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
