export const formatPrice = (price, currency = 'USD') => new Intl.NumberFormat(currency === 'GBP' ? 'en-GB' : 'en-US', {
  style: 'currency',
  currency,
  maximumFractionDigits: 0
}).format(price);