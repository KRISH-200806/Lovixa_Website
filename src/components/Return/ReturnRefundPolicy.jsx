import React from "react";
import { Link } from "react-router-dom";

const ReturnRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-warm pt-28 pb-16 font-['Urbanist']">
      <div className="max-w-4xl mx-auto px-6 bg-pure p-8 md:p-12 rounded-3xl shadow-card border border-stone-200/70 text-text-main">
        {/* Breadcrumb */}
        <div className="text-xs text-text-secondary mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-brand underline">Home</Link>
          <span>/</span>
          <span className="text-text-main font-semibold">Refund & Return Policy</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-serif font-bold text-text-main mb-8 border-b border-stone-100 pb-4">Refunds & Returns Policy</h1>

        <div className="space-y-6 text-xs md:text-sm leading-relaxed text-text-secondary">
          <p>
            At Lovixa, we strive to deliver the highest quality fragrances and satisfaction. If you encounter an issue with your purchase, our support team is available to assist you promptly.
          </p>

          <section>
            <h2 className="text-base font-bold text-text-main mb-2 font-serif">1. Eligibility for Returns & Replacements</h2>
            <p className="mb-2">We offer hassle-free replacements or refunds within 7 days of delivery under the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Product delivered is damaged, leaked, or bottle cracked during transit.</li>
              <li>Incorrect variant, volume, or product model delivered.</li>
              <li>Defective atomizer or dispenser mechanism.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-text-main mb-2 font-serif">2. Return Process</h2>
            <p className="mb-2">
              To initiate a return or replacement, email <span className="font-semibold text-text-main">support@lovixa.com</span> or message our customer helpline at <span className="font-semibold text-text-main">+91 88859 78692</span> with your Order ID and photo/video proof of the damaged item.
            </p>
            <p>
              Once approved, our courier partner will arrange pickup of the parcel within 2-3 business days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-text-main mb-2 font-serif">3. Refund Processing</h2>
            <p>
              Prepaid orders will be refunded back to the original payment source within 5-7 business days of inspection. Cash on Delivery (COD) refunds will be processed via direct bank transfer (NEFT / UPI).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPolicy;