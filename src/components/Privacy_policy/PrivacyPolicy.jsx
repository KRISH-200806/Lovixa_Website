import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  // // Add useEffect to scroll to top on component mount
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  return (
    <div className="max-w-7xl mx-auto px-9 py-8 text-gray-800">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-8 mt-20">
        <a href="/" className="text-stone-600 hover:underline">Home</a>
        <span className="text-gray-500"> / Privacy & Policy</span>
      </div>
      
      {/* Page heading */}
      <div className="mb-10 flex items-center ">
        <div className="">
          <h1 className="text-3xl md:text-4xl font-medium ">Privacy & Policy</h1>
        </div>
      </div>
      
      <div className="bg-white  ">
        <h2 className="text-xl font-semibold mb-4">SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?</h2>
        <p className="mb-4">When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address and email address.</p>
        <p className="mb-4">When you browse our store, we also automatically receive your computer's internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.</p>
        <p className="mb-4">Email marketing (if applicable): With your permission, we may send you emails about our store, new products and other updates.</p>
        
        <h2 className="text-xl font-semibold my-4">SECTION 2 - CONSENT</h2>
        <p className="mb-4">How do you get my consent?</p>
        <p className="mb-4">When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.</p>
        <p className="mb-4">If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.</p>
        
        <p className="mb-4">How do I withdraw my consent?</p>
        <p className="mb-4">If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at anytime, by contacting us at info@adilqadri.com or mailing us at:</p>
        <p className="mb-4">Adilqadri.com</p>
        <p className="mb-4">chapaneri streets, station road bilimora Gujarat IN 396321</p>
        
        <h2 className="text-xl font-semibold my-4">SECTION 3 - DISCLOSURE</h2>
        <p className="mb-4">We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;