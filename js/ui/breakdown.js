/**
 * Breakdown & Metrics UI Controller
 * Updates metric cards, ratio bar, and visual split between Principal & Interest
 */

import { formatINR, formatCompactINR, formatPercent } from '../formatters.js';

export function updateMetricsAndBreakdown(elements, calcResult, principal) {
  if (!elements) return;

  const { monthlyEMI, totalPayment, totalInterest, principalRatio, interestRatio } = calcResult;

  // Monthly EMI highlight
  if (elements.monthlyEMI) {
    elements.monthlyEMI.textContent = formatINR(monthlyEMI);
  }

  // Key metric summaries
  if (elements.principalAmount) {
    elements.principalAmount.textContent = formatINR(principal);
  }
  if (elements.principalCompact) {
    elements.principalCompact.textContent = formatCompactINR(principal);
  }

  if (elements.interestAmount) {
    elements.interestAmount.textContent = formatINR(totalInterest);
  }
  if (elements.interestCompact) {
    elements.interestCompact.textContent = formatCompactINR(totalInterest);
  }

  if (elements.totalPayment) {
    elements.totalPayment.textContent = formatINR(totalPayment);
  }

  // Percentage badges
  if (elements.principalPercent) {
    elements.principalPercent.textContent = formatPercent(principalRatio);
  }
  if (elements.interestPercent) {
    elements.interestPercent.textContent = formatPercent(interestRatio);
  }

  // Visual Breakdown Bar segments
  if (elements.principalBar) {
    elements.principalBar.style.width = `${principalRatio}%`;
    elements.principalBar.setAttribute('aria-valuenow', principalRatio);
    elements.principalBar.title = `Principal: ${formatINR(principal)} (${principalRatio}%)`;
  }
  if (elements.interestBar) {
    elements.interestBar.style.width = `${interestRatio}%`;
    elements.interestBar.setAttribute('aria-valuenow', interestRatio);
    elements.interestBar.title = `Interest: ${formatINR(totalInterest)} (${interestRatio}%)`;
  }
}

/**
 * Resets metrics and breakdown bar to a clean pending/invalid state
 * so stale calculation results are never presented during invalid input.
 */
export function updateMetricsInvalidState(elements) {
  if (!elements) return;

  if (elements.monthlyEMI) {
    elements.monthlyEMI.textContent = '—';
    elements.monthlyEMI.setAttribute('aria-label', 'EMI unavailable due to invalid input');
  }

  if (elements.principalAmount) elements.principalAmount.textContent = '—';
  if (elements.principalCompact) elements.principalCompact.textContent = 'Awaiting valid input';

  if (elements.interestAmount) elements.interestAmount.textContent = '—';
  if (elements.interestCompact) elements.interestCompact.textContent = 'Awaiting valid input';

  if (elements.totalPayment) elements.totalPayment.textContent = '—';

  if (elements.principalPercent) elements.principalPercent.textContent = '—';
  if (elements.interestPercent) elements.interestPercent.textContent = '—';

  if (elements.principalBar) {
    elements.principalBar.style.width = '0%';
    elements.principalBar.setAttribute('aria-valuenow', '0');
    elements.principalBar.title = 'Awaiting valid loan inputs';
  }
  if (elements.interestBar) {
    elements.interestBar.style.width = '0%';
    elements.interestBar.setAttribute('aria-valuenow', '0');
    elements.interestBar.title = 'Awaiting valid loan inputs';
  }
}
