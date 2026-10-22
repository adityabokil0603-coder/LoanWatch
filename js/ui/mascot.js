/**
 * Apna Rupaiyya Mascot UI Controller
 * Manages mascot speech bubble, contextual loan insights, and tips.
 */

export function updateMascotTip(elements, { principal, annualRate, tenureMonths, totalInterest, monthlyEMI }, language = 'en') {
  if (!elements || !elements.speechText) return;

  const interestRatio = (principal + totalInterest) > 0 ? (totalInterest / (principal + totalInterest)) * 100 : 0;
  const tenureYears = tenureMonths / 12;

  let tipTitle = "Apna Rupaiyya's Insight";
  let tipText = "";

  if (language === 'hi') {
    tipTitle = 'Apna Rupaiyya की सलाह';
    tipText = `अनुमानित मासिक EMI ${formatCurrency(monthlyEMI)} है। हर महीने समय पर भुगतान से मूलधन घटता है। वास्तविक राशि और तारीख अपने ऋणदाता से जांचें।`;
  } else if (language === 'mr') {
    tipTitle = 'Apna Rupaiyya चा सल्ला';
    tipText = `अंदाजित मासिक EMI ${formatCurrency(monthlyEMI)} आहे. दर महिन्याला वेळेवर भरल्यास मुद्दल कमी होते. प्रत्यक्ष रक्कम व तारीख कर्जदात्याकडून तपासा.`;
  } else if (annualRate === 0) {
    tipTitle = "Interest-Free Alert!";
    tipText = "Zero percent interest loans are great! Make sure to double-check with the lender for any hidden file charges, processing fees, or mandatory insurance bundles.";
  } else if (totalInterest > principal) {
    tipTitle = "High Interest Alert!";
    tipText = `Watch out! Your total interest (${formatCurrency(totalInterest)}) exceeds your principal. Increasing your monthly EMI or choosing a shorter tenure will save you lakhs in compounding charges.`;
  } else if (tenureYears >= 20) {
    tipTitle = "Tenure Impact";
    tipText = `A ${tenureYears}-year tenure keeps your monthly EMI manageable at ${formatCurrency(monthlyEMI)}, but interest accounts for ${interestRatio.toFixed(0)}% of your total repayment. Ask your lender how different payment choices could affect the schedule.`;
  } else if (tenureYears <= 3) {
    tipTitle = "Speedy Payoff!";
    tipText = `Excellent strategy! A short tenure of ${tenureYears} ${tenureYears === 1 ? 'year' : 'years'} drastically slashes the interest burden. You will retain ${((100 - interestRatio)).toFixed(0)}% of your repayment toward your own equity.`;
  } else {
    tipTitle = "Prudent Borrowing";
    tipText = "Golden rule of Indian personal finance: Ensure all your combined monthly loan EMIs do not exceed 35% to 40% of your net monthly in-hand income.";
  }

  if (elements.speakerTitle) {
    elements.speakerTitle.textContent = tipTitle;
  }
  elements.speechText.textContent = tipText;

  // Also update header capsule tip if present
  if (elements.headerTip) {
    elements.headerTip.textContent = tipText;
  }
}

/**
 * Contextual message when inputs require correction
 */
export function updateMascotInvalidState(elements, errors = {}, language = 'en') {
  if (!elements || !elements.speechText) return;

  const tipTitle = language === 'hi' ? 'सुधार आवश्यक' : language === 'mr' ? 'दुरुस्ती आवश्यक' : 'Action Needed';
  let tipText = "Please correct the highlighted inputs on the left. Once valid, I'll calculate your exact monthly EMI, interest breakdown, and amortization schedule!";

  if (language === 'hi') {
    tipText = 'कृपया चिह्नित जानकारी सही करें। सही जानकारी मिलने पर मैं मासिक EMI, ब्याज और किस्त-सारणी का अनुमान दिखाऊंगा।';
  } else if (language === 'mr') {
    tipText = 'कृपया दाखवलेली माहिती दुरुस्त करा. योग्य माहिती मिळाल्यावर मी मासिक EMI, व्याज आणि वेळापत्रकाचा अंदाज दाखवेन.';
  }

  if (errors.principal) {
    tipText = language === 'en' ? `Loan Amount: ${errors.principal}. Please adjust this to proceed.` : tipText;
  } else if (errors.annualRate) {
    if (language === 'en') tipText = `Interest Rate: ${errors.annualRate}. Enter a non-negative rate to calculate.`;
  } else if (errors.tenure) {
    if (language === 'en') tipText = `Tenure: ${errors.tenure}. Enter at least 1 month (or 0.5 years).`;
  }

  if (elements.speakerTitle) {
    elements.speakerTitle.textContent = tipTitle;
  }
  elements.speechText.textContent = tipText;

  if (elements.headerTip) {
    elements.headerTip.textContent = language === 'hi'
      ? 'EMI निकालने के लिए चिह्नित जानकारी सही करें।'
      : language === 'mr'
        ? 'EMI मोजण्यासाठी दाखवलेली माहिती दुरुस्त करा.'
        : 'Correct the highlighted inputs on the left to calculate your EMI.';
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
