import React, { useState } from "react";
import { Coffee, Upload, Image } from "lucide-react";
import toast from "react-hot-toast";
import { dummyRestaurant } from "../../assets/assets.ts";

interface RestaurantWizardProps {
    setRestaurant: (restaurant: any) => void;
}

export default function RestaurantWizard({
    setRestaurant,
}: RestaurantWizardProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [priceRange, setPriceRange] = useState("$$");
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");
    const [chef, setChef] = useState("");
    const [tags, setTags] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
    ]);
    const [totalSeats, setTotalSeats] = useState("20");
    const [formLoading, setFormLoading] = useState(false);

    const defaultSlots = [
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
    ];

    const toggleSlot = (slot: string) => {
        setAvailableSlots((currentSlots) =>
            currentSlots.includes(slot)
                ? currentSlots.filter((currentSlot) => currentSlot !== slot)
                : [...currentSlots, slot].sort()
        );
    };

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid café image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("The image must be smaller than 5 MB.");
            return;
        }

        if (imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleCreateRestaurant = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter your café name.");
            return;
        }

        if (!cuisine.trim()) {
            toast.error("Please enter your coffee and menu focus.");
            return;
        }

        if (!location.trim()) {
            toast.error("Please enter your café location.");
            return;
        }

        if (!address.trim()) {
            toast.error("Please enter your café address.");
            return;
        }

        if (!totalSeats || Number(totalSeats) < 1) {
            toast.error("Seating capacity must be at least 1.");
            return;
        }

        if (availableSlots.length === 0) {
            toast.error("Please select at least one reservation time.");
            return;
        }

        setFormLoading(true);

        try {
            const formData = new FormData();

            formData.append("name", name.trim());
            formData.append("description", description.trim());
            formData.append("cuisine", cuisine.trim());
            formData.append("priceRange", priceRange);
            formData.append("location", location.trim());
            formData.append("address", address.trim());
            formData.append("chef", chef.trim());
            formData.append("tags", tags.trim());
            formData.append("availableSlots", availableSlots.join(","));
            formData.append("totalSeats", totalSeats);

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const baseRestaurant = dummyRestaurant[0];

            if (!baseRestaurant) {
                toast.error("Restaurant data is unavailable.");
                return;
            }

            setRestaurant({
                ...baseRestaurant,
                name: name.trim(),
                slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
                description: description.trim(),
                cuisine: cuisine.trim(),
                priceRange,
                location: location.trim(),
                address: address.trim(),
                chef: chef.trim(),
                tags: tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                availableSlots,
                totalSeats: Number(totalSeats),
                image: imagePreview || baseRestaurant.image,
                status: "pending",
                updatedAt: new Date().toISOString(),
            });

            toast.success(
                "Café profile submitted successfully! Awaiting admin approval."
            );
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    "Failed to register café."
            );
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-surface-container-lowest border border-outline-variant/20 p-8 md:p-10 shadow-sm rounded-md space-y-6">
            <div className="text-center space-y-2 pb-6 border-b border-outline-variant/10">
                <Coffee
                    size={36}
                    className="mx-auto text-secondary"
                />

                <h2 className="font-display text-xl font-medium text-primary">
                    Set Up Your Café Profile
                </h2>

                <p className="text-xs text-on-surface/55">
                    Add your café details, coffee specialties, seating
                    capacity, and reservation times. Your profile will be
                    reviewed by the admin before going live.
                </p>
            </div>

            <form
                onSubmit={handleCreateRestaurant}
                className="space-y-5 text-left"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                            Café Name
                        </label>

                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="e.g. The Roasted Bean"
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                            Coffee & Menu Focus
                        </label>

                        <input
                            type="text"
                            required
                            value={cuisine}
                            onChange={(event) =>
                                setCuisine(event.target.value)
                            }
                            placeholder="e.g. Specialty Coffee, Brunch"
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                        Café Description
                    </label>

                    <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="Describe your coffee, pastries, atmosphere, seating, and signature drinks..."
                        className="w-full bg-surface-container-low/30 border border-outline-variant/40 p-3 text-xs focus:border-secondary focus:outline-none rounded-sm"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                        Café Cover Image
                    </label>

                    <div className="flex flex-col md:flex-row gap-4 items-center bg-surface-container-low/30 border border-outline-variant/40 p-4 rounded-sm">
                        <div className="relative w-32 h-24 bg-surface border border-outline-variant/30 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Café preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Image
                                    size={24}
                                    className="text-on-surface/30"
                                />
                            )}
                        </div>

                        <div className="grow space-y-2 text-center md:text-left w-full">
                            <p className="text-[11px] text-on-surface/55 leading-relaxed">
                                Upload a high-resolution photo of your café,
                                coffee bar, seating area, pastries, or
                                signature drinks. Supports JPG, PNG, and WEBP.
                            </p>

                            <label className="inline-flex items-center gap-1.5 px-4 py-2 border border-outline-variant/40 hover:border-primary hover:text-primary transition-colors text-[10px] font-medium tracking-wider uppercase rounded-sm cursor-pointer bg-surface-container-lowest">
                                <Upload size={12} />

                                {imageFile
                                    ? "Change Café Image"
                                    : "Upload Café Image"}

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            {imageFile && (
                                <span className="block text-[10px] text-secondary font-medium">
                                    Selected: {imageFile.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                            Café Price Range
                        </label>

                        <select
                            value={priceRange}
                            onChange={(event) =>
                                setPriceRange(event.target.value)
                            }
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        >
                            <option value="$">
                                $ (Casual Coffee)
                            </option>
                            <option value="$$">
                                $$ (Specialty Café)
                            </option>
                            <option value="$$$">
                                $$$ (Premium Café)
                            </option>
                            <option value="$$$$">
                                $$$$ (Luxury Café)
                            </option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                            Location
                        </label>

                        <input
                            type="text"
                            required
                            value={location}
                            onChange={(event) =>
                                setLocation(event.target.value)
                            }
                            placeholder="e.g. Manhattan, NY"
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                            Seating Capacity
                        </label>

                        <input
                            type="number"
                            min="1"
                            required
                            value={totalSeats}
                            onChange={(event) =>
                                setTotalSeats(event.target.value)
                            }
                            placeholder="20"
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                            Café Address
                        </label>

                        <input
                            type="text"
                            required
                            value={address}
                            onChange={(event) =>
                                setAddress(event.target.value)
                            }
                            placeholder="123 Coffee Lane, New York"
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                            Head Barista or Café Manager
                        </label>

                        <input
                            type="text"
                            value={chef}
                            onChange={(event) =>
                                setChef(event.target.value)
                            }
                            placeholder="e.g. Alex Morgan"
                            className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                        Café Tags
                    </label>

                    <input
                        type="text"
                        value={tags}
                        onChange={(event) => setTags(event.target.value)}
                        placeholder="Quiet workspace, Wi-Fi, Outdoor Seating, Pastries"
                        className="w-full bg-surface-container-low/30 border border-outline-variant/40 px-3 py-2.5 text-xs focus:border-secondary focus:outline-none rounded-sm"
                    />

                    <p className="text-[10px] text-on-surface/45">
                        Separate tags with commas.
                    </p>
                </div>

                <div className="space-y-2">
                    <span className="block text-[10px] font-medium text-on-surface/55 tracking-wider uppercase">
                        Available Reservation Times
                    </span>

                    <div className="flex flex-wrap gap-2">
                        {defaultSlots.map((slot) => {
                            const isSelected =
                                availableSlots.includes(slot);

                            return (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => toggleSlot(slot)}
                                    className={`py-1.5 px-3 text-[10px] border transition-colors cursor-pointer rounded-sm ${
                                        isSelected
                                            ? "bg-primary border-primary text-on-primary"
                                            : "border-outline-variant/40 text-on-surface/55 hover:border-primary"
                                    }`}
                                >
                                    {slot}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full bg-primary hover:bg-secondary disabled:opacity-60 disabled:cursor-not-allowed text-on-primary text-xs font-medium tracking-widest uppercase py-3.5 transition-colors cursor-pointer"
                >
                    {formLoading
                        ? "SUBMITTING CAFÉ..."
                        : "REGISTER CAFÉ"}
                </button>
            </form>
        </div>
    );
}