import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Coffee } from "lucide-react";
import { cuisines } from "../../assets/assets";

const trendingCoffee = [
    {
        name: "Specialty Coffee",
        search: "SPECIALTY COFFEE",
        description: "Freshly brewed single-origin coffee, cup by cup.",
    },
    {
        name: "Signature Espresso & Lattes",
        search: "ESPRESSO & LATTES",
        description: "Smooth espresso blended with creamy steamed milk.",
    },
    {
        name: "Cold Brew",
        search: "COLD BREW",
        description: "Slow-steeped, refreshing, and naturally smooth.",
    },
    {
        name: "Artisan Bakery",
        search: "ARTISAN BAKERY",
        description: "Perfectly baked pastries for your coffee break.",
    },
];

export default function TrendingRow() {
    const navigate = useNavigate();

    const handleCoffeeClick = (coffeeName: string) => {
        navigate(`/search?cuisine=${encodeURIComponent(coffeeName)}`);
    };

    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-[10px] text-secondary tracking-[0.2em] block mb-2 uppercase">
                            POPULAR THIS WEEK
                        </span>

                        <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary">
                            Trending Coffee Favorites
                        </h2>
                    </div>

                    <Link
                        to="/search"
                        className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1.5 group"
                    >
                        EXPLORE ALL
                        <ArrowRight
                            size={14}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trendingCoffee.map((coffee, index) => {
                        const Icon = cuisines[index]?.icon || Coffee;

                        return (
                            <button
                                key={coffee.name}
                                type="button"
                                onClick={() => handleCoffeeClick(coffee.search)}
                                className="group text-left bg-surface-container-lowest border border-outline-variant/20 p-6 hover:border-secondary hover:shadow-md transition-soft"
                            >
                                <div className="w-14 h-14 flex items-center justify-center bg-secondary/10 mb-6">
                                    <Icon
                                        size={28}
                                        strokeWidth={1.2}
                                        className="text-secondary group-hover:scale-110 transition-transform"
                                    />
                                </div>

                                <span className="text-[10px] text-secondary tracking-[0.18em] uppercase">
                                    TRENDING NOW
                                </span>

                                <h3 className="font-display text-xl text-primary mt-2 mb-3">
                                    {coffee.name}
                                </h3>

                                <p className="text-sm text-on-surface/65 leading-relaxed">
                                    {coffee.description}
                                </p>

                                <span className="inline-flex items-center gap-2 text-[10px] tracking-widest text-secondary mt-6">
                                    FIND CAFÉS
                                    <ArrowRight
                                        size={13}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
