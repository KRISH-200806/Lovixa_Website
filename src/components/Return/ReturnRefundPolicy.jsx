import React, { useEffect } from 'react';

const ReturnRefundPolicy = () => {
  // This effect will run when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-9 py-8 text-gray-800">
      {/* Rest of your component remains the same */}
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-8 mt-20">
      <a href="/" className="text-stone-600 hover:underline">Home</a>
         <span className="text-gray-500"> / Return & Refund</span>
      </div>
      
      {/* Page heading */}
      <div className="mb-10 flex items-center ">
        <div className="">
          <h1 className="text-3xl md:text-4xl font-medium ">Return & Refund</h1>
        </div>
      </div>
      
      {/* Main content */}
      <div className="space-y-6 text-sm md:text-base">
        {/* Your content remains unchanged */}
        <p>
          At Adil Qadri, we leave no stone unturned to avail you the best products and services. However, at times circumstances may come that you wish to cancel or have a refund on your order. To ensure you attain the utmost satisfaction from our services, we would like to share with you our cancellation and refund policy, considering some frequently raised questions. Let's start:
        </p>
        
        <p>The Policy envisages the terms and conditions under which:</p>
        
        <p>(a) You are permitted to return goods purchased by you, subject to a valid reason;</p>
        
        <p>(b) a refund may be obtained for goods purchased by you, subject to certain conditions;</p>
        
        <p>(c) you may cancel orders for goods purchased by you within a stipulated period of time;</p>
        
        <p className="text-justify">
          It is important to note while the Company makes best efforts to ensure that returns, refunds and cancellations are available to the users of the Website, the Company has to place certain restrictions on the same in order to meet its business, legal and contractual obligations. Return, refunds or cancellations may also vary from brand to brand, in which case each such good sold there under will have specific guidelines which will determine the terms and conditions related to return, refunds or cancellations (the "Guidelines"). In each such case, the Guidelines shall prevail over this Policy and it is important for you to acquaint yourself with the applicable Guidelines while making a purchase on the Website.
        </p>
        
        <h2 className="font-medium text-lg mt-8 mb-4">What I can return and when?</h2>
        
        <div className="space-y-2">
          <p>(a) You received a faulty or defective product (like damaged or leaked attar bottle, non-working electric Bakhoor burner)</p>
          <p>(b) You received a product that is different from what you ordered</p>
          <p>(c) You received a product that looks different from how it is actually appeared</p>
          <p>(d) If the product delivered by us does not appear to be the exact size you have ordered (size issues)</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPolicy;