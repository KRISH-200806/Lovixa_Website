import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Mail, MessageCircle, HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "What is the difference between perfume spray and concentrated attar?",
    answer:
      "Perfumes are alcohol- or water-based fine fragrances with spray mist dispersion, whereas pure attars are 100% concentrated botanical and essential oil formulations without alcohol, providing deeper longevity and skin intimacy.",
  },
  {
    question: "Are Lovixa perfumes and attars 100% alcohol-free?",
    answer:
      "All our traditional attars and select perfume spray formulations are strictly 100% alcohol-free, non-toxic, and skin friendly.",
  },
  {
    question: "How long does the scent projection last?",
    answer:
      "Our concentrated attars naturally last 10 to 16+ hours on pulse points and fabric. Our Eau de Parfum sprays maintain active projection for 8 to 12 hours depending on ambient temperature.",
  },
  {
    question: "Are Lovixa products safe and dermatologically tested for sensitive skin?",
    answer:
      "Yes, all Lovixa formulations undergo rigorous dermatological safety testing. We recommend a 24-hour patch test behind the wrist for individuals with hyper-sensitive skin.",
  },
  {
    question: "How should I apply and store my fragrances?",
    answer:
      "Apply attar directly to pulse points (wrists, side of neck, behind ears). Store your bottles in a cool, dry place away from direct sunlight to preserve raw aromatic molecules.",
  },
  {
    question: "What is your average delivery timeline and shipping policy?",
    answer:
      "We provide reliable shipping across India. Orders are usually dispatched within 24 hours and delivered within 3-5 business days.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-warm pt-28 pb-16 font-['Urbanist']">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sage text-xs font-bold uppercase tracking-widest block mb-1">
            Got Questions?
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-main mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-text-secondary text-sm max-w-lg mx-auto">
            Everything you need to know about our luxury perfumes, attars, shipping, and ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Contact Support Card */}
          <div className="bg-pure p-6 md:p-8 rounded-3xl shadow-card border border-stone-200/70 flex flex-col items-start md:sticky md:top-28">
            <div className="w-12 h-12 rounded-2xl bg-sage/15 flex items-center justify-center text-brand mb-4">
              <HelpCircle size={24} />
            </div>
            <h3 className="text-lg font-serif font-bold text-text-main mb-2">Still need help?</h3>
            <p className="text-xs text-text-secondary mb-6 leading-relaxed">
              Cannot find the answer you are looking for? Our fragrance specialists are happy to assist.
            </p>
            <Link
              to="/contact-us"
              className="w-full bg-brand hover:bg-brand/90 text-white py-3 rounded-full font-bold text-xs text-center transition duration-300 shadow-button"
            >
              Contact Support
            </Link>
            <div className="mt-6 pt-4 border-t border-stone-100 w-full text-xs text-text-secondary space-y-2.5">
              <p className="flex items-center">
                <Mail size={14} className="mr-2 text-brand" />
                support@lovixa.com
              </p>
              <p className="flex items-center">
                <MessageCircle size={14} className="mr-2 text-brand" />
                +91 88859 78692
              </p>
            </div>
          </div>

          {/* Accordion Questions */}
          <div className="md:col-span-2 space-y-3">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`bg-pure rounded-2xl border transition shadow-xs ${
                    isOpen ? "border-brand/40 shadow-sm" : "border-stone-200/70 hover:border-brand/20"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex justify-between items-center space-x-4 transition"
                  >
                    <span className="font-bold text-sm text-text-main">{faq.question}</span>
                    <span className="text-brand flex-shrink-0">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-text-secondary leading-relaxed border-t border-stone-100/80 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;