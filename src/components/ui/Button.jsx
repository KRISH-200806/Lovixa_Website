import React from "react";
import PropTypes from "prop-types";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[44px]";

  const variantStyles = {
    primary:
      "bg-brand hover:bg-brand-hover text-white shadow-brand/20 hover:shadow-brand/40 focus:ring-brand",
    secondary:
      "bg-sage hover:bg-sage-dark text-white shadow-sage/20 hover:shadow-sage/40 focus:ring-sage",
    gold:
      "bg-gold hover:bg-gold-dark text-white shadow-gold/20 hover:shadow-gold/40 focus:ring-gold",
    outline:
      "border-2 border-brand text-brand hover:bg-brand hover:text-white focus:ring-brand",
    ghost:
      "text-text-main hover:bg-brand/10 hover:text-brand focus:ring-brand/30",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            data-testid="loading-spinner"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "ghost", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
