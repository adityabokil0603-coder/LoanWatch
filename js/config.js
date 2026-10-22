/**
 * LoanWatch Configuration & Constants
 * Default parameters, slider steps, limits, and preset chips
 */

export const LOAN_DEFAULTS = {
  principal: 2500000, // ₹ 25 Lakhs
  annualRate: 8.5,    // 8.5%
  tenureYears: 20,    // 20 Years
  tenureMonths: 240,  // 240 Months
  tenureUnit: 'years' // 'years' | 'months'
};

export const INPUT_LIMITS = {
  principal: {
    min: 10000,            // ₹ 10,000
    max: 100000000,        // ₹ 10 Crore (100 Million)
    step: 25000,
    sliderMax: 10000000    // Slider max ₹ 1 Crore for ergonomic slider control; input allows up to 10 Cr
  },
  annualRate: {
    min: 0,                // 0% (zero-interest loans supported)
    max: 30,               // 30% APR
    step: 0.1
  },
  tenureYears: {
    min: 0.5,              // 6 months (0.5 year)
    max: 35,               // 35 years
    step: 0.5
  },
  tenureMonths: {
    min: 1,                // 1 month
    max: 420,              // 35 years = 420 months
    step: 1
  }
};

export const PRESET_CHIPS = {
  principal: [
    { label: '₹ 5 Lakh', value: 500000 },
    { label: '₹ 10 Lakh', value: 1000000 },
    { label: '₹ 25 Lakh', value: 2500000 },
    { label: '₹ 50 Lakh', value: 5000000 },
    { label: '₹ 1 Crore', value: 10000000 }
  ],
  annualRate: [
    { label: '0% (Interest-Free)', value: 0 },
    { label: '7.5% (Govt/Agri)', value: 7.5 },
    { label: '8.5% (Home Loan)', value: 8.5 },
    { label: '9.5% (Car Loan)', value: 9.5 },
    { label: '11.5% (Personal)', value: 11.5 }
  ],
  tenure: [
    { label: '1 Year', years: 1, months: 12 },
    { label: '3 Years', years: 3, months: 36 },
    { label: '5 Years', years: 5, months: 60 },
    { label: '10 Years', years: 10, months: 120 },
    { label: '20 Years', years: 20, months: 240 }
  ]
};
