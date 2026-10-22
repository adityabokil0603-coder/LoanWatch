/**
 * LoanWatch Formatting Utilities
 * Indian Currency (INR), Number Formatter & Indian Words Converter
 */

const inrDecimalFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const inrWholeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const inrNumberOnlyFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0
});

/**
 * Format a number as Indian Currency with two decimal places (e.g. ₹21,695.58, ₹10,000.00, ₹0.00)
 * @param {number} amount
 * @param {boolean} showDecimals - Default is true to enforce exact two decimal places across all displays
 * @returns {string}
 */
export function formatINR(amount, showDecimals = true) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showDecimals ? '₹0.00' : '₹0';
  }
  return showDecimals ? inrDecimalFormatter.format(amount) : inrWholeFormatter.format(amount);
}

/**
 * Format number with Indian comma grouping without currency symbol
 * @param {number} amount
 * @returns {string}
 */
export function formatINRNumber(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  return inrNumberOnlyFormatter.format(Math.round(amount));
}

/**
 * Format large amounts in compact Indian notation (Lakhs & Crores)
 * @param {number} amount
 * @returns {string}
 */
export function formatCompactINR(amount) {
  if (amount === null || amount === undefined || !Number.isFinite(Number(amount))) return '₹0.00';
  if (amount <= 0) return '₹0.00';

  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹ ${cr.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹ ${lakh.toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `₹ ${k.toFixed(2)} K`;
  }
  return formatINR(amount);
}

/**
 * Format percentage value (e.g. 8.5%)
 * @param {number} rate
 * @returns {string}
 */
export function formatPercent(rate) {
  if (rate === null || rate === undefined || isNaN(rate)) return '0%';
  const rounded = Number(rate.toFixed(2));
  return `${rounded}%`;
}

/**
 * Clean user-entered numeric string (removes ₹, commas, spaces)
 * @param {string|number} input
 * @returns {number}
 */
export function cleanNumericInput(input) {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;
  const cleaned = input.toString().replace(/[₹,\s]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Converts integer numbers up to Crores into Indian English Words
 * @param {number} amount
 * @returns {string}
 */
export function numberToIndianWords(amount) {
  const num = Math.floor(Math.abs(cleanNumericInput(amount)));
  if (num === 0) return 'Zero Rupees';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function convertTwoDigits(n) {
    if (n < 20) return ones[n];
    const unit = n % 10;
    return tens[Math.floor(n / 10)] + (unit > 0 ? '-' + ones[unit] : '');
  }

  function convertThreeDigits(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = '';
    if (hundred > 0) {
      res += ones[hundred] + ' Hundred';
      if (rest > 0) res += ' ';
    }
    if (rest > 0) {
      res += convertTwoDigits(rest);
    }
    return res;
  }

  let words = '';
  const crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  if (crore > 0) {
    words += (crore < 100 ? convertTwoDigits(crore) : convertThreeDigits(crore)) + ' Crore ';
  }
  if (lakh > 0) {
    words += convertTwoDigits(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += convertTwoDigits(thousand) + ' Thousand ';
  }
  if (remainder > 0) {
    words += convertThreeDigits(remainder) + ' ';
  }

  return (words.trim() + ' Rupees');
}
