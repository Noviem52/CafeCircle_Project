import { Info } from "lucide-react";
import type { DisplayCafe } from "../../lib/adapters";

interface PendingApprovalProps {
    cafe: DisplayCafe;
}

export default function PendingApproval({
    cafe,
}: PendingApprovalProps) {
    return (
        <div className="max-w-xl mx-auto bg-surface-container-lowest border border-outline-variant/20 p-8 text-center shadow-sm rounded-md space-y-6">
            <Info
                size={40}
                className="mx-auto text-secondary animate-pulse"
            />

            <h2 className="font-display text-xl text-primary">
                Café Registration Pending Approval
            </h2>

            <p className="text-sm text-on-surface/55 leading-relaxed">
                Thank you for registering{" "}
                <span className="text-on-surface">
                    {cafe?.name}
                </span>
                . Your café profile, menu details, and reservation times are
                currently being reviewed by our Master Admin.
            </p>

            <div className="border border-outline-variant/10 bg-surface-container-low/20 p-4 rounded-sm text-left space-y-2 text-xs text-on-surface/65">
                <p>
                    <strong>Coffee Focus:</strong>{" "}
                    {cafe?.cuisine || "Specialty Coffee"}
                </p>

                <p>
                    <strong>Location:</strong>{" "}
                    {cafe?.location || "Not provided"}
                </p>

                <p>
                    <strong>Seating Capacity:</strong>{" "}
                    {cafe?.totalSeats || 0} seats
                </p>

                <p>
                    <strong>Approval Status:</strong>{" "}
                    <span className="text-secondary font-medium tracking-wider uppercase text-[9px] bg-secondary-container/20 px-2 py-0.5 rounded-sm">
                        PENDING
                    </span>
                </p>
            </div>

            <p className="text-[10px] text-on-surface/40 italic">
                You will receive full café booking access as soon as your
                profile status is marked as APPROVED.
            </p>
        </div>
    );
}
