
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import FooterCountrySelector from "./CountrySection";


export default function Footer() {

  return (
    <footer className="bg-gradient-to-b from-black to-neutral-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Info */}
          <div>
              <Link href="/" className="group flex items-center gap-0.5"> 
                {/* Logo Image */}
                <div className="relative w-36 h-10 transition-transform duration-300 ease-in-out group-hover:rotate-12">
                  <Image
                    src="/logo2.png" 
                    alt="S Logo"
                    fill
                    className=""
                    priority
                  />
                </div>
            
              </Link>
            <p className="text-sm leading-relaxed mb-6">
              Subnex is an independent digital service platform in
              Bangladesh, offering easy access to popular subscriptions
              using local payment methods.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 text-lg">
              <a href="https://www.facebook.com/subnexit" target="_blank" className="hover:text-white"><FaFacebookF /></a>
              <a href="/" target="blank" className="hover:text-white"><FaInstagram /></a>
              <a href="https://www.youtube.com/@subnexit" target="_blank" className="hover:text-white"><FaYoutube /></a>
              <a href="/" target="blank" className="hover:text-white"><FaTiktok /></a>
              <a href="/" target="blank" className="hover:text-white"><FaXTwitter /></a>
            </div>
          </div>

          {/* Policy Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase">
              Our Links 
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/products" className="hover:text-white">All Products</Link></li>
              <li><Link href="/digital-product" className="hover:text-white">Digital product</Link></li>
              <li><Link href="/subscription" className="hover:text-white">Subscription</Link></li>
              <li><Link href="/automation" className="hover:text-white">Automation</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Information</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Subscribe to our emails
            </h3>

            <div className="flex items-center border border-gray-500 rounded-lg overflow-hidden max-w-sm">
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent px-4 py-3 text-sm w-full outline-none"
              />
              <button className="px-4 text-white hover:text-indigo-400">
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-10" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center  md:justify-between gap-6 text-sm">
          {/* Country Selector */}
         <FooterCountrySelector></FooterCountrySelector>

          {/* Copyright */}
          <p className="text-gray-400 text-center">
            © 2025, Subnex – Digital Subscriptions Platform
          </p>
        </div>
      </div>
    </footer>
  );
}