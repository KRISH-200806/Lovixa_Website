import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-warm pt-28 pb-16 font-['Urbanist']">
      <div className="max-w-4xl mx-auto px-6 bg-pure p-8 md:p-12 rounded-3xl shadow-card border border-stone-200/70 text-text-main">
        {/* Breadcrumb */}
        <div className="text-xs text-text-secondary mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-brand underline">Home</Link>
          <span>/</span>
          <span className="text-text-main font-semibold">Terms of Service</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-serif font-bold text-text-main mb-8 border-b border-stone-100 pb-4">Terms of Service</h1>

        <div className="space-y-6 text-xs md:text-sm leading-relaxed text-text-secondary">
          <section>
            <h2 className="text-base font-bold text-text-main mb-2 font-serif">OVERVIEW</h2>
            <p className="mb-2">
              This website is operated by Lovixa. Throughout the site, the terms "we", "us" and "our" refer to Lovixa Luxury Fragrances. Lovixa offers this website, including all information, products, tools, and services conditioned upon your acceptance of all terms, conditions, and policies stated here.
            </p>
            <p>
              By accessing our store or placing an order, you agree to be bound by these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-text-main mb-2 font-serif">SECTION 1 - ONLINE STORE TERMS</h2>
            <p className="mb-2">
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your jurisdiction of residence.
            </p>
            <p>
              You may not use our products for any unauthorized or illegal purpose nor violate any laws in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-text-main mb-2 font-serif">SECTION 2 - PRODUCTS & PRICING ACCURACY</h2>
            <p className="mb-2">
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue products.
            </p>
            <p>
              We strive to display product colors and images as accurately as possible, though individual device displays may vary.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-text-main mb-2 font-serif">SECTION 3 - GOVERNING LAW</h2>
            <p>
              These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;