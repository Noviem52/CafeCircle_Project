import type { FormEvent } from "react";

interface BookingFormProps {
    name: string;
    setName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    phone: string;
    setPhone: (value: string) => void;
    occasion: string;
    setOccasion: (value: string) => void;
    specialRequests: string;
    setSpecialRequests: (value: string) => void;
    confirming: boolean;
    onSubmit: (
        event: FormEvent<HTMLFormElement>
    ) => void | Promise<void>;
}

export default function BookingForm({
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    occasion,
    setOccasion,
    specialRequests,
    setSpecialRequests,
    confirming,
    onSubmit,
}: BookingFormProps) {
    return (
        <div className="rounded-md border border-outline-variant/20 bg-surface-container-lowest p-8 text-left shadow-sm">
            <h3 className="mb-6 border-b border-outline-variant/10 pb-3 font-display text-lg font-semibold text-primary">
                Café Guest Details
            </h3>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                            FULL NAME
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Your full name"
                            required
                            className="w-full border-b border-outline-variant/60 bg-transparent pb-2 pt-1 text-sm transition-colors focus:border-secondary focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                            EMAIL ADDRESS
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="you@example.com"
                            required
                            className="w-full border-b border-outline-variant/60 bg-transparent pb-2 pt-1 text-sm transition-colors focus:border-secondary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                            PHONE NUMBER
                        </label>

                        <input
                            type="tel"
                            value={phone}
                            onChange={(event) =>
                                setPhone(event.target.value)
                            }
                            placeholder="+1 (555) 000-0000"
                            required
                            className="w-full border-b border-outline-variant/60 bg-transparent pb-2 pt-1 text-sm transition-colors focus:border-secondary focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                            SPECIAL OCCASION
                        </label>

                        <select
                            value={occasion}
                            onChange={(event) =>
                                setOccasion(event.target.value)
                            }
                            className="w-full cursor-pointer border-b border-outline-variant/60 bg-transparent pb-2 pt-1 text-sm focus:border-secondary focus:outline-none"
                        >
                            <option value="">None</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Anniversary">Anniversary</option>
                            <option value="Coffee Date">Coffee Date</option>
                            <option value="Business Meeting">
                                Business Meeting
                            </option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                        SPECIAL REQUESTS (OPTIONAL)
                    </label>

                    <textarea
                        value={specialRequests}
                        onChange={(event) =>
                            setSpecialRequests(event.target.value)
                        }
                        rows={3}
                        placeholder="Allergies, accessibility needs, preferred seating, or drink requests..."
                        className="w-full rounded-md border border-outline-variant/40 bg-surface-container-low/20 p-3 text-xs focus:border-secondary focus:outline-none"
                    />
                </div>

                <div className="flex items-start gap-3 py-2">
                    <input
                        type="checkbox"
                        id="cafeNewsletterOpt"
                        className="mt-1 cursor-pointer"
                        defaultChecked
                    />

                    <label
                        htmlFor="cafeNewsletterOpt"
                        className="cursor-pointer select-none text-xs leading-relaxed text-on-surface/55"
                    >
                        Send me seasonal café updates, new menu announcements,
                        and exclusive coffee event invitations from Café
                        Circle.
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={confirming}
                    className="w-full cursor-pointer bg-primary py-4 text-xs font-medium uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {confirming
                        ? "CONFIRMING CAFÉ RESERVATION..."
                        : "RESERVE CAFÉ TABLE"}
                </button>
            </form>
        </div>
    );
}
