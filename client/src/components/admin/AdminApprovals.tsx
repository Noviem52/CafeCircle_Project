import { Link } from "react-router-dom";
import {
    CheckCircle,
    Coffee,
    MapPin,
    Users,
} from "lucide-react";
import type { AdminCafeRow } from "../../lib/types";

interface AdminApprovalsProps {
    pendingCafes: AdminCafeRow[];
    otherCafes: AdminCafeRow[];
    btnLoading: string | null;
    onApproveStatus: (
        cafeId: string,
        status: "approved" | "rejected"
    ) => Promise<void>;
}

export default function AdminApprovals({
    pendingCafes,
    otherCafes,
    btnLoading,
    onApproveStatus,
}: AdminApprovalsProps) {
    return (
        <div className="space-y-8 text-left">
            {}
            <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-display text-lg font-medium text-primary">
                    Pending Café Registrations (
                    {pendingCafes.length})
                </h3>

                {pendingCafes.length === 0 ? (
                    <div className="rounded-md border border-outline-variant/10 bg-surface-container-lowest p-12 text-center">
                        <CheckCircle
                            size={32}
                            className="mx-auto mb-2 text-green-600"
                        />

                        <p className="text-xs italic text-on-surface/55">
                            All café registration requests have been
                            processed.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingCafes.map((cafe: AdminCafeRow) => (
                            <div
                                key={cafe._id}
                                className="flex flex-col items-start justify-between gap-6 rounded-md border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm md:flex-row md:items-center"
                            >
                                <div className="flex-1 space-y-1.5">
                                    <h4 className="font-display text-base font-medium text-primary">
                                        {cafe.name}
                                    </h4>

                                    <p className="text-xs leading-relaxed text-on-surface/55">
                                        {cafe.description ||
                                            "No café description provided."}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-[11px] text-on-surface/50">
                                        <span className="flex items-center gap-1">
                                            <Coffee size={12} />
                                            {cafe.cuisine ||
                                                "Specialty Coffee"}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {cafe.address ||
                                                cafe.location ||
                                                "Location not provided"}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <Users size={12} />
                                            Capacity:{" "}
                                            {cafe.totalSeats || 0} seats
                                        </span>
                                    </div>

                                    <p className="pt-1 text-[10px] font-medium uppercase tracking-wide text-secondary">
                                        Café Owner:{" "}
                                        {cafe.owner?.name || "N/A"}{" "}
                                        {cafe.owner?.email &&
                                            `(${cafe.owner.email})`}
                                    </p>
                                </div>

                                <div className="flex w-full shrink-0 justify-end gap-2 md:w-auto">
                                    <button
                                        type="button"
                                        disabled={btnLoading === cafe._id}
                                        onClick={() =>
                                            onApproveStatus(
                                                cafe._id,
                                                "approved"
                                            )
                                        }
                                        className="cursor-pointer rounded-sm bg-green-600 px-4 py-2 text-[9px] font-medium uppercase tracking-wider text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Approve Café
                                    </button>

                                    <button
                                        type="button"
                                        disabled={btnLoading === cafe._id}
                                        onClick={() =>
                                            onApproveStatus(
                                                cafe._id,
                                                "rejected"
                                            )
                                        }
                                        className="cursor-pointer rounded-sm bg-error px-4 py-2 text-[9px] font-medium uppercase tracking-wider text-white transition-colors hover:bg-error/85 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Reject Café
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {}
            <div className="space-y-4">
                <h3 className="font-display text-lg font-medium text-primary">
                    Registered Cafés ({otherCafes.length})
                </h3>

                {otherCafes.length === 0 ? (
                    <p className="text-xs italic text-on-surface/40">
                        No approved or rejected café records.
                    </p>
                ) : (
                    <div className="overflow-hidden rounded-md border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant/10 bg-surface-container-low text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                                    <th className="p-4">Café</th>
                                    <th className="p-4">
                                        Coffee Focus & Location
                                    </th>
                                    <th className="p-4">Café Owner</th>
                                    <th className="p-4 text-right">
                                        Status / Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-outline-variant/10">
                                {otherCafes.map((cafe: AdminCafeRow) => (
                                    <tr
                                        key={cafe._id}
                                        className="hover:bg-surface/50"
                                    >
                                        <td className="p-4 font-medium text-primary">
                                            <Link
                                                to={`/cafe/${cafe.slug}`}
                                                className="hover:text-secondary"
                                            >
                                                {cafe.name}
                                            </Link>
                                        </td>

                                        <td className="p-4">
                                            {cafe.cuisine ||
                                                "Specialty Coffee"}{" "}
                                            •{" "}
                                            {cafe.location ||
                                                "Location unavailable"}
                                        </td>

                                        <td className="p-4 text-on-surface/55">
                                            {cafe.owner?.name || "N/A"}
                                        </td>

                                        <td className="space-x-3 p-4 text-right">
                                            <span
                                                className={`inline-block rounded-sm px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider ${
                                                    cafe.status === "approved"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-error-container text-on-error-container"
                                                }`}
                                            >
                                                {cafe.status}
                                            </span>

                                            {cafe.status === "approved" ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onApproveStatus(
                                                            cafe._id,
                                                            "rejected"
                                                        )
                                                    }
                                                    className="cursor-pointer text-[10px] font-medium uppercase text-error hover:underline"
                                                >
                                                    Suspend Café
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onApproveStatus(
                                                            cafe._id,
                                                            "approved"
                                                        )
                                                    }
                                                    className="cursor-pointer text-[10px] font-medium uppercase text-green-600 hover:underline"
                                                >
                                                    Re-Approve Café
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
