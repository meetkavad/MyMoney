"use client";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  style = {},
  ...props
}) => {
  const baseStyles = {
    fontWeight: "500",
    borderRadius: "8px",
    transition: "all 0.2s ease-in-out",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    border: "none",
    outline: "none",
  };

  const variantStyles = {
    primary: {
      backgroundColor: "#4DB6AC",
      color: "white",
      border: "none",
    },
    secondary: {
      backgroundColor: "transparent",
      color: "#4DB6AC",
      border: "2px solid #4DB6AC",
    },
    outline: {
      backgroundColor: "white",
      color: "#212121",
      border: "1px solid #E0E0E0",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "#616161",
      border: "none",
    },
  };

  const sizeStyles = {
    sm: {
      padding: "8px 12px",
      fontSize: "14px",
    },
    md: {
      padding: "12px 24px",
      fontSize: "16px",
    },
    lg: {
      padding: "16px 32px",
      fontSize: "18px",
    },
  };

  const handleMouseEnter = (e) => {
    if (variant === "primary") {
      e.target.style.backgroundColor = "#26A69A";
      e.target.style.transform = "translateY(-1px)";
    } else if (variant === "secondary") {
      e.target.style.backgroundColor = "#4DB6AC";
      e.target.style.color = "white";
    }
  };

  const handleMouseLeave = (e) => {
    if (variant === "primary") {
      e.target.style.backgroundColor = "#4DB6AC";
      e.target.style.transform = "translateY(0)";
    } else if (variant === "secondary") {
      e.target.style.backgroundColor = "transparent";
      e.target.style.color = "#4DB6AC";
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style, // This ensures style prop overrides base styles
  };

  return (
    <button
      className={className}
      style={combinedStyles}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
