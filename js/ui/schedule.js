/**
 * Amortization Schedule UI Controller
 * Renders Yearly and Monthly breakdown tables with responsive pagination
 */

import { formatINR } from '../formatters.js';
import { generateAmortizationSchedule, generateYearlySchedule } from '../calculations.js';

let currentMode = 'yearly'; // 'yearly' | 'monthly'
let isExpanded = false;
let cachedSchedule = null;
let scheduleLanguage = 'en';

const labels = {
  en: ['Period', 'Opening Balance', 'EMI Paid', 'Principal Repaid', 'Interest Paid', 'Outstanding Principal', 'Year', 'Total EMI Paid', 'Month', 'Paid Off', 'Showing annual summary for', 'years.', 'Showing all', 'monthly instalments.', 'Showing first 24 of', 'months.', 'Show All', 'Months', 'Collapse to 24 Months', 'Correct the highlighted inputs above to view your amortisation schedule.', 'Waiting for valid loan parameters...'],
  hi: ['अवधि', 'आरंभिक शेष', 'भरी EMI', 'चुकाया मूलधन', 'भरा ब्याज', 'बकाया मूलधन', 'वर्ष', 'कुल EMI', 'महीना', 'पूरा चुकाया', 'वार्षिक सारांश:', 'वर्ष।', 'सभी', 'मासिक किस्तें दिखाई गईं।', 'पहली 24 में से', 'महीने दिखाई गईं।', 'सभी', 'महीने दिखाएं', 'पहले 24 महीने दिखाएं', 'किस्त-सारणी देखने के लिए ऊपर की चिह्नित जानकारी सही करें।', 'सही ऋण विवरण की प्रतीक्षा है।'],
  mr: ['कालावधी', 'सुरुवातीची बाकी', 'भरलेली EMI', 'फेडलेले मुद्दल', 'भरलेले व्याज', 'बाकी मुद्दल', 'वर्ष', 'एकूण EMI', 'महिना', 'पूर्ण फेडले', 'वार्षिक सारांश:', 'वर्षे.', 'सर्व', 'मासिक हप्ते दाखवले.', 'पहिले 24 पैकी', 'महिने दाखवले.', 'सर्व', 'महिने दाखवा', 'पहिले 24 महिने दाखवा', 'वेळापत्रक पाहण्यासाठी वरील दाखवलेली माहिती दुरुस्त करा.', 'योग्य कर्ज तपशीलाची प्रतीक्षा आहे.']
};

export function setScheduleLanguage(language) {
  scheduleLanguage = labels[language] ? language : 'en';
}

function scheduleLabels() {
  return labels[scheduleLanguage];
}

export function initScheduleController(elements, getInputsCallback) {
  if (!elements.viewYearlyBtn || !elements.viewMonthlyBtn) return;

  elements.viewYearlyBtn.addEventListener('click', () => {
    if (currentMode === 'yearly') return;
    currentMode = 'yearly';
    elements.viewYearlyBtn.classList.add('active');
    elements.viewMonthlyBtn.classList.remove('active');
    const params = getInputsCallback();
    if (params && params.isValid) {
      renderSchedule(elements, params);
    } else {
      renderScheduleInvalidState(elements);
    }
  });

  elements.viewMonthlyBtn.addEventListener('click', () => {
    if (currentMode === 'monthly') return;
    currentMode = 'monthly';
    elements.viewMonthlyBtn.classList.add('active');
    elements.viewYearlyBtn.classList.remove('active');
    const params = getInputsCallback();
    if (params && params.isValid) {
      renderSchedule(elements, params);
    } else {
      renderScheduleInvalidState(elements);
    }
  });

  if (elements.expandTableBtn) {
    elements.expandTableBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      const params = getInputsCallback();
      if (params && params.isValid) {
        renderSchedule(elements, params);
      } else {
        renderScheduleInvalidState(elements);
      }
    });
  }
}

/**
 * Displays a clean, helpful waiting prompt in the schedule table
 * when any loan parameter is invalid, preventing stale data display.
 */
export function renderScheduleInvalidState(elements) {
  if (!elements || !elements.tableBody) return;
  const text = scheduleLabels();

  if (elements.tableHead) {
    elements.tableHead.innerHTML = `
      <tr>
        <th scope="col">${text[0]}</th>
        <th scope="col" class="text-right">${text[1]}</th>
        <th scope="col" class="text-right">${text[2]}</th>
        <th scope="col" class="text-right">${text[3]}</th>
        <th scope="col" class="text-right">${text[4]}</th>
        <th scope="col" class="text-right">${text[5]}</th>
      </tr>
    `;
  }

  elements.tableBody.innerHTML = `
    <tr>
      <td colspan="6" class="table-empty-notice">
        ${text[19]}
      </td>
    </tr>
  `;

  if (elements.scheduleFooterInfo) {
    elements.scheduleFooterInfo.textContent = text[20];
  }
  if (elements.expandTableBtn) {
    elements.expandTableBtn.style.display = 'none';
  }
}

export function renderSchedule(elements, { principal, annualRate, tenureMonths, monthlyEMI }) {
  if (!elements.tableHead || !elements.tableBody) return;

  // Recalculate schedule
  cachedSchedule = generateAmortizationSchedule(principal, annualRate, tenureMonths, monthlyEMI);
  const monthlyRows = cachedSchedule.rows;
  const yearlyRows = generateYearlySchedule(monthlyRows);

  if (currentMode === 'yearly') {
    renderYearlyView(elements, yearlyRows);
  } else {
    renderMonthlyView(elements, monthlyRows);
  }
}

function renderYearlyView(elements, yearlyRows) {
  const text = scheduleLabels();
  // Update Header
  elements.tableHead.innerHTML = `
    <tr>
      <th scope="col">${text[6]}</th>
      <th scope="col" class="text-right">${text[1]}</th>
      <th scope="col" class="text-right">${text[7]}</th>
      <th scope="col" class="text-right">${text[3]}</th>
      <th scope="col" class="text-right">${text[4]}</th>
      <th scope="col" class="text-right">${text[5]}</th>
    </tr>
  `;

  // Update Body
  const htmlRows = yearlyRows.map((row, index) => {
    const isFinal = index === yearlyRows.length - 1;
    return `
      <tr class="${isFinal ? 'final-row' : ''}">
        <td><strong>${text[6]} ${row.year}</strong></td>
        <td class="text-right">${formatINR(row.openingBalance)}</td>
        <td class="text-right">${formatINR(row.totalEMI)}</td>
        <td class="text-right col-principal">${formatINR(row.totalPrincipalPaid)}</td>
        <td class="text-right col-interest">${formatINR(row.totalInterestPaid)}</td>
        <td class="text-right"><strong>${row.closingBalance <= 0 ? `${formatINR(0)} (${text[9]})` : formatINR(row.closingBalance)}</strong></td>
      </tr>
    `;
  }).join('');

  elements.tableBody.innerHTML = htmlRows;

  // Footer status
  if (elements.scheduleFooterInfo) {
    elements.scheduleFooterInfo.textContent = `${text[10]} ${yearlyRows.length} ${text[11]}`;
  }
  if (elements.expandTableBtn) {
    elements.expandTableBtn.style.display = 'none';
  }
}

function renderMonthlyView(elements, monthlyRows) {
  const text = scheduleLabels();
  // Update Header
  elements.tableHead.innerHTML = `
    <tr>
      <th scope="col">${text[8]}</th>
      <th scope="col" class="text-right">${text[1]}</th>
      <th scope="col" class="text-right">${text[2]}</th>
      <th scope="col" class="text-right">${text[3]}</th>
      <th scope="col" class="text-right">${text[4]}</th>
      <th scope="col" class="text-right">${text[5]}</th>
    </tr>
  `;

  const totalRows = monthlyRows.length;
  const displayLimit = isExpanded ? totalRows : Math.min(24, totalRows);
  const rowsToRender = monthlyRows.slice(0, displayLimit);

  const htmlRows = rowsToRender.map((row, index) => {
    const isFinal = row.month === totalRows;
    return `
      <tr class="${isFinal ? 'final-row' : ''}">
        <td><strong>${text[8]} ${row.month}</strong> <span style="font-size: 0.75rem; color: var(--text-muted);">(${text[6]} ${row.year})</span></td>
        <td class="text-right">${formatINR(row.openingBalance)}</td>
        <td class="text-right">${formatINR(row.emi)}</td>
        <td class="text-right col-principal">${formatINR(row.principalPaid)}</td>
        <td class="text-right col-interest">${formatINR(row.interestPaid)}</td>
        <td class="text-right"><strong>${row.closingBalance <= 0 ? `${formatINR(0)} (${text[9]})` : formatINR(row.closingBalance)}</strong></td>
      </tr>
    `;
  }).join('');

  elements.tableBody.innerHTML = htmlRows;

  // Footer status and expand button
  if (elements.scheduleFooterInfo) {
    elements.scheduleFooterInfo.textContent = isExpanded || totalRows <= 24
      ? `${text[12]} ${totalRows} ${text[13]}`
      : `${text[14]} ${totalRows} ${text[15]}`;
  }

  if (elements.expandTableBtn) {
    if (totalRows > 24) {
      elements.expandTableBtn.style.display = 'inline-block';
      elements.expandTableBtn.textContent = isExpanded ? text[18] : `${text[16]} ${totalRows} ${text[17]}`;
    } else {
      elements.expandTableBtn.style.display = 'none';
    }
  }
}
