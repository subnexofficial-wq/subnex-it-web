
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

export default function Home() {
  return (
    <div>
       <HeroSlider />
  <div className="container mx-auto">
   
    <TopPicUp />
    <StreamProduct/>
    <AiToolsProduct />
    <MusicAudioProduct />
    <GammingProduct />
    <SoftwerProductively />
    <UtilityAndSocialTool />
    <VpnProduct />
    <DatingProduct />
    <SocialGallery />
    <FAQSection />
  </div>
  </div>

  );
}