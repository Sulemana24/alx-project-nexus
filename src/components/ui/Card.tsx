import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
}) => {
  return (
    <div
      className={`
        bg-[#3B82F6] text-white rounded-xl shadow-lg p-6
        ${
          hover
            ? "hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            : ""
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Card sub-components for better structure
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h3 className={`text-xl font-bold ${className}`}>{children}</h3>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`mt-4 pt-4 border-t border-blue-400 ${className}`}>
    {children}
  </div>
);
