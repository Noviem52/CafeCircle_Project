import { useEffect, useMemo, useState } from "react";
import { MapPin, Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";

import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import CafeCard from "../components/CafeCard.tsx";
import * as api from "../lib/api";
import { adaptCafe, type DisplayCafe } from "../lib/adapters";

const priceOptions = ["$", "$$", "$$$", "$$$$"];

const cuisineOptions = [
    "Specialty Coffee",
    "Espresso & Lattes",
    "Cold Brew",
    "Brunch Café",
    "Artisan Bakery",
    "Tea House",
];

export default function Search() {
    const [cafes, setCafes] = useState<DisplayCafe[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [sort, setSort] = useState("");

    const [tempSearch, setTempSearch] = useState("");
    const [tempLocation, setTempLocation] = useState("");
    const [tempCuisine, setTempCuisine] = useState("");
    const [tempPriceRange, setTempPriceRange] = useState("");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setSearch(tempSearch);
            setLocation(tempLocation);
        }, 300);

        return () => window.clearTimeout(timer);
    }, [tempSearch, tempLocation]);

    useEffect(() => {
        const loadCafes = async () => {
            try {
                setLoading(true);
                setLoadError(false);
                const data = await api.getCafes();
                setCafes(data.map(adaptCafe));
            } catch {
                setLoadError(true);
            } finally {
                setLoading(false);
            }
        };

        void loadCafes();
    }, []);

    const filteredCafes = useMemo(() => {
        const list = [...cafes].filter((cafe: DisplayCafe) => {
            const searchText = search.toLowerCase().trim();
            const locationText = location.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                String(cafe.name || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(cafe.cuisine || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(cafe.description || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(cafe.tags || "")
                    .toLowerCase()
                    .includes(searchText);

            const matchesLocation =
                !locationText ||
                String(cafe.location || "")
                    .toLowerCase()
                    .includes(locationText) ||
                String(cafe.address || "")
                    .toLowerCase()
                    .includes(locationText);

            const matchesCuisine =
                !cuisine ||
                String(cafe.cuisine || "")
                    .toLowerCase()
                    .includes(cuisine.toLowerCase());

            const matchesPrice =
                !priceRange || cafe.priceRange === priceRange;

            return (
                matchesSearch &&
                matchesLocation &&
                matchesCuisine &&
                matchesPrice
            );
        });

        return list.sort((firstCafe: DisplayCafe, secondCafe: DisplayCafe) => {
            if (sort === "price_low") {
                return (
                    String(firstCafe.priceRange || "").length -
                    String(secondCafe.priceRange || "").length
                );
            }

            if (sort === "price_high") {
                return (
                    String(secondCafe.priceRange || "").length -
                    String(firstCafe.priceRange || "").length
                );
            }

            return 0;
        });
    }, [cafes, search, location, cuisine, priceRange, sort]);

    const applyFilters = () => {
        setSearch(tempSearch);
        setLocation(tempLocation);
        setCuisine(tempCuisine);
        setPriceRange(tempPriceRange);
        setMobileFiltersOpen(false);
    };

    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setCuisine("");
        setPriceRange("");
        setSort("");

        setTempSearch("");
        setTempLocation("");
        setTempCuisine("");
        setTempPriceRange("");
    };

    const filtersContent = (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="block text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                    Coffee & Menu Focus
                </label>

                <select
                    value={tempCuisine}
                    onChange={(event) =>
                        setTempCuisine(event.target.value)
                    }
                    className="w-full rounded-md border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-xs outline-none focus:border-secondary"
                >
                    <option value="">All Coffee & Menu Options</option>

                    {cuisineOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                    Café Price Range
                </label>

                <div className="grid grid-cols-4 gap-2">
                    {priceOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() =>
                                setTempPriceRange(
                                    tempPriceRange === option ? "" : option
                                )
                            }
                            className={`rounded-md border py-2 text-xs transition-colors ${
                                tempPriceRange === option
                                    ? "border-primary bg-primary text-on-primary"
                                    : "border-outline-variant/40 text-on-surface/55 hover:border-secondary"
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="button"
                onClick={applyFilters}
                className="w-full bg-primary px-4 py-3 text-[10px] font-medium uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary"
            >
                Apply Café Filters
            </button>

            <button
                type="button"
                onClick={clearFilters}
                className="w-full text-xs text-on-surface/55 underline hover:text-primary"
            >
                Clear All Filters
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />

            <main className="grow mx-auto w-full max-w-7xl px-6 py-12 md:px-10">
                <div className="mb-8 border-b border-outline-variant/10 pb-8">
                    <h1 className="font-display text-3xl font-medium text-primary">
                        Discover Cafés
                    </h1>

                    <p className="mt-2 text-sm text-on-surface/55">
                        Find specialty coffee, cozy spaces, and memorable café
                        experiences near you.
                    </p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-12">
                    <div className="relative md:col-span-5">
                        <SearchIcon
                            size={16}
                            className="absolute left-3 top-3 text-on-surface/45"
                        />

                        <input
                            type="text"
                            placeholder="Search café name or coffee focus..."
                            value={tempSearch}
                            onChange={(event) =>
                                setTempSearch(event.target.value)
                            }
                            className="w-full rounded-md border border-outline-variant/40 bg-surface-container-low/30 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-secondary"
                        />
                    </div>

                    <div className="relative md:col-span-4">
                        <MapPin
                            size={16}
                            className="absolute left-3 top-3 text-on-surface/45"
                        />

                        <input
                            type="text"
                            placeholder="City or neighborhood..."
                            value={tempLocation}
                            onChange={(event) =>
                                setTempLocation(event.target.value)
                            }
                            className="w-full rounded-md border border-outline-variant/40 bg-surface-container-low/30 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-secondary"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(true)}
                        className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[10px] font-medium uppercase tracking-widest text-on-primary hover:bg-secondary md:hidden"
                    >
                        <SlidersHorizontal size={14} />
                        Café Filters
                    </button>

                    <div className="md:col-span-3">
                        <select
                            value={sort}
                            onChange={(event) =>
                                setSort(event.target.value)
                            }
                            className="w-full rounded-md border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-xs outline-none focus:border-secondary"
                        >
                            <option value="">
                                Default (Newest Cafés)
                            </option>
                            <option value="price_low">
                                Price: Low to High
                            </option>
                            <option value="price_high">
                                Price: High to Low
                            </option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
                    <aside className="hidden rounded-md border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm lg:col-span-3 lg:block">
                        <div className="mb-5 flex items-center justify-between border-b border-outline-variant/10 pb-4">
                            <h2 className="text-xs font-medium uppercase tracking-wider text-primary">
                                Café Filters
                            </h2>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-[10px] text-on-surface/55 underline hover:text-primary"
                            >
                                Clear
                            </button>
                        </div>

                        {filtersContent}
                    </aside>

                    <section className="lg:col-span-9">
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-sm text-on-surface/55">
                                {filteredCafes.length}{" "}
                                {filteredCafes.length === 1
                                    ? "Café"
                                    : "Cafés"}{" "}
                                Available
                            </p>

                            <span className="hidden text-xs uppercase tracking-wider text-on-surface/55 sm:block">
                                Sort Cafés By
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-16">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-outline-variant/30 border-t-secondary" />
                            </div>
                        ) : loadError ? (
                            <div className="rounded-md border border-outline-variant/10 bg-surface-container-lowest p-12 text-center">
                                <h3 className="mb-2 font-display text-xl font-medium">
                                    Couldn't Load Cafés
                                </h3>
                                <p className="mx-auto max-w-sm text-xs text-on-surface/50">
                                    Something went wrong reaching the server.
                                    Please try again shortly.
                                </p>
                            </div>
                        ) : filteredCafes.length === 0 ? (
                            <div className="rounded-md border border-outline-variant/10 bg-surface-container-lowest p-12 text-center">
                                <h3 className="mb-2 font-display text-xl font-medium">
                                    No Cafés Found
                                </h3>

                                <p className="mx-auto mb-6 max-w-sm text-xs text-on-surface/50">
                                    We could not find any cafés matching your
                                    search. Try a different coffee focus,
                                    location, or price range.
                                </p>

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="bg-primary px-6 py-3 text-[10px] font-medium uppercase tracking-widest text-on-primary hover:bg-secondary"
                                >
                                    Clear Café Search
                                </button>
                            </div>
                        ) : (
                            <div className="grid grow grid-cols-1 gap-6 lg:grid-cols-2">
                                {filteredCafes.map((cafe: DisplayCafe) => (
                                    <CafeCard
                                        key={cafe._id || cafe.slug}
                                        cafe={cafe}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
                    <div className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-surface-container-lowest p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-display text-xl text-primary">
                                Café Filters
                            </h2>

                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                className="text-on-surface/55 hover:text-primary"
                                aria-label="Close café filters"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {filtersContent}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
