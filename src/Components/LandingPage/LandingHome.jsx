"use client";
import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import PartnerSlider from './PartnerSlider';
import FeaturesTabs from './FeaturesTabs';
import { tabs, contentData } from './data'; 
import LandingAutomation from './PublicAutomation';

// মাউস গ্লো কম্পোনেন্ট
const MouseGlow = () => {
    const [pos, setPos] = useState({ x: -500, y: -500 });
    useEffect(() => {
        const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);
    return <div className="fixed pointer-events-none z-0" style={{ left: pos.x, top: pos.y, width: '500px', height: '500px', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, transparent 70%)', filter: 'blur(80px)' }} />;
};

const logos = ["/landing/landing1.jpeg", "/landing/landing2.jpeg", "/landing/landing3.jpeg", "/landing/landing4.jpeg", "/landing/landing5.jpeg", "/landing/landing6.jpeg"];

const LandingHome = () => {
    const [activeTab, setActiveTab] = useState('comment');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [activeHeroBtn, setActiveHeroBtn] = useState("start");

    return (
        <main className="w-full relative bg-[#020617] text-white min-h-screen overflow-x-clip ">
            {/* ব্যাকগ্রাউন্ড ইফেক্ট */}
            <MouseGlow />
            
            {/* হিরো সেকশন */}
            <Hero
                onDemoClick={() => setActiveHeroBtn("demo")} 
                activeBtn={activeHeroBtn} 
            />

            {/* লোগো স্লাইডার */}
            <div className=" border-y border-white/5 bg-white/[0.02]">
                <PartnerSlider logos={logos} />
            </div>

     <LandingAutomation></LandingAutomation>
          
            
            
        </main>
    );
};

export default LandingHome;