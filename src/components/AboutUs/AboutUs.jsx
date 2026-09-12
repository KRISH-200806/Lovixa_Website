import React from 'react';
import ceoimage  from "../../assets/image/CEO.jpg"
import man1  from "../../assets/image/1-man.avif"
import man2  from "../../assets/image/2-man.avif"
import man3  from "../../assets/image/3-man.avif"
import OurProcess  from "../../assets/image/photo-2.avif"
const AboutUs = () => {
    
  return (
    <div className="font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="text-2xl font-bold">Adil Qadri</div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-gray-500">Home</a>
            <a href="#" className="hover:text-gray-500">About</a>
            <a href="#" className="hover:text-gray-500">Products</a>
            <a href="#" className="hover:text-gray-500">Contact</a>
          </div>
          <div className="md:hidden">
            <button className="text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the authentic journey behind Adil Qadri and our commitment to bringing you the finest fragrances.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src={ceoimage}
              alt="Adil Qadri Founder" 
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Born from a passion for exquisite fragrances and a commitment to authenticity, Adil Qadri began with a simple mission — to create fragrances that evoke memories, stir emotions, and leave lasting impressions.
            </p>
            <p className="text-gray-700 mb-6">
              Our founder, Adil Qadri, has spent years perfecting the art of creating fragrances that capture the essence of natural ingredients while maintaining their purity and potency. His journey began with a deep appreciation for traditional perfumery and evolved into a modern approach that respects ancient techniques while embracing innovation.
            </p>
            <p className="text-gray-700">
              Today, we are proud to share our collection of premium fragrances with customers who appreciate quality, craftsmanship, and the power of scent to transform moments into memories.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-xl font-semibold mb-4">Quality</div>
              <p className="text-gray-600">
                We source only the finest ingredients and materials, ensuring that every product we create meets our exacting standards of excellence.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-xl font-semibold mb-4">Authenticity</div>
              <p className="text-gray-600">
                We believe in creating genuine fragrances that stay true to their inspiration while offering something unique to our customers.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-xl font-semibold mb-4">Sustainability</div>
              <p className="text-gray-600">
                We are committed to ethical practices that respect both people and the planet, from responsible sourcing to eco-friendly packaging.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <img 
              src={man1}
              alt="Adil Qadri" 
              className="rounded-full w-40 h-40 mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold">Adil Qadri</h3>
            <p className="text-gray-600">Founder & Master Perfumer</p>
          </div>
          <div className="text-center">
            <img 
              src={man2}
              alt="Sarah Johnson" 
              className="rounded-full w-40 h-40 mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold">Sarah Johnson</h3>
            <p className="text-gray-600">Creative Director</p>
          </div>
          <div className="text-center">
            <img 
              src={man3}
              alt="Mohammed Ali" 
              className="rounded-full w-40 h-40 mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold">Mohammed Ali</h3>
            <p className="text-gray-600">Production Manager</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-gray-600 italic mb-4">
                "The fragrances from Adil Qadri are unlike anything I've experienced before. They have a depth and longevity that is truly exceptional."
              </p>
              <p className="font-semibold">- Amina K.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-gray-600 italic mb-4">
                "I've been a loyal customer for years, and I'm constantly impressed by the quality and craftsmanship of every product. Truly magnificent."
              </p>
              <p className="font-semibold">- David L.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Process */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-700 mb-6">
              At Adil Qadri, we follow a meticulous process to create our signature fragrances:
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Inspiration</h3>
                <p className="text-gray-600">
                  Every fragrance begins with inspiration — a memory, a place, an emotion that we seek to capture in scent.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Ingredient Selection</h3>
                <p className="text-gray-600">
                  We carefully select the finest ingredients from around the world, prioritizing quality and sustainability.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Craft & Creation</h3>
                <p className="text-gray-600">
                  Our master perfumers blend traditional techniques with modern approaches to create complex, layered fragrances.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">4. Perfection</h3>
                <p className="text-gray-600">
                  Each fragrance undergoes rigorous testing and refinement until it meets our exacting standards.
                </p>
              </div>
            </div>
          </div>
          <div>
            <img 
              src={OurProcess}
              alt="Our Perfume Creation Process" 
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#B4945E] text-white py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Experience Our Collection</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover the perfect fragrance to complement your unique personality and style.
          </p>
          <button className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;