/**
 * LoanWatch Calculations Engine
 * Core financial math for reducing-balance EMI, zero-interest edge cases,
 * month-by-month amortization, and yearly aggregation.
 */

/**
 * Rounds a number to two decimal places
 * @param {number} num
 * @returns {number}
 */
export function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Validate loan input values
 * @param {number} principal
 * @param {number} annualRate
 * @param {number} tenureMonths
 * @returns {{ isValid: boolean, errors: { principal?: string, annualRate?: string, tenure?: string } }}
 */
export function validateLoanInputs(principal, annualRate, tenureMonths) {
  const errors = {};

  if (!Number.isFinite(principal)) {
    errors.principal = 'Enter a valid loan amount in ₹ (e.g., 25,00,000)';
  } else if (principal <= 0) {
    errors.principal = 'Enter a loan amount greater than ₹ 0 (minimum ₹ 1,000)';
  } else if (principal < 1000) {
    errors.principal = 'Minimum loan amount is ₹ 1,000';
  } else if (principal > 1000000000) { // 100 Crore
    errors.principal = 'Loan amount exceeds ₹ 100 Crore limit';
  }

  if (!Number.isFinite(annualRate)) {
    errors.annualRate = 'Enter a valid interest rate (e.g., 8.5%)';
  } else if (annualRate < 0) {
    errors.annualRate = 'Interest rate cannot be negative. Enter 0% or higher.';
  } else if (annualRate > 50) {
    errors.annualRate = 'Interest rate cannot exceed 50% per annum';
  }

  if (!Number.isFinite(tenureMonths)) {
    errors.tenure = 'Enter a valid loan tenure';
  } else if (tenureMonths < 1) {
    errors.tenure = 'Tenure must be at least 1 month (or 0.5 years)';
  } else if (tenureMonths > 480) { // 40 years
    errors.tenure = 'Tenure cannot exceed 40 years (480 months)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Calculate Monthly EMI and high-level summary
 * Formula: EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]
 * Where r = annualRate / 12 / 100, n = tenureMonths
 * Special case: r = 0 => EMI = P / n
 *
 * @param {number} principal
 * @param {number} annualRate
 * @param {number} tenureMonths
 * @returns {{
 *   monthlyEMI: number,
 *   totalPayment: number,
 *   totalInterest: number,
 *   principalRatio: number,
 *   interestRatio: number,
 *   monthlyRate: number
 * }}
 */
export function calculateEMI(principal, annualRate, tenureMonths) {
  if (principal <= 0 || tenureMonths <= 0) {
    return {
      monthlyEMI: 0,
      totalPayment: 0,
      totalInterest: 0,
      principalRatio: 100,
      interestRatio: 0,
      monthlyRate: 0
    };
  }

  const n = Math.round(tenureMonths);
  const monthlyRate = annualRate > 0 ? (annualRate / 12) / 100 : 0;

  let monthlyEMI = 0;

  if (monthlyRate === 0) {
    // Zero-interest loan: pure equal split
    monthlyEMI = roundToTwo(principal / n);
  } else {
    const rateFactor = Math.pow(1 + monthlyRate, n);
    monthlyEMI = roundToTwo(principal * monthlyRate * (rateFactor / (rateFactor - 1)));
  }

  // Pre-generate schedule to obtain exact rounding-adjusted totals
  const schedule = generateAmortizationSchedule(principal, annualRate, n, monthlyEMI);

  const totalPayment = schedule.totals.totalPayment;
  const totalInterest = schedule.totals.totalInterest;

  const principalRatio = totalPayment > 0 ? (principal / totalPayment) * 100 : 100;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return {
    monthlyEMI,
    totalPayment,
    totalInterest,
    principalRatio: roundToTwo(principalRatio),
    interestRatio: roundToTwo(interestRatio),
    monthlyRate
  };
}

/**
 * Generates month-by-month reducing-balance amortization schedule.
 * Accurately calculates interest on current opening balance, principal portion,
 * and applies final month adjustment to guarantee exactly ₹ 0.00 closing balance.
 *
 * @param {number} principal
 * @param {number} annualRate
 * @param {number} tenureMonths
 * @param {number} [calculatedEMI]
 * @returns {{
 *   rows: Array<{
 *     month: number,
 *     year: number,
 *     monthInYear: number,
 *     openingBalance: number,
 *     emi: number,
 *     principalPaid: number,
 *     interestPaid: number,
 *     closingBalance: number
 *   }>,
 *   totals: {
 *     totalPrincipal: number,
 *     totalInterest: number,
 *     totalPayment: number
 *   }
 * }}
 */
export function generateAmortizationSchedule(principal, annualRate, tenureMonths, calculatedEMI = null) {
  const n = Math.round(tenureMonths);
  if (principal <= 0 || n <= 0) {
    return {
      rows: [],
      totals: { totalPrincipal: 0, totalInterest: 0, totalPayment: 0 }
    };
  }

  const monthlyRate = annualRate > 0 ? (annualRate / 12) / 100 : 0;

  let baseEMI = calculatedEMI;
  if (!baseEMI) {
    if (monthlyRate === 0) {
      baseEMI = roundToTwo(principal / n);
    } else {
      const rateFactor = Math.pow(1 + monthlyRate, n);
      baseEMI = roundToTwo(principal * monthlyRate * (rateFactor / (rateFactor - 1)));
    }
  }

  const rows = [];
  let currentBalance = roundToTwo(principal);
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalPayment = 0;

  for (let m = 1; m <= n; m++) {
    const openingBalance = currentBalance;
    const currentYear = Math.ceil(m / 12);
    const monthInYear = ((m - 1) % 12) + 1;

    let interestPaid = 0;
    let principalPaid = 0;
    let monthEMI = baseEMI;
    let closingBalance = 0;

    if (monthlyRate === 0) {
      // Zero-interest loan
      interestPaid = 0;
      if (m === n) {
        principalPaid = openingBalance;
        monthEMI = principalPaid;
        closingBalance = 0;
      } else {
        principalPaid = baseEMI;
        if (principalPaid > openingBalance) {
          principalPaid = openingBalance;
        }
        monthEMI = principalPaid;
        closingBalance = roundToTwo(openingBalance - principalPaid);
      }
    } else {
      interestPaid = roundToTwo(openingBalance * monthlyRate);

      if (m === n) {
        // Final instalment adjustment: payoff exact remaining balance
        principalPaid = openingBalance;
        monthEMI = roundToTwo(principalPaid + interestPaid);
        closingBalance = 0;
      } else {
        principalPaid = roundToTwo(baseEMI - interestPaid);
        if (principalPaid > openingBalance) {
          principalPaid = openingBalance;
          monthEMI = roundToTwo(principalPaid + interestPaid);
          closingBalance = 0;
        } else {
          monthEMI = roundToTwo(principalPaid + interestPaid);
          closingBalance = roundToTwo(openingBalance - principalPaid);
        }
      }
    }

    currentBalance = closingBalance;

    totalInterest = roundToTwo(totalInterest + interestPaid);
    totalPrincipal = roundToTwo(totalPrincipal + principalPaid);
    totalPayment = roundToTwo(totalPayment + monthEMI);

    rows.push({
      month: m,
      year: currentYear,
      monthInYear: monthInYear,
      openingBalance,
      emi: monthEMI,
      principalPaid,
      interestPaid,
      closingBalance
    });

    if (closingBalance <= 0 && m < n) {
      // Loan closed early due to precision
      break;
    }
  }

  return {
    rows,
    totals: {
      totalPrincipal,
      totalInterest,
      totalPayment
    }
  };
}

/**
 * Roll up monthly schedule into annual summary rows
 * @param {Array} monthlyRows
 * @returns {Array<{
 *   year: number,
 *   openingBalance: number,
 *   totalEMI: number,
 *   totalPrincipalPaid: number,
 *   totalInterestPaid: number,
 *   closingBalance: number
 * }>}
 */
export function generateYearlySchedule(monthlyRows) {
  if (!monthlyRows || monthlyRows.length === 0) return [];

  const yearlyMap = new Map();

  for (const row of monthlyRows) {
    if (!yearlyMap.has(row.year)) {
      yearlyMap.set(row.year, {
        year: row.year,
        openingBalance: row.openingBalance,
        totalEMI: 0,
        totalPrincipalPaid: 0,
        totalInterestPaid: 0,
        closingBalance: row.closingBalance
      });
    }

    const yearData = yearlyMap.get(row.year);
    yearData.totalEMI = roundToTwo(yearData.totalEMI + row.emi);
    yearData.totalPrincipalPaid = roundToTwo(yearData.totalPrincipalPaid + row.principalPaid);
    yearData.totalInterestPaid = roundToTwo(yearData.totalInterestPaid + row.interestPaid);
    yearData.closingBalance = row.closingBalance; // Last month of year sets closing balance
  }

  return Array.from(yearlyMap.values()).map(y => ({
    year: y.year,
    openingBalance: y.openingBalance,
    totalEMI: y.totalEMI,
    totalPrincipalPaid: y.totalPrincipalPaid,
    totalInterestPaid: y.totalInterestPaid,
    closingBalance: y.closingBalance
  }));
}
