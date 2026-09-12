import React from 'react';
import { Facebook, Instagram, Youtube, Phone, Mail } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-stone-100">
      <header className="p-4 bg-stone-50 shadow-sm">
        <nav className="max-w-6xl mx-auto">
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-stone-900 hover:underline">Home</a>
            </li>
            <li>
              <a href="/privacy.html" className="text-stone-900 hover:underline">Privacy Policy</a>
            </li>
            <li>
              <a href="/contact.html" className="text-stone-900 hover:underline font-medium">Contact Us</a>
            </li>
            <li>
              <a href="/terms.html" className="text-stone-900 hover:underline">Terms of Service</a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-center my-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Get in touch with us! Your satisfaction is our priority, and we're just a message away.</h2>
            
            <div className="flex items-center mb-4">
              <Phone className="mr-2" size={20} />
              <span>+91 8885978692</span>
            </div>
            
            <div className="flex items-center mb-6">
              <Mail className="mr-2" size={20} />
              <span>info@adilqadri.com</span>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="bg-[#B4945E] hover:bg-[#8B7355] text-white p-2 rounded-full">
                <Facebook size={24} />
              </a>
              <a href="#" className="bg-[#B4945E] hover:bg-[#8B7355] text-white p-2 rounded-full">
                <Instagram size={24} />
              </a>
              <a href="#" className="bg-[#B4945E] hover:bg-[#8B7355] text-white p-2 rounded-full">
                <Youtube size={24} />
              </a>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <form className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  placeholder="Mobile Number" 
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <textarea 
                  placeholder="Message" 
                  rows="4" 
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#B4945E] text-white py-3 rounded hover:bg-[#8B7355]"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;