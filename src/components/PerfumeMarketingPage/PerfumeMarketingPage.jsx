import React from 'react';
import PerfumeMarketing from "../../assets/image/PerfumeMarketing/PerfumeMarketing.svg"
import PerfumeMarketing1 from "../../assets/image/PerfumeMarketing/PerfumeMarketing1.svg"

const PerfumeMarketingPage = () => {
  // This data would come from your API in the future
  const marketingImages = [
    {
      id: 1,
      title: "7 Reasons Why Shanya Perfume Is lit",
      image: PerfumeMarketing,
    },
    {
      id: 2,
      title: "A Fragrance Where East Meets West",
      image: PerfumeMarketing1 ,
    }
  ];

  return (
    <div className="w-full">
      {marketingImages.map((item) => (
        <div 
          key={item.id} 
          className={`w-full ${item.bgColor} p-4 flex justify-center items-center`}
        >
          <div className="max-w-4xl w-full">
            <h2 className= "text-2xl font-bold mb-4 text-center  text-black">
              {item.title}
            </h2>
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerfumeMarketingPage; 