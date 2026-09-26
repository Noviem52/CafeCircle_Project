import { assets } from "../../assets/assets";
import { BadgeCheck, Coffee } from "lucide-react";

export default function MembershipSection() {
    return (
        <section className="py-24 xl:py-32 px-6 md:px-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 h-[450px] overflow-hidden">
                    <img loading="lazy" decoding="async"
                        src={assets.membership_section_img}
                        alt="Luxury café interior with elegant seating"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center lg:pl-6">
                    <span className="text-[10px] text-secondary tracking-[0.2em] block mb-2 uppercase">
                        PREMIUM CAFÉ MEMBERSHIP
                    </span>

                    <h2 className="font-display text-3xl md:text-4xl text-primary mb-6 leading-tight">
                        Make Every Coffee Moment Extraordinary
                    </h2>

                    <p className="text-sm text-on-surface/55 mb-8 leading-relaxed">
                        Join our exclusive café club and enjoy priority seating,
                        handcrafted drinks, members-only tastings, and unforgettable
                        moments in the city’s most refined coffee spaces.
                    </p>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <BadgeCheck
                                size={20}
                                className="text-secondary shrink-0 mt-0.5"
                            />

                            <div>
                                <h4 className="text-sm text-primary">
                                    Priority Café Reservations
                                </h4>

                                <p className="text-xs text-on-surface/55 mt-1 leading-relaxed">
                                    Reserve the best seats before peak hours and enjoy
                                    a relaxed café experience whenever you visit.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Coffee
                                size={20}
                                className="text-secondary shrink-0 mt-0.5"
                            />

                            <div>
                                <h4 className="text-sm text-primary">
                                    Exclusive Coffee Experiences
                                </h4>

                                <p className="text-xs text-on-surface/55 mt-1 leading-relaxed">
                                    Receive invitations to private coffee tastings,
                                    seasonal menu launches, and barista-led events.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="self-start mt-8 bg-primary text-on-primary text-xs tracking-widest uppercase px-7 py-4 hover:bg-secondary transition-soft"
                    >
                        JOIN THE CAFÉ CLUB
                    </button>
                </div>
            </div>
        </section>
    );
}
