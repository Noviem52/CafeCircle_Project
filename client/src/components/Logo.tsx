interface LogoProps {
    className?: string;
    bold?: boolean;
    markOnly?: boolean;
}

export default function Logo({
    className = "",
    bold = false,
    markOnly = false,
}: LogoProps) {
    const stroke = bold ? 9 : 7.5;

    const mark = (
        <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Café Circle"
            className="h-full w-auto shrink-0"
        >
            <circle
                cx="60"
                cy="60"
                r="53"
                stroke="currentColor"
                strokeWidth={stroke}
            />
            <path
                d="M44 34c0 6-5 7-5 13"
                stroke="currentColor"
                strokeWidth={stroke - 1.5}
                strokeLinecap="round"
            />
            <path
                d="M60 32c0 6-5 7-5 13"
                stroke="currentColor"
                strokeWidth={stroke - 1.5}
                strokeLinecap="round"
            />
            <path
                d="M76 34c0 6-5 7-5 13"
                stroke="currentColor"
                strokeWidth={stroke - 1.5}
                strokeLinecap="round"
            />
            <path
                d="M33 56h46v16a23 23 0 0 1-46 0z"
                stroke="currentColor"
                strokeWidth={stroke}
                strokeLinejoin="round"
            />
            <path
                d="M79 60h6a11 11 0 0 1 0 22h-6"
                stroke="currentColor"
                strokeWidth={stroke}
                strokeLinecap="round"
            />
            <path
                d="M27 92h58"
                stroke="currentColor"
                strokeWidth={stroke}
                strokeLinecap="round"
            />
        </svg>
    );

    if (markOnly) {
        return <span className={`inline-block ${className}`}>{mark}</span>;
    }

    return (
        <span className={`inline-flex items-center gap-2.5 ${className}`}>
            {mark}

            <span className="flex flex-col justify-center leading-none">
                <span
                    className={`font-display text-[1.35em] tracking-tight ${
                        bold ? "font-semibold" : "font-medium"
                    }`}
                >
                    Café Circle
                </span>

                <span className="mt-[0.25em] text-[0.42em] font-medium uppercase tracking-[0.42em] opacity-60">
                    Reserve a seat
                </span>
            </span>
        </span>
    );
}
