"use client";

const Card = ({
  children,
  className = "",
  hover = true,
  padding = "lg",
  style = {},
  ...props
}) => {
  const baseStyles = {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "all 0.2s ease-in-out",
  };

  const paddingStyles = {
    none: { padding: "0" },
    sm: { padding: "16px" },
    md: { padding: "24px" },
    lg: { padding: "32px" },
  };

  const combinedStyles = {
    ...baseStyles,
    ...paddingStyles[padding],
    ...style, // This ensures style prop overrides base styles
  };

  return (
    <div className={className} style={combinedStyles} {...props}>
      {children}
    </div>
  );
};

export default Card;
