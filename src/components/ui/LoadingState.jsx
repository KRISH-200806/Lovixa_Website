import React from "react";
import PropTypes from "prop-types";

/**
 * Reusable LoadingState component that prevents layout collapse
 * between Navbar and Footer when API requests are pending.
 */
const LoadingState = ({
  message = "Loading luxury collection...",
  subtitle = "Preparing the finest hand-crafted fragrances for you",
  type = "skeleton", // 'skeleton' | 'spinner'
  cardCount = 4,
}) => {
  return (
    <div className="w-full min-h-[65vh] flex flex-col items-center justify-center px-4 py-16 font-['Urbanist'] animate-fade-in bg-white">
      {type === "spinner" ? (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-brand animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-ping"></span>
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-text-main font-serif">{message}</h3>
            {subtitle && (
              <p className="text-xs text-text-secondary mt-1 max-w-sm">{subtitle}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <div className="h-4 bg-emerald-50 rounded-full w-28 mx-auto animate-pulse"></div>
            <div className="h-8 bg-emerald-50/80 rounded-xl w-64 mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(cardCount)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-100 p-4 space-y-4 shadow-xs animate-pulse"
              >
                <div className="aspect-square bg-emerald-50/70 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-emerald-50/70 rounded-md w-1/3"></div>
                  <div className="h-4 bg-emerald-50/80 rounded-md w-3/4"></div>
                  <div className="h-4 bg-emerald-50/70 rounded-md w-1/4"></div>
                </div>
                <div className="h-10 bg-emerald-50/60 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

LoadingState.propTypes = {
  message: PropTypes.string,
  subtitle: PropTypes.string,
  type: PropTypes.oneOf(["skeleton", "spinner"]),
  cardCount: PropTypes.number,
};

export default LoadingState;
