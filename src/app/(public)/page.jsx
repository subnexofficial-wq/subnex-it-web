
import HeroSlider from "@/Components/homeSection/HeroSlider";

import TopPicUp from "@/Components/homeSection/TopPicUp";
import StreamProduct from "@/Components/homeSection/StreamProduct";
import AiToolsProduct from "@/Components/homeSection/AiToolsProduct";
import MusicAudioProduct from "@/Components/homeSection/MusicAudioProduct";
import GammingProduct from "@/Components/homeSection/GammingProduct";
import SoftwerProductively from "@/Components/homeSection/SoftwerProductively";
import UtilityAndSocialTool from "@/Components/homeSection/UtilityAndSocialTool";
import VpnProduct from "@/Components/homeSection/VpnProduct";
import DatingProduct from "@/Components/homeSection/DatingProduct";
import FAQSection from "@/Components/FAQSection";
import SocialGallery from "@/Components/homeSection/SocialGellary";
import BuyView from "@/Components/homeSection/BuyView";
import FeaturedPromo from "@/Components/homeSection/FeaturedPromo";

export default function Home() {
  return (
    <div>
       <HeroSlider />
  <div >
    <div className="container mx-auto px-2">

    <TopPicUp />
    </div>

    <BuyView />

    <div className="container mx-auto px-2">
      
    <StreamProduct/>
    <AiToolsProduct />
    <MusicAudioProduct />
    <GammingProduct />
    <SoftwerProductively />
    <UtilityAndSocialTool />
    <VpnProduct />
    <DatingProduct />
    </div>

    <div className="">
    <FeaturedPromo />
    </div>

    <div className="container mx-auto px-2">
    <SocialGallery />
    <FAQSection />
    </div>

  </div>
  </div>

  );
}