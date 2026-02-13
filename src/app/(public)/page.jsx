import DynamicProductSection from "@/Components/DynamicProductSection";
import BuyView from "@/Components/BuyView";
import FeaturedPromo from "@/Components/FeaturedPromo";
import SocialGallery from "@/Components/SocialGellary";
import FAQSection from "@/Components/FAQSection";
import HeroSlider from "@/Components/HeroSlider";
import { getAllProducts } from "@/actions/productActions";
import { FaWhatsapp } from "react-icons/fa";


export default async function Home() {
  const products = await getAllProducts();

  const getByCategory = (cat) =>
    products.filter((p) => p.category === cat).slice(0, 10);

  const featuredProducts = products
    .filter((p) => p.featured === true)
    .slice(0, 10);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <HeroSlider />

      <div className="container mx-auto space-y-5 my-5">
        <DynamicProductSection
          products={featuredProducts}
          sectionTitle="Top Picks Products For you"
        />

        <DynamicProductSection
          products={getByCategory("digital-product")}
          sectionTitle="DIGITAL PRODUCTS"
        />

        <DynamicProductSection
          products={getByCategory("service")}
          sectionTitle="SERVICES"
        />

        <DynamicProductSection
          products={getByCategory("subscription")}
          sectionTitle="SUBSCRIPTIONS"
        />
        
        <DynamicProductSection
          products={getByCategory("course")}
          sectionTitle="COURSES"
        />
      </div>

      <BuyView />

      <div className="container space-y-5 my-5 mx-auto">
        <DynamicProductSection
          products={getByCategory("automation")}
          sectionTitle="AUTOMATIONS"
        />
        <DynamicProductSection
          products={getByCategory("custom-solution")}
          sectionTitle="CUSTOM SOLUTIONS"
        />

        <DynamicProductSection
          products={getByCategory("social")}
          sectionTitle="SOCIAL MEDIA SERVICES"
        />
      </div>

      <FeaturedPromo />

      <div className="container mx-auto my-5 relative">
        <SocialGallery />
        <FAQSection />
     
      </div>

      {/* Floating WhatsApp Support - Fixed Position corrected */}
      <a
        href="https://wa.me/8801323019182"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 md:right-8 z-[9999] flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 md:px-6 md:py-3.5 rounded-full shadow-2xl font-bold hover:scale-105 transition active:scale-95"
      >
        <FaWhatsapp size={24} />
        <span className="text-sm md:text-base">Need Help?</span>
      </a>
    </main>
  );
}