import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch FAQ data from API
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        // const response = await fetch('/api/faqs');
        // const data = await response.json();
        // setFaqs(data);

        // For demonstration purposes, using mock data
        // In a real implementation, you would fetch this from an API
        setTimeout(() => {
          setFaqs([
            {
              question: "What is the difference between perfume and attar?",
              answer:
                "Perfumes are alcohol or oil-based fragrances with various concentration levels, while attars are pure essential oil-based fragrances without alcohol, making them more concentrated and long-lasting.",
            },
            {
              question: "Are your perfumes and attars alcohol-free?",
              answer: "Our attars are 100% alcohol-free. We also offer a selection of alcohol-free perfumes in our collection.",
            },
            {
              question: "How long does the fragrance last?",
              answer:
                "The longevity varies by product. Attars typically last 8-12 hours, while perfumes can last 4-8 hours depending on concentration.",
            },
            {
              question: "Are your products safe for sensitive skin?",
              answer:
                "Yes, our products are dermatologically tested. However, we recommend doing a patch test before full application if you have sensitive skin.",
            },
            {
              question: "Do you offer natural or organic perfumes and attars?",
              answer:
                "Yes, we offer a range of natural and organic fragrances made from pure essential oils and natural ingredients.",
            },
            {
              question: "How should I apply attar?",
              answer:
                "Apply attar to pulse points such as wrists, neck, and behind ears. A small amount is sufficient due to its concentration.",
            },
            {
              question: "How should I store my perfumes and attars?",
              answer:
                "Store in a cool, dry place away from direct sunlight and heat. Keep bottles tightly closed when not in use.",
            },
            {
              question: "Do you offer customized or personalized fragrances?",
              answer: "Yes, we offer customization services for special occasions and personal preferences.",
            },
            {
              question: "What are your best-selling fragrances?",
              answer:
                "Our best-sellers include Rose Attar, Oud Royale, and Arabian Musk. These fragrances are loved for their unique and lasting scents.",
            },
          ]);
          setLoading(false);
        }, 500); // Simulate API delay
      } catch (err) {
        setError("Failed to load FAQs. Please try again later.");
        setLoading(false);
        console.error("Error fetching FAQs:", err);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-16 bg-gray-100 rounded-sm mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-6 md:p-8 grid gap-8 md:grid-cols-2 mt-20">
      <div className="mb-8 w-3/4">
        <h1 className="text-3xl md:text-4xl font-light mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-6">
          If you have any additional questions, you can send or email us at hello@adipadi.com
        </p>
        <Link className="flex items-center justify-center w-full bg-[#2D1810] text-white py-3 rounded hover:bg-[#3D2820] transition-colors" to="/contact-us">
          {/* Simple SVG icon instead of Lucide component */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          CONTACT US
        </Link>
      </div>
      <div className="space-y-3 ">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-gray-50 rounded-sm overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-100 transition-colors"
            >
              <span className="text-left text-sm md:text-base">{faq.question}</span>
              {openIndex === index ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 flex-shrink-0 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 flex-shrink-0 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
            <div
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${openIndex === index ? "max-h-48" : "max-h-0"}
              `}
            >
              <div className="p-4 text-sm text-gray-600 border-t border-gray-100">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default FAQ;