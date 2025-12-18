export const metadata = {
  title: "Contact Information | Subnex",
  description:
    "Official contact information of Subnex. Reach us for support, queries, or service-related assistance.",
};

export default function ContactInformationPage() {
  return (
    <div className="bg-white text-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Contact Information
        </h1>

        {/* ================= বাংলা অংশ ================= */}
        <section className="space-y-6 mb-12">
          <h2 className="text-xl font-semibold">যোগাযোগের তথ্য</h2>

          <p>
            <strong>Subnex</strong> একটি অনলাইন ভিত্তিক ডিজিটাল সার্ভিস প্ল্যাটফর্ম।
            আমাদের সেবা, সাবস্ক্রিপশন অথবা যেকোনো সহায়তার জন্য নিচের মাধ্যমে
            আমাদের সাথে যোগাযোগ করতে পারেন।
          </p>

          <div className="space-y-2 text-sm md:text-base">
            <p>
              <strong>ইমেইল:</strong> support@subnex.com
            </p>
            <p>
              <strong>হোয়াটসঅ্যাপ / ম্যাসেঞ্জার:</strong> ডেলিভারি ও সাপোর্ট
              সংক্রান্ত যোগাযোগের জন্য ব্যবহৃত হয়
            </p>
            <p>
              <strong>সাপোর্ট সময়:</strong> প্রতিদিন সকাল ১০টা – রাত ১০টা
            </p>
          </div>

          <p>
            গ্রাহকের তথ্যের গোপনীয়তা ও নিরাপত্তা আমাদের জন্য অত্যন্ত গুরুত্বপূর্ণ।
            আমরা শুধুমাত্র সেবা প্রদান ও যোগাযোগের প্রয়োজনে তথ্য ব্যবহার করি।
          </p>
        </section>

        <hr className="my-10" />

        {/* ================= English Section ================= */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Contact Information</h2>

          <p>
            <strong>Subnex</strong> is an online-based digital service platform.
            If you have any questions, need support, or require assistance with
            our services, please contact us using the details below.
          </p>

          <div className="space-y-2 text-sm md:text-base">
            <p>
              <strong>Email:</strong> support@subnex.com
            </p>
            <p>
              <strong>WhatsApp / Messenger:</strong> Used for delivery and
              service-related communication
            </p>
            <p>
              <strong>Support Hours:</strong> 10:00 AM – 10:00 PM (Daily)
            </p>
          </div>

          <p>
            We value user privacy and data security. Your information is used
            strictly for communication and service delivery purposes only.
          </p>
        </section>
      </div>
    </div>
  );
}
