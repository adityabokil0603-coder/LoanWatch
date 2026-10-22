const translations = {
  en: {
    welcomeHeading: 'Welcome to LoanWatch',
    welcomeText: 'Plan your loan, understand each instalment, and keep a private record in this browser. Figures are estimates, not lender-confirmed quotes.',
    continue: 'Continue', goodbye: 'Goodbye / return to welcome', goodbyeHeading: 'See you again',
    goodbyeText: 'You can return to LoanWatch whenever you like. This does not close your browser tab; saved records remain in this browser.',
    continueReturn: 'Return to LoanWatch', dashboard: 'Your loan dashboard',
    navDashboard: 'Main Dashboard', navCalculator: 'EMI Calculator', navTracker: 'Loan Tracker', navHowTo: 'How to Use',
    sectionTitles: { dashboardSection: 'Main Dashboard', calculatorSection: 'EMI Calculator', trackerSection: 'Loan Tracker', howToSection: 'How to Use' },
    sectionSubtitles: {
      dashboardSection: 'A clear overview of your saved loans and estimated repayment.',
      calculatorSection: 'Estimate one loan and understand its monthly payment and total cost.',
      trackerSection: 'Manage saved loans and record payments you have made.',
      howToSection: 'A step-by-step introduction to LoanWatch and its estimates.'
    },
    dashboardSubtitle: 'Overview of your active loans and estimated repayment.',
    activeLoans: 'Active loans', totalPrincipal: 'Total original principal',
    estimatedInterest: 'Estimated total interest', compositionTitle: 'Estimated repayment composition',
    outstandingChartTitle: 'Outstanding principal by loan', loanOverview: 'Loan overview',
    summaryLoan: 'Loan', summaryCategory: 'Category', summaryEMI: 'Monthly EMI',
    summaryOutstanding: 'Outstanding', summaryProgress: 'Progress',
    noChartData: 'Add a loan to see your repayment visualizations.',
    highInterestTitle: 'Interest estimate exceeds original principal',
    highInterestMessage: 'Across these loans, estimated interest ({interest}) is higher than original principal ({principal}). Review the terms and compare options; LoanWatch does not estimate guaranteed savings.',
    dataNotice: 'Your records stay in this browser. Clearing browser site data may erase them.',
    savedLoans: 'Active loans', combinedEMI: 'Combined monthly EMI', outstanding: 'Outstanding principal',
    progress: 'Repayment progress', noUpcoming: 'No upcoming instalments. Add a loan to begin.',
    tracker: 'My loans', trackerIntro: 'Add loans and record instalments you have paid. LoanWatch does not process payments.',
    saveLoan: 'Save a loan', loanName: 'Loan name', category: 'Category', startDate: 'Start date',
    calcNote: 'Loan amount, rate, and tenure come from the EMI Calculator. Check them before saving.',
    saveDetails: 'Save calculator details', cancelEdit: 'Cancel edit', editLoan: 'Edit',
    deleteLoan: 'Delete loan', deletePayment: 'Delete payment', downloadReport: 'Download PDF Report', markPaid: 'Record payment',
    paymentDate: 'Paid on', installment: 'Instalment', paymentHistory: 'Payment history',
    noPayments: 'No payments recorded yet.', noLoans: 'No saved loans yet. Calculate an EMI, then save it here.',
    remaining: 'remaining instalments', paid: 'paid', due: 'Due', paidOn: 'Paid on',
    monthlyEMI: 'Monthly EMI', balance: 'Outstanding principal', startDateLabel: 'Started',
    demoStatus: 'Demo data — changes are temporary', demoOn: 'Exit demo', demoOff: 'Try demo',
    lightTheme: 'Light theme', darkTheme: 'Dark theme', themeDark: 'Dark theme',
    welcomeReturn: 'Welcome back. Your saved loans remain in this browser.',
    estimate: 'Estimated figures only — not lender-confirmed. Actual terms and payment dates may differ.',
    learning: 'Learn about your loan', learningIntro: 'A beginner-friendly guide from Apna Rupaiyya.',
    guide: 'How to use LoanWatch',
    guideBody: '<ol class="learning-steps"><li><strong>Start at Main Dashboard.</strong> Review active loans, combined EMI, original principal, estimated interest, outstanding principal, progress, and upcoming instalment.</li><li><strong>Calculate one loan.</strong> Open EMI Calculator and enter principal, annual interest rate, and tenure. The example inputs can be changed.</li><li><strong>Understand the estimate.</strong> EMI is the monthly payment estimate. Each payment includes interest and principal. Total repayment combines both; the schedule estimates how the balance reduces over time.</li><li><strong>Save the loan.</strong> Go to Loan Tracker, provide a name, category, and start date, then save the calculator details. Review the original principal, rate, tenure, EMI, and balance.</li><li><strong>Track payments.</strong> Record an instalment only after paying your lender. Progress and outstanding principal are estimates based on recorded payments. You can review or remove records in the loan card.</li><li><strong>Try Demo Mode safely.</strong> Use the demo button to explore sample loans. Demo records stay in temporary memory and do not replace personal records in this browser.</li><li><strong>Change display settings.</strong> Use the language and theme controls in the header. Your selection is saved in this browser.</li><li><strong>Download a report.</strong> In Loan Tracker, choose Download PDF Report on a loan card. The one-page PDF summarizes the loan and repayment estimate; it omits payment history and monthly schedule rows.</li><li><strong>Remember the limits.</strong> Figures are estimates, not lender-confirmed quotes. Actual terms, fees, and payment dates can differ. Data is stored locally; clearing browser site data may erase it. LoanWatch has no bank integration and does not process payments.</li></ol>',
    glossary: 'Financial glossary',
    glossaryBody: '<dt>Principal</dt><dd>The amount borrowed, before interest.</dd><dt>EMI</dt><dd>A regular monthly payment toward interest and principal.</dd><dt>Interest rate</dt><dd>The yearly percentage used to estimate the cost of borrowing.</dd><dt>Tenure</dt><dd>The planned length of the loan, usually measured in months.</dd><dt>Total repayment</dt><dd>All estimated instalments added together.</dd><dt>Total interest</dt><dd>The estimated borrowing cost, in addition to principal.</dd><dt>Outstanding balance</dt><dd>Estimated principal not yet repaid according to the tracked schedule.</dd><dt>Reducing-balance interest</dt><dd>Interest is estimated on the principal still outstanding each month.</dd><dt>Amortisation schedule</dt><dd>A month-by-month estimate of each payment’s interest and principal parts.</dd>',
    categories: ['Home Loan', 'Car Loan', 'Education Loan', 'Other Loans'],
    amountRateTenure: 'Loan amount, rate, or tenure is invalid.',
    duplicatePayment: 'This instalment is invalid or has already been recorded as paid.',
    paymentDateError: 'Enter a valid payment date no later than today.',
    paymentChronologyError: 'Payment dates must follow the instalment order.',
    saveSuccess: 'Loan saved.', editSuccess: 'Loan updated.', storageError: 'Could not save to browser storage. Your changes are not confirmed saved.',
    malformedStorage: 'Some saved loan data was malformed and could not be loaded.',
    deleteLoanConfirm: 'Delete this loan and its payment history? This cannot be undone.',
    deletePaymentConfirm: 'Delete this payment record? This cannot be undone.',
    paymentSuccess: 'Payment recorded locally; this does not send money to your lender.',
    reportTitle: 'Loan Summary Report', pdfGenerated: 'Report generated',
    reportError: 'Could not generate the PDF report.',
    reportPayments: 'Payment history', reportSchedule: 'Estimated amortisation summary',
    reportPaid: 'Paid instalments', reportRemaining: 'Remaining instalments',
    reportPrincipal: 'Principal', reportRate: 'Annual interest rate', reportTenure: 'Tenure',
    reportStart: 'Start date', reportEMI: 'Estimated monthly EMI', reportInterest: 'Estimated total interest',
    reportTotal: 'Estimated total repayment', reportOutstanding: 'Estimated current outstanding principal',
    reportDisclaimer: 'Estimate only. Not lender-confirmed. Figures use a reducing-balance model and tracked payment records; actual lender calculations, fees, and dates may differ.',
    reportNoPayments: 'No payment records.',
    errors: ['Enter a valid loan amount in ₹ (e.g., 25,00,000)', 'Enter a loan amount greater than ₹ 0 (minimum ₹ 1,000)', 'Minimum loan amount is ₹ 1,000', 'Loan amount exceeds ₹ 100 Crore limit', 'Enter a valid interest rate (e.g., 8.5%)', 'Interest rate cannot be negative. Enter 0% or higher.', 'Interest rate cannot exceed 50% per annum', 'Enter a valid loan tenure', 'Tenure must be at least 1 month (or 0.5 years)', 'Tenure cannot exceed 40 years (480 months)'],
    calculator: 'EMI Calculator', calculatorSubtitle: 'Estimate monthly instalments, interest cost, and a month-by-month schedule.',
    parameters: 'Loan Parameters', adjustLoan: 'Adjust principal, interest rate, and tenure',
    principalLabel: 'Loan Amount (Principal)', rateLabel: 'Annual Interest Rate (APR)',
    tenureYears: 'Tenure (Years)', tenureMonths: 'Tenure (Months)', years: 'Years', months: 'Months',
    summary: 'Repayment Summary', summarySubtitle: 'Monthly obligation & total cost breakdown', estimatedEMI: 'Estimated Monthly EMI',
    principalAmount: 'Principal Amount', totalInterest: 'Total Interest',
    totalRepayment: 'Total Repayment Amount (Principal + Interest)', split: 'Principal vs. Interest Ratio',
    scheduleTitle: 'Amortisation Schedule', scheduleSubtitle: 'Month-by-month reducing balance breakdown of principal and interest',
    yearlySummary: 'Yearly Summary', monthByMonth: 'Month-by-Month',     outstandingHeader: 'Outstanding Principal', invalidInputs: 'Correct the highlighted inputs to calculate your EMI.',
    dueStatus: 'Upcoming instalment', overdueStatus: 'Overdue instalment',
    emiNote: 'Payable every month until the loan is paid off.',
    loanDetailsError: 'Enter a loan name, valid category, start date, and valid loan details.',
    tenureEditError: 'Tenure cannot be shortened below a recorded instalment number.',
    principalEditError: 'Principal cannot be reduced below principal already recorded as paid.',
    orderError: 'Record instalments in order to keep the estimated balance accurate.',
    noBalanceError: 'No estimated principal remains to pay.',
    principalMetric: 'Principal Amount', interestMetric: 'Total Interest',
    principalLegend: 'Principal: ', interestLegend: 'Interest: ',
    reducingBalance: 'Reducing Monthly Balance',
    amountChips: ['₹ 5 Lakh', '₹ 10 Lakh', '₹ 25 Lakh', '₹ 50 Lakh', '₹ 1 Crore'],
    rateChips: ['0% (Interest-Free)', '7.5% (Govt/Agri)', '8.5% (Home Loan)', '9.5% (Car Loan)', '11.5% (Personal)'],
    tenureChips: ['1 Year', '3 Years', '5 Years', '10 Years', '20 Years']
  },
  hi: {
    welcomeHeading: 'LoanWatch में आपका स्वागत है',
    welcomeText: 'अपने ऋण की योजना बनाएं, हर किस्त समझें और इस ब्राउज़र में निजी रिकॉर्ड रखें। आंकड़े अनुमान हैं, ऋणदाता की पुष्टि नहीं।',
    continue: 'आगे बढ़ें', goodbye: 'अलविदा / स्वागत पर लौटें', goodbyeHeading: 'फिर मिलेंगे',
    goodbyeText: 'आप जब चाहें LoanWatch पर लौट सकते हैं। इससे ब्राउज़र टैब बंद नहीं होता; सहेजे गए रिकॉर्ड इसी ब्राउज़र में रहते हैं।',
    continueReturn: 'LoanWatch पर लौटें', dashboard: 'आपका ऋण डैशबोर्ड',
    dataNotice: 'आपके रिकॉर्ड इसी ब्राउज़र में रहते हैं। ब्राउज़र डेटा मिटाने पर वे हट सकते हैं।',
    savedLoans: 'चालू ऋण', combinedEMI: 'कुल मासिक EMI', outstanding: 'बकाया मूलधन',
    progress: 'भुगतान प्रगति', noUpcoming: 'अगली किस्त नहीं है। शुरू करने के लिए ऋण जोड़ें।',
    tracker: 'मेरे ऋण', trackerIntro: 'ऋण जोड़ें और चुकाई गई किस्त दर्ज करें। LoanWatch भुगतान नहीं करता।',
    saveLoan: 'ऋण सहेजें', loanName: 'ऋण का नाम', category: 'श्रेणी', startDate: 'शुरू होने की तारीख',
    calcNote: 'ऋण राशि, ब्याज दर और अवधि EMI कैलकुलेटर से आती है। सहेजने से पहले जांचें।',
    saveDetails: 'कैलकुलेटर विवरण सहेजें', cancelEdit: 'संपादन रद्द करें', editLoan: 'संपादित करें',
    deleteLoan: 'ऋण हटाएं', deletePayment: 'भुगतान हटाएं', downloadReport: 'PDF रिपोर्ट डाउनलोड करें', markPaid: 'भुगतान दर्ज करें',
    paymentDate: 'भुगतान की तारीख', installment: 'किस्त', paymentHistory: 'भुगतान इतिहास',
    noPayments: 'अभी कोई भुगतान दर्ज नहीं है।', noLoans: 'अभी कोई ऋण सहेजा नहीं है। EMI निकालकर यहां सहेजें।',
    remaining: 'किस्तें बाकी', paid: 'चुकाई गई', due: 'देय', paidOn: 'भुगतान तारीख',
    monthlyEMI: 'मासिक EMI', balance: 'बकाया मूलधन', startDateLabel: 'शुरू',
    demoStatus: 'डेमो डेटा — बदलाव अस्थायी हैं', demoOn: 'डेमो से बाहर जाएं', demoOff: 'डेमो देखें',
    lightTheme: 'हल्की थीम', darkTheme: 'गहरी थीम', themeDark: 'गहरी थीम',
    welcomeReturn: 'वापसी पर स्वागत है। आपके सहेजे गए ऋण इस ब्राउज़र में सुरक्षित हैं।',
    estimate: 'केवल अनुमान — ऋणदाता द्वारा पुष्टि नहीं। वास्तविक शर्तें और भुगतान तिथियां अलग हो सकती हैं।',
    learning: 'अपने ऋण को समझें', learningIntro: 'Apna Rupaiyya की शुरुआती लोगों के लिए सरल मार्गदर्शिका।',
    guide: 'LoanWatch का उपयोग कैसे करें',
    guideBody: '<ol class="learning-steps"><li><strong>मुख्य डैशबोर्ड देखें।</strong> चालू ऋण, कुल EMI, मूलधन, अनुमानित ब्याज, बकाया राशि, प्रगति और अगली किस्त देखें।</li><li><strong>एक ऋण का EMI निकालें।</strong> EMI कैलकुलेटर में मूलधन, वार्षिक ब्याज दर और अवधि भरें। उदाहरण के लिए दी गई जानकारी बदली जा सकती है।</li><li><strong>अनुमान समझें।</strong> EMI मासिक किस्त का अनुमान है। इसमें मूलधन और ब्याज दोनों शामिल हैं। कुल भुगतान दोनों का जोड़ है; किस्त-सारणी घटती हुई बाकी का अनुमान दिखाती है।</li><li><strong>ऋण सहेजें।</strong> ऋण ट्रैकर खोलकर नाम, श्रेणी और शुरू होने की तारीख भरें। मूलधन, दर, अवधि, EMI और बकाया देखें।</li><li><strong>भुगतान दर्ज करें।</strong> ऋणदाता को भुगतान करने के बाद ही किस्त दर्ज करें। प्रगति और बकाया राशि दर्ज भुगतानों पर आधारित अनुमान हैं।</li><li><strong>डेमो सुरक्षित रूप से देखें।</strong> नमूना ऋणों को देखने के लिए डेमो बटन दबाएं। डेमो बदलाव अस्थायी हैं और आपके निजी रिकॉर्ड को नहीं बदलते।</li><li><strong>भाषा और थीम बदलें।</strong> हेडर में दिए नियंत्रण चुनें। आपकी पसंद इसी ब्राउज़र में सहेजी जाती है।</li><li><strong>PDF रिपोर्ट डाउनलोड करें।</strong> ऋण ट्रैकर में ऋण के पास रिपोर्ट बटन चुनें। PDF सारांश देता है; इसमें भुगतान इतिहास और हर महीने की पूरी सारणी नहीं होती।</li><li><strong>सीमाएं याद रखें।</strong> आंकड़े अनुमान हैं, ऋणदाता की पुष्टि नहीं। असली शर्तें, शुल्क और तारीखें अलग हो सकती हैं। डेटा इसी ब्राउज़र में है; साइट डेटा साफ करने से मिट सकता है। LoanWatch बैंक से जुड़ा नहीं है और भुगतान नहीं करता।</li></ol>',
    glossary: 'वित्तीय शब्दावली',
    glossaryBody: '<dt>मूलधन</dt><dd>ब्याज से पहले उधार ली गई राशि।</dd><dt>EMI</dt><dd>मूलधन और ब्याज के लिए नियमित मासिक भुगतान।</dd><dt>ब्याज दर</dt><dd>उधार की अनुमानित लागत निकालने की वार्षिक प्रतिशत दर।</dd><dt>अवधि</dt><dd>ऋण चुकाने की तय अवधि, आमतौर पर महीनों में।</dd><dt>कुल भुगतान</dt><dd>सभी अनुमानित किस्तों का जोड़।</dd><dt>कुल ब्याज</dt><dd>मूलधन के अतिरिक्त अनुमानित उधार लागत।</dd><dt>बकाया शेष</dt><dd>ट्रैक की गई सारणी के अनुसार अभी तक न चुकाया गया अनुमानित मूलधन।</dd><dt>घटते शेष पर ब्याज</dt><dd>हर महीने शेष मूलधन पर ब्याज का अनुमान।</dd><dt>किस्त-सारणी</dt><dd>हर महीने की किस्त में ब्याज और मूलधन का अनुमानित विवरण।</dd>',
    categories: ['गृह ऋण', 'कार ऋण', 'शिक्षा ऋण', 'अन्य ऋण'],
    reportTitle: 'ऋण सारांश रिपोर्ट', pdfGenerated: 'रिपोर्ट की तारीख', reportError: 'PDF रिपोर्ट नहीं बन सकी।',
    amountRateTenure: 'ऋण राशि, ब्याज दर या अवधि अमान्य है।',
    duplicatePayment: 'यह किस्त अमान्य है या पहले ही चुकाई हुई दर्ज है।',
    paymentDateError: 'आज से आगे की तारीख न दें; सही भुगतान तारीख दर्ज करें।',
    paymentChronologyError: 'भुगतान की तारीखें किस्तों के क्रम में होनी चाहिए।',
    saveSuccess: 'ऋण सहेजा गया।', editSuccess: 'ऋण अपडेट हुआ।', storageError: 'ब्राउज़र में सहेजा नहीं जा सका। बदलाव सहेजे जाने की पुष्टि नहीं है।',
    malformedStorage: 'कुछ सहेजा गया ऋण डेटा गलत था और लोड नहीं हो सका।',
    deleteLoanConfirm: 'क्या इस ऋण और इसका भुगतान इतिहास हटाना है? इसे वापस नहीं किया जा सकता।',
    deletePaymentConfirm: 'क्या यह भुगतान रिकॉर्ड हटाना है? इसे वापस नहीं किया जा सकता।',
    paymentSuccess: 'भुगतान स्थानीय रूप से दर्ज हुआ; ऋणदाता को पैसा नहीं भेजा गया।',
    reportTitle: 'LoanWatch अनुमानित ऋण रिपोर्ट', reportPayments: 'भुगतान इतिहास', reportSchedule: 'अनुमानित किस्त-सारणी सारांश',
    reportPaid: 'चुकाई गई किस्तें', reportRemaining: 'बाकी किस्तें', reportPrincipal: 'मूलधन',
    reportRate: 'वार्षिक ब्याज दर', reportTenure: 'अवधि', reportStart: 'शुरू होने की तारीख',
    reportEMI: 'अनुमानित मासिक EMI', reportInterest: 'अनुमानित कुल ब्याज', reportTotal: 'अनुमानित कुल भुगतान',
    reportOutstanding: 'अनुमानित वर्तमान बकाया मूलधन',
    reportDisclaimer: 'केवल अनुमान, ऋणदाता द्वारा पुष्टि नहीं। गणना घटते शेष मॉडल और दर्ज भुगतानों पर आधारित है; वास्तविक गणना, शुल्क और तारीखें अलग हो सकती हैं।',
    reportNoPayments: 'कोई भुगतान रिकॉर्ड नहीं।',
    errors: ['सही ऋण राशि दर्ज करें', '₹ 0 से अधिक राशि दर्ज करें', 'न्यूनतम ऋण राशि ₹ 1,000 है', 'ऋण राशि ₹ 100 करोड़ की सीमा से अधिक है', 'सही ब्याज दर दर्ज करें', 'ब्याज दर ऋणात्मक नहीं हो सकती', 'ब्याज दर 50% वार्षिक से अधिक नहीं हो सकती', 'सही ऋण अवधि दर्ज करें', 'अवधि कम से कम 1 महीना होनी चाहिए', 'अवधि 40 वर्ष (480 महीने) से अधिक नहीं हो सकती'],
    calculator: 'EMI कैलकुलेटर', calculatorSubtitle: 'मासिक किस्त, ब्याज लागत और महीने-दर-महीने सारणी का अनुमान लगाएं।',
    parameters: 'ऋण विवरण', adjustLoan: 'मूलधन, ब्याज दर और अवधि बदलें',
    principalLabel: 'ऋण राशि (मूलधन)', rateLabel: 'वार्षिक ब्याज दर (APR)',
    tenureYears: 'अवधि (वर्ष)', tenureMonths: 'अवधि (महीने)', years: 'वर्ष', months: 'महीने',
    summary: 'भुगतान सारांश', summarySubtitle: 'मासिक किस्त और कुल लागत का विवरण', estimatedEMI: 'अनुमानित मासिक EMI',
    principalAmount: 'मूलधन', totalInterest: 'कुल ब्याज',
    totalRepayment: 'कुल भुगतान (मूलधन + ब्याज)', split: 'मूलधन और ब्याज का अनुपात',
    scheduleTitle: 'किस्त-सारणी', scheduleSubtitle: 'मूलधन और ब्याज का महीने-दर-महीने घटता शेष विवरण',
    yearlySummary: 'वार्षिक सारांश', monthByMonth: 'महीने-दर-महीने',     outstandingHeader: 'बकाया मूलधन', invalidInputs: 'EMI निकालने के लिए चिह्नित जानकारी सही करें।',
    dueStatus: 'आगामी किस्त', overdueStatus: 'देय किस्त',
    emiNote: 'ऋण चुकने तक हर महीने भुगतान देय है।',
    loanDetailsError: 'ऋण का नाम, सही श्रेणी, शुरू होने की तारीख और सही विवरण भरें।',
    tenureEditError: 'दर्ज किस्त संख्या से कम अवधि नहीं कर सकते।',
    principalEditError: 'पहले से चुकाए गए मूलधन से कम राशि नहीं रख सकते।',
    orderError: 'अनुमानित शेष सही रखने के लिए किस्तें क्रम से दर्ज करें।',
    noBalanceError: 'अनुमान के अनुसार कोई मूलधन बाकी नहीं है।',
    principalMetric: 'मूलधन राशि', interestMetric: 'कुल ब्याज',
    principalLegend: 'मूलधन: ', interestLegend: 'ब्याज: ',
    reducingBalance: 'घटते मासिक शेष पर',
    amountChips: ['₹ 5 लाख', '₹ 10 लाख', '₹ 25 लाख', '₹ 50 लाख', '₹ 1 करोड़'],
    rateChips: ['0% (ब्याज नहीं)', '7.5% (सरकारी/कृषि)', '8.5% (गृह ऋण)', '9.5% (कार ऋण)', '11.5% (व्यक्तिगत)'],
    tenureChips: ['1 वर्ष', '3 वर्ष', '5 वर्ष', '10 वर्ष', '20 वर्ष'],
    navDashboard: 'मुख्य डैशबोर्ड', navCalculator: 'EMI कैलकुलेटर', navTracker: 'ऋण ट्रैकर', navHowTo: 'उपयोग विधि',
    sectionTitles: { dashboardSection: 'मुख्य डैशबोर्ड', calculatorSection: 'EMI कैलकुलेटर', trackerSection: 'ऋण ट्रैकर', howToSection: 'उपयोग विधि' },
    sectionSubtitles: { dashboardSection: 'आपके ऋण और अनुमानित भुगतान का सरल सारांश।', calculatorSection: 'एक ऋण की मासिक किस्त और कुल लागत का अनुमान लगाएं।', trackerSection: 'सहेजे गए ऋण देखें और किए गए भुगतान दर्ज करें।', howToSection: 'LoanWatch और इसके अनुमानों के लिए चरण-दर-चरण मार्गदर्शिका।' },
    activeLoans: 'चालू ऋण', totalPrincipal: 'कुल मूलधन', estimatedInterest: 'अनुमानित कुल ब्याज',
    compositionTitle: 'अनुमानित भुगतान का विवरण', outstandingChartTitle: 'ऋण के अनुसार बकाया मूलधन',
    loanOverview: 'ऋण सारांश', summaryLoan: 'ऋण', summaryCategory: 'श्रेणी', summaryEMI: 'मासिक EMI',
    summaryOutstanding: 'बकाया', summaryProgress: 'प्रगति', noChartData: 'भुगतान चार्ट देखने के लिए ऋण जोड़ें।',
    highInterestTitle: 'अनुमानित ब्याज मूलधन से अधिक है',
    highInterestMessage: 'इन ऋणों का अनुमानित ब्याज ({interest}) मूलधन ({principal}) से अधिक है। शर्तों की समीक्षा करें और विकल्पों की तुलना करें; LoanWatch निश्चित बचत का अनुमान नहीं देता।',
  },
  mr: {
    welcomeHeading: 'LoanWatch मध्ये आपले स्वागत आहे',
    welcomeText: 'कर्जाचे नियोजन करा, प्रत्येक हप्ता समजून घ्या आणि या ब्राउझरमध्ये खाजगी नोंद ठेवा. आकडे अंदाज आहेत, कर्जदात्याने पुष्टी केलेले नाहीत.',
    continue: 'पुढे चला', goodbye: 'निरोप / स्वागत पृष्ठावर परत', goodbyeHeading: 'पुन्हा भेटू',
    goodbyeText: 'तुम्ही कधीही LoanWatch वर परत येऊ शकता. यामुळे ब्राउझर टॅब बंद होत नाही; जतन केलेल्या नोंदी या ब्राउझरमध्ये राहतात.',
    continueReturn: 'LoanWatch वर परत', dashboard: 'तुमचा कर्ज डॅशबोर्ड',
    dataNotice: 'तुमच्या नोंदी या ब्राउझरमध्ये राहतात. ब्राउझर डेटा पुसल्यास त्या हटू शकतात.',
    savedLoans: 'सक्रिय कर्जे', combinedEMI: 'एकूण मासिक EMI', outstanding: 'बाकी मुद्दल',
    progress: 'परतफेड प्रगती', noUpcoming: 'आगामी हप्ता नाही. सुरुवात करण्यासाठी कर्ज जोडा.',
    tracker: 'माझी कर्जे', trackerIntro: 'कर्ज जोडा आणि भरलेले हप्ते नोंदवा. LoanWatch पैसे भरत नाही.',
    saveLoan: 'कर्ज जतन करा', loanName: 'कर्जाचे नाव', category: 'प्रकार', startDate: 'सुरू तारीख',
    calcNote: 'रक्कम, व्याजदर आणि कालावधी EMI कॅल्क्युलेटरमधून येतात. जतन करण्यापूर्वी तपासा.',
    saveDetails: 'कॅल्क्युलेटर तपशील जतन करा', cancelEdit: 'बदल रद्द करा', editLoan: 'बदला',
    deleteLoan: 'कर्ज हटवा', deletePayment: 'पेमेंट हटवा', downloadReport: 'PDF अहवाल डाउनलोड करा', markPaid: 'पेमेंट नोंदवा',
    paymentDate: 'भरल्याची तारीख', installment: 'हप्ता', paymentHistory: 'पेमेंट इतिहास',
    noPayments: 'अद्याप पेमेंट नोंदवलेले नाही.', noLoans: 'अद्याप कर्ज जतन केलेले नाही. EMI मोजून येथे जतन करा.',
    remaining: 'हप्ते बाकी', paid: 'भरले', due: 'देय', paidOn: 'भरल्याची तारीख',
    monthlyEMI: 'मासिक EMI', balance: 'बाकी मुद्दल', startDateLabel: 'सुरू',
    demoStatus: 'डेमो डेटा — बदल तात्पुरते आहेत', demoOn: 'डेमोमधून बाहेर', demoOff: 'डेमो वापरा',
    lightTheme: 'उजळ थीम', darkTheme: 'गडद थीम', themeDark: 'गडद थीम',
    welcomeReturn: 'पुन्हा स्वागत आहे. तुमची जतन केलेली कर्जे या ब्राउझरमध्ये आहेत.',
    estimate: 'फक्त अंदाज — कर्जदात्याने पुष्टी केलेली नाही. प्रत्यक्ष अटी व तारखा वेगळ्या असू शकतात.',
    learning: 'तुमचे कर्ज समजून घ्या', learningIntro: 'Apna Rupaiyya कडून नवशिक्यांसाठी सोपे मार्गदर्शन.',
    guide: 'LoanWatch कसे वापरावे',
    guideBody: '<ol class="learning-steps"><li><strong>मुख्य डॅशबोर्ड पाहा.</strong> सक्रिय कर्जे, एकूण EMI, मुद्दल, अंदाजित व्याज, बाकी रक्कम, प्रगती आणि पुढील हप्ता तपासा.</li><li><strong>एका कर्जाचा EMI मोजा.</strong> EMI कॅल्क्युलेटरमध्ये मुद्दल, वार्षिक व्याजदर आणि कालावधी भरा. उदाहरणातील आकडे बदलता येतात.</li><li><strong>अंदाज समजून घ्या.</strong> EMI हा मासिक हप्त्याचा अंदाज आहे. त्यात मुद्दल आणि व्याज असते. एकूण परतफेड दोन्हींची बेरीज आहे; वेळापत्रक घटणाऱ्या बाकीचा अंदाज दाखवते.</li><li><strong>कर्ज जतन करा.</strong> कर्ज ट्रॅकरमध्ये नाव, प्रकार आणि सुरू तारीख भरा. मूळ रक्कम, व्याजदर, कालावधी, EMI आणि बाकी तपासा.</li><li><strong>पेमेंट नोंदवा.</strong> कर्जदात्याला पैसे भरल्यानंतरच हप्ता नोंदवा. प्रगती आणि बाकी रक्कम नोंदवलेल्या पेमेंटवर आधारित अंदाज आहेत.</li><li><strong>डेमो सुरक्षितपणे वापरा.</strong> नमुना कर्जे पाहण्यासाठी डेमो वापरा. डेमोमधील बदल तात्पुरते असतात आणि वैयक्तिक नोंदी बदलत नाहीत.</li><li><strong>भाषा आणि थीम बदला.</strong> हेडरमधील नियंत्रणे वापरा. तुमची निवड या ब्राउझरमध्ये जतन होते.</li><li><strong>PDF अहवाल डाउनलोड करा.</strong> कर्ज ट्रॅकरमध्ये कर्जाजवळील अहवाल बटण निवडा. PDF मध्ये सारांश असतो; पेमेंट इतिहास आणि प्रत्येक महिन्याचे तपशील नसतात.</li><li><strong>मर्यादा लक्षात ठेवा.</strong> आकडे अंदाज आहेत, कर्जदात्याने पुष्टी केलेले नाहीत. प्रत्यक्ष अटी, शुल्क आणि तारखा वेगळ्या असू शकतात. डेटा या ब्राउझरमध्ये असतो; साइट डेटा पुसल्यास तो हटू शकतो. LoanWatch बँकेशी जोडलेले नाही आणि पेमेंट करत नाही.</li></ol>',
    glossary: 'आर्थिक शब्दकोश',
    glossaryBody: '<dt>मुद्दल</dt><dd>व्याजापूर्वी घेतलेली कर्जाची रक्कम.</dd><dt>EMI</dt><dd>मुद्दल आणि व्याजासाठी नियमित मासिक हप्ता.</dd><dt>व्याजदर</dt><dd>कर्जखर्चाचा अंदाज घेण्यासाठी वापरलेली वार्षिक टक्केवारी.</dd><dt>कालावधी</dt><dd>कर्ज फेडण्याचा ठरलेला काळ, सामान्यतः महिन्यांत.</dd><dt>एकूण परतफेड</dt><dd>सर्व अंदाजित हप्त्यांची बेरीज.</dd><dt>एकूण व्याज</dt><dd>मुद्दलाव्यतिरिक्त अंदाजित कर्जखर्च.</dd><dt>बाकी रक्कम</dt><dd>नोंदवलेल्या वेळापत्रकानुसार अजून न फेडलेले अंदाजित मुद्दल.</dd><dt>घटत्या बाकीवरील व्याज</dt><dd>दर महिन्याला उरलेल्या मुद्दलावर व्याजाचा अंदाज.</dd><dt>परतफेड वेळापत्रक</dt><dd>प्रत्येक महिन्याच्या हप्त्यातील व्याज व मुद्दलाचा अंदाज.</dd>',
    categories: ['गृहकर्ज', 'वाहन कर्ज', 'शिक्षण कर्ज', 'इतर कर्जे'],
    reportTitle: 'कर्जाचा सारांश अहवाल', pdfGenerated: 'अहवालाची तारीख', reportError: 'PDF अहवाल तयार करता आला नाही.',
    amountRateTenure: 'कर्जाची रक्कम, व्याजदर किंवा कालावधी अवैध आहे.',
    duplicatePayment: 'हा हप्ता अवैध आहे किंवा आधीच भरलेला नोंदवला आहे.',
    paymentDateError: 'आजच्या पुढील तारीख न देता योग्य पेमेंट तारीख भरा.',
    paymentChronologyError: 'पेमेंटच्या तारखा हप्त्यांच्या क्रमाने असाव्यात.',
    saveSuccess: 'कर्ज जतन झाले.', editSuccess: 'कर्ज अद्ययावत झाले.', storageError: 'ब्राउझरमध्ये जतन करता आले नाही. बदल जतन झाल्याची खात्री नाही.',
    malformedStorage: 'काही जतन केलेला कर्ज डेटा चुकीचा असल्याने लोड झाला नाही.',
    deleteLoanConfirm: 'हे कर्ज आणि त्याचा पेमेंट इतिहास हटवायचा? ही कृती मागे घेता येणार नाही.',
    deletePaymentConfirm: 'ही पेमेंट नोंद हटवायची? ही कृती मागे घेता येणार नाही.',
    paymentSuccess: 'पेमेंट स्थानिकरीत्या नोंदले; कर्जदात्याला पैसे पाठवलेले नाहीत.',
    reportTitle: 'LoanWatch अंदाजित कर्ज अहवाल', reportPayments: 'पेमेंट इतिहास', reportSchedule: 'अंदाजित परतफेड सारांश',
    reportPaid: 'भरलेले हप्ते', reportRemaining: 'बाकी हप्ते', reportPrincipal: 'मुद्दल',
    reportRate: 'वार्षिक व्याजदर', reportTenure: 'कालावधी', reportStart: 'सुरू तारीख',
    reportEMI: 'अंदाजित मासिक EMI', reportInterest: 'अंदाजित एकूण व्याज', reportTotal: 'अंदाजित एकूण परतफेड',
    reportOutstanding: 'अंदाजित सध्याचे बाकी मुद्दल',
    reportDisclaimer: 'फक्त अंदाज; कर्जदात्याने पुष्टी केलेली नाही. गणना घटत्या बाकीवर व नोंदवलेल्या पेमेंटवर आधारित आहे; प्रत्यक्ष गणना, शुल्क आणि तारखा वेगळ्या असू शकतात.',
    reportNoPayments: 'पेमेंट नोंदी नाहीत.',
    errors: ['योग्य कर्ज रक्कम भरा', '₹ 0 पेक्षा जास्त रक्कम भरा', 'किमान कर्ज रक्कम ₹ 1,000 आहे', 'कर्ज रक्कम ₹ 100 कोटी मर्यादेपेक्षा जास्त आहे', 'योग्य व्याजदर भरा', 'व्याजदर ऋण असू शकत नाही', 'व्याजदर वार्षिक 50% पेक्षा जास्त असू शकत नाही', 'योग्य कर्ज कालावधी भरा', 'कालावधी किमान 1 महिना असावा', 'कालावधी 40 वर्षांपेक्षा जास्त असू शकत नाही'],
    calculator: 'EMI कॅल्क्युलेटर', calculatorSubtitle: 'मासिक हप्ता, व्याज खर्च आणि महिन्यानुसार वेळापत्रकाचा अंदाज घ्या.',
    parameters: 'कर्ज तपशील', adjustLoan: 'मुद्दल, व्याजदर आणि कालावधी बदला',
    principalLabel: 'कर्ज रक्कम (मुद्दल)', rateLabel: 'वार्षिक व्याजदर (APR)',
    tenureYears: 'कालावधी (वर्षे)', tenureMonths: 'कालावधी (महिने)', years: 'वर्षे', months: 'महिने',
    summary: 'परतफेड सारांश', summarySubtitle: 'मासिक हप्ता आणि एकूण खर्च', estimatedEMI: 'अंदाजित मासिक EMI',
    principalAmount: 'मुद्दल रक्कम', totalInterest: 'एकूण व्याज',
    totalRepayment: 'एकूण परतफेड (मुद्दल + व्याज)', split: 'मुद्दल आणि व्याजाचे प्रमाण',
    scheduleTitle: 'परतफेड वेळापत्रक', scheduleSubtitle: 'मुद्दल व व्याजाचा महिन्यानुसार घटता शिल्लक तपशील',
    yearlySummary: 'वार्षिक सारांश', monthByMonth: 'महिन्यानुसार',     outstandingHeader: 'बाकी मुद्दल', invalidInputs: 'EMI मोजण्यासाठी दाखवलेली माहिती दुरुस्त करा.',
    dueStatus: 'आगामी हप्ता', overdueStatus: 'थकीत हप्ता',
    emiNote: 'कर्ज फेडले जाईपर्यंत दर महिन्याला भरणा देय आहे.',
    loanDetailsError: 'कर्जाचे नाव, योग्य प्रकार, सुरू तारीख आणि योग्य तपशील भरा.',
    tenureEditError: 'नोंदवलेल्या हप्त्याच्या क्रमांकापेक्षा कमी कालावधी ठेवता येणार नाही.',
    principalEditError: 'आधीच फेडलेल्या मुद्दलापेक्षा कमी रक्कम ठेवता येणार नाही.',
    orderError: 'अंदाजित बाकी योग्य ठेवण्यासाठी हप्ते क्रमाने नोंदवा.',
    noBalanceError: 'अंदाजानुसार मुद्दल बाकी नाही.',
    principalMetric: 'मुद्दल रक्कम', interestMetric: 'एकूण व्याज',
    principalLegend: 'मुद्दल: ', interestLegend: 'व्याज: ',
    reducingBalance: 'घटत्या मासिक बाकीवर',
    amountChips: ['₹ 5 लाख', '₹ 10 लाख', '₹ 25 लाख', '₹ 50 लाख', '₹ 1 कोटी'],
    rateChips: ['0% (व्याज नाही)', '7.5% (शासकीय/शेती)', '8.5% (गृहकर्ज)', '9.5% (वाहन कर्ज)', '11.5% (वैयक्तिक)'],
    tenureChips: ['1 वर्ष', '3 वर्षे', '5 वर्षे', '10 वर्षे', '20 वर्षे'],
    navDashboard: 'मुख्य डॅशबोर्ड', navCalculator: 'EMI कॅल्क्युलेटर', navTracker: 'कर्ज ट्रॅकर', navHowTo: 'वापर मार्गदर्शक',
    sectionTitles: { dashboardSection: 'मुख्य डॅशबोर्ड', calculatorSection: 'EMI कॅल्क्युलेटर', trackerSection: 'कर्ज ट्रॅकर', howToSection: 'वापर मार्गदर्शक' },
    sectionSubtitles: { dashboardSection: 'तुमच्या कर्जांचा आणि अंदाजित परतफेडीचा स्पष्ट आढावा.', calculatorSection: 'एका कर्जाच्या मासिक हप्त्याचा आणि एकूण खर्चाचा अंदाज घ्या.', trackerSection: 'जतन केलेली कर्जे व्यवस्थापित करा आणि भरलेली रक्कम नोंदवा.', howToSection: 'LoanWatch आणि अंदाज समजून घेण्यासाठी टप्प्याटप्प्याने मार्गदर्शन.' },
    activeLoans: 'सक्रिय कर्जे', totalPrincipal: 'एकूण मूळ रक्कम', estimatedInterest: 'अंदाजित एकूण व्याज',
    compositionTitle: 'अंदाजित परतफेडीचे विभाजन', outstandingChartTitle: 'कर्जानुसार बाकी मुद्दल',
    loanOverview: 'कर्जाचा आढावा', summaryLoan: 'कर्ज', summaryCategory: 'प्रकार', summaryEMI: 'मासिक EMI',
    summaryOutstanding: 'बाकी', summaryProgress: 'प्रगती', noChartData: 'परतफेडीचा आलेख पाहण्यासाठी कर्ज जोडा.',
    highInterestTitle: 'अंदाजित व्याज मूळ रकमेपेक्षा जास्त आहे',
    highInterestMessage: 'या कर्जांचे अंदाजित व्याज ({interest}) मूळ रकमेपेक्षा ({principal}) जास्त आहे. अटी तपासा आणि पर्यायांची तुलना करा; LoanWatch निश्चित बचतीचा अंदाज देत नाही.'
  }
};

const selectors = {
  welcomeHeading: '#welcomeHeading', welcomeText: '#welcomePanel p', dashboard: '#dashboardHeading',
  dataNotice: '#dataNotice', savedLoans: '#activeLoansLabel',
  combinedEMI: '.dashboard-metric:nth-child(2) span', totalPrincipal: '.dashboard-metric:nth-child(3) span',
  outstanding: '.dashboard-metric:nth-child(4) span', estimatedInterest: '.dashboard-metric:nth-child(5) span',
  progress: '.dashboard-metric:nth-child(6) span', tracker: '#trackerHeading',
  trackerIntro: '#loanTracker > .section-heading p', saveLoan: '#loanFormHeading',
  loanName: 'label[for="loanName"]', category: 'label[for="loanCategory"]',
  startDate: 'label[for="loanStartDate"]', calcNote: '#loanForm .form-helper-text',
  learning: '#learningHeading', learningIntro: '#learningSection .section-heading p',
  guide: '#learningSection .learning-grid article:first-child h3',
  glossary: '#learningSection .learning-grid article:last-child h3',
  continue: '#continueButton', goodbye: '#goodbyeButton', saveDetails: '#saveLoanButton',
  calculator: '#sectionTitle', calculatorSubtitle: '#sectionSubtitle', parameters: '#input-heading',
  adjustLoan: '#inputSubtitle',
  rateLabel: 'label[for="rateInput"]', summary: '#results-heading',
  summarySubtitle: '#results-heading + p', estimatedEMI: '.emi-label',
  totalRepayment: '.total-payment-card .metric-mini-title',
  split: '.breakdown-header span', scheduleTitle: '#schedule-heading',
  scheduleSubtitle: '#scheduleSubtitle',
  compositionTitle: '#compositionChartTitle', outstandingChartTitle: '#outstandingChartTitle',
  loanOverview: '#dashboardSummaryHeading',
  summaryLoan: '.summary-table th:nth-child(1)', summaryCategory: '.summary-table th:nth-child(2)',
  summaryEMI: '.summary-table th:nth-child(3)', summaryOutstanding: '.summary-table th:nth-child(4)',
  summaryProgress: '.summary-table th:nth-child(5)'
};

export function getTranslation(language) {
  return translations[language] || translations.en;
}

export function applyTranslations(language) {
  const text = getTranslation(language);
  for (const [key, selector] of Object.entries(selectors)) {
    const element = document.querySelector(selector);
    if (element && text[key]) element.textContent = text[key];
  }
  const sectionButtons = [...document.querySelectorAll('.section-nav-item')];
  const sectionLabels = [text.navDashboard, text.navCalculator, text.navTracker, text.navHowTo];
  sectionButtons.forEach((button, index) => {
    button.textContent = sectionLabels[index];
    button.setAttribute('aria-label', sectionLabels[index]);
  });
  const selectedSection = document.querySelector('.section-nav-item.active')?.dataset.section || 'dashboardSection';
  const sectionTitle = document.getElementById('sectionTitle');
  const sectionSubtitle = document.getElementById('sectionSubtitle');
  if (sectionTitle) sectionTitle.textContent = text.sectionTitles[selectedSection];
  if (sectionSubtitle) sectionSubtitle.textContent = text.sectionSubtitles[selectedSection];
  const guide = document.querySelector('#learningSection .learning-grid article:first-child ol');
  if (guide) guide.outerHTML = text.guideBody;
  const glossary = document.querySelector('#learningSection .learning-grid article:last-child dl');
  if (glossary) glossary.innerHTML = text.glossaryBody;
  const warning = document.querySelector('.estimate-note');
  if (warning) warning.textContent = text.estimate;
  const categoryOptions = document.querySelectorAll('#loanCategory option');
  categoryOptions.forEach((option, index) => { option.textContent = text.categories[index]; });
  const demoButton = document.getElementById('demoToggle');
  if (demoButton) demoButton.textContent = demoButton.getAttribute('aria-pressed') === 'true' ? text.demoOn : text.demoOff;
  const themeButton = document.getElementById('themeToggle');
  if (themeButton) themeButton.textContent = document.documentElement.dataset.theme === 'dark' ? text.lightTheme : text.darkTheme;
  const principalLabel = document.querySelector('label[for="principalInput"]');
  if (principalLabel?.firstChild) principalLabel.firstChild.textContent = text.principalLabel;
  const rateLabel = document.querySelector('label[for="rateInput"]');
  if (rateLabel) rateLabel.textContent = text.rateLabel;
  const metricTitles = document.querySelectorAll('.metrics-summary-grid .metric-mini-title');
  if (metricTitles[0]?.childNodes[2]) metricTitles[0].childNodes[2].textContent = ` ${text.principalMetric}`;
  if (metricTitles[1]?.childNodes[2]) metricTitles[1].childNodes[2].textContent = ` ${text.interestMetric}`;
  const legendLabels = document.querySelectorAll('.breakdown-legend .legend-item span:last-child');
  if (legendLabels[0]?.firstChild) legendLabels[0].firstChild.textContent = text.principalLegend;
  if (legendLabels[1]?.firstChild) legendLabels[1].firstChild.textContent = text.interestLegend;
  const rateHelper = document.querySelector('#emiForm .form-group:nth-child(2) .form-helper-text');
  if (rateHelper) rateHelper.textContent = text.reducingBalance;
  const tenureLabelText = document.getElementById('tenureUnitLabel');
  if (tenureLabelText && tenureLabelText.dataset.unit) {
    tenureLabelText.textContent = tenureLabelText.dataset.unit === 'months' ? text.tenureMonths : text.tenureYears;
  }
  const unitButtons = document.getElementById('tenureUnitYears');
  const monthButton = document.getElementById('tenureUnitMonths');
  if (unitButtons) unitButtons.textContent = text.years;
  if (monthButton) monthButton.textContent = text.months;
  const loanLabels = document.querySelectorAll('.loan-form-grid .form-group');
  [text.loanName, text.category, text.startDate].forEach((label, index) => {
    if (loanLabels[index]) loanLabels[index].childNodes[0].textContent = `${label}\n            `;
  });
  const scheduleButtons = document.getElementById('viewYearlyBtn');
  if (scheduleButtons) scheduleButtons.textContent = text.yearlySummary;
  const monthlyButton = document.getElementById('viewMonthlyBtn');
  if (monthlyButton) monthlyButton.textContent = text.monthByMonth;
  const cancelEdit = document.getElementById('cancelLoanEdit');
  if (cancelEdit) cancelEdit.textContent = text.cancelEdit;
  document.querySelectorAll('#principalChips .chip-btn').forEach((button, index) => {
    if (text.amountChips[index]) button.textContent = text.amountChips[index];
  });
  document.querySelectorAll('#rateChips .chip-btn').forEach((button, index) => {
    if (text.rateChips[index]) button.textContent = text.rateChips[index];
  });
  document.querySelectorAll('#tenureChips .chip-btn').forEach((button, index) => {
    if (text.tenureChips[index]) button.textContent = text.tenureChips[index];
  });
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) skipLink.textContent = language === 'hi' ? 'मुख्य सामग्री पर जाएं' : language === 'mr' ? 'मुख्य मजकुराकडे जा' : 'Skip to main content';
  const languageLabel = document.querySelector('label[for="languageSelect"]');
  if (languageLabel) languageLabel.textContent = language === 'hi' ? 'भाषा' : language === 'mr' ? 'भाषा' : 'Language';
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) languageSelect.setAttribute('aria-label', languageLabel?.textContent || 'Language');
  const upcoming = document.getElementById('upcomingPayment');
  if (upcoming && upcoming.dataset.empty === 'true') upcoming.textContent = text.noUpcoming;
}

export function translateValidation(message, language) {
  const english = translations.en.errors;
  const translated = getTranslation(language).errors;
  const index = english.indexOf(message);
  return index < 0 ? message : translated[index];
}
