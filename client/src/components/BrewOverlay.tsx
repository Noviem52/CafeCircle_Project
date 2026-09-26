interface BrewOverlayProps {
    name?: string | null;
    message?: string;
}

export default function BrewOverlay({
    name,
    message = "Brewing your session",
}: BrewOverlayProps) {
    const greeting = name ? `Welcome back, ${name.split(" ")[0]}` : "Welcome back";

    return (
        <div
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-surface animate-brew-veil"
            role="status"
            aria-live="polite"
        >
            <svg
                viewBox="0 0 160 170"
                className="h-40 w-40 text-primary"
                aria-hidden="true"
            >
                <g className="text-secondary">
                    <path
                        className="animate-steam-a"
                        d="M62 46c0-9 8-11 8-20s-8-11-8-20"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                    />
                    <path
                        className="animate-steam-b"
                        d="M80 46c0-9 8-11 8-20s-8-11-8-20"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                    />
                    <path
                        className="animate-steam-c"
                        d="M98 46c0-9 8-11 8-20s-8-11-8-20"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                    />
                </g>

                <clipPath id="brew-cup-clip">
                    <path d="M34 62h74v34a37 37 0 0 1-37 37 37 37 0 0 1-37-37z" />
                </clipPath>

                <rect
                    x="30"
                    y="62"
                    width="82"
                    height="76"
                    clipPath="url(#brew-cup-clip)"
                    className="animate-brew-fill text-secondary"
                    fill="currentColor"
                />

                <path
                    d="M34 62h74v34a37 37 0 0 1-37 37 37 37 0 0 1-37-37z"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinejoin="round"
                    fill="none"
                />

                <path
                    d="M108 72h12a17 17 0 0 1 0 34h-12"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                />

                <path
                    d="M22 148h98"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
            </svg>

            <p className="mt-8 font-display text-2xl tracking-tight text-primary">
                {greeting}
            </p>

            <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-on-surface/55">
                {message}
            </p>

            <div className="mt-6 h-px w-40 overflow-hidden bg-outline-variant/40">
                <span className="block h-full w-1/3 bg-secondary animate-brew-bar" />
            </div>
        </div>
    );
}
