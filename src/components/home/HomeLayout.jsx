// src/components/home/HomeLayout.jsx
import HeroSlider from "./HeroSlider";
import ProductGrid from "./ProductGrid";
import ProductDetails from "./ProductDetails";
import StreamingSection from "./StreamingSection";
import AiToolsSection from "./AiToolsSection"; // ১. ইম্পোর্ট করুন
import MusicAudioSection from "./MusicAudioSection";
import GamingSection from "./GamingSection";
import ProductivitySection from "./ProductivitySection";
import UtilitySection from "./UtilitySection";
import VpnSection from "./VpnSection";
import DatingSection from "./DatingSection";
import FeaturedPromo from "./FeaturedPromo";
import SocialGallery from "./SocialGallery";

const HomeLayout = () => {
    return (
        <div className="w-full min-h-screen bg-black pb-20">

            <header className="w-full">
                <HeroSlider />
            </header>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">

                {/* প্রোডাক্ট গ্রিড */}
                <section>
                    <ProductGrid />
                </section>

                {/* প্রোডাক্ট ডিটেইলস */}
                <section className="mt-16 border-t border-gray-900 pt-10">
                    <ProductDetails />
                </section>

                {/* ২. স্ট্রিমিং সেকশন + ব্যানার (নতুন যোগ করা হলো) */}
                <section className="mt-10">
                    <StreamingSection />
                </section>

                <section className="mt-10">
                    <AiToolsSection />
                </section>

                <section className="mt-10">
                    <MusicAudioSection />
                </section>

                <section className="mt-10">
                    <GamingSection />
                </section>

                <section className="mt-10">
                    <ProductivitySection />
                </section>

                <section className="mt-10">
                    <UtilitySection />
                </section>

                <section className="mt-10">
                    <VpnSection />
                </section>

                <section className="mt-10">
                    <DatingSection />
                </section>

                <section className="mt-16">
                    <FeaturedPromo />
                </section>

                <section className="mt-16">
                    <SocialGallery />
                </section>

            </main>
        </div>
    );
};

export default HomeLayout;