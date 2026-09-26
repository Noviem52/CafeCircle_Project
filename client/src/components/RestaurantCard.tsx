import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, MapPinIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

interface RestaurantCardProps {
    restaurant: {
        _id: string;
        name: string;
        slug: string;
        cuisine: string;
        priceRange: string;
        rating: number;
        reviewCount: number;
        location: string;
        image: string;
        availableSlots: string[];
        featured?: boolean;
        exclusive?: boolean;
    };
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite } = useAppContext();
    const favorited = isFavorite(restaurant._id);

    // Each café carries its own rating and review count, so the card shows
    // that café's numbers rather than one shared placeholder value.
    const cafeRating = Number(restaurant.rating ?? 0);
    const cafeReviewCount = Number(restaurant.reviewCount ?? 0);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        toggleFavorite(restaurant._id);
        toast.success(
            favorited
                ? `Removed ${restaurant.name} from favorites`
                : `Added ${restaurant.name} to favorites`
        );
    };

    const handleSlotClick = (e: React.MouseEvent, slot: string) => {
        e.preventDefault();
        e.stopPropagation();

        const today = new Date().toISOString().split("T")[0];

        navigate(`/booking/${restaurant.slug}?slot=${slot}&date=${today}`);
    };

    return (
        <div className="group relative bg-surface-container-lowest border border-outline-variant/10 card-hover-effect overflow-hidden rounded-md flex flex-col h-full">
            {/* Café image and badges */}
            <Link
                to={`/restaurant/${restaurant.slug}`}
                className="relative h-60 overflow-hidden block"
                aria-label={`View ${restaurant.name} café`}
            >
                <img
                    src={restaurant.image}
                    alt={`${restaurant.name} café`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                <button
                    type="button"
                    onClick={handleFavoriteClick}
                    aria-label={
                        favorited
                            ? `Remove ${restaurant.name} from favorites`
                            : `Add ${restaurant.name} to favorites`
                    }
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50 cursor-pointer"
                >
                    <Heart
                        size={16}
                        className={
                            favorited
                                ? "text-secondary"
                                : "text-white"
                        }
                        fill={favorited ? "currentColor" : "none"}
                    />
                </button>

                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {restaurant.exclusive && (
                        <span className="text-[9px] font-medium tracking-widest text-on-secondary bg-secondary py-1 px-2.5 uppercase">
                            LUXURY CAFÉ
                        </span>
                    )}

                    {restaurant.featured && (
                        <span className="text-[9px] font-medium tracking-widest text-on-primary bg-primary py-1 px-2.5 uppercase">
                            FEATURED CAFÉ
                        </span>
                    )}
                </div>
            </Link>

            {/* Café details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-medium text-secondary tracking-widest uppercase">
                            {restaurant.cuisine}
                        </span>

                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-medium text-on-surface/55">
                                {restaurant.priceRange}
                            </span>

                            <span className="text-on-surface/30 text-xs">•</span>

                            <div className="flex items-center gap-0.5 text-secondary">
                                <Star size={12} fill="currentColor" />

                                <span className="text-xs font-medium text-primary">
                                    {cafeRating > 0
                                        ? cafeRating.toFixed(1)
                                        : "New"}
                                </span>

                                {cafeReviewCount > 0 && (
                                    <span className="ml-0.5 text-[10px] font-normal text-on-surface/55">
                                        ({cafeReviewCount})
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Café name */}
                    <Link
                        to={`/restaurant/${restaurant.slug}`}
                        className="block mb-2"
                    >
                        <h3 className="font-display text-lg font-semibold text-primary group-hover:text-secondary transition-colors line-clamp-1">
                            {restaurant.name}
                        </h3>
                    </Link>

                    {/* Café location */}
                    <p className="text-xs text-on-surface/55 mb-4 flex items-center gap-1">
                        <MapPinIcon
                            size={14}
                            className="text-on-surface/70"
                        />
                        {restaurant.location}
                    </p>
                </div>

                {/* Quick café booking */}
                <div>
                    <div className="border-t border-outline-variant/10 my-3" />

                    <span className="block text-[9px] font-medium text-on-surface/55 tracking-wider uppercase mb-2">
                        QUICK CAFÉ BOOKING
                    </span>

                    <div className="flex flex-wrap gap-1.5">
                        {restaurant.availableSlots
                            .filter((slot) => {
                                const [slotHour, slotMinute] = slot
                                    .split(":")
                                    .map(Number);

                                const now = new Date();
                                const currentHour = now.getHours();
                                const currentMinute = now.getMinutes();

                                return (
                                    slotHour > currentHour ||
                                    (slotHour === currentHour &&
                                        slotMinute > currentMinute)
                                );
                            })
                            .slice(0, 3)
                            .map((slot) => (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={(e) =>
                                        handleSlotClick(e, slot)
                                    }
                                    className="text-[10px] font-medium border border-outline-variant/60 hover:border-primary px-3 py-1.5 transition-colors cursor-pointer text-on-surface/55 hover:text-primary bg-surface"
                                >
                                    {slot}
                                </button>
                            ))}

                        <Link
                            to={`/restaurant/${restaurant.slug}`}
                            className="text-[10px] font-medium border border-outline-variant/20 px-3 py-1.5 transition-colors cursor-pointer text-secondary hover:bg-secondary hover:text-on-secondary"
                        >
                            VIEW ALL TIMES
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}