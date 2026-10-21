import React from "react";
import PropTypes from "prop-types";

export const Skeleton = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  ...props
}) => {
  const variantStyles = {
    circular: "rounded-full",
    rectangular: "rounded-lg",
    text: "rounded h-4 my-1",
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      style={style}
      className={`animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] ${
        variantStyles[variant] || variantStyles.rectangular
      } ${className}`}
      data-testid="skeleton-loader"
      {...props}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex flex-col gap-3">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <Skeleton variant="text" className="w-1/3 h-3" />
      <Skeleton variant="text" className="w-3/4 h-5" />
      <div className="flex justify-between items-center mt-2">
        <Skeleton variant="text" className="w-1/4 h-6" />
        <Skeleton className="w-20 h-8 rounded-full" />
      </div>
    </div>
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["circular", "rectangular", "text"]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Skeleton;
