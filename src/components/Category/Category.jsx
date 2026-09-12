import React, { useState, useEffect } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import image from "../../assets/image/lazina.jpg"
import image1 from "../../assets/image/satwan.png"
import agarbatti from "../../assets/image/agarbatti.png"
import combo from "../../assets/image/combo.png"

// Placeholder for API call
const fetchCategories = async () => {
  try {
    // Replace with your actual API endpoint
    // const response = await fetch('your-api-endpoint');
    // const data = await response.json();
    // return data;

    // Placeholder data structure
    return [
      {
        id: 1,
        name: "Attar Collection",
        image: image,
        description: "Premium fragrances made with natural ingredients",
        link: "/viewall"
      },
      {
        id: 2,
        name: "Perfume Sprays",
        image: image1,
        description: "Long-lasting signature scents for every occasion",
        link: "/viewall"
      },
      {
        id: 3,
        name: "Gift Sets",
        image: agarbatti,
        description: "Elegant combinations for the perfect present",
        link: "/viewall"
      },
      {
        id: 4,
        name: "New Arrivals",
        image: combo,
        description: "Discover our latest products and collections",
        link: "/viewall"
      }
    ];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
      setLoading(false);
    };

    loadCategories();
  }, []);

  // Card tilt effect handler
  const handleMouseMove = (e, index) => {
    if (!document.querySelector(`.card-${index}`)) return;

    const card = document.querySelector(`.card-${index}`);
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = (index) => {
    if (!document.querySelector(`.card-${index}`)) return;
    const card = document.querySelector(`.card-${index}`);
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-rose-100 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-100 opacity-30 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative ">
        <div className="text-center mb-16">

          <h2 className="text-4xl relative inline-block">
            Shop By Category

          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-8 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="perspective-container"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => {
                  setActiveIndex(null);
                  handleMouseLeave(index);
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
              >
                <Link
                  to={category.link}
                  className={`card-${index} block relative h-96 rounded-2xl overflow-hidden transition-all duration-500 group transform`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Card with parallax effect */}
                  <div className="absolute inset-0  z-0 rounded-2xl shadow-lg shadow-rose-200/20">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${category.image})`,
                        transform: activeIndex === index ? 'translateZ(-100px)' : 'translateZ(0)'
                      }}
                    ></div>
                  </div>

                  {/* Colored overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70  to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-10"></div>

                  {/* Floating decorative elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-white/30  transform rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>

                  {/* Content container */}
                  <div
                    className="absolute inset-x-0 bottom-0 z-20 p-6 transform transition-all duration-500"
                    style={{ transform: activeIndex === index ? 'translateZ(50px)' : 'translateZ(0)' }}
                  >
                    {/* Category label */}
                    <div className="mb-2 overflow-hidden">
                      <h3 className="text-2xl font-bold text-white transform transition-transform duration-500 group-hover:-translate-y-1">{category.name}</h3>
                    </div>

                    {/* Description - hidden until hover */}
                    <div className="h-0 group-hover:h-16 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                      <p className="text-white/80 text-sm mb-4">{category.description}</p>
                    </div>

                    {/* Shop now button */}
                    {/* Shop now button */}
                    <div className="inline-flex items-center text-white bg-[#B4945E] px-4 py-2 rounded-md transition-all duration-500 overflow-hidden group-hover:pr-5">
                      <span className="relative z-10 mr-1">Shop Now</span>
                      <ChevronRight size={16} className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>

                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Category;