
import DynamicProductSection from "@/Components/DynamicProductSection";
import BuyView from "@/Components/BuyView";
import FeaturedPromo from "@/Components/FeaturedPromo";
import SocialGallery from "@/Components/SocialGellary";
import FAQSection from "@/Components/FAQSection";
import HeroSlider from "@/Components/HeroSlider";
import { getAllProducts } from "@/actions/productActions";

export default async function Home() {

  const products = await getAllProducts();


  const getByCategory = (cat) => 
    products.filter((p) => p.category === cat).slice(0, 10);

  const featuredProducts = products
    .filter((p) => p.featured === true)
    .slice(0, 10);

  return (
    <main>
      <HeroSlider />
      
      <div className="container mx-auto  space-y-12 my-10">
        <DynamicProductSection 
          products={featuredProducts} 
          sectionTitle="Top Picks Products For you" 
        />

        <DynamicProductSection 
          products={getByCategory("offers")} 
          sectionTitle="Featured Offers" 
        />

        <DynamicProductSection 
          products={getByCategory("tools")} 
          sectionTitle="AI & EDUCATION TOOLS" 
        />

        <DynamicProductSection 
          products={getByCategory("google-drive")} 
          sectionTitle="STORAGE SERVICES" 
        />
        
        <DynamicProductSection 
          products={getByCategory("streaming")} 
          sectionTitle="PREMIUM STREAMING" 
        />
      </div>

      <BuyView />

      <div className="container mx-auto  space-y-12 my-10">
        <DynamicProductSection 
          products={getByCategory("gaming")} 
          sectionTitle="GAMING SUBSCRIPTIONS" 
        />
        <DynamicProductSection 
          products={getByCategory("software")} 
          sectionTitle="SOFTWARE SUBSCRIPTIONS" 
        />
        <DynamicProductSection 
          products={getByCategory("vpn")} 
          sectionTitle="VPN SERVICES" 
        />
        <DynamicProductSection 
          products={getByCategory("social")} 
          sectionTitle="SOCIAL MEDIA SERVICES" 
        />
      </div>

      <FeaturedPromo />

      <div className="container mx-auto  my-10">
        <SocialGallery />
        <FAQSection />
      </div>
    </main>
  );
}