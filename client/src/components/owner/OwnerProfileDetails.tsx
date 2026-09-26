import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Coffee, Image, MapPin, Phone, Save, Upload } from "lucide-react";
import toast from "react-hot-toast";
import * as api from "../../lib/api";
import { adaptCafe, type DisplayCafe } from "../../lib/adapters";
import { errorMessage } from "../../lib/types";

interface OwnerProfileDetailsProps {
    cafe: DisplayCafe;
    onSaved: (updated: DisplayCafe) => void;
}

export default function OwnerProfileDetails({
    cafe,
    onSaved,
}: OwnerProfileDetailsProps) {
    const [formLoading, setFormLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(cafe.image);
    const [uploadedUrl, setUploadedUrl] = useState("");

    const [cafeName, setCafeName] = useState(cafe.name);
    const [cuisine, setCuisine] = useState(cafe.cuisine);
    const [priceRange, setPriceRange] = useState(cafe.priceRange);
    const [description, setDescription] = useState(cafe.description);
    const [address, setAddress] = useState(cafe.address);
    const [phone, setPhone] = useState(cafe.phone || "");
    const [openingTime, setOpeningTime] = useState(
        cafe.opening_time.slice(0, 5)
    );
    const [closingTime, setClosingTime] = useState(
        cafe.closing_time.slice(0, 5)
    );

    useEffect(() => {
        setCafeName(cafe.name);
        setCuisine(cafe.cuisine);
        setPriceRange(cafe.priceRange);
        setDescription(cafe.description);
        setAddress(cafe.address);
        setPhone(cafe.phone || "");
        setOpeningTime(cafe.opening_time.slice(0, 5));
        setClosingTime(cafe.closing_time.slice(0, 5));
        setImageUrl(cafe.image);
        setUploadedUrl("");
    }, [cafe]);

    const handleImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            toast.error("Café image must be a JPG, PNG, or WEBP file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("The image must be smaller than 5 MB.");
            return;
        }

        setUploading(true);

        try {
            const url = await api.uploadImage(file);
            setUploadedUrl(url);
            setImageUrl(api.resolveImageUrl(url));
            toast.success("Café image uploaded. Save to apply it.");
        } catch (error: unknown) {
            toast.error(errorMessage(error, "Couldn't upload that image."));
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!cafeName.trim()) {
            toast.error("Please enter your café name.");
            return;
        }

        if (!address.trim()) {
            toast.error("Please enter your café address.");
            return;
        }

        if (!openingTime || !closingTime) {
            toast.error("Please set your opening and closing time.");
            return;
        }

        try {
            setFormLoading(true);

            const updated = await api.updateCafe(cafe.id, {
                name: cafeName.trim(),
                cuisine,
                price_range: priceRange,
                description: description.trim() || undefined,
                address: address.trim(),
                phone: phone.trim() || undefined,
                image_url: uploadedUrl || undefined,
                opening_time: `${openingTime}:00`,
                closing_time: `${closingTime}:00`,
            });

            onSaved(adaptCafe(updated));
            toast.success("Café profile saved successfully.");
        } catch (error: unknown) {
            toast.error(errorMessage(error, "Unable to save café details."));
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 text-left">
            <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4">
                <Coffee size={22} className="text-secondary" />

                <div>
                    <h3 className="font-display text-lg font-medium text-primary">
                        Update Café Profile
                    </h3>

                    <p className="text-xs text-on-surface/55 mt-1">
                        Manage your café information and opening hours.
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-on-surface/55">
                    Café Cover Image
                </span>

                <div className="flex flex-col items-center gap-4 rounded-sm border border-outline-variant/30 p-4 md:flex-row">
                    <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-outline-variant/30 bg-surface">
                        {imageUrl ? (
                            <img
                                loading="lazy"
                                decoding="async"
                                src={imageUrl}
                                alt={`${cafe.name} cover`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Image size={24} className="text-on-surface/30" />
                        )}
                    </div>

                    <div className="w-full grow space-y-2 text-center md:text-left">
                        <p className="text-[11px] leading-relaxed text-on-surface/55">
                            Upload a new photo of your café. JPG, PNG, or WEBP,
                            up to 5 MB. The change applies once you save.
                        </p>

                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-outline-variant/40 bg-surface-container-lowest px-4 py-2 text-[10px] font-medium uppercase tracking-wider transition-colors hover:border-primary hover:text-primary">
                            <Upload size={12} />
                            {uploading ? "Uploading..." : "Upload New Image"}

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label
                        htmlFor="cafe-name"
                        className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase"
                    >
                        Café Name
                    </label>

                    <input
                        id="cafe-name"
                        type="text"
                        value={cafeName}
                        onChange={(event) => setCafeName(event.target.value)}
                        placeholder="Enter your café name"
                        className="w-full border border-outline-variant/30 px-4 py-3 text-sm outline-none focus:border-secondary"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="coffee-focus"
                        className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase"
                    >
                        Coffee & Menu Focus
                    </label>

                    <select
                        id="coffee-focus"
                        value={cuisine}
                        onChange={(event) => setCuisine(event.target.value)}
                        className="w-full border border-outline-variant/30 px-4 py-3 text-sm outline-none focus:border-secondary bg-surface-container-lowest"
                    >
                        <option>Specialty Coffee</option>
                        <option>Espresso & Lattes</option>
                        <option>Cold Brew</option>
                        <option>Artisan Bakery</option>
                        <option>Brunch Café</option>
                        <option>Dessert Café</option>
                        <option>Tea & Coffee House</option>
                    </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label
                        htmlFor="cafe-description"
                        className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase"
                    >
                        Café Description
                    </label>

                    <textarea
                        id="cafe-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Describe your coffee, atmosphere, pastries, and signature drinks"
                        rows={4}
                        className="w-full resize-none border border-outline-variant/30 px-4 py-3 text-sm outline-none focus:border-secondary"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="address"
                        className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase"
                    >
                        Café Address
                    </label>

                    <div className="relative">
                        <MapPin
                            size={17}
                            className="absolute left-4 top-3.5 text-secondary"
                        />

                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            placeholder="Enter the complete café address"
                            className="w-full border border-outline-variant/30 py-3 pl-11 pr-4 text-sm outline-none focus:border-secondary"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="phone"
                        className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase"
                    >
                        Café Phone
                    </label>

                    <div className="relative">
                        <Phone
                            size={17}
                            className="absolute left-4 top-3.5 text-secondary"
                        />

                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full border border-outline-variant/30 py-3 pl-11 pr-4 text-sm outline-none focus:border-secondary"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="price-range"
                        className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase"
                    >
                        Café Price Range
                    </label>

                    <select
                        id="price-range"
                        value={priceRange}
                        onChange={(event) => setPriceRange(event.target.value)}
                        className="w-full border border-outline-variant/30 px-4 py-3 text-sm outline-none focus:border-secondary bg-surface-container-lowest"
                    >
                        <option value="$">$ — Casual Coffee</option>
                        <option value="$$">$$ — Specialty Café</option>
                        <option value="$$$">$$$ — Premium Café</option>
                        <option value="$$$$">$$$$ — Luxury Café</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="opening-time"
                        className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase"
                    >
                        Opens At
                    </label>

                    <input
                        id="opening-time"
                        type="time"
                        value={openingTime}
                        onChange={(event) => setOpeningTime(event.target.value)}
                        className="w-full border border-outline-variant/30 px-4 py-3 text-sm outline-none focus:border-secondary"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="closing-time"
                        className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase"
                    >
                        Closes At
                    </label>

                    <input
                        id="closing-time"
                        type="time"
                        value={closingTime}
                        onChange={(event) => setClosingTime(event.target.value)}
                        className="w-full border border-outline-variant/30 px-4 py-3 text-sm outline-none focus:border-secondary"
                        required
                    />
                </div>
            </div>

            <p className="text-[11px] text-on-surface/55 border-t border-outline-variant/10 pt-4">
                Reservation times are generated automatically from your
                opening and closing hours. Table setup (seating capacity)
                isn't editable here yet — that's managed per table.
            </p>

            <div className="flex justify-end border-t border-outline-variant/10 pt-6">
                <button
                    type="submit"
                    disabled={formLoading}
                    className="flex items-center gap-2 bg-primary px-7 py-4 text-xs tracking-widest text-on-primary transition-soft hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Save size={15} />
                    {formLoading ? "SAVING CAFÉ CHANGES..." : "SAVE CAFÉ DETAILS"}
                </button>
            </div>
        </form>
    );
}
