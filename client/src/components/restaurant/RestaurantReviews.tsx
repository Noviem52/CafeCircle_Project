/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Star } from "lucide-react";
import { dummyReviews } from "../../assets/assets.ts";
import { useAppContext } from "../../context/AppContext";

interface RestaurantReviewsProps {
    restaurant?: any;
}

/*
    Turns a café id into a stable number so the sample reviews below differ
    per café instead of every café showing an identical review list.
*/
const hashId = (id: string) => {
    let total = 0;

    for (let i = 0; i < id.length; i += 1) {
        total = (total + id.charCodeAt(i) * (i + 1)) % 9973;
    }

    return total;
};

export default function RestaurantReviews({
    restaurant,
}: RestaurantReviewsProps) {
    const { getRating } = useAppContext();

    const cafeId = String(restaurant?._id ?? "");
    const cafeRating = Number(restaurant?.rating ?? 0);
    const cafeReviewCount = Number(restaurant?.reviewCount ?? 0);
    const myRating = cafeId ? getRating(cafeId) : 0;

    /*
        Each café gets its own ordering of the sample reviews, and the star
        values are nudged toward that café's overall rating, so a 4.2 café no
        longer displays exactly the same reviews as a 4.9 café.
    */
    const reviews = useMemo(() => {
        const list = [...(dummyReviews as any[])];

        if (!cafeId || list.length === 0) return list;

        const seed = hashId(cafeId);
        const offset = seed % list.length;
        const rotated = [...list.slice(offset), ...list.slice(0, offset)];

        return rotated.map((review: any, index: number) => {
            const base =
                cafeRating > 0 ? Math.round(cafeRating) : review.rating;
            const wobble = (seed + index) % 3 === 0 ? -1 : 0;

            return {
                ...review,
                rating: Math.min(5, Math.max(3, base + wobble)),
            };
        });
    }, [cafeId, cafeRating]);

    return (
        <section className="space-y-8 pt-6 border-t border-outline-variant/10 text-left">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <h3 className="font-display text-xl font-semibold text-primary">
                    Guest Experiences
                </h3>

                {cafeRating > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-secondary">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <Star
                                    key={value}
                                    size={14}
                                    fill={
                                        cafeRating >= value - 0.5
                                            ? "currentColor"
                                            : "none"
                                    }
                                    className={
                                        cafeRating >= value - 0.5
                                            ? ""
                                            : "text-outline-variant"
                                    }
                                />
                            ))}
                        </div>

                        <span className="text-sm font-medium text-on-surface">
                            {cafeRating.toFixed(1)}
                        </span>

                        <span className="text-xs text-on-surface/55">
                            ({cafeReviewCount} reviews)
                        </span>
                    </div>
                )}
            </div>

            {myRating > 0 && (
                <p className="text-xs text-on-surface/55">
                    You rated this café{" "}
                    <span className="font-medium text-secondary">
                        {myRating} star{myRating > 1 ? "s" : ""}
                    </span>
                    .
                </p>
            )}

            {/* Reviews list */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-xs text-on-surface/80 italic">
                        No reviews yet. Be the first to share your experience!
                    </p>
                ) : (
                    reviews.map((r: any) => (
                        <div
                            key={`${cafeId}-${r._id}`}
                            className="pb-6 border-b border-outline-variant/10 last:border-b-0 space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-primary">
                                        {r.userName}
                                    </h4>
                                    <span className="text-xs text-on-surface/55">
                                        Visited{" "}
                                        {new Date(
                                            r.visitedDate
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-0.5 text-secondary">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            fill={
                                                i < r.rating
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                            className={
                                                i < r.rating
                                                    ? ""
                                                    : "text-outline-variant"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-on-surface/55 max-w-lg leading-relaxed">
                                {r.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
