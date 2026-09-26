import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import * as api from "../lib/api";
import type { User } from "../lib/api";

export interface AuthResult {
    ok: boolean;
    error?: string;
    user?: User;
}

interface AppContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    login: (email: string, password: string) => Promise<AuthResult>;
    register: (
        name: string,
        email: string,
        password: string,
        phone?: string,
        role?: "user" | "owner"
    ) => Promise<AuthResult>;
    logout: () => void;
    favorites: string[];
    favoritesLoading: boolean;
    isFavorite: (cafeId: string) => boolean;
    toggleFavorite: (cafeId: string) => Promise<boolean>;
    darkMode: boolean;
    toggleDarkMode: () => void;
    ratings: Record<string, number>;
    getRating: (cafeId: string) => number;
    setRating: (cafeId: string, rating: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DARK_MODE_KEY = "cafeCircleDarkMode";
const RATINGS_KEY = "cafeCircleRatings";

function readStored<T>(key: string, fallback: T): T {
    try {
        const stored = localStorage.getItem(key);
        return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
        return fallback;
    }
}

interface Props {
    children: React.ReactNode;
}

export const AppContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(api.getToken());
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const hydrated = useRef(false);

    const [favorites, setFavorites] = useState<string[]>([]);
    const [favoritesLoading, setFavoritesLoading] = useState(false);

    const [darkMode, setDarkMode] = useState<boolean>(
        () => localStorage.getItem(DARK_MODE_KEY) === "true"
    );

    const [ratings, setRatings] = useState<Record<string, number>>(() =>
        readStored<Record<string, number>>(RATINGS_KEY, {})
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem(DARK_MODE_KEY, String(darkMode));
    }, [darkMode]);

    const toggleDarkMode = useCallback(
        () => setDarkMode((current) => !current),
        []
    );

    const isFavorite = useCallback(
        (cafeId: string) => favorites.includes(cafeId),
        [favorites]
    );

    const toggleFavorite = useCallback(
        async (cafeId: string): Promise<boolean> => {
            if (!user) {
                setAuthModalOpen(true);
                return false;
            }

            const numericId = Number(cafeId);
            const wasFavorite = favorites.includes(cafeId);

            setFavorites((current) =>
                wasFavorite
                    ? current.filter((id) => id !== cafeId)
                    : [...current, cafeId]
            );

            try {
                if (wasFavorite) {
                    await api.removeFavorite(numericId);
                } else {
                    await api.addFavorite(numericId);
                }

                return true;
            } catch {
                setFavorites((current) =>
                    wasFavorite
                        ? [...current, cafeId]
                        : current.filter((id) => id !== cafeId)
                );

                return false;
            }
        },
        [favorites, user]
    );

    const getRating = useCallback(
        (cafeId: string) => ratings[cafeId] ?? 0,
        [ratings]
    );

    const setRating = useCallback((cafeId: string, rating: number) => {
        setRatings((current) => {
            const next = { ...current, [cafeId]: rating };
            localStorage.setItem(RATINGS_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const login = useCallback(
        async (email: string, password: string): Promise<AuthResult> => {
            try {
                const res = await api.login(email, password);
                api.setToken(res.access_token);
                setTokenState(res.access_token);
                setUser(res.user);
                return { ok: true, user: res.user };
            } catch (error) {
                return {
                    ok: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unable to sign in right now.",
                };
            }
        },
        []
    );

    const register = useCallback(
        async (
            name: string,
            email: string,
            password: string,
            phone?: string,
            role: "user" | "owner" = "user"
        ): Promise<AuthResult> => {
            try {
                await api.register({
                    name,
                    email,
                    password,
                    phone,
                    role: role === "owner" ? "owner" : "user",
                });
            } catch (error) {
                return {
                    ok: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unable to create the account right now.",
                };
            }

            return login(email, password);
        },
        [login]
    );

    const logout = useCallback(() => {
        api.clearToken();
        setTokenState(null);
        setUser(null);
        setFavorites([]);
    }, []);

    useEffect(() => {
        let cancelled = false;

        if (!user) {
            setFavorites([]);
            return;
        }

        const loadFavorites = async () => {
            setFavoritesLoading(true);

            try {
                const ids = await api.getFavoriteIds();
                if (!cancelled) setFavorites(ids.map(String));
            } catch {
                if (!cancelled) setFavorites([]);
            } finally {
                if (!cancelled) setFavoritesLoading(false);
            }
        };

        void loadFavorites();

        return () => {
            cancelled = true;
        };
    }, [user]);

    useEffect(() => {
        let cancelled = false;

        const loadCurrentUser = async () => {
            if (token && !hydrated.current) {
                hydrated.current = true;

                try {
                    const me = await api.getCurrentUser();
                    if (!cancelled) setUser(me);
                } catch {
                    api.clearToken();
                    if (!cancelled) {
                        setTokenState(null);
                        setUser(null);
                    }
                }
            }

            if (!cancelled) setLoading(false);
        };

        void loadCurrentUser();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const value = useMemo<AppContextType>(
        () => ({
            user,
            token,
            loading,
            isAuthenticated: Boolean(user),
            isAuthModalOpen,
            setAuthModalOpen,
            login,
            register,
            logout,
            favorites,
            favoritesLoading,
            isFavorite,
            toggleFavorite,
            darkMode,
            toggleDarkMode,
            ratings,
            getRating,
            setRating,
        }),
        [
            user,
            token,
            loading,
            isAuthModalOpen,
            login,
            register,
            logout,
            favorites,
            favoritesLoading,
            isFavorite,
            toggleFavorite,
            darkMode,
            toggleDarkMode,
            ratings,
            getRating,
            setRating,
        ]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be used inside AppContextProvider");
    }

    return context;
};
