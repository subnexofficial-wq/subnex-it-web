import { Mail, MessageCircle, Clock, ShieldCheck, PhoneCall } from "lucide-react";

export const metadata = {
  title: "Contact Information | Subnex",
  description:
    "Official contact information of Subnex. Reach us for support, queries, or service-related assistance.",
};

export default function ContactInformationPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      {/* Hero Section */}
      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 uppercase tracking-tighter">
            Contact Information
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            আপনার যেকোনো জিজ্ঞাসা বা সহায়তার জন্য আমাদের টিম প্রস্তুত। সরাসরি যোগাযোগ করুন নিচের মাধ্যমগুলোতে।
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Email Support */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Mail size={28} />
            </div>
            <h3 className="text-lg font-bold mb-2">Email Support</h3>
            <p className="text-gray-500 text-sm mb-4">যেকোনো অফিসিয়াল কুয়েরির জন্য ইমেইল করুন</p>
            <a href="mailto:support@subnex.com" className="text-blue-600 font-bold hover:underline">
              support@subnex.com
            </a>
          </div>

          {/* WhatsApp Support */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={28} />
            </div>
            <h3 className="text-lg font-bold mb-2">Instant Chat</h3>
            <p className="text-gray-500 text-sm mb-4">ডেলিভারি ও দ্রুত সাপোর্টের জন্য মেসেজ দিন</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-green-700 transition">
              WhatsApp Us
            </button>
          </div>

          {/* Support Hours */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
              <Clock size={28} />
            </div>
            <h3 className="text-lg font-bold mb-2">Service Hours</h3>
            <p className="text-gray-500 text-sm mb-4">আমাদের সাপোর্ট টিম এই সময় এক্টিভ থাকে</p>
            <p className="text-gray-800 font-bold">সকাল ১০টা – রাত ১০টা (প্রতিদিন)</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Bengali Description */}
            <div className="space-y-6 border-b lg:border-b-0 lg:border-r border-gray-100 pb-10 lg:pb-0 lg:pr-12">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                আমাদের সম্পর্কে
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                <strong>Subnex</strong> একটি অনলাইন ভিত্তিক ডিজিটাল সার্ভিস প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য গ্রাহকদের সাশ্রয়ী মূল্যে প্রিমিয়াম সাবস্ক্রিপশন ও ডিজিটাল সেবা প্রদান করা।
              </p>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div className="flex gap-4">
                  <ShieldCheck className="text-blue-600 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">নিরাপত্তা ও গোপনীয়তা</h4>
                    <p className="text-sm text-blue-800 leading-snug">
                      গ্রাহকের তথ্যের গোপনীয়তা আমাদের সর্বোচ্চ অগ্রাধিকার। আপনার তথ্য শুধুমাত্র সেবা প্রদানের জন্য ব্যবহার করা হয়।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* English Description */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-2 uppercase">
                <span className="w-2 h-8 bg-black rounded-full"></span>
                Why Contact Us?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you encounter any issues with your subscription, account access, or payment, please don&apos;t hesitate to reach out. We ensure instant delivery and premium after-sales support.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Instant Response on WhatsApp
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Dedicated Technical Support Team
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Service-related Queries & Refunds
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                <PhoneCall size={14} /> 
                Looking for a custom business plan? Contact our sales team.
            </p>
        </div>
      </div>
    </div>
  );
}