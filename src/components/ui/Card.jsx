import React from "react";
import PropTypes from "prop-types";

export const Card = ({
  children,
  className = "",
  hover = true,
  glass = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${
        glass
          ? "bg-white/80 backdrop-blur-md border border-white/40 shadow-sm"
          : "bg-white border border-neutral-100 shadow-sm"
      } ${
        hover
          ? "hover:shadow-card hover:-translate-y-1 hover:border-brand/30"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  glass: PropTypes.bool,
};

export default Card;
