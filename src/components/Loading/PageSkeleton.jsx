
import React from "react";

const PageSkeleton = () => {
  return (
    <div className="min-h-screen pt-20 pb-10 bg-gray-50 animate-pulse">
      {/* Hero section skeleton */}

      {/* Products grid skeleton */}
      <div className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional content skeleton */}
      <div className="container mx-auto px-4 mt-16">
        <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default PageSkeleton;
