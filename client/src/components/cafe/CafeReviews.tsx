import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import * as api from "../../lib/api";
import { adaptReview, averageRating, type DisplayReview } from "../../lib/adapters";
import type { DisplayCafe } from "../../lib/adapters";
import { useAppContext } from "../../context/AppContext";
import { errorMessage } from "../../lib/types";

interface CafeReviewsProps {
    cafe?: DisplayCafe | null;
}

export default function CafeReviews({
    cafe,
}: CafeReviewsProps) {
    const { isAuthenticated, setAuthModalOpen } = useAppContext();

    const [reviews, setReviews] = useState<DisplayReview[]>([]);
    const [rawReviews, setRawReviews] = useState<api.Review[]>([]);
    const [loading, setLoading] = useState(true);

    const [formRating, setFormRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const cafeId = cafe?.id;

    useEffect(() => {
        const loadReviews = async () => {
            if (!cafeId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await api.getReviews(cafeId);
                setRawReviews(data);
                setReviews(data.map(adaptReview));
            } catch {
                setRawReviews([]);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        void loadReviews();
    }, [cafeId]);

    const cafeRating = averageRating(rawReviews);
    const cafeReviewCount = rawReviews.length;

    const handleSubmitReview = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!isAuthenticated) {
            setAuthModalOpen(true);
            return;
        }

        if (!cafeId) return;

        if (formRating < 1) {
            toast.error("Please select a star rating.");
            return;
        }

        try {
            setSubmitting(true);
            const created = await api.createReview({
                cafe_id: cafeId,
                rating: formRating,
                comment: comment.trim() || undefined,
            });

            setRawReviews((current) => [created, ...current]);
            setReviews((current) => [adaptReview(created), ...current]);
            setFormRating(0);
            setComment("");
            toast.success("Thanks for your review!");
        } catch (error: unknown) {
            toast.error(errorMessage(error, "Couldn't submit your review."));
        } finally {
            setSubmitting(false);
        }
    };

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

            {}
            <form
                onSubmit={handleSubmitReview}
                className="space-y-3 rounded-md border border-outline-variant/20 bg-surface-container-lowest p-5"
            >
                <span className="block text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                    Leave a Review
                </span>

                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onMouseEnter={() => setHoveredStar(value)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => setFormRating(value)}
                            aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                            className="cursor-pointer text-secondary"
                        >
                            <Star
                                size={20}
                                fill={
                                    (hoveredStar || formRating) >= value
                                        ? "currentColor"
                                        : "none"
                                }
                                className={
                                    (hoveredStar || formRating) >= value
                                        ? ""
                                        : "text-outline-variant"
                                }
                            />
                        </button>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={3}
                    placeholder={
                        isAuthenticated
                            ? "Share how your visit went..."
                            : "Log in to leave a review..."
                    }
                    className="w-full rounded-md border border-outline-variant/40 bg-surface-container-low/20 p-3 text-xs focus:border-secondary focus:outline-none"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary px-5 py-2.5 text-[10px] font-medium uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
                >
                    {isAuthenticated ? "Submit Review" : "Log In to Review"}
                </button>
            </form>

            {}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center py-6">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-outline-variant/30 border-t-secondary" />
                    </div>
                ) : reviews.length === 0 ? (
                    <p className="text-xs text-on-surface/80 italic">
                        No reviews yet. Be the first to share your experience!
                    </p>
                ) : (
                    reviews.map((r) => (
                        <div
                            key={r._id}
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
                            {r.comment && (
                                <p className="text-xs text-on-surface/55 max-w-lg leading-relaxed">
                                    {r.comment}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
