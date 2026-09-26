import { XIcon } from "lucide-react";

interface RequestRejectedProps {
    cafeName: string;
}

export default function RequestRejected({
    cafeName,
}: RequestRejectedProps) {
    return (
        <div className="max-w-xl mx-auto bg-surface-container-lowest border border-outline-variant/20 p-8 text-center shadow-sm rounded-md space-y-6">
            <XIcon size={40} className="mx-auto text-red-300" />

            <h2 className="font-display text-xl font-medium text-primary">
                Café Registration Denied
            </h2>

            <p className="text-sm text-on-surface/55 leading-relaxed">
                Unfortunately, your request to list{" "}
                <strong>{cafeName}</strong> as a café has been rejected
                by our administration team.
            </p>

            <p className="text-xs text-on-surface/55 italic">
                Please contact café support for further information.
            </p>
        </div>
    );
}
