import { MapPin, Clock, Utensils, ChefHat } from "lucide-react";
import type { DisplayCafe } from "../../lib/adapters";

interface CafeInfoProps {
    cafe: DisplayCafe | null;
}

export default function CafeInfo({ cafe }: CafeInfoProps) {
    if (!cafe) return null;

    return (
        <div className="space-y-12 text-left">
            {}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-outline-variant/10">
                <div className="text-center border-r border-outline-variant/10 px-2">
                    <ChefHat className="text-secondary mx-auto mb-2" size={20} />
                    <span className="block text-[9px] tracking-wider text-on-surface/55 uppercase">BARISTA</span>
                    <span className="text-xs text-primary mt-1 block">{cafe.chef}</span>
                </div>
                <div className="text-center border-r border-outline-variant/10 px-2">
                    <Utensils className="text-secondary mx-auto mb-2" size={20} />
                    <span className="block text-[9px] tracking-wider text-on-surface/55 uppercase">SPECIALTY</span>
                    <span className="text-xs text-primary mt-1 block">{cafe.cuisine}</span>
                </div>
                <div className="text-center px-2">
                    <Clock className="text-secondary mx-auto mb-2" size={20} />
                    <span className="block text-[9px] tracking-wider text-on-surface/55 uppercase">OPENING</span>
                    <span className="text-xs text-primary mt-1 block">{cafe.hoursLabel || "7:00 AM - 8:00 PM"}</span>
                </div>
            </div>

            {}
            <section className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-primary">About the Dining Room</h3>
                <p className="text-sm text-on-surface/55 leading-relaxed">{cafe.description}</p>
                <div className="flex items-start gap-2 text-sm text-on-surface/55 pt-2">
                    <MapPin size={16} className="text-secondary shrink-0 mt-0.5" />
                    <span>{cafe.address}</span>
                </div>
            </section>
        </div>
    );
}
