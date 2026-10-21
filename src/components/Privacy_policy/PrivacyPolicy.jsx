import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-warm pt-28 pb-16 font-['Urbanist']">
      <div className="max-w-4xl mx-auto px-6 bg-pure p-8 md:p-12 rounded-3xl shadow-card border border-stone-200/70 text-text-main">
        {/* Breadcrumb */}
        <div className="text-xs text-text-secondary mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-brand underline">Home</Link>
          <span>/</span>
          <span className="text-text-main font-semibold">Privacy Policy</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-serif font-bold text-text-main mb-8 border-b border-stone-100 pb-4">Privacy Policy</h1>

        <div className="space-y-6 text-xs md:text-sm leading-relaxed text-text-secondary">
          <section>
            <h2 className="text-base font-bold text-text-main mb-2 font-serif">SECTION 1 - INFORMATION WE COLLECT</h2>
            <p className="mb-2">
              When you purchase products from Lovixa, we collect personal information such as your name, delivery address, phone number, and email address as part of the order fulfillment process.
            </p>
            <p>
              When browsing our store, our servers automatically receive internet protocol (IP) addresses to deliver optimal browser compatibility and security performance.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-text-main mb-2 font-serif">SECTION 2 - USER CONSENT</h2>
            <p className="mb-2">
              By providing personal details to place orders, arrange delivery, or process returns, you consent to our collection and usage solely for those specific purposes.
            </p>
            <p>
              You may withdraw your marketing communications consent anytime by contacting us at <span className="font-semibold text-text-main">support@lovixa.com</span>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-text-main mb-2 font-serif">SECTION 3 - DATA SECURITY & DISCLOSURE</h2>
            <p>
              We implement industry-standard AES-256 encryption for user sessions and secure payment gateways. We do not sell or rent your personal information to third parties. We may disclose personal information if strictly required by law.
            </p>
          </section>

          <section className="pt-4 border-t border-stone-100">
            <h2 className="text-base font-bold text-text-main mb-2 font-serif">SECTION 4 - CONTACT US</h2>
            <p>
              For questions regarding our privacy practices, email us at <span className="font-semibold text-text-main">support@lovixa.com</span> or write to Lovixa Luxury Care, Station Road, Bilimora, Gujarat 396321.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;