import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import AuthModal from "../components/AuthModal.tsx";
import Hero from "../components/home/Hero.tsx";
import CuisineBrowse from "../components/home/CuisineBrowse.tsx";
import TrendingRow from "../components/home/TrendingRow.tsx";
import MembershipSection from "../components/home/MembershipSection.tsx";
import NewsletterCTA from "../components/home/NewsletterCTA.tsx";

export default function Home() {

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-0">
            <Navbar />
            <AuthModal />

            <main className="flex-1">
                <Hero />
                <CuisineBrowse />

                <TrendingRow />

                <MembershipSection />
                <NewsletterCTA />
            </main>

            <Footer />
        </div>
    );
}
