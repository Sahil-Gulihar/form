// lib/helpers.js

// Format a field value for display
export const formatValue = (name: string, value: any) => {
  if (!value) return "-";

  // Format dates
  if (name.includes("Date") && value) {
    try {
      return new Date(value).toLocaleDateString();
    } catch (e) {
      return value;
    }
  }

  // Format percentages
  if (name.includes("Progress") && value) {
    return `${value}%`;
  }

  // Format currency
  if (name === "estimatedValue" && value) {
    return `₹${value} Cr.`;
  }

  return value;
};
