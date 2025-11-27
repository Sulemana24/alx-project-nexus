import React from "react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-white rounded-xl shadow-2xl w-full ${sizes[size]} 
          animate-in fade-in-90 zoom-in-90 duration-200
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="!p-2"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Modal sub-components for structured usage
export const ModalHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="mb-4">{children}</div>;

export const ModalFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="flex justify-end space-x-3 mt-6">{children}</div>;
