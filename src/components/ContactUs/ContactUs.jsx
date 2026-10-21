import React, { useState } from "react";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    // Simulate inquiry submission
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thank you! Your message has been received. Our team will contact you shortly.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-16 font-['Urbanist']">
      <main className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-brand text-xs font-bold uppercase tracking-widest block mb-1">
            We Are Here To Assist You
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-text-main">Contact Us</h1>
          <p className="text-text-secondary text-sm mt-2 max-w-lg mx-auto">
            Have questions about a fragrance, order, or bespoke gifting? Reach out to our customer care team anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Info Card */}
          <div className="bg-[#18231E] text-white p-8 md:p-10 rounded-3xl shadow-card flex flex-col justify-between border border-stone-800">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-4 text-white">Get In Touch</h2>
              <p className="text-stone-400 text-xs leading-relaxed mb-8">
                Your satisfaction is our utmost priority. Reach out directly or leave a message and our fragrance consultants will reply promptly.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-center space-x-3 text-stone-300">
                  <div className="p-2.5 bg-white/10 rounded-xl text-sage">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400">Phone Support</span>
                    <span className="font-semibold">+91 88859 78692</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-stone-300">
                  <div className="p-2.5 bg-white/10 rounded-xl text-sage">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400">Email Inquiry</span>
                    <span className="font-semibold">support@lovixa.com</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-stone-300">
                  <div className="p-2.5 bg-white/10 rounded-xl text-sage">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400">Headquarters</span>
                    <span className="font-semibold">Station Road, Bilimora, Gujarat 396321</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-800 mt-8">
              <span className="block text-[11px] text-stone-400 mb-3 uppercase tracking-wider font-semibold">
                Follow Lovixa
              </span>
              <div className="flex space-x-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-brand text-white p-2.5 rounded-xl transition duration-300"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-brand text-white p-2.5 rounded-xl transition duration-300"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-brand text-white p-2.5 rounded-xl transition duration-300"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-pure p-8 md:p-10 rounded-3xl shadow-card border border-stone-200/70 flex flex-col justify-center">
            <h2 className="text-xl font-serif font-bold text-text-main mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-text-main font-bold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-3.5 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-text-main font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@example.com"
                  className="w-full p-3.5 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-text-main font-bold mb-1">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full p-3.5 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-text-main font-bold mb-1">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you?"
                  rows="4"
                  className="w-full p-3.5 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  required
                  disabled={submitting}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand text-white py-3.5 rounded-xl hover:bg-brand/90 font-bold text-xs tracking-wider transition duration-300 flex items-center justify-center space-x-2 shadow-button disabled:opacity-60 active:scale-98"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <Send size={14} className="ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;