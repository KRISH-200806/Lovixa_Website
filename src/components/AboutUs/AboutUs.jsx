import React from "react";
import { Link } from "react-router-dom";
import ceoimage from "../../assets/image/CEO.jpg";
import man1 from "../../assets/image/1-man.avif";
import man2 from "../../assets/image/2-man.avif";
import man3 from "../../assets/image/3-man.avif";
import OurProcess from "../../assets/image/photo-2.avif";

const AboutUs = () => {
  return (
    <div className="font-['Urbanist'] bg-white">
      {/* Hero Section */}
      <div className="bg-white py-20 mt-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="text-brand text-xs font-bold uppercase tracking-widest block mb-2">
            The Essence of Craftsmanship
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-4">About Lovixa</h1>
          <p className="text-base text-text-secondary max-w-2xl mx-auto">
            Discover the passion behind Lovixa and our commitment to bringing you the finest luxury fragrances and natural skincare formulations.
          </p>
        </div>
      </div>

      {/* Main Story Content */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-3xl shadow-card border border-stone-200/70">
            <img
              src={ceoimage}
              alt="Lovixa Founder"
              className="w-full h-auto object-cover hover:scale-105 transition duration-700"
            />
          </div>
          <div>
            <span className="text-sage text-xs font-bold uppercase tracking-widest block mb-1">
              Our Heritage
            </span>
            <h2 className="text-3xl font-serif font-bold text-text-main mb-6">Our Story</h2>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-4">
              Born from a passion for exquisite fragrances and a commitment to pure botanical craftsmanship, Lovixa began with a simple mission: to create scents and formulas that evoke memories, stir emotions, and leave lasting impressions.
            </p>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-4">
              Our master perfumers have spent years perfecting the art of blending authentic natural essential oils, oud, amber, and florals while maintaining unmatched longevity and purity without synthetic alcohol or harsh chemicals.
            </p>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              Today, we are proud to share our collection of premium perfumes, attars, and skincare essentials with thousands of discerning customers worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-warm/70 py-16 border-y border-stone-200/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-sage text-xs font-bold uppercase tracking-widest block mb-1">
              Guiding Principles
            </span>
            <h2 className="text-3xl font-serif font-bold text-text-main">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-pure p-8 rounded-3xl shadow-card border border-stone-200/70 hover:border-brand/30 hover:shadow-lg transition">
              <div className="text-lg font-bold font-serif text-text-main mb-2">Uncompromised Quality</div>
              <p className="text-text-secondary text-xs leading-relaxed">
                We source only the finest raw botanicals and perfume oils, ensuring that every drop meets our strict standards of excellence.
              </p>
            </div>
            <div className="bg-pure p-8 rounded-3xl shadow-card border border-stone-200/70 hover:border-brand/30 hover:shadow-lg transition">
              <div className="text-lg font-bold font-serif text-text-main mb-2">Purity & Authenticity</div>
              <p className="text-text-secondary text-xs leading-relaxed">
                We believe in formulating non-alcoholic, pure essential fragrances that remain faithful to their traditional origins.
              </p>
            </div>
            <div className="bg-pure p-8 rounded-3xl shadow-card border border-stone-200/70 hover:border-brand/30 hover:shadow-lg transition">
              <div className="text-lg font-bold font-serif text-text-main mb-2">Cruelty-Free & Sustainable</div>
              <p className="text-text-secondary text-xs leading-relaxed">
                We are committed to ethical practices that respect both people and the planet, from responsible sourcing to eco-conscious packaging.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-sage text-xs font-bold uppercase tracking-widest block mb-1">
            The Artisans
          </span>
          <h2 className="text-3xl font-serif font-bold text-text-main">Meet Our Master Craftsmen</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-3xl bg-pure border border-stone-200/60 shadow-card">
            <img
              src={man1}
              alt="Master Perfumer"
              className="rounded-full w-32 h-32 mx-auto mb-4 object-cover shadow-md ring-4 ring-sage/20"
            />
            <h3 className="text-lg font-serif font-bold text-text-main">Aarav Patel</h3>
            <p className="text-xs text-sage font-bold uppercase tracking-wider mt-1">Head Perfumer</p>
          </div>
          <div className="text-center p-6 rounded-3xl bg-pure border border-stone-200/60 shadow-card">
            <img
              src={man2}
              alt="Creative Director"
              className="rounded-full w-32 h-32 mx-auto mb-4 object-cover shadow-md ring-4 ring-sage/20"
            />
            <h3 className="text-lg font-serif font-bold text-text-main">Sarah Johnson</h3>
            <p className="text-xs text-sage font-bold uppercase tracking-wider mt-1">Creative & Blend Director</p>
          </div>
          <div className="text-center p-6 rounded-3xl bg-pure border border-stone-200/60 shadow-card">
            <img
              src={man3}
              alt="Production Head"
              className="rounded-full w-32 h-32 mx-auto mb-4 object-cover shadow-md ring-4 ring-sage/20"
            />
            <h3 className="text-lg font-serif font-bold text-text-main">Mohammed Rehan</h3>
            <p className="text-xs text-sage font-bold uppercase tracking-wider mt-1">Quality & Distillation Lead</p>
          </div>
        </div>
      </div>

      {/* Our Process */}
      <div className="bg-warm/80 py-16 border-t border-stone-200/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sage text-xs font-bold uppercase tracking-widest block mb-1">
                The Science of Scent
              </span>
              <h2 className="text-3xl font-serif font-bold text-text-main mb-6">Our Distillation Process</h2>
              <div className="space-y-4 text-xs text-text-secondary">
                <div className="p-4 bg-pure rounded-2xl shadow-card border border-stone-200/60">
                  <h3 className="font-bold text-text-main mb-1">1. Ethical Botanical Harvest</h3>
                  <p>Selecting the most potent flowers, woods, and resins at peak bloom.</p>
                </div>
                <div className="p-4 bg-pure rounded-2xl shadow-card border border-stone-200/60">
                  <h3 className="font-bold text-text-main mb-1">2. Traditional Steam Distillation</h3>
                  <p>Gentle extraction preserves delicate top and heart aromatic molecules.</p>
                </div>
                <div className="p-4 bg-pure rounded-2xl shadow-card border border-stone-200/60">
                  <h3 className="font-bold text-text-main mb-1">3. Artisanal Aging & Maturation</h3>
                  <p>Blends are naturally matured for months to achieve perfect depth and longevity.</p>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl shadow-card border border-stone-200/70">
              <img
                src={OurProcess}
                alt="Lovixa Distillation Process"
                className="w-full h-auto object-cover hover:scale-105 transition duration-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-brand text-white py-16 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-serif font-bold mb-3">Experience the Lovixa Signature</h2>
          <p className="text-sm text-white/90 mb-6 max-w-xl mx-auto">
            Discover a signature fragrance curated to elevate your everyday presence.
          </p>
          <Link
            to="/viewall/all-products"
            className="inline-block bg-pure text-brand font-bold px-8 py-3.5 rounded-xl hover:bg-stone-100 transition shadow-lg text-xs tracking-wider uppercase"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;