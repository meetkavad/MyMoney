"use client";

import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeContext";
import { getCategoryIcon, getCategoryColor } from "@/lib/categories";
import { formatCurrency } from "@/lib/utils";

export default function CategoryList({ analyticsData }) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  return (
    <div>
      <Card
        padding="md"
        style={{ backgroundColor: currentColors.cardBackground }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: currentColors.text }}
        >
          Categories
        </h3>
        <div className="space-y-3">
          {analyticsData.map((item) => {
            const IconComponent = getCategoryIcon(item.category);
            return (
              <div
                key={item.category}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: currentColors.hover }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-full"
                    style={{
                      backgroundColor: getCategoryColor(item.category) + "20",
                    }}
                  >
                    <IconComponent
                      className="h-4 w-4"
                      style={{
                        color: getCategoryColor(item.category),
                      }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: currentColors.text }}
                    >
                      {item.category}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: currentColors.textSecondary }}
                    >
                      {item.percentage}%
                    </p>
                  </div>
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: currentColors.text }}
                >
                  {formatCurrency(Math.abs(item.totalAmount))}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
