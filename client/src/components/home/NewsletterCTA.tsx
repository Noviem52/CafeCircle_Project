import toast from "react-hot-toast";

export default function NewsletterCTA() {
    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Welcome to the Café Club!");
    };

    return (
        <section className="bg-surface-container-low text-on-surface border-y border-outline-variant/40 py-20 xl:py-32 text-center">
            <div className="max-w-2xl mx-auto px-6">
                <h2 className="font-display text-2xl md:text-3xl text-primary mb-4">
                    Join the Café Club
                </h2>

                <p className="text-sm text-on-surface/70 mb-8 leading-relaxed">
                    Be the first to discover new cafés, seasonal drinks, fresh
                    pastries, and exclusive coffee experiences.
                </p>

                <form
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                    <input
                        className="flex-1 bg-surface-container-lowest border-b border-outline-variant focus:border-secondary text-on-surface text-sm py-3 px-4 outline-none placeholder:text-on-surface/45"
                        placeholder="Your email address"
                        type="email"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-primary text-on-primary hover:bg-secondary hover:text-on-secondary transition-soft text-xs tracking-widest uppercase py-3 px-8 cursor-pointer"
                    >
                        JOIN NOW
                    </button>
                </form>
            </div>
        </section>
    );
}
