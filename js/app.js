/**
 * LoanWatch Application Entry Point
 * Event coordination, input synchronization, validation & calculation pipeline
 */

import { LOAN_DEFAULTS, INPUT_LIMITS, PRESET_CHIPS } from './config.js';
import { cleanNumericInput, formatINR, formatINRNumber, numberToIndianWords } from './formatters.js';
import { calculateEMI, validateLoanInputs } from './calculations.js';
import { updateMetricsAndBreakdown, updateMetricsInvalidState } from './ui/breakdown.js';
import { initScheduleController, renderSchedule, renderScheduleInvalidState, setScheduleLanguage } from './ui/schedule.js';
import { updateMascotTip, updateMascotInvalidState } from './ui/mascot.js';
import {
  createLoan, getDashboardTotals, getDueDate, getLoanProgress, getLoanSchedule,
  loadLoans, LOAN_CATEGORIES, markInstallmentPaid, saveLoans
} from './loans.js';
import { applyTranslations, getTranslation, translateValidation } from './i18n.js';
import { downloadLoanPDF } from './pdf-report.js';

// Application State
const state = {
  principal: LOAN_DEFAULTS.principal,
  annualRate: LOAN_DEFAULTS.annualRate,
  tenureYears: LOAN_DEFAULTS.tenureYears,
  tenureMonths: LOAN_DEFAULTS.tenureMonths,
  tenureUnit: LOAN_DEFAULTS.tenureUnit, // 'years' | 'months'
  personalLoans: [],
  demoLoans: null,
  demoMode: false,
  editingLoanId: null,
  language: 'en'
};

// DOM References
let dom = {};

document.addEventListener('DOMContentLoaded', () => {
  initDOMReferences();
  initPresetChips();
  initEventListeners();
  initScheduleController(dom.schedule, getCurrentLoanParams);
  initTracker();
  initPreferences();

  // Initial Calculation Run
  syncUIWithState();
  recalculateLoan();
});

function initDOMReferences() {
  dom = {
    // Principal Elements
    principalInput: document.getElementById('principalInput'),
    principalSlider: document.getElementById('principalSlider'),
    principalWords: document.getElementById('principalWords'),
    principalError: document.getElementById('principalError'),

    // Interest Elements
    rateInput: document.getElementById('rateInput'),
    rateSlider: document.getElementById('rateSlider'),
    rateError: document.getElementById('rateError'),

    // Tenure Elements
    tenureInput: document.getElementById('tenureInput'),
    tenureSlider: document.getElementById('tenureSlider'),
    tenureUnitYearsBtn: document.getElementById('tenureUnitYears'),
    tenureUnitMonthsBtn: document.getElementById('tenureUnitMonths'),
    tenureUnitLabel: document.getElementById('tenureUnitLabel'),
    tenureScaleMax: document.getElementById('tenureScaleMax'),
    tenureError: document.getElementById('tenureError'),

    // Chips Containers
    principalChips: document.getElementById('principalChips'),
    rateChips: document.getElementById('rateChips'),
    tenureChips: document.getElementById('tenureChips'),

    // Results & Metrics Elements
    resultsCard: document.getElementById('resultsCard'),
    resultsStatusNotice: document.getElementById('resultsStatusNotice'),
    resultsStatusText: document.getElementById('resultsStatusText'),
    emiNote: document.getElementById('emiNote'),
    metrics: {
      monthlyEMI: document.getElementById('monthlyEMI'),
      principalAmount: document.getElementById('principalAmount'),
      principalCompact: document.getElementById('principalCompact'),
      interestAmount: document.getElementById('interestAmount'),
      interestCompact: document.getElementById('interestCompact'),
      totalPayment: document.getElementById('totalPayment'),
      principalPercent: document.getElementById('principalPercent'),
      interestPercent: document.getElementById('interestPercent'),
      principalBar: document.getElementById('principalBar'),
      interestBar: document.getElementById('interestBar')
    },

    // Mascot Elements
    mascot: {
      speakerTitle: document.getElementById('mascotSpeakerTitle'),
      speechText: document.getElementById('mascotSpeechText'),
      headerTip: document.getElementById('headerMascotTip')
    },

    // Schedule Elements
    schedule: {
      tableHead: document.getElementById('scheduleTableHead'),
      tableBody: document.getElementById('scheduleTableBody'),
      viewYearlyBtn: document.getElementById('viewYearlyBtn'),
      viewMonthlyBtn: document.getElementById('viewMonthlyBtn'),
      expandTableBtn: document.getElementById('expandTableBtn'),
      scheduleFooterInfo: document.getElementById('scheduleFooterInfo')
    }
  };
}

function initPresetChips() {
  // Render Principal Chips
  if (dom.principalChips) {
    dom.principalChips.innerHTML = PRESET_CHIPS.principal.map(chip => `
      <button type="button" class="chip-btn" data-type="principal" data-value="${chip.value}">
        ${chip.label}
      </button>
    `).join('');
  }

  // Render Rate Chips
  if (dom.rateChips) {
    dom.rateChips.innerHTML = PRESET_CHIPS.annualRate.map(chip => `
      <button type="button" class="chip-btn" data-type="rate" data-value="${chip.value}">
        ${chip.label}
      </button>
    `).join('');
  }

  // Render Tenure Chips
  if (dom.tenureChips) {
    dom.tenureChips.innerHTML = PRESET_CHIPS.tenure.map(chip => `
      <button type="button" class="chip-btn" data-type="tenure" data-years="${chip.years}" data-months="${chip.months}">
        ${chip.label}
      </button>
    `).join('');
  }
}

function initEventListeners() {
  document.querySelectorAll('.section-nav-item').forEach(button => {
    button.addEventListener('click', () => selectSection(button.dataset.section));
  });

  // Principal Input & Slider Sync
  if (dom.principalSlider && dom.principalInput) {
    dom.principalSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.principal = val;
      dom.principalInput.value = formatINRNumber(val);
      updatePrincipalWords(val);
      clearFieldError(dom.principalInput, dom.principalError);
      updateActiveChips();
      recalculateLoan();
    });

    dom.principalInput.addEventListener('input', (e) => {
      const parsed = cleanNumericInput(e.target.value);
      state.principal = parsed;
      // Sync slider if within its range
      if (parsed <= INPUT_LIMITS.principal.sliderMax) {
        dom.principalSlider.value = parsed;
      }
      updatePrincipalWords(parsed);
      recalculateLoan();
    });

    dom.principalInput.addEventListener('blur', () => {
      // Reformat with commas on blur
      if (!isNaN(state.principal) && state.principal > 0) {
        dom.principalInput.value = formatINRNumber(state.principal);
      }
    });
  }

  // Rate Input & Slider Sync
  if (dom.rateSlider && dom.rateInput) {
    dom.rateSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.annualRate = val;
      dom.rateInput.value = val;
      clearFieldError(dom.rateInput, dom.rateError);
      updateActiveChips();
      recalculateLoan();
    });

    dom.rateInput.addEventListener('input', (e) => {
      const parsed = parseFloat(e.target.value);
      state.annualRate = parsed;
      if (parsed <= INPUT_LIMITS.annualRate.max) {
        dom.rateSlider.value = state.annualRate;
      }
      recalculateLoan();
    });
  }

  // Tenure Input & Slider Sync
  if (dom.tenureSlider && dom.tenureInput) {
    dom.tenureSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (state.tenureUnit === 'years') {
        state.tenureYears = val;
        state.tenureMonths = Math.round(val * 12);
        dom.tenureInput.value = val;
      } else {
        state.tenureMonths = Math.round(val);
        state.tenureYears = +(val / 12).toFixed(1);
        dom.tenureInput.value = val;
      }
      clearFieldError(dom.tenureInput, dom.tenureError);
      updateActiveChips();
      recalculateLoan();
    });

    dom.tenureInput.addEventListener('input', (e) => {
      const parsed = parseFloat(e.target.value);
      if (isNaN(parsed)) {
        state.tenureMonths = NaN;
        recalculateLoan();
        return;
      }

      if (state.tenureUnit === 'years') {
        state.tenureYears = parsed;
        state.tenureMonths = Math.round(parsed * 12);
        dom.tenureSlider.value = parsed;
      } else {
        state.tenureMonths = Math.round(parsed);
        state.tenureYears = +(parsed / 12).toFixed(1);
        dom.tenureSlider.value = parsed;
      }
      recalculateLoan();
    });
  }

  // Tenure Unit Toggle
  if (dom.tenureUnitYearsBtn && dom.tenureUnitMonthsBtn) {
    dom.tenureUnitYearsBtn.addEventListener('click', () => {
      if (state.tenureUnit === 'years') return;
      setTenureUnit('years');
    });

    dom.tenureUnitMonthsBtn.addEventListener('click', () => {
      if (state.tenureUnit === 'months') return;
      setTenureUnit('months');
    });
  }

  // Preset Chips Click Handler
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip-btn');
    if (!chip) return;

    const type = chip.dataset.type;
    if (type === 'principal') {
      const val = parseFloat(chip.dataset.value);
      state.principal = val;
      dom.principalInput.value = formatINRNumber(val);
      dom.principalSlider.value = Math.min(val, INPUT_LIMITS.principal.sliderMax);
      updatePrincipalWords(val);
      clearFieldError(dom.principalInput, dom.principalError);
    } else if (type === 'rate') {
      const val = parseFloat(chip.dataset.value);
      state.annualRate = val;
      dom.rateInput.value = val;
      dom.rateSlider.value = val;
      clearFieldError(dom.rateInput, dom.rateError);
    } else if (type === 'tenure') {
      const years = parseFloat(chip.dataset.years);
      const months = parseInt(chip.dataset.months, 10);
      state.tenureYears = years;
      state.tenureMonths = months;

      if (state.tenureUnit === 'years') {
        dom.tenureInput.value = years;
        dom.tenureSlider.value = years;
      } else {
        dom.tenureInput.value = months;
        dom.tenureSlider.value = months;
      }
      clearFieldError(dom.tenureInput, dom.tenureError);
    }

    updateActiveChips();
    recalculateLoan();
  });
}

function setTenureUnit(unit) {
  state.tenureUnit = unit;
  if (unit === 'years') {
    dom.tenureUnitYearsBtn.classList.add('active');
    dom.tenureUnitMonthsBtn.classList.remove('active');
    dom.tenureUnitLabel.textContent = 'Tenure (Years)';
    dom.tenureInput.value = state.tenureYears;

    dom.tenureSlider.min = INPUT_LIMITS.tenureYears.min;
    dom.tenureSlider.max = INPUT_LIMITS.tenureYears.max;
    dom.tenureSlider.step = INPUT_LIMITS.tenureYears.step;
    dom.tenureSlider.value = state.tenureYears;
    if (dom.tenureScaleMax) dom.tenureScaleMax.textContent = `${INPUT_LIMITS.tenureYears.max} Yrs`;
  } else {
    dom.tenureUnitMonthsBtn.classList.add('active');
    dom.tenureUnitYearsBtn.classList.remove('active');
    dom.tenureUnitLabel.textContent = 'Tenure (Months)';
    dom.tenureInput.value = state.tenureMonths;

    dom.tenureSlider.min = INPUT_LIMITS.tenureMonths.min;
    dom.tenureSlider.max = INPUT_LIMITS.tenureMonths.max;
    dom.tenureSlider.step = INPUT_LIMITS.tenureMonths.step;
    dom.tenureSlider.value = state.tenureMonths;
    if (dom.tenureScaleMax) dom.tenureScaleMax.textContent = `${INPUT_LIMITS.tenureMonths.max} Mo`;
  }
  const text = getTranslation(state.language);
  dom.tenureUnitLabel.textContent = unit === 'years' ? text.tenureYears : text.tenureMonths;
  dom.tenureUnitLabel.dataset.unit = unit;
  dom.tenureUnitYearsBtn.textContent = text.years;
  dom.tenureUnitMonthsBtn.textContent = text.months;
  updateActiveChips();
}

function syncUIWithState() {
  if (dom.principalInput) dom.principalInput.value = formatINRNumber(state.principal);
  if (dom.principalSlider) dom.principalSlider.value = state.principal;
  updatePrincipalWords(state.principal);

  if (dom.rateInput) dom.rateInput.value = state.annualRate;
  if (dom.rateSlider) dom.rateSlider.value = state.annualRate;

  setTenureUnit(state.tenureUnit);
  updateActiveChips();
}

function updatePrincipalWords(amount) {
  if (!dom.principalWords) return;
  if (amount > 0) {
    dom.principalWords.textContent = numberToIndianWords(amount);
    dom.principalWords.style.display = 'inline-block';
  } else {
    dom.principalWords.textContent = '';
    dom.principalWords.style.display = 'none';
  }
}

function updateActiveChips() {
  document.querySelectorAll('.chip-btn').forEach(btn => {
    const type = btn.dataset.type;
    if (type === 'principal') {
      const val = parseFloat(btn.dataset.value);
      btn.classList.toggle('active', val === state.principal);
    } else if (type === 'rate') {
      const val = parseFloat(btn.dataset.value);
      btn.classList.toggle('active', val === state.annualRate);
    } else if (type === 'tenure') {
      const years = parseFloat(btn.dataset.years);
      btn.classList.toggle('active', years === state.tenureYears);
    }
  });
}

function clearFieldError(inputEl, errorEl) {
  if (inputEl) {
    inputEl.classList.remove('is-invalid');
    inputEl.removeAttribute('aria-invalid');
  }
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

function setFieldError(inputEl, errorEl, message) {
  if (inputEl) {
    inputEl.classList.add('is-invalid');
    inputEl.setAttribute('aria-invalid', 'true');
  }
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function recalculateLoan() {
  const validation = validateLoanInputs(state.principal, state.annualRate, state.tenureMonths);

  // Apply or clear validation errors
  if (validation.errors.principal) {
    setFieldError(dom.principalInput, dom.principalError, translateValidation(validation.errors.principal, state.language));
  } else {
    clearFieldError(dom.principalInput, dom.principalError);
  }

  if (validation.errors.annualRate) {
    setFieldError(dom.rateInput, dom.rateError, translateValidation(validation.errors.annualRate, state.language));
  } else {
    clearFieldError(dom.rateInput, dom.rateError);
  }

  if (validation.errors.tenure) {
    setFieldError(dom.tenureInput, dom.tenureError, translateValidation(validation.errors.tenure, state.language));
  } else {
    clearFieldError(dom.tenureInput, dom.tenureError);
  }

  if (!validation.isValid) {
    renderInvalidState(validation.errors);
    return;
  }

  // RESTORE VALID STATE
  if (dom.resultsCard) {
    dom.resultsCard.classList.remove('is-invalid-state');
  }
  if (dom.resultsStatusNotice) {
    dom.resultsStatusNotice.classList.remove('visible');
  }
  if (dom.emiNote) {
    dom.emiNote.textContent = getTranslation(state.language).emiNote;
  }

  // Core Math Calculation
  const calcResult = calculateEMI(state.principal, state.annualRate, state.tenureMonths);

  // Update Visual Metrics & Ratio Bar
  updateMetricsAndBreakdown(dom.metrics, calcResult, state.principal);

  // Update Amortization Schedule
  renderSchedule(dom.schedule, {
    principal: state.principal,
    annualRate: state.annualRate,
    tenureMonths: state.tenureMonths,
    monthlyEMI: calcResult.monthlyEMI
  });

  // Update Apna Rupaiyya's Contextual Advice
  updateMascotTip(dom.mascot, {
    principal: state.principal,
    annualRate: state.annualRate,
    tenureMonths: state.tenureMonths,
    totalInterest: calcResult.totalInterest,
    monthlyEMI: calcResult.monthlyEMI
  }, state.language);
}

function renderInvalidState(errors) {
  if (dom.resultsCard) {
    dom.resultsCard.classList.add('is-invalid-state');
  }
  if (dom.resultsStatusNotice) {
    dom.resultsStatusNotice.classList.add('visible');
  }
  if (dom.resultsStatusText) {
    dom.resultsStatusText.textContent = getTranslation(state.language).invalidInputs;
  }
  if (dom.emiNote) {
    dom.emiNote.textContent = getTranslation(state.language).invalidInputs;
  }

  // Prevent misleading or stale calculations in metrics & chart
  updateMetricsInvalidState(dom.metrics);

  // Prevent misleading or stale schedule
  renderScheduleInvalidState(dom.schedule);

  // Update mascot guidance to explain what to fix
  updateMascotInvalidState(dom.mascot, errors, state.language);
}

function getCurrentLoanParams() {
  const validation = validateLoanInputs(state.principal, state.annualRate, state.tenureMonths);
  if (!validation.isValid) {
    return { isValid: false };
  }
  const calcResult = calculateEMI(state.principal, state.annualRate, state.tenureMonths);
  return {
    isValid: true,
    principal: state.principal,
    annualRate: state.annualRate,
    tenureMonths: state.tenureMonths,
    monthlyEMI: calcResult.monthlyEMI
  };
}

function initPreferences() {
    const languageSelect = document.getElementById('languageSelect');
    let language = 'en';
    let theme = 'light';
    try {
      language = localStorage.getItem('loanwatch.language') || 'en';
      theme = localStorage.getItem('loanwatch.theme') || 'light';
    } catch (error) {
      showStorageWarning(error.message);
    }
    state.language = ['en', 'hi', 'mr'].includes(language) ? language : 'en';
    document.documentElement.lang = state.language === 'en' ? 'en-IN' : state.language;
    if (languageSelect) languageSelect.value = state.language;
    setTheme(theme);
    setScheduleLanguage(state.language);
    applyTranslations(state.language);
    languageSelect?.addEventListener('change', () => {
      state.language = languageSelect.value;
      document.documentElement.lang = state.language === 'en' ? 'en-IN' : state.language;
      try { localStorage.setItem('loanwatch.language', state.language); }
      catch (error) { showStorageWarning(error.message); }
      applyTranslations(state.language);
      setScheduleLanguage(state.language);
      setTenureUnit(state.tenureUnit);
      recalculateLoan();
      renderLoans();
    });
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
    document.getElementById('demoToggle')?.addEventListener('click', toggleDemoMode);
    document.getElementById('continueButton')?.addEventListener('click', () => {
      document.getElementById('welcomePanel').hidden = true;
      const text = getTranslation(state.language);
      document.getElementById('welcomeHeading').textContent = text.welcomeHeading;
      document.querySelector('#welcomePanel p').textContent = text.welcomeText;
      document.getElementById('continueButton').textContent = text.continue;
      document.getElementById('principalInput').focus();
    });
    document.getElementById('goodbyeButton')?.addEventListener('click', () => {
      const text = getTranslation(state.language);
      const panel = document.getElementById('welcomePanel');
      panel.hidden = false;
      document.getElementById('welcomeHeading').textContent = text.goodbyeHeading;
      document.querySelector('#welcomePanel p').textContent = text.goodbyeText;
      document.getElementById('continueButton').textContent = text.continueReturn;
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById('welcomeHeading').focus?.();
    });
}

function setTheme(theme) {
    const selected = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = selected;
    const button = document.getElementById('themeToggle');
    if (button) button.setAttribute('aria-pressed', String(selected === 'dark'));
    if (button) button.textContent = selected === 'dark'
      ? getTranslation(state.language).lightTheme
      : getTranslation(state.language).darkTheme;
    try { localStorage.setItem('loanwatch.theme', selected); }
    catch (error) { showStorageWarning(error.message); }
}

function initTracker() {
    const loanForm = document.getElementById('loanForm');
    if (!loanForm) return;
    try {
      const loaded = loadLoans();
      state.personalLoans = loaded.loans;
      if (loaded.malformed) showStorageWarning(getTranslation(state.language).malformedStorage);
    } catch (error) {
      state.personalLoans = [];
      showStorageWarning(`${getTranslation(state.language).storageError} ${error.message}`);
    }
    const startDate = document.getElementById('loanStartDate');
    startDate.value = localDateString();

    loanForm.addEventListener('submit', event => {
      event.preventDefault();
      saveCurrentLoan();
    });
    document.getElementById('cancelLoanEdit').addEventListener('click', resetLoanForm);
    document.getElementById('loanList').addEventListener('click', handleLoanAction);
    document.getElementById('loanList').addEventListener('change', handlePaymentSelection);
    renderLoans();
}

function currentLoans() {
    return state.demoMode ? state.demoLoans : state.personalLoans;
}

function persistLoans(nextLoans) {
    if (!state.demoMode) saveLoans(nextLoans);
    if (state.demoMode) state.demoLoans = nextLoans;
    else state.personalLoans = nextLoans;
    renderLoans();
}

function saveCurrentLoan() {
    const message = document.getElementById('loanFormMessage');
    const translation = getTranslation(state.language);
    const validation = validateLoanInputs(state.principal, state.annualRate, state.tenureMonths);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      message.textContent = translateValidation(firstError, state.language);
      return;
    }
    try {
      const formLoan = createLoan({
        name: document.getElementById('loanName').value,
        category: document.getElementById('loanCategory').value,
        startDate: document.getElementById('loanStartDate').value,
        principal: state.principal,
        annualRate: state.annualRate,
        tenureMonths: state.tenureMonths
      }, state.editingLoanId || undefined);
      const loans = currentLoans();
      const editedLoan = loans.find(loan => loan.id === state.editingLoanId);
      if (editedLoan && editedLoan.payments.some(payment => payment.installmentNumber > formLoan.tenureMonths)) {
        throw new Error('TENURE_EDIT_ERROR');
      }
      if (editedLoan && editedLoan.payments.reduce((sum, payment) => sum + payment.principalPaid, 0) > formLoan.principal) {
        throw new Error('PRINCIPAL_EDIT_ERROR');
      }
      if (editedLoan && editedLoan.payments.length >= formLoan.tenureMonths &&
          editedLoan.payments.reduce((sum, payment) => sum + payment.principalPaid, 0) < formLoan.principal) {
        throw new Error('TENURE_EDIT_ERROR');
      }
      const next = state.editingLoanId
        ? loans.map(loan => loan.id === state.editingLoanId ? { ...formLoan, payments: loan.payments } : loan)
        : [...loans, formLoan];
      persistLoans(next);
      const wasEditing = Boolean(state.editingLoanId);
      resetLoanForm();
      message.textContent = wasEditing ? translation.editSuccess : translation.saveSuccess;
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.name === 'SecurityError') {
        showStorageWarning(`${translation.storageError} ${error.message}`);
        message.textContent = translation.storageError;
      } else {
        message.textContent = localizedTrackerError(error, translation);
      }
    }
}

function resetLoanForm() {
    state.editingLoanId = null;
    document.getElementById('loanForm').reset();
    document.getElementById('loanStartDate').value = localDateString();
    document.getElementById('loanFormHeading').textContent = getTranslation(state.language).saveLoan;
    document.getElementById('saveLoanButton').textContent = getTranslation(state.language).saveDetails;
    document.getElementById('cancelLoanEdit').hidden = true;
    document.getElementById('loanFormMessage').textContent = '';
}

function renderLoans() {
    const loans = currentLoans() || [];
    const dictionary = getTranslation(state.language);
    const totals = getDashboardTotals(loans);
    document.getElementById('dashboardLoanCount').textContent = String(totals.activeLoanCount);
    document.getElementById('dashboardEMI').textContent = formatINR(totals.monthlyEMI);
    document.getElementById('dashboardPrincipal').textContent = formatINR(totals.totalPrincipal);
    document.getElementById('dashboardOutstanding').textContent = formatINR(totals.outstandingPrincipal);
    document.getElementById('dashboardInterest').textContent = formatINR(totals.totalEstimatedInterest);
    document.getElementById('dashboardProgress').textContent = `${totals.progressPercent.toFixed(2)}%`;
    document.getElementById('dashboardProgressBar').value = totals.progressPercent;
    renderDashboardCharts(loans, totals, dictionary);
    const upcoming = document.getElementById('upcomingPayment');
    upcoming.dataset.empty = String(!totals.upcoming);
    const today = localDateString();
    upcoming.textContent = totals.upcoming
      ? `${totals.upcoming.dueDate < today ? dictionary.overdueStatus : dictionary.dueStatus}: ${escapeHTML(totals.upcoming.loanName)} — ${formatINR(totals.upcoming.amount)} (${totals.upcoming.dueDate})`
      : dictionary.noUpcoming;
    const demoStatus = document.getElementById('demoStatus');
    demoStatus.hidden = !state.demoMode;
    demoStatus.textContent = dictionary.demoStatus;
    const demoToggle = document.getElementById('demoToggle');
    demoToggle.setAttribute('aria-pressed', String(state.demoMode));
    demoToggle.textContent = state.demoMode ? dictionary.demoOn : dictionary.demoOff;
    renderHighInterestAlert(totals, dictionary);
    const list = document.getElementById('loanList');
    if (!loans.length) {
      list.innerHTML = `<p class="empty-state">${dictionary.noLoans}</p>`;
      return;
    }
    list.innerHTML = loans.map(loan => renderLoanCard(loan, dictionary)).join('');
}

function selectSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section || !section.classList.contains('app-section')) return;
    document.querySelectorAll('.app-section').forEach(item => {
      item.hidden = item !== section;
    });
    document.querySelectorAll('.section-nav-item').forEach(button => {
      const selected = button.dataset.section === sectionId;
      button.classList.toggle('active', selected);
      if (selected) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const dictionary = getTranslation(state.language);
    document.getElementById('sectionTitle').textContent = dictionary.sectionTitles[sectionId];
    document.getElementById('sectionSubtitle').textContent = dictionary.sectionSubtitles[sectionId];
  }

function renderDashboardCharts(loans, totals, dictionary) {
    const svg = document.getElementById('compositionChart');
    const legend = document.getElementById('compositionLegend');
    const barChart = document.getElementById('outstandingChart');
    const summary = document.getElementById('dashboardLoanSummary');
    const description = document.getElementById('compositionChartDescription');
    if (!loans.length) {
      svg.innerHTML = '<circle cx="90" cy="90" r="62" fill="none" stroke="var(--bg-surface-subtle)" stroke-width="24"></circle>';
      description.textContent = dictionary.noChartData;
      legend.innerHTML = `<p class="empty-state">${dictionary.noChartData}</p>`;
      barChart.innerHTML = `<p class="empty-state">${dictionary.noChartData}</p>`;
      summary.innerHTML = `<p class="empty-state">${dictionary.noLoans}</p>`;
      return;
    }
    const principal = totals.totalPrincipal;
    const interest = totals.totalEstimatedInterest;
    const total = principal + interest;
    const circumference = 2 * Math.PI * 62;
    const principalShare = total ? principal / total : 1;
    svg.innerHTML = `
      <circle cx="90" cy="90" r="62" fill="none" stroke="var(--brand-saffron)" stroke-width="24"></circle>
      <circle cx="90" cy="90" r="62" fill="none" stroke="var(--brand-emerald)" stroke-width="24"
        stroke-dasharray="${circumference * principalShare} ${circumference * (1 - principalShare)}"
        transform="rotate(-90 90 90)"></circle>
      <text x="90" y="86" text-anchor="middle" fill="var(--text-primary)" font-size="12">${escapeHTML(dictionary.summaryLoan)}</text>
      <text x="90" y="105" text-anchor="middle" fill="var(--text-primary)" font-size="13" font-weight="700">${escapeHTML(formatINR(total))}</text>`;
    description.textContent = `${dictionary.totalPrincipal}: ${formatINR(principal)}. ${dictionary.estimatedInterest}: ${formatINR(interest)}.`;
    legend.innerHTML = `
      <span><span><i class="chart-swatch" style="background:var(--brand-emerald)"></i>${escapeHTML(dictionary.totalPrincipal)}</span><strong>${formatINR(principal)}</strong></span>
      <span><span><i class="chart-swatch" style="background:var(--brand-saffron)"></i>${escapeHTML(dictionary.estimatedInterest)}</span><strong>${formatINR(interest)}</strong></span>`;
    const details = loans.map(loan => ({ loan, progress: getLoanProgress(loan) }));
    const maxBalance = Math.max(...details.map(item => item.progress.outstandingPrincipal), 0);
    barChart.innerHTML = details.map(({ loan, progress }) => {
      const width = maxBalance ? progress.outstandingPrincipal / maxBalance * 100 : 0;
      return `<div class="outstanding-row">
        <span class="outstanding-row-label" title="${escapeHTML(loan.name)}">${escapeHTML(loan.name)}</span>
        <span class="outstanding-track" aria-hidden="true"><span class="outstanding-fill" style="display:block;width:${width.toFixed(2)}%"></span></span>
        <strong class="outstanding-value">${formatINR(progress.outstandingPrincipal)}</strong>
      </div>`;
    }).join('');
    summary.innerHTML = `<div class="summary-table-wrapper"><table class="summary-table">
      <thead><tr><th>${escapeHTML(dictionary.summaryLoan)}</th><th>${escapeHTML(dictionary.summaryCategory)}</th><th>${escapeHTML(dictionary.summaryEMI)}</th><th>${escapeHTML(dictionary.summaryOutstanding)}</th><th>${escapeHTML(dictionary.summaryProgress)}</th></tr></thead>
      <tbody>${details.map(({ loan, progress }) => {
        const category = dictionary.categories[LOAN_CATEGORIES.indexOf(loan.category)] || loan.category;
        return `<tr><td>${escapeHTML(loan.name)}</td><td>${escapeHTML(category)}</td>
          <td>${formatINR(progress.upcoming?.amount || loan.monthlyEMI)}</td><td>${formatINR(progress.outstandingPrincipal)}</td>
          <td><progress class="summary-progress" max="100" value="${progress.progressPercent}" aria-label="${escapeHTML(dictionary.summaryProgress)} ${progress.progressPercent}%">${progress.progressPercent}%</progress> ${progress.progressPercent.toFixed(2)}%</td></tr>`;
      }).join('')}</tbody></table></div>`;
}

function renderHighInterestAlert(totals, dictionary) {
    const alert = document.getElementById('highInterestAlert');
    const exceedsPrincipal = totals.loanCount > 0 && totals.totalEstimatedInterest > totals.totalPrincipal;
    alert.hidden = !exceedsPrincipal;
    if (!exceedsPrincipal) {
      alert.replaceChildren();
      return;
    }
    const heading = document.createElement('strong');
    heading.textContent = dictionary.highInterestTitle;
    const message = document.createElement('p');
    message.textContent = dictionary.highInterestMessage
      .replace('{interest}', formatINR(totals.totalEstimatedInterest))
      .replace('{principal}', formatINR(totals.totalPrincipal));
    alert.replaceChildren(heading, message);
}

function renderLoanCard(loan, dictionary) {
    const progress = getLoanProgress(loan);
    const paidNumbers = new Set(loan.payments.map(payment => payment.installmentNumber));
    const unpaid = progress.schedule.rows.filter(row => !paidNumbers.has(row.month)).slice(0, 1);
    const categoryIndex = LOAN_CATEGORIES.indexOf(loan.category);
    const category = dictionary.categories[categoryIndex] || loan.category;
    const payments = loan.payments.length
      ? loan.payments.slice().sort((a, b) => b.installmentNumber - a.installmentNumber).map(payment =>
        `<li>${dictionary.installment} ${payment.installmentNumber}: ${formatINR(payment.amount)} — ${dictionary.paidOn} ${escapeHTML(payment.paidDate)}
          <button type="button" class="btn-secondary" data-action="delete-payment" data-id="${escapeHTML(loan.id)}" data-installment="${payment.installmentNumber}">${dictionary.deletePayment}</button></li>`
      ).join('')
      : `<li>${dictionary.noPayments}</li>`;
    const options = unpaid.map(row =>
      `<option value="${row.month}">${dictionary.installment} ${row.month} — ${formatINR(row.emi)} (${getDueDate(loan.startDate, row.month)})</option>`
    ).join('');
    return `<article class="loan-card" data-loan-id="${escapeHTML(loan.id)}">
      <h3>${escapeHTML(loan.name)}</h3>
      <p>${escapeHTML(category)} · ${dictionary.startDateLabel}: ${escapeHTML(loan.startDate)}</p>
      <p class="loan-card-details">${dictionary.reportPrincipal}: ${formatINR(loan.principal)} · ${loan.annualRate}% · ${loan.tenureMonths} ${dictionary.months.toLowerCase()}</p>
      <div class="loan-card-metrics">
        <div><span>${dictionary.monthlyEMI}</span><strong>${formatINR(progress.upcoming?.amount || loan.monthlyEMI)}</strong></div>
        <div><span>${dictionary.balance}</span><strong>${formatINR(progress.outstandingPrincipal)}</strong></div>
        <div><span>${dictionary.progress}</span><strong>${progress.progressPercent.toFixed(2)}%</strong></div>
        <div><span>${dictionary.remaining}</span><strong>${progress.remainingInstallments}</strong></div>
      </div>
      <progress max="100" value="${progress.progressPercent}" aria-label="${dictionary.progress} ${progress.progressPercent}%">${progress.progressPercent}%</progress>
      ${state.demoMode ? '' : `<details class="loan-payment-details"><summary>${dictionary.paymentHistory} · ${progress.paidInstallments} ${dictionary.paid}</summary>
      <div class="payment-controls">
        <label>${dictionary.installment}
          <select data-payment-select aria-label="${dictionary.installment}" ${unpaid.length ? '' : 'disabled'}>${options || '<option value="">—</option>'}</select>
        </label>
        <label>${dictionary.paymentDate}
          <input type="date" data-payment-date value="${localDateString()}" max="${localDateString()}" ${unpaid.length ? '' : 'disabled'}>
        </label>
        <button type="button" class="btn-primary" data-action="pay" data-id="${escapeHTML(loan.id)}" ${unpaid.length ? '' : 'disabled'}>${dictionary.markPaid}</button>
      </div>
      <h4>${dictionary.paymentHistory}</h4><ul class="payment-history">${payments}</ul>
      </details>`}
      <div class="loan-card-actions">
        <button type="button" class="btn-secondary" data-action="edit" data-id="${escapeHTML(loan.id)}">${dictionary.editLoan}</button>
        <button type="button" class="btn-secondary" data-action="report" data-id="${escapeHTML(loan.id)}">${dictionary.downloadReport}</button>
        <button type="button" class="btn-secondary btn-danger" data-action="delete" data-id="${escapeHTML(loan.id)}">${dictionary.deleteLoan}</button>
      </div>
    </article>`;
}

function handlePaymentSelection(event) {
    if (!event.target.matches('[data-payment-select]')) return;
    const card = event.target.closest('.loan-card');
    const button = card.querySelector('[data-action="pay"]');
    button.dataset.installment = event.target.value;
}

function handleLoanAction(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const loans = currentLoans();
    const loan = loans.find(item => item.id === button.dataset.id);
    if (!loan) return;
    const dictionary = getTranslation(state.language);
    if (button.dataset.action === 'edit') {
      state.editingLoanId = loan.id;
      document.getElementById('loanName').value = loan.name;
      document.getElementById('loanCategory').value = loan.category;
      document.getElementById('loanStartDate').value = loan.startDate;
      state.principal = loan.principal;
      state.annualRate = loan.annualRate;
      state.tenureMonths = loan.tenureMonths;
      state.tenureYears = loan.tenureMonths / 12;
      dom.tenureInput.value = state.tenureYears;
      dom.rateInput.value = state.annualRate;
      dom.principalInput.value = formatINRNumber(state.principal);
      syncUIWithState();
      recalculateLoan();
      document.getElementById('loanFormHeading').textContent = dictionary.editLoan;
      document.getElementById('saveLoanButton').textContent = dictionary.saveLoan;
      document.getElementById('cancelLoanEdit').hidden = false;
      document.getElementById('loanForm').scrollIntoView({ behavior: 'smooth' });
    } else if (button.dataset.action === 'delete') {
      if (!window.confirm(dictionary.deleteLoanConfirm)) return;
      try {
        persistLoans(loans.filter(item => item.id !== loan.id));
      } catch (error) {
        showStorageWarning(`${dictionary.storageError} ${error.message}`);
      }
    } else if (button.dataset.action === 'delete-payment') {
      if (!window.confirm(dictionary.deletePaymentConfirm)) return;
      const installment = Number(button.dataset.installment);
      try {
        persistLoans(loans.map(item => item.id === loan.id
          ? { ...item, payments: item.payments.filter(payment => payment.installmentNumber !== installment) }
          : item));
      } catch (error) {
        showStorageWarning(`${dictionary.storageError} ${error.message}`);
      }
    } else if (button.dataset.action === 'pay') {
      const card = button.closest('.loan-card');
      const installment = Number(button.dataset.installment || card.querySelector('[data-payment-select]').value);
      const paidDate = card.querySelector('[data-payment-date]').value;
      try {
        const updated = { ...loan, payments: loan.payments.map(payment => ({ ...payment })) };
        markInstallmentPaid(updated, installment, paidDate);
        persistLoans(loans.map(item => item.id === loan.id ? updated : item));
        document.getElementById('loanFormMessage').textContent = dictionary.paymentSuccess;
      } catch (error) {
        document.getElementById('loanFormMessage').textContent = localizedTrackerError(error, dictionary);
      }
    } else if (button.dataset.action === 'report') {
      try {
        downloadLoanPDF(loan, getLoanProgress(loan), state.language);
      } catch (error) {
        document.getElementById('loanFormMessage').textContent = `${dictionary.reportError} ${error.message}`;
      }
    }
}

function toggleDemoMode() {
    state.demoMode = !state.demoMode;
    state.editingLoanId = null;
    resetLoanForm();
    if (state.demoMode) state.demoLoans = createDemoLoans();
    else state.demoLoans = null;
    applyTranslations(state.language);
    renderLoans();
}

function createDemoLoans() {
    const loans = [
      createLoan({ name: 'Pune family home', category: 'Home Loan', startDate: '2023-06-05', principal: 4200000, annualRate: 8.4, tenureMonths: 240 }),
      createLoan({ name: 'City commute car', category: 'Car Loan', startDate: '2025-02-12', principal: 850000, annualRate: 9.2, tenureMonths: 60 }),
      createLoan({ name: 'Engineering education', category: 'Education Loan', startDate: '2024-08-01', principal: 650000, annualRate: 7.5, tenureMonths: 84 }),
      createLoan({ name: 'Home essentials', category: 'Other Loans', startDate: '2025-11-07', principal: 300000, annualRate: 12.5, tenureMonths: 36 })
    ];
    for (const [index, paidCount] of [40, 20, 26, 10].entries()) {
      for (let installment = 1; installment <= paidCount; installment += 1) {
        const paidDate = getDueDate(loans[index].startDate, installment);
        markInstallmentPaid(loans[index], installment, paidDate);
      }
    }
    return loans;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

function showStorageWarning(message) {
    const warning = document.getElementById('storageWarning');
    if (!warning) return;
    warning.hidden = false;
    warning.textContent = message;
}

function localizedTrackerError(error, dictionary) {
  const messages = {
    'Enter a loan name, valid category, start date, and valid loan details.': dictionary.loanDetailsError,
    'This instalment is invalid or has already been recorded as paid.': dictionary.duplicatePayment,
    'Enter a valid payment date no later than today.': dictionary.paymentDateError,
    'Payment dates must follow the instalment order.': dictionary.paymentChronologyError,
    'Record instalments in order to keep the estimated balance accurate.': dictionary.orderError,
    'No estimated principal remains to pay.': dictionary.noBalanceError,
    TENURE_EDIT_ERROR: dictionary.tenureEditError,
    PRINCIPAL_EDIT_ERROR: dictionary.principalEditError
  };
  return messages[error.message] || error.message;
}

function localDateString() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
