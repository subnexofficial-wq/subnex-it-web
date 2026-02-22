
import React from "react";
import Link from "next/link";
import LandingHome from "@/Components/LandingPage/LandingHome";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata = {
  title: "AI Automation | Subnex",
  description: "AI automation landing page for Subnex workflows, plans, and onboarding.",
  alternates: {
    canonical: `${baseUrl}/automation`,
  },
};
const StreamingPage = async () => {

  return (
    <div className="min-h-[70vh]">
<LandingHome></LandingHome>
    </div>
  );
};

export default StreamingPage;
