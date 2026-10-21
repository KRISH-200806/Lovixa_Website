"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-white w-full ${maxWidth} rounded-2xl shadow-2xl overflow-hidden border border-neutral-100 transform transition-all duration-300 scale-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            {title ? (
              <h3 id="modal-title" className="text-lg font-bold text-neutral-900">
                {title}
              </h3>
            ) : (
              <div />
            )}
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  showClose: PropTypes.bool,
};

export default Modal;
