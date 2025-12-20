


import getDB from "@/lib/mongodb";
import DynamicProductSection from "@/Components/DynamicProductSection";
import BuyView from "@/Components/BuyView";
import FeaturedPromo from "@/Components/FeaturedPromo";
import SocialGallery from "@/Components/SocialGellary";
import FAQSection from "@/Components/FAQSection";
import HeroSlider from "@/Components/HeroSlider";

export default async function Home() {
  // ১. ডাটাবেস থেকে সব একটিভ প্রোডাক্ট একবারে নিয়ে আসা
  const { db } = await getDB();
  const allProducts = await db
    .collection("products")
    .find({ active: true })
    .sort({ createdAt: -1 })
    .toArray();

  // ২. ক্যাটাগরি অনুযায়ী ফিল্টার করার সহজ ফাংশন
  const getByCategory = (cat) => 
    allProducts
      .filter((p) => p.category === cat)
      .map(p => ({ ...p, _id: p._id.toString() })) 
      .slice(0, 10); 
 
  const featuredProducts = allProducts
    .filter((p) => p.featured === true)
    .map(p => ({ ...p, _id: p._id.toString() }))
    .slice(0, 10);
    
    
  return (
    <main>
      <HeroSlider />
      
      <div className="container mx-auto px-2">

        <DynamicProductSection 
          products={featuredProducts} 
          sectionTitle=" Top Picks Products For you" 
        />

        <DynamicProductSection 
          products={getByCategory("offers")} 
          sectionTitle="Featured Offers" 
        />

        {/* ডায়নামিক সেকশনগুলো */}
        <DynamicProductSection 
          products={getByCategory("tools")} 
          sectionTitle="AI & EDUCATION TOOLS" 
        />
        
        <DynamicProductSection 
          products={getByCategory("streaming")} 
          sectionTitle="PREMIUM STREAMING" 
        />
      </div>

      <BuyView />

      <div className="container mx-auto px-2">
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
          sectionTitle=" SOCIAL MEDIA SERVICES" 
        />
        {/* এভাবেই অন্যান্য ক্যাটাগরিগুলো বসিয়ে দিন */}
      </div>

      <FeaturedPromo />

      <div className="container mx-auto px-2">
        <SocialGallery />
        <FAQSection />
      </div>
    </main>
  );
}