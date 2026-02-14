
import React from "react";
import Link from "next/link";
import LandingHome from "@/Components/LandingPage/LandingHome";

export const metadata = {
  title: "Automation - Subnex",
  description: "Automate your business workflows with our advanced AI solutions.",
};
const StreamingPage = async () => {

  return (
    <div className="min-h-[70vh]">
<LandingHome></LandingHome>
    </div>
  );
};

export default StreamingPage;