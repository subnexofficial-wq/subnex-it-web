import {
  ShieldCheck,
  Lock,
  EyeOff,
  FileText,
  Bell,
  Mail,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Subnex",
  description:
    "Privacy Policy of Subnex – Learn how we collect, use, and protect user information.",
};

export default function PrivacyPolicyPage() {
  const date = new Date();
  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Section */}
      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 uppercase tracking-tighter">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Subnex আপনার ব্যক্তিগত তথ্যের গোপনীয়তা ও নিরাপত্তাকে সর্বোচ্চ
            গুরুত্ব দেয়। আমরা কীভাবে আপনার তথ্য সুরক্ষিত রাখি তা নিচে বিস্তারিত
            আলোচনা করা হলো।
          </p>
          <div className="mt-6 inline-block bg-white/10 px-4 py-1 rounded-full text-xs font-medium text-gray-300">
            {`Last Updated: ${date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}`}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12">
        {/* Key Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Secure Data</h3>
              <p className="text-xs text-gray-500 leading-tight">
                আপনার সকল তথ্য এনক্রিপ্টেড সার্ভারে সংরক্ষিত থাকে।
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <EyeOff size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">No Selling</h3>
              <p className="text-xs text-gray-500 leading-tight">
                আমরা কখনোই তৃতীয় পক্ষের কাছে তথ্য বিক্রি করি না।
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">SSL Certified</h3>
              <p className="text-xs text-gray-500 leading-tight">
                লেনদেনের নিরাপত্তার জন্য আমাদের সাইট SSL এনক্রিপ্টেড।
              </p>
            </div>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
            {/* Section 1: Data Collection */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                ১. আমরা কী ধরনের তথ্য সংগ্রহ করি
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    আমরা শুধুমাত্র সেই তথ্যগুলোই সংগ্রহ করি যা আপনাকে সেবা
                    প্রদানের জন্য প্রয়োজন:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "ইমেইল ঠিকানা",
                      "ফোন নাম্বার",
                      "একাউন্ট সংক্রান্ত মৌলিক তথ্য",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <CheckCircle2 className="text-green-500" size={18} />{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                  <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <Lock size={18} /> অত্যন্ত গুরুত্বপূর্ণ
                  </h4>
                  <p className="text-sm text-red-800 leading-relaxed">
                    আমরা কখনোই আপনার ব্যাংক বা মোবাইল ব্যাংকিং পাসওয়ার্ড, কার্ড
                    নম্বর, OTP বা ভেরিফিকেশন কোড সংগ্রহ বা সংরক্ষণ করি না।
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section 2: Usage & Security */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <span className="w-2 h-8 bg-black rounded-full"></span>
                  ২. তথ্য ব্যবহারের উদ্দেশ্য
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  আপনার তথ্য শুধুমাত্র একাউন্ট তৈরি, ডিজিটাল সার্ভিস ডেলিভারি
                  এবং কাস্টমার সাপোর্টের প্রয়োজনে ব্যবহার করা হয়। আমরা আপনার
                  গোপনীয়তাকে সম্মান করি এবং কোনো অননুমোদিত ব্যবহারের অনুমতি দেই
                  না।
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-black flex items-center gap-3 uppercase">
                  <span className="w-2 h-8 bg-black rounded-full"></span>
                  3. Payment Security
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  All payments are processed through secure third-party
                  gateways. Subnex ensures SSL encryption for every transaction,
                  keeping your sensitive billing data invisible to us.
                </p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section 3: Others */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <Bell size={18} className="text-blue-600" /> নীতিমালা পরিবর্তন
                </h3>
                <p className="text-sm text-gray-500 italic">
                  Subnex যেকোনো সময় এই প্রাইভেসি পলিসি পরিবর্তন বা হালনাগাদ
                  করার অধিকার সংরক্ষণ করে।
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <FileText size={18} className="text-blue-600" /> কুকিজ
                  (Cookies)
                </h3>
                <p className="text-sm text-gray-500 italic">
                  ওয়েবসাইটের পারফরম্যান্স উন্নত ও দ্রুত লোড নিশ্চিত করার জন্য
                  আমরা সাময়িকভাবে কুকিজ ব্যবহার করি।
                </p>
              </div>
            </div>

            {/* Contact Support CTA */}
            <div className="bg-black rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-1">কোনো জিজ্ঞাসা আছে?</h3>
                <p className="text-gray-400 text-sm">
                  প্রাইভেসি সংক্রান্ত যেকোনো তথ্যের জন্য সরাসরি যোগাযোগ করুন
                </p>
              </div>
              <a
                href="mailto:support@subnex.com"
                className="bg-white text-black px-10 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition flex items-center gap-2"
              >
                <Mail size={18} /> Send Email
              </a>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center text-gray-400 text-[10px] uppercase tracking-[0.2em]">
          © {new Date().getFullYear()}, Subnex – Digital Subscriptions Platform
        </div>
      </div>
    </div>
  );
}
