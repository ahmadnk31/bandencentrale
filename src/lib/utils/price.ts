/**
 * Utility functions for price formatting and handling
 */

/**
 * Formats a price value to a string with currency symbol
 * @param price - The price value (number, string, or null/undefined)
 * @param currency - The currency symbol (default: '€')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string
 */
export function formatPrice(
  price: number | string | null | undefined, 
  currency: string = '€', 
  decimals: number = 2
): string {
  // Handle null, undefined, or empty values
  if (price === null || price === undefined || price === '') {
    return `${currency}0.00`;
  }

  // Convert to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Check if conversion resulted in a valid number
  if (isNaN(numericPrice)) {
    return `${currency}0.00`;
  }

  // Format the price
  return `${currency}${numericPrice.toFixed(decimals)}`;
}

/**
 * Safely converts a price value to a number
 * @param price - The price value to convert
 * @returns A valid number or 0 if conversion fails
 */
export function safeToNumber(price: number | string | null | undefined): number {
  if (price === null || price === undefined || price === '') {
    return 0;
  }

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numericPrice) ? 0 : numericPrice;
}

/**
 * Calculates discount percentage between two prices
 * @param originalPrice - The original price
 * @param currentPrice - The current/sale price
 * @returns Discount percentage as a number (0 if no discount)
 */
export function calculateDiscountPercentage(
  originalPrice: number | string | null | undefined,
  currentPrice: number | string | null | undefined
): number {
  const original = safeToNumber(originalPrice);
  const current = safeToNumber(currentPrice);

  if (original <= 0 || current <= 0 || current >= original) {
    return 0;
  }

  return Math.round(((original - current) / original) * 100);
}

/**
 * Formats a discount percentage
 * @param percentage - The discount percentage
 * @returns Formatted discount string (e.g., "-25%")
 */
export function formatDiscount(percentage: number): string {
  return percentage > 0 ? `-${percentage}%` : '';
}

/**
 * Checks if a price represents a valid monetary value
 * @param price - The price to validate
 * @returns True if the price is valid and greater than 0
 */
export function isValidPrice(price: number | string | null | undefined): boolean {
  const numericPrice = safeToNumber(price);
  return numericPrice > 0;
}
