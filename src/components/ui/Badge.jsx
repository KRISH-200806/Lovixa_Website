import React from "react";
import PropTypes from "prop-types";

export const Badge = ({
  children,
  variant = "gold",
  size = "md",
  className = "",
  ...props
}) => {
  const variantStyles = {
    brand: "bg-brand/10 text-brand border border-brand/20",
    sage: "bg-sage/15 text-sage-dark border border-sage/30",
    gold: "bg-gold/15 text-gold-dark border border-gold/30",
    warm: "bg-warm text-text-secondary border border-border",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    neutral: "bg-neutral-100 text-neutral-700 border border-neutral-200",
    dark: "bg-neutral-900 text-white border border-neutral-800",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase",
    md: "px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
    lg: "px-3.5 py-1.5 text-sm font-semibold tracking-wide",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${
        variantStyles[variant] || variantStyles.gold
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["gold", "success", "danger", "warning", "neutral", "dark"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};

export default Badge;
