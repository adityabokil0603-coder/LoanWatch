import { calculateEMI, generateAmortizationSchedule, validateLoanInputs } from './calculations.js';
import { roundToTwo } from './calculations.js';

export const LOAN_STORAGE_KEY = 'loanwatch.loans.v1';
export const LOAN_CATEGORIES = ['Home Loan', 'Car Loan', 'Education Loan', 'Other Loans'];

function createId() {
  return globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `loan-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createLoan(input, id = createId()) {
  const name = String(input.name || '').trim();
  const startDate = String(input.startDate || '');
  const category = LOAN_CATEGORIES.includes(input.category) ? input.category : '';
  const principal = Number(input.principal);
  const annualRate = Number(input.annualRate);
  const tenureMonths = Math.round(Number(input.tenureMonths));
  const validation = validateLoanInputs(principal, annualRate, tenureMonths);
  if (!name || name.length > 80 || !category || !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      !isValidDate(startDate) || !validation.isValid) {
    throw new Error('Enter a loan name, valid category, start date, and valid loan details.');
  }

  const summary = calculateEMI(principal, annualRate, tenureMonths);
  return {
    id,
    name,
    category,
    startDate,
    principal: roundToTwo(principal),
    annualRate,
    tenureMonths,
    monthlyEMI: summary.monthlyEMI,
    payments: []
  };
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function localDateString() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function validateLoanRecords(value) {
  if (!Array.isArray(value)) return [];
  const accepted = [];
  const ids = new Set();
  for (const item of value) {
    try {
      if (!item || typeof item !== 'object' || typeof item.id !== 'string' || ids.has(item.id)) continue;
      const loan = createLoan(item, item.id);
      const payments = Array.isArray(item.payments)
        ? item.payments.slice().sort((a, b) => Number(a?.installmentNumber) - Number(b?.installmentNumber))
        : [];
      const schedule = getLoanSchedule(loan);
      const paymentIds = new Set();
        let paidPrincipalTotal = 0;
        let lastPaidDate = null;
        loan.payments = payments.filter(payment => {
          const number = Number(payment.installmentNumber);
          if (!Number.isInteger(number) || number < 1 || number > schedule.rows.length ||
              paymentIds.has(number) || !schedule.rows[number - 1]) return false;
          if (!isValidDate(payment.paidDate) || payment.paidDate > localDateString() ||
              (lastPaidDate && payment.paidDate < lastPaidDate)) return false;
          const scheduled = schedule.rows[number - 1];
          const principalPaid = payment.principalPaid === undefined ? scheduled.principalPaid : Number(payment.principalPaid);
          const interestPaid = payment.interestPaid === undefined ? scheduled.interestPaid : Number(payment.interestPaid);
          const amount = payment.amount === undefined ? scheduled.emi : Number(payment.amount);
          if (![principalPaid, interestPaid, amount].every(Number.isFinite) ||
              principalPaid < 0 || interestPaid < 0 || amount <= 0 ||
              Number(payment.installmentNumber) !== paymentIds.size + 1 ||
              principalPaid > loan.principal || interestPaid > amount ||
              Math.abs(roundToTwo(principalPaid + interestPaid) - amount) > 0.01 ||
              paidPrincipalTotal + principalPaid > loan.principal) return false;
          paidPrincipalTotal = roundToTwo(paidPrincipalTotal + principalPaid);
          lastPaidDate = payment.paidDate;
          paymentIds.add(number);
          return true;
        }).map(payment => ({
          installmentNumber: Number(payment.installmentNumber),
          dueDate: isValidDate(payment.dueDate) ? payment.dueDate : getDueDate(loan.startDate, Number(payment.installmentNumber)),
          paidDate: payment.paidDate,
          amount: roundToTwo(payment.amount === undefined ? schedule.rows[Number(payment.installmentNumber) - 1].emi : Number(payment.amount)),
          principalPaid: roundToTwo(payment.principalPaid === undefined ? schedule.rows[Number(payment.installmentNumber) - 1].principalPaid : Number(payment.principalPaid)),
          interestPaid: roundToTwo(payment.interestPaid === undefined ? schedule.rows[Number(payment.installmentNumber) - 1].interestPaid : Number(payment.interestPaid))
        }));
        if (loan.payments.length === loan.tenureMonths &&
            paidPrincipalTotal < loan.principal) continue;
        accepted.push(loan);
      ids.add(loan.id);
    } catch {
      continue;
    }
  }
  return accepted;
}

export function loadLoans(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(LOAN_STORAGE_KEY);
    if (!raw) return { loans: [], malformed: false };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { loans: [], malformed: true };
    const loans = validateLoanRecords(parsed);
    return { loans, malformed: JSON.stringify(parsed) !== JSON.stringify(loans) };
  } catch (error) {
    if (error instanceof SyntaxError) return { loans: [], malformed: true };
    throw error;
  }
}

export function saveLoans(loans, storage = globalThis.localStorage) {
  storage.setItem(LOAN_STORAGE_KEY, JSON.stringify(loans));
}

export function getDueDate(startDate, installmentNumber) {
  const start = new Date(`${startDate}T00:00:00`);
  const monthIndex = start.getMonth() + installmentNumber - 1;
  const year = start.getFullYear() + Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  const day = Math.min(start.getDate(), new Date(year, month + 1, 0).getDate());
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getLoanSchedule(loan) {
  const baseSummary = calculateEMI(loan.principal, loan.annualRate, loan.tenureMonths);
  const baseSchedule = generateAmortizationSchedule(loan.principal, loan.annualRate, loan.tenureMonths, baseSummary.monthlyEMI);
  const payments = Array.isArray(loan.payments) ? loan.payments.slice().sort((a, b) => a.installmentNumber - b.installmentNumber) : [];
  if (!payments.length) return baseSchedule;

  let balance = roundToTwo(loan.principal);
  const historicalRows = payments.map(payment => {
    const originalRow = baseSchedule.rows[payment.installmentNumber - 1];
    const principalPaid = roundToTwo(Math.min(payment.principalPaid ?? originalRow.principalPaid, balance));
    const interestPaid = roundToTwo(payment.interestPaid ?? originalRow.interestPaid);
    const openingBalance = balance;
    balance = Math.max(0, roundToTwo(balance - principalPaid));
    return {
      month: payment.installmentNumber,
      year: Math.ceil(payment.installmentNumber / 12),
      monthInYear: ((payment.installmentNumber - 1) % 12) + 1,
      openingBalance,
      emi: roundToTwo(payment.amount ?? principalPaid + interestPaid),
      principalPaid,
      interestPaid,
      closingBalance: balance
    };
  });

  const remainingMonths = loan.tenureMonths - historicalRows.length;
  let futureRows = [];
  if (balance > 0 && remainingMonths > 0) {
    const remainingSummary = calculateEMI(balance, loan.annualRate, remainingMonths);
    const remainingSchedule = generateAmortizationSchedule(
      balance, loan.annualRate, remainingMonths, remainingSummary.monthlyEMI
    );
    futureRows = remainingSchedule.rows.map(row => {
      const month = historicalRows.length + row.month;
      return { ...row, month, year: Math.ceil(month / 12), monthInYear: ((month - 1) % 12) + 1 };
    });
  }
  const rows = [...historicalRows, ...futureRows];
  const totals = rows.reduce((sum, row) => ({
    totalPrincipal: roundToTwo(sum.totalPrincipal + row.principalPaid),
    totalInterest: roundToTwo(sum.totalInterest + row.interestPaid),
    totalPayment: roundToTwo(sum.totalPayment + row.emi)
  }), { totalPrincipal: 0, totalInterest: 0, totalPayment: 0 });
  return { rows, totals };
}

export function getLoanProgress(loan) {
  const schedule = getLoanSchedule(loan);
  const paid = new Set(loan.payments.map(payment => payment.installmentNumber));
  const validPayments = loan.payments.filter(payment =>
    Number.isInteger(payment.installmentNumber) && payment.installmentNumber >= 1 &&
    payment.installmentNumber <= schedule.rows.length);
  const paidPrincipal = roundToTwo(validPayments.reduce((total, payment) => {
    const scheduledPrincipal = schedule.rows[payment.installmentNumber - 1].principalPaid;
    return total + (Number.isFinite(payment.principalPaid) ? payment.principalPaid : scheduledPrincipal);
  }, 0));
  const paidInstallments = validPayments.length;
  const upcoming = schedule.rows.find(row => !paid.has(row.month));
  const remainingInstallments = schedule.rows.filter(row => !paid.has(row.month)).length;
  const outstandingPrincipal = Math.max(0, roundToTwo(loan.principal - paidPrincipal));
  return {
    schedule,
    paidInstallments,
    remainingInstallments,
    outstandingPrincipal,
    progressPercent: loan.principal ? roundToTwo((loan.principal - outstandingPrincipal) / loan.principal * 100) : 0,
    upcoming: upcoming ? {
      installmentNumber: upcoming.month,
      dueDate: getDueDate(loan.startDate, upcoming.month),
      amount: upcoming.emi
    } : null
  };
}

export function markInstallmentPaid(loan, installmentNumber, paidDate) {
  const progress = getLoanProgress(loan);
  if (!Number.isInteger(installmentNumber) || installmentNumber < 1 ||
      installmentNumber > progress.schedule.rows.length ||
      loan.payments.some(payment => payment.installmentNumber === installmentNumber)) {
    throw new Error('This instalment is invalid or has already been recorded as paid.');
  }
  if (installmentNumber !== progress.paidInstallments + 1) {
    throw new Error('Record instalments in order to keep the estimated balance accurate.');
  }
  if (!isValidDate(paidDate) || paidDate > localDateString()) {
    throw new Error('Enter a valid payment date no later than today.');
  }
  const previousPayment = loan.payments[loan.payments.length - 1];
  if (previousPayment && paidDate < previousPayment.paidDate) {
    throw new Error('Payment dates must follow the instalment order.');
  }
  const row = progress.schedule.rows[installmentNumber - 1];
  const principalPaid = Math.min(row.principalPaid, progress.outstandingPrincipal);
  if (principalPaid <= 0) {
    throw new Error('No estimated principal remains to pay.');
  }
  loan.payments.push({
    installmentNumber,
    dueDate: getDueDate(loan.startDate, installmentNumber),
    paidDate,
    amount: roundToTwo(principalPaid + row.interestPaid),
    principalPaid,
    interestPaid: row.interestPaid
  });
  loan.payments.sort((a, b) => a.installmentNumber - b.installmentNumber);
}

export function getDashboardTotals(loans) {
  const details = loans.map(loan => ({ loan, progress: getLoanProgress(loan) }));
  const active = details.filter(item => item.progress.remainingInstallments > 0);
  const upcoming = active.flatMap(item => [{
    loanName: item.loan.name,
    ...item.progress.upcoming
  }]).sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0] || null;
  const totalPrincipal = details.reduce((sum, item) => sum + item.loan.principal, 0);
  return {
    loanCount: loans.length,
    activeLoanCount: active.length,
    monthlyEMI: roundToTwo(active.reduce((sum, item) => sum + (item.progress.upcoming?.amount || item.loan.monthlyEMI), 0)),
    totalPrincipal: roundToTwo(totalPrincipal),
    outstandingPrincipal: roundToTwo(details.reduce((sum, item) => sum + item.progress.outstandingPrincipal, 0)),
    totalEstimatedInterest: roundToTwo(details.reduce((sum, item) => sum + item.progress.schedule.totals.totalInterest, 0)),
    progressPercent: totalPrincipal ? roundToTwo(details.reduce((sum, item) =>
      sum + (item.loan.principal - item.progress.outstandingPrincipal), 0) /
      totalPrincipal * 100) : 0,
    upcoming
  };
}
