import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { assets } from "../../assets/assets";

export default function Hero() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState("2");

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (searchQuery.trim()) {
            params.append("search", searchQuery.trim());
        }

        if (location.trim()) {
            params.append("location", location.trim());
        }

        if (date) {
            params.append("date", date);
        }

        if (guests) {
            params.append("guests", guests);
        }

        navigate(`/search?${params.toString()}`);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {}
            <div className="absolute inset-0 z-0">
                <img fetchPriority="high" decoding="async"
                    src={assets.hero_bg_img}
                    alt="Warm and modern café interior"
                    className="w-full h-full object-cover brightness-[0.65]"
                />
                <div className="absolute inset-0 bg-black/35" />
            </div>

            {}
            <div className="relative z-10 w-full max-w-7xl px-6 md:px-10 text-center">
                <span className="text-sm text-secondary-container tracking-[0.25em] uppercase block mb-4">
                    YOUR DAILY COFFEE ESCAPE
                </span>

                <h1 className="font-display text-4xl md:text-6xl text-white mb-6 max-w-4xl mx-auto leading-[1.15] font-medium tracking-tight drop-shadow-md">
                    Great Coffee, Good Vibes, Your Perfect Moment
                </h1>

                <p className="text-white/85 text-base md:text-lg max-w-2xl mx-auto mb-12">
                    Discover cozy cafés, fresh pastries, specialty coffee, and spaces
                    made for meaningful moments.
                </p>

                {}
                <form
                    onSubmit={handleSearchSubmit}
                    className="bg-surface-container-lowest p-3 md:p-2.5 ambient-shadow max-w-5xl mx-auto flex flex-col md:flex-row gap-2"
                >
                    {}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Search
                            className="text-outline-variant mr-3 shrink-0"
                            size={18}
                        />

                        <input
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface placeholder:text-on-surface/55"
                            placeholder="Search cafés, coffee, pastries..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <MapPin
                            className="text-outline-variant mr-3 shrink-0"
                            size={18}
                        />

                        <input
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface placeholder:text-on-surface/55"
                            placeholder="Location or neighborhood"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    {}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Calendar
                            className="text-outline-variant mr-3 shrink-0"
                            size={18}
                        />

                        <input
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface cursor-pointer"
                            aria-label="Select visit date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Users
                            className="text-outline-variant mr-3 shrink-0"
                            size={18}
                        />

                        <select
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface cursor-pointer"
                            aria-label="Select number of guests"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                        >
                            <option value="1">1 Person</option>
                            <option value="2">2 People</option>
                            <option value="4">4 People</option>
                            <option value="6">6 People</option>
                            <option value="8">8 People</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-primary text-on-primary text-xs tracking-widest uppercase px-8 py-4 md:py-3 hover:bg-secondary hover:text-on-secondary transition-soft cursor-pointer"
                    >
                        FIND A CAFÉ
                    </button>
                </form>
            </div>
        </section>
    );
}
