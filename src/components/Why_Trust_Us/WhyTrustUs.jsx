import React from "react";
import Premium_Quality from "../../assets/image/Why_trust_us/Premium_Quality1.png";
import Long_lasting from "../../assets/image/Why_trust_us/Long_Lasting1.png";
import Cruelty_Free from "../../assets/image/Why_trust_us/Cruelty_Free.svg";
import Fragrances from "../../assets/image/Why_trust_us/Fragrances.png";
import Derma_Tested from "../../assets/image/Why_trust_us/Derma_Tested.svg";
import Vegan from "../../assets/image/Why_trust_us/Vegan.svg";

const WhyTrustUs = () => {
  const features = [
    {
      icon: <img src={Premium_Quality} alt="Premium Quality" className="h-10 w-10 object-contain" />,
      title: "Premium Quality",
      subtitle: "Crafted with highest grade notes",
    },
    {
      icon: <img src={Cruelty_Free} alt="Cruelty Free" className="h-10 w-10 object-contain" />,
      title: "Cruelty Free",
      subtitle: "Never tested on animals",
    },
    {
      icon: <img src={Long_lasting} alt="Long Lasting" className="h-10 w-10 object-contain" />,
      title: "Long Lasting",
      subtitle: "Stays vibrant all day long",
    },
    {
      icon: <img src={Fragrances} alt="Variety of Fragrances" className="h-10 w-10 object-contain" />,
      title: "Royal Variety",
      subtitle: "Over 50+ unique blends",
    },
    {
      icon: <img src={Derma_Tested} alt="Derma Tested" className="h-10 w-10 object-contain" />,
      title: "Derma Tested",
      subtitle: "Gentle & safe for all skin",
    },
    {
      icon: <img src={Vegan} alt="100% Vegan" className="h-10 w-10 object-contain" />,
      title: "100% Vegan",
      subtitle: "Pure natural plant botanicals",
    },
  ];

  return (
    <div className="bg-[#18231E] text-white py-16 px-4 font-['Urbanist'] border-y border-stone-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sage text-xs font-bold uppercase tracking-widest block mb-1">
            Our Quality Promise
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Why Choose Lovixa?</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-sage/30 transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-sage/10 flex items-center justify-center mb-3 text-white">
                {feature.icon}
              </div>
              <h3 className="font-serif font-bold text-sm text-white mb-1">{feature.title}</h3>
              <p className="text-[11px] text-stone-400">{feature.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyTrustUs;