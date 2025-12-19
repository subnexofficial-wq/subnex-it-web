"use client";

import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";

const faqs = [
  {
    question: "Subnex BD কী?",
    answer:
      "Subnex BD একটি অনলাইন ভিত্তিক ডিজিটাল সার্ভিস প্ল্যাটফর্ম, যেখানে ব্যবহারকারীরা সহজ ও নিরাপদ উপায়ে বিভিন্ন ডিজিটাল সাবস্ক্রিপশন ও সার্ভিস গ্রহণ করতে পারেন।",
  },
  {
    question: "কিভাবে সাবস্ক্রিপশন অর্ডার করতে পারি?",
    answer:
      "ওয়েবসাইট থেকে আপনার পছন্দের সাবস্ক্রিপশন নির্বাচন করে অর্ডার সম্পন্ন করতে পারবেন। পেমেন্ট সফল হলে ডেলিভারি প্রক্রিয়া শুরু হয়।",
  },
  {
    question: "আপনাদের দেওয়া সাবস্ক্রিপশন কি আসল ও নির্ভরযোগ্য?",
    answer:
      "আমরা শুধুমাত্র যাচাইকৃত ও বিশ্বস্ত উৎস থেকে সংগৃহীত সাবস্ক্রিপশন প্রদান করি, যাতে ব্যবহারকারীরা নিশ্চিন্তে সার্ভিস ব্যবহার করতে পারেন।",
  },
  {
    question: "পেমেন্ট করার জন্য কোন কোন মাধ্যম ব্যবহার করা যাবে?",
    answer:
      "bKash, Nagad, Rocket সহ অন্যান্য অনুমোদিত অনলাইন পেমেন্ট মাধ্যম ব্যবহার করে নিরাপদে পেমেন্ট করা যায়।",
  },
  {
    question: "সাবস্ক্রিপশন কাজ না করলে কী করবো?",
    answer:
      "নির্ধারিত সময়ের মধ্যে কোনো সমস্যা হলে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন। যাচাই শেষে প্রয়োজনীয় সমাধান দেওয়া হবে।",
  },
  {
    question: "অর্ডার দেওয়ার পর কত সময়ের মধ্যে সাবস্ক্রিপশন পাবো?",
    answer:
      "সাধারণত পেমেন্ট নিশ্চিত হওয়ার পর অল্প সময়ের মধ্যেই সাবস্ক্রিপশন ডেলিভারি করা হয়।",
  },
  {
    question: "Subnex BD কি নিরাপদ ও বিশ্বাসযোগ্য?",
    answer:
      "আমরা নিরাপদ পেমেন্ট গেটওয়ে ব্যবহার করি এবং গ্রাহকের ব্যক্তিগত তথ্য গোপনীয়তার সাথে সংরক্ষণ করি।",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-7xl  mx-auto px-4 py-12">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>

      {/* FAQ List */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index}>
            {/* Question Bar */}
            <button
              onClick={() => toggle(index)}
              className="
                w-full flex items-center justify-between
                px-5 py-4
                bg-black text-white
                rounded-lg
                text-left
              "
            >
              <span className="text-sm md:text-base font-medium">
                {faq.question}
              </span>
              <FiChevronRight
                className={`text-green-400 text-xl transition-transform duration-300 ${
                  openIndex === index ? "rotate-90" : ""
                }`}
              />
            </button>

            {/* Answer (NO background, page background only) */}
            {openIndex === index && (
              <div className="px-5 pt-3 bg-bl text-gray-900 text-bese leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
