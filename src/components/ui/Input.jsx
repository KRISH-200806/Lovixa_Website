import React, { forwardRef } from "react";
import PropTypes from "prop-types";

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = "text",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wide text-neutral-700 uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 text-neutral-400 pointer-events-none flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`w-full bg-neutral-50/80 border text-neutral-900 text-sm rounded-lg transition-all duration-200 outline-none placeholder-neutral-400 focus:bg-white min-h-[44px] ${
              Icon ? "pl-11 pr-4 py-2.5" : "px-4 py-2.5"
            } ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-neutral-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-neutral-500 mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  icon: PropTypes.elementType,
  type: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Input;
