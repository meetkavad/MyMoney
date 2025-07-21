import {
  Home,
  Car,
  Coffee,
  Heart,
  Shield,
  Shirt,
  GraduationCap,
  CreditCard,
  PiggyBank,
  Gamepad2,
  HelpCircle,
  DollarSign,
  Briefcase,
  TrendingUp,
  Percent,
  Trophy,
  Gift,
  Banknote,
  Ticket,
  Building,
  ScrollText,
} from "lucide-react";

export const categories = [
  "Housing",
  "Transportation",
  "Food",
  "Personal Care",
  "Healthcare",
  "Insurance",
  "Clothing",
  "Education",
  "Debt",
  "Investment",
  "Entertainment",
  "Miscellaneous",
  "Salary",
  "Freelance",
  "Interest",
  "Capital Gains",
  "Awards",
  "Coupons",
  "Grants",
  "Lottery",
  "Rental",
  "Scholarship",
];

// Category icons mapping
export const categoryIcons = {
  // Expense Categories
  Housing: Home,
  Transportation: Car,
  Food: Coffee,
  "Personal Care": Heart,
  Healthcare: Heart,
  Insurance: Shield,
  Clothing: Shirt,
  Education: GraduationCap,
  Debt: CreditCard,
  Investment: PiggyBank,
  Entertainment: Gamepad2,
  Miscellaneous: HelpCircle,

  // Income Categories
  Salary: DollarSign,
  Freelance: Briefcase,
  Interest: Percent,
  "Capital Gains": TrendingUp,
  Awards: Trophy,
  Coupons: Ticket,
  Grants: Gift,
  Lottery: Banknote,
  Rental: Building,
  Scholarship: ScrollText,
};

// Category colors for analytics and charts
export const categoryColors = {
  // Expense Categories
  Housing: "#FF6B6B",
  Transportation: "#4ECDC4",
  Food: "#45B7D1",
  "Personal Care": "#96CEB4",
  Healthcare: "#FECA57",
  Insurance: "#FF9FF3",
  Clothing: "#54A0FF",
  Education: "#5F27CD",
  Debt: "#FF3838",
  Investment: "#00D2D3",
  Entertainment: "#FF9F43",
  Miscellaneous: "#A4B0BE",

  // Income Categories
  Salary: "#26DE81",
  Freelance: "#FD79A8",
  Interest: "#FDCB6E",
  "Capital Gains": "#6C5CE7",
  Awards: "#A29BFE",
  Coupons: "#74B9FF",
  Grants: "#81ECEC",
  Lottery: "#00B894",
  Rental: "#E17055",
  Scholarship: "#00CEC9",
};

// Categorize by expense/income for form selection
export const expenseCategories = [
  "Housing",
  "Transportation",
  "Food",
  "Personal Care",
  "Healthcare",
  "Insurance",
  "Clothing",
  "Education",
  "Debt",
  "Investment",
  "Entertainment",
  "Miscellaneous",
];

export const incomeCategories = [
  "Salary",
  "Freelance",
  "Investment",
  "Interest",
  "Capital Gains",
  "Awards",
  "Coupons",
  "Grants",
  "Lottery",
  "Rental",
  "Scholarship",
];

// Helper function to get category type
export const getCategoryType = (category) => {
  if (expenseCategories.includes(category)) return "expense";
  if (incomeCategories.includes(category)) return "income";
  return "miscellaneous";
};

// Helper function to get category icon
export const getCategoryIcon = (category) => {
  return categoryIcons[category] || HelpCircle;
};

// Helper function to get category color
export const getCategoryColor = (category) => {
  return categoryColors[category] || "#A4B0BE";
};

// Helper function to get categories by type
export const getCategoriesByType = (type) => {
  switch (type) {
    case "expense":
      return expenseCategories;
    case "income":
      return incomeCategories;
    default:
      return categories;
  }
};
