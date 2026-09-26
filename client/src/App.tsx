import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ScrollToTop from "./components/ScrollToTop.tsx";
import Loader from "./components/Loader.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const Home = lazy(() => import("./pages/Home.tsx"));
const Search = lazy(() => import("./pages/Search.tsx"));
const Favorites = lazy(() => import("./pages/Favorites.tsx"));
const CafeDetail = lazy(() => import("./pages/CafeDetail.tsx"));
const BookingConfirmation = lazy(
    () => import("./pages/BookingConfirmation.tsx")
);
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const OwnerDashboard = lazy(() => import("./pages/owner/OwnerDashboard.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));

function LegacyCafeRedirect() {
    const { slug } = useParams();

    return <Navigate to={slug ? `/cafe/${slug}` : "/search"} replace />;
}

export default function App() {
    return (
        <>
            <ScrollToTop />

            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "#1a1c1c",
                        color: "#ffffff",
                        fontFamily: "Outfit, sans-serif",
                        fontSize: "12px",
                        letterSpacing: "0.02em",
                        borderRadius: "4px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                    },
                }}
            />

            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/search" element={<Search />} />

                    <Route path="/favorites" element={<Favorites />} />

                    <Route path="/cafe/:slug" element={<CafeDetail />} />

                    <Route
                        path="/restaurant/:slug"
                        element={<LegacyCafeRedirect />}
                    />

                    <Route
                        path="/booking/:slug"
                        element={
                            <ProtectedRoute>
                                <BookingConfirmation />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/owner/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["owner"]}>
                                <OwnerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </>
    );
}
