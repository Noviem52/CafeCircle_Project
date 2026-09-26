interface LoaderProps {
    text?: string;
}

export default function Loader({
    text = "Preparing your café experience...",
}: LoaderProps) {
    return (
        <div
            className="min-h-screen bg-surface flex flex-col justify-center items-center"
            role="status"
            aria-live="polite"
        >
            <div
                className="w-12 h-12 border-2 border-outline-variant/30 border-t-secondary rounded-full animate-spin"
                aria-hidden="true"
            />

            <p className="font-display text-sm tracking-widest text-on-surface/55 mt-4 animate-pulse uppercase">
                {text}
            </p>
        </div>
    );
}
