import { useEffect, useState } from "react";
import {
    Heart,
    LogIn,
    Menu,
    Moon,
    ShieldCheck,
    Sun,
    User,
    X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Logo from "./Logo";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        user,
        setAuthModalOpen,
        logout,
        darkMode,
        toggleDarkMode,
        favorites,
    } = useAppContext();

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHomePage = location.pathname === "/";
    const lightText = isHomePage && !scrolled;

    const handleDashboardClick = () => {
        setMobileMenuOpen(false);

        if (user) {
            navigate("/dashboard");
        } else {
            setAuthModalOpen(true);
        }
    };

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        navigate("/");
    };

    const navTextClass = lightText
        ? "text-white/80 hover:text-white"
        : "text-on-surface/55 hover:text-primary";

    return (
        <header
            className={`fixed top-0 z-40 w-full transition-all ${
                scrolled || !isHomePage
                    ? "bg-surface-container-lowest/95 shadow-sm backdrop-blur-md"
                    : "bg-transparent"
            }`}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
                <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Café Circle home"
                >
                    <Logo
                        bold={darkMode || lightText}
                        className={`h-9 text-[13px] ${
                            darkMode || lightText
                                ? "text-white"
                                : "text-primary"
                        }`}
                    />
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <Link
                        to="/search"
                        className={`border-b-2 border-transparent pb-1 text-sm transition-colors ${
                            location.pathname.startsWith("/search")
                                ? "border-secondary text-secondary"
                                : navTextClass
                        }`}
                    >
                        Cafés
                    </Link>

                    <Link
                        to="/favorites"
                        className={`flex items-center gap-1.5 border-b-2 border-transparent pb-1 text-sm transition-colors ${
                            location.pathname.startsWith("/favorites")
                                ? "border-secondary text-secondary"
                                : navTextClass
                        }`}
                    >
                        <Heart
                            size={14}
                            fill={
                                favorites.length > 0 ? "currentColor" : "none"
                            }
                        />
                        Favorites
                        {favorites.length > 0 && (
                            <span className="ml-0.5 rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-medium leading-none text-on-secondary">
                                {favorites.length}
                            </span>
                        )}
                    </Link>

                    <button
                        type="button"
                        onClick={handleDashboardClick}
                        className={`border-b-2 border-transparent pb-1 text-left text-sm transition-colors ${
                            location.pathname === "/dashboard"
                                ? "border-secondary text-secondary"
                                : navTextClass
                        }`}
                    >
                        Café Reservations
                    </button>

                    {user ? (
                        <>
                            {user.role === "owner" && (
                                <Link
                                    to="/owner/dashboard"
                                    className={`flex items-center gap-2 text-sm ${navTextClass}`}
                                >
                                    <ShieldCheck size={14} />
                                    Café Owner Panel
                                </Link>
                            )}

                            {user.role === "admin" && (
                                <Link
                                    to="/admin/dashboard"
                                    className={`flex items-center gap-2 text-sm ${navTextClass}`}
                                >
                                    <ShieldCheck size={14} />
                                    Admin Console
                                </Link>
                            )}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className={`flex items-center gap-2 text-sm ${navTextClass}`}
                            >
                                <LogIn size={14} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setAuthModalOpen(true)}
                            className={`flex items-center gap-2 text-sm ${navTextClass}`}
                        >
                            <User size={14} />
                            Sign In
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        aria-label={
                            darkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                        className={`cursor-pointer rounded-full p-1.5 transition-colors ${navTextClass}`}
                    >
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    className={`cursor-pointer md:hidden ${
                        lightText ? "text-white" : "text-primary"
                    }`}
                    aria-label="Toggle café navigation"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {mobileMenuOpen && (
                <div className="border-t border-outline-variant/20 bg-surface-container-lowest px-6 py-6 md:hidden">
                    <div className="flex flex-col gap-5">
                        <Link
                            to="/search"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-base text-on-surface hover:text-primary"
                        >
                            Cafés
                        </Link>

                        <Link
                            to="/favorites"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 text-base text-on-surface hover:text-primary"
                        >
                            <Heart
                                size={16}
                                fill={
                                    favorites.length > 0
                                        ? "currentColor"
                                        : "none"
                                }
                            />
                            Favorites
                            {favorites.length > 0 && (
                                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-medium leading-none text-on-secondary">
                                    {favorites.length}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            onClick={handleDashboardClick}
                            className="text-left text-base text-on-surface hover:text-primary"
                        >
                            Café Reservations
                        </button>

                        {user ? (
                            <>
                                {user.role === "owner" && (
                                    <Link
                                        to="/owner/dashboard"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="text-sm font-medium text-on-surface/55 hover:text-primary"
                                    >
                                        Café Owner Console
                                    </Link>
                                )}

                                {user.role === "admin" && (
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="text-sm font-medium text-on-surface/55 hover:text-primary"
                                    >
                                        Admin Console
                                    </Link>
                                )}

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-left text-sm font-medium text-on-surface/55 hover:text-primary"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setAuthModalOpen(true);
                                }}
                                className="text-left text-sm font-medium text-on-surface/55 hover:text-primary"
                            >
                                Sign In
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            className="flex items-center gap-2 text-left text-sm font-medium text-on-surface/55 hover:text-primary"
                        >
                            {darkMode ? (
                                <Sun size={16} />
                            ) : (
                                <Moon size={16} />
                            )}
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
