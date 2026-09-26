import hero_bg_img from "./hero_bg.jpg";
import default_cafe_img from "./default_cafe_img.jpeg";
import membership_section_img from "./membership_section.jpg";
import {
    CoffeeIcon,
    CroissantIcon,
    GlobeIcon,
    LeafIcon,
    MailIcon,
    MilkIcon,
    SandwichIcon,
    Share2Icon,
    SnowflakeIcon,
} from "lucide-react";

export const assets = {
    hero_bg_img,
    default_cafe_img,
    membership_section_img,
};

export const dummyReviews = [
    {
        _id: "dummy-rev-1",
        userName: "Emily Watson",
        rating: 5,
        comment:
            "Absolutely phenomenal experience! The ambiance was perfect, and the food was cooked to perfection. A must-visit!",
        visitedDate: "2026-06-10T12:00:00.000Z",
        createdAt: "2026-06-10T12:00:00.000Z",
    },
    {
        _id: "dummy-rev-2",
        userName: "Marcus Vance",
        rating: 4,
        comment:
            "The signature dishes were incredible and the staff was extremely attentive. Will definitely come back for another dinner.",
        visitedDate: "2026-06-08T18:30:00.000Z",
        createdAt: "2026-06-08T18:30:00.000Z",
    },
    {
        _id: "dummy-rev-3",
        userName: "Sophia Loren",
        rating: 5,
        comment:
            "Every course of the tasting menu was a delightful surprise. The pairings were exquisite. High-end dining at its finest.",
        visitedDate: "2026-06-05T20:15:00.000Z",
        createdAt: "2026-06-05T20:15:00.000Z",
    },
];

export const dummyRating = 4.8;
export const dummyReviewCount = 124;

export const footerSections = [
    {
        title: "COMPANY",
        links: [
            { label: "About Us", path: "#" },
            { label: "Partner with Us", path: "#" },
            { label: "Careers", path: "#" },
        ],
    },
    {
        title: "LEGAL",
        links: [
            { label: "Terms of Service", path: "#" },
            { label: "Privacy Policy", path: "#" },
            { label: "Cookies", path: "#" },
        ],
    },
];

export const socialLinks = [
    { icon: GlobeIcon, href: "#" },
    { icon: Share2Icon, href: "#" },
    { icon: MailIcon, href: "#" },
];

export const bottomLinks = [
    { label: "Terms", path: "#" },
    { label: "Privacy", path: "#" },
];

export const cuisines = [
    {
        name: "Specialty Coffee",
        icon: CoffeeIcon,
        label: "SPECIALTY COFFEE",
    },
    {
        name: "Espresso & Lattes",
        icon: MilkIcon,
        label: "ESPRESSO & LATTES",
    },
    {
        name: "Cold Brew",
        icon: SnowflakeIcon,
        label: "COLD BREW",
    },
    {
        name: "Brunch Café",
        icon: SandwichIcon,
        label: "BRUNCH CAFÉ",
    },
    {
        name: "Artisan Bakery",
        icon: CroissantIcon,
        label: "ARTISAN BAKERY",
    },
    {
        name: "Tea House",
        icon: LeafIcon,
        label: "TEA HOUSE",
    },
];

export const dummyUser = {
    _id: "6a32a3c50e88c825d8873f75",
    name: "Alex Mercer",
    email: "alex@example.com",
    phone: "+01234567788",
    role: "owner",
    token: "xyz",
    createdAt: "2026-06-17T13:40:21.669Z",
    updatedAt: "2026-06-17T13:40:21.669Z",
};

export const dummyCafe = [
    {
        _id: "6a32a3c50e88c825d8873f7d",
        name: "Cafe Luna",
        slug: "cafe-luna",
        description:
            "An intimate, Parisian-inspired pastry chamber wrapped in soft blush tones and warm golden light. Café Lumière specializes in delicate viennoiserie and artisan breads, creating a rich sensory dialogue between modern baking craft and classic French charm.",
        cuisine: "Artisan Bakery",
        priceRange: "$$$$",
        rating: 4.9,
        reviewCount: 88,
        location: "Yangon, Myanmar",
        address: "115 Junction Square, Yangon, Myanmar 10006",
        image: "/cafe_1.png",
        chef: "Jean-Luc Picard",
        tags: [
            "Cozy",
            "Pastel Interiors",
            "Candlelit",
            "Artisan Pastries",
        ],
        availableSlots: ["09:00", "10:00", "11:00", "14:00", "16:00"],
        featured: true,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f77",
        status: "approved",
        totalSeats: 45,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },
    {
        _id: "6a32a3c50e88c825d8873f7a",
        name: "Origin Cafe and Bar",
        slug: "origin-cafe-and-bar",
        description:
            "A sun-drenched rooftop café celebrating relaxed brunch culture. Featuring floor-to-ceiling foliage, white marble bistro tables, and panoramic skyline views, Terraza Bloom serves hand-crafted brunch plates paired with bright botanical mocktails.",
        cuisine: "Brunch Café",
        priceRange: "$$$",
        rating: 4.5,
        reviewCount: 205,
        location: "Yangon, Myanmar",
        address: "244 Fifth Ave Rooftop, Yangon, Myanmar 10006",
        image: "/cafe_9.jpg",
        chef: "Elena Rossi",
        tags: [
            "Rooftop",
            "Skyline Views",
            "Brunch Plates",
            "Botanical Mocktails",
        ],
        availableSlots: [
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
        ],
        featured: true,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f77",
        status: "approved",
        totalSeats: 30,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },
    {
        _id: "6a32a3c50e88c825d8873f79",
        name: "Kuro Coffee House",
        slug: "kuro-coffee-house",
        description:
            "An atmospheric, moody sanctuary for serious coffee lovers. Seated at a dark, polished basalt-stone bar, guests experience a deeply focused specialty coffee tasting. Head barista Kenji Sato pulls single-origin beans sourced directly from Tokyo's finest roasters into elegant, edible poetry in a cup.",
        cuisine: "Specialty Coffee",
        priceRange: "$$$$",
        rating: 4.8,
        reviewCount: 92,
        location: "Yangon, Myanmar",
        address: "18 Orchard St, Yangon, Myanmar 10002",
        image: "/cafe_2.jpg",
        chef: "Kenji Sato",
        tags: [
            "Single-Origin",
            "Basalt Counter",
            "Pour-Over Bar",
            "Zen Atmosphere",
        ],
        availableSlots: ["08:00", "09:30", "11:00"],
        featured: true,
        exclusive: true,
        owner: "6a32a3c50e88c825d8873f77",
        status: "approved",
        totalSeats: 25,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },
    {
        _id: "6a32a3c50e88c825d8873f7c",
        name: "Rangoon Tea House",
        slug: "rangoon-tea-house",
        description:
            "A bright, airy conservatory celebrating organic, plant-forward tea culture. Nestled under glass ceilings with floor-to-ceiling botanicals, Flora Garden Tea House transforms fresh seasonal leaves and blends into delicate, high-end tea service.",
        cuisine: "Tea House",
        priceRange: "$$$",
        rating: 4.6,
        reviewCount: 110,
        location: "Yangon, Myanmar",
        address: "90 Grand St, Yangon, Myanmar 10013",
        image: "/cafe_6.png",
        chef: "Chloe Mercer",
        tags: [
            "Loose-Leaf Tea",
            "Glasshouse",
            "Organic",
            "Bright & Airy",
        ],
        availableSlots: [
            "11:30",
            "13:00",
            "14:30",
            "16:00",
            "17:30",
        ],
        featured: false,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f77",
        status: "approved",
        totalSeats: 40,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },
    {
        _id: "6a32a3c50e88c825d8873f7b",
        name: "Manual Cafe",
        slug: "manual-cafe",
        description:
            "An upscale modern cold brew bar with exposed brick walls, leather booths, and warm, industrial-chic pendant lighting. Offering slow-steeped cold brews and nitro pours crafted with house-roasted beans. Café culture elevated into a sophisticated experience.",
        cuisine: "Coffee & Cold Brew",
        priceRange: "$$$$",
        rating: 4.3,
        reviewCount: 142,
        location: "Yangon, Myanmar",
        address: "320 Ahlone Rd, Yangon, Myanmar 10012",
        image: "/cafe_5.png",
        chef: "Marcus Vance",
        tags: [
            "Nitro Cold Brew",
            "House-Roasted",
            "Modern Lighting",
            "Coffee Bar",
        ],
        availableSlots: ["10:00", "12:00", "14:00", "16:00", "18:00"],
        featured: false,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f77",
        status: "approved",
        totalSeats: 35,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },
    {
        _id: "6a32a3c50e88c825d8873f78",
        name: "Dear Tokyo Cafe & Bar",
        slug: "dear-tokyo-cafe-bar",
        description:
            "An avant-garde journey through modern espresso craft. L'Atelier Espresso Bar blends classic French café foundations with contemporary latte-art artistry, resulting in a sensory coffee experience that is both theatrical and deeply satisfying. Set in a gorgeous high-ceilinged room with minimal charcoal and gold design language.",
        cuisine: "Espresso & Lattes",
        priceRange: "$$$$",
        rating: 4.7,
        reviewCount: 124,
        location: "Yangon, Myanmar",
        address: "420 U Sein St, Yangon, Myanmar 10003",
        image: "/cafe_4.png",
        chef: "Jean-Pierre Dubois",
        tags: [
            "Japanese Food",
            "Luxury Cocktail",
            "Friendly",
            "Romantic",
        ],
        availableSlots: [
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
        ],
        featured: true,
        exclusive: true,
        owner: "6a32a3c50e88c825d8873f77",
        status: "approved",
        totalSeats: 20,
        createdAt: "2026-06-17T13:40:21.827Z",
        updatedAt: "2026-06-17T13:40:21.827Z",
    },
    {
        _id: "6a32a3c50e88c825d8873f7d",
        name: "Café Dejavu",
        slug: "cafe-dejavu",
        description:
            "An intimate, Parisian-inspired pastry chamber wrapped in soft blush tones and warm golden light. Café Lumière specializes in delicate viennoiserie and artisan breads, creating a rich sensory dialogue between modern baking craft and classic French charm.",
        cuisine: "European Food and Café",
        priceRange: "$$$$",
        rating: 4.4,
        reviewCount: 76,
        location: "Yangon, Myanmar",
        address: "115 Main St, Yangon, Myanmar 10006",
        image: "/cafe_7.png",
        chef: "Jean-Luc Picard",
        tags: [
            "Cozy",
            "Pastel Interiors",
            "Candlelit",
            "Artisan Pastries",
        ],
        availableSlots: ["09:00", "10:00", "11:00", "14:00", "16:00"],
        featured: true,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f77",
        status: "pending",
        totalSeats: 45,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },
    {
        _id: "6a32a3c50e88c825d8873f7a",
        name: "Shwe Pu Zun Cafeteria & Bakery House",
        slug: "shwe-pu-zun-cafeteria-bakery-house",
        description:
            "Vegetarian friendly, Vegan options. Breakfast, Brunch, Drinks.",
        cuisine: "Café and Desserts",
        priceRange: "$$$",
        rating: 4.2,
        reviewCount: 231,
        location: "Yangon, Myanmar",
        address: "244 Fifth Ave Rooftop, Yangon, Myanmar 10001",
        image: "/cafe_3.jpg",
        chef: "Elena Rossi",
        tags: ["Drinks", "Cakes", "Sandwiches", "Cookies"],
        availableSlots: [
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
        ],
        featured: true,
        exclusive: false,
        owner: "6a32a3c50e88c825d8873f77",
        status: "pending",
        totalSeats: 30,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },
];

export const dummyAvailability = [
    {
        time: "18:00",
        availableSeats: 45,
        isAvailable: true,
    },
    {
        time: "19:00",
        availableSeats: 45,
        isAvailable: true,
    },
    {
        time: "20:00",
        availableSeats: 45,
        isAvailable: true,
    },
    {
        time: "21:00",
        availableSeats: 45,
        isAvailable: true,
    },
    {
        time: "22:00",
        availableSeats: 45,
        isAvailable: true,
    },
];

export const dummyBookingData = {
    user: "6a32a3c50e88c825d8873f75",
    cafe: {
        _id: "6a32a3c50e88c825d8873f7d",
        name: "Café Luna",
        location: "Yangon, Myanmar",
        address: "115 Greenwich St, Yangon, Myanmar 10006",
        image: "/cafe_5.png",
    },
    date: "2026-06-25T00:00:00.000Z",
    time: "22:00",
    guests: 2,
    occasion: "",
    specialRequests: "",
    status: "confirmed",
    _id: "6a34e4caf866d0ae1e98e487",
    createdAt: "2026-06-19T06:42:18.305Z",
    updatedAt: "2026-06-19T06:42:18.305Z",
    bookingId: "GR-71B448A7",
};

export const dummyMyBookingsData = [
    {
        _id: "6a34e4caf866d0ae1e98e487",
        user: "6a32a3c50e88c825d8873f75",
        cafe: {
            _id: "6a32a3c50e88c825d8873f7d",
            name: "Café Luna",
            slug: "cafe-luna",
            location: "Yangon, Myanmar",
            address: "115 Greenwich St, Yangon, Myanmar 10006",
            image: "/cafe_5.png",
        },
        date: "2026-06-25T00:00:00.000Z",
        time: "10:00",
        guests: 2,
        occasion: "",
        specialRequests: "",
        status: "confirmed",
        createdAt: "2026-06-19T06:42:18.305Z",
        updatedAt: "2026-06-19T06:42:18.305Z",
        bookingId: "GR-71B448A7",
    },
    {
        _id: "6a34e55af866d0ae1e98e489",
        user: "6a32a3c50e88c825d8873f75",
        cafe: {
            _id: "6a32a3c50e88c825d8873f7a",
            name: "Terraza Bloom",
            slug: "terraza-bloom",
            location: "Yangon, Myanmar",
            address: "244 Fifth Ave Rooftop, Yangon, Myanmar 10001",
            image: "/cafe_3.jpg",
        },
        date: "2026-06-19T00:00:00.000Z",
        time: "11:00",
        guests: 2,
        occasion: "",
        specialRequests: "",
        status: "confirmed",
        createdAt: "2026-06-19T06:44:42.294Z",
        updatedAt: "2026-06-19T06:44:42.294Z",
        bookingId: "GR-17743C76",
    },
    {
        _id: "6a34e54ff866d0ae1e98e488",
        user: "6a32a3c50e88c825d8873f75",
        cafe: {
            _id: "6a32a3c50e88c825d8873f78",
            name: "Dear Tokyo Cafe & Bar",
            slug: "dear-tokyo-cafe-bar",
            location: "Yangon, Myanmar",
            address: "420 U Sein St, Yangon, Myanmar 10003",
            image: "/cafe_4.png",
        },
        date: "2026-06-19T00:00:00.000Z",
        time: "09:00",
        guests: 2,
        occasion: "",
        specialRequests: "",
        status: "confirmed",
        createdAt: "2026-06-19T06:44:31.052Z",
        updatedAt: "2026-06-19T06:44:31.052Z",
        bookingId: "GR-F82DDD63",
    },
];

export const dummyAdminStats = {
    users: {
        totalUsers: 1,
        totalOwners: 1,
        total: 2,
    },
    cafes: {
        total: 6,
    },
    bookings: {
        total: 1,
    },
    latestBookings: [
        {
            _id: "6a34f88580587be1dada87ba",
            user: {
                _id: "6a34ef24a4d96fc34d9c906b",
                name: "Marc Dubois",
                email: "owner@example.com",
            },
            cafe: {
                _id: "6a34ef24a4d96fc34d9c906d",
                name: "Kuro Coffee House",
            },
            date: "2026-06-19T00:00:00.000Z",
            time: "09:30",
            guests: 2,
            occasion: "",
            specialRequests: "",
            status: "confirmed",
            createdAt: "2026-06-19T08:06:29.155Z",
            updatedAt: "2026-06-19T08:06:29.155Z",
            bookingId: "GR-EB39904C",
        },
    ],
};

export const dummyFeaturedCafes = [
    dummyCafe[0],
    dummyCafe[1],
    dummyCafe[2],
];

export interface Restaurant {
    _id: string;
    name: string;
    slug: string;
    description: string;
    cuisine: string;
    priceRange: string;
    rating: number;
    reviewCount: number;
    location: string;
    address: string;
    image: string;
    chef: string;
    tags: string[];
    availableSlots: string[];
    featured: boolean;
    exclusive: boolean;
    owner: string;
    status: string;
    totalSeats: number;
    createdAt: string;
    updatedAt: string;
}

export const dummyRestaurant: Restaurant[] = [
    {
        _id: "dummy-restaurant-1",
        name: "New Café",
        slug: "new-cafe",
        description:
            "A cozy café serving specialty coffee and fresh pastries.",
        cuisine: "Specialty Coffee",
        priceRange: "$$",
        rating: 0,
        reviewCount: 0,
        location: "Yangon, Myanmar",
        address: "123 Coffee Street, Yangon, Myanmar",
        image: default_cafe_img,
        chef: "",
        tags: [],
        availableSlots: [
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
        ],
        featured: false,
        exclusive: false,
        owner: "dummy-owner",
        status: "pending",
        totalSeats: 20,
        createdAt: "2026-06-17T13:40:21.828Z",
        updatedAt: "2026-06-17T13:40:21.828Z",
    },
];