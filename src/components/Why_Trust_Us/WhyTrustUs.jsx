import React from 'react';
import Premium_Quality  from "../../assets/image/Why_trust_us/Premium_Quality1.png"
import Long_lasting  from "../../assets/image/Why_trust_us/Long_Lasting1.png"
import Cruelty_Free  from "../../assets/image/Why_trust_us/Cruelty_Free.svg"
import Fragrances  from "../../assets/image/Why_trust_us/Fragrances.png"
import Derma_Tested  from "../../assets/image/Why_trust_us/Derma_Tested.svg"
import Vegan  from "../../assets/image/Why_trust_us/Vegan.svg"




const WhyTrustUs = () => {
  const features = [
    {
      icon: (
       <img src={Premium_Quality} alt="" />
      ),
      title: 'Premium Quality'
    },
    {
      icon: (
        <img src={Cruelty_Free} alt="" className="h-14 w-14" />

      ),
      title: 'Cruelty Free'
    },
    {
      icon: (
        <img src={Long_lasting} alt="" />
      ),
      title: 'Long Lasting'
    },
    {
      icon: (
        <img src={Fragrances} alt="" className='h-20 w-20'/>

      ),
      title: 'Variety of Fragrances'
    },
    {
      icon: (
       <img src={Derma_Tested} alt="" className='h-16 w-16'/>
      ),
      title: 'Derma Tested'
    },
    {
      icon: (
       <img src={Vegan} alt="" className='h-20 w-20 '/>
        
      ),
      title: '100% Vegan'
    }
  ];

  const fetchData = async () => {
    try {
      // Example API call structure
      const response = await fetch('your-api-endpoint');
      const data = await response.json();

      
      // Process your API data here
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Call fetchData when component mounts
  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-amber-950 text-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl  text-center mb-10">Why Trust Us?</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-amber-700 w-24 h-24 rounded-full flex items-center justify-center mb-2 relative" style={{ borderRadius: '75% 75% 75% 75% / 70% 70% 80% 80%' }}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <p className="font-medium mt-2">{feature.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyTrustUs;