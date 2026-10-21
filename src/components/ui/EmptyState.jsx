import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Sparkles, ShoppingBag } from "lucide-react";

/**
 * Reusable EmptyState component with minimum height to guarantee
 * Navbar and Footer never collapse or look broken when 0 items are available.
 */
const EmptyState = ({
  icon: Icon = ShoppingBag,
  title = "No Products Found",
  description = "We are currently curating new fragrance batches. Explore our full collection in the meantime.",
  buttonText = "Explore All Products",
  buttonLink = "/viewall/all-products",
  onButtonClick,
}) => {
  return (
    <div className="w-full min-h-[65vh] flex flex-col items-center justify-center text-center px-4 py-16 font-['Urbanist'] animate-fade-in bg-white">
      <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-brand mb-6 shadow-inner border border-emerald-100/60">
        <Icon size={36} className="text-brand animate-pulse-subtle" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-main mb-2">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
        {description}
      </p>

      {buttonText && (
        buttonLink ? (
          <Link
            to={buttonLink}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand hover:bg-brand/90 text-white rounded-full text-xs font-bold transition shadow-button active:scale-95 uppercase tracking-wider"
          >
            <Sparkles size={14} />
            <span>{buttonText}</span>
          </Link>
        ) : (
          <button
            onClick={onButtonClick}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand hover:bg-brand/90 text-white rounded-full text-xs font-bold transition shadow-button active:scale-95 uppercase tracking-wider cursor-pointer"
          >
            <Sparkles size={14} />
            <span>{buttonText}</span>
          </button>
        )
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default EmptyState;
