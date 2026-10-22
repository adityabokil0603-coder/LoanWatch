# LoanWatch — Smart Indian EMI & Loan Tracker

A responsive, frontend-only EMI Calculator and Loan Tracker designed with a modern Indian fintech visual identity and guided by **Apna Rupaiyya**, your friendly rupee-shaped financial literacy mascot.

---

## 🎨 Visual Identity & Design System
* **Background:** Warm Ivory (`#FAF7F2`)
* **Text & Dark Accents:** Deep Navy (`#0C1A30`)
* **Interest Accents:** Restrained Saffron (`#D95D1E`)
* **Principal & Prosperity Accents:** Emerald Green (`#0F764E`)
* **Mascot Accents:** Royal Gold (`#DDA027`)
* **Typography:** System-native high-readability sans-serif stack with tabular numbers (`tabular-nums`) for currency alignment.
* **Motifs & Badges:** Subtle Indian geometric patterns and Indian currency notation (`₹ xx,xx,xxx` Lakhs and Crores via `Intl.NumberFormat('en-IN')`).

---

## 🚀 How to Run the Application

Because LoanWatch is built cleanly with **vanilla ES6 modules (`import`/`export`)**, modern web browsers require ES modules to be served over HTTP/HTTPS rather than the restricted `file:///` protocol (to satisfy browser CORS security policies).

### Option 1: Python Static Server (Recommended)
Open a terminal in this directory and run:
```bash
python -m http.server 8000
```
Then open your browser at:
```
http://localhost:8000
```

### Option 2: VS Code Live Server / Any Static Web Server
* Right-click `index.html` in VS Code and select **Open with Live Server**.
* Or use any lightweight static server:
  ```bash
  npx serve .
  ```

---

## 📁 File Structure & Responsibilities

```
EMI Loan Tracker/
├── index.html                  # Accessible semantic HTML5 entry point
├── README.md                   # Project overview & running instructions
├── css/
│   ├── tokens.css              # Color palette, spacing, typography & elevation tokens
│   ├── layout.css              # Responsive shell, header, 2-column grid & footer
│   └── components.css          # Cards, dual-sync sliders, chips, metric cards, breakdown bar, table
├── js/
│   ├── config.js               # Default loan configurations, limits & quick preset chips
│   ├── formatters.js           # Indian currency (INR), compact Lakhs/Crores, and words converter
│   ├── calculations.js          # Pure financial math (reducing balance EMI, zero-interest, amortization)
│   ├── loans.js                # Validated loan records, local persistence, instalment accounting & dashboard totals
├── pdf-report.js           # One-page browser-generated PDF loan summaries
│   ├── i18n.js                 # English, Hindi and Marathi interface translations
│   ├── ui/
│   │   ├── breakdown.js        # Principal vs Interest ratio bar and metric card updates
│   │   ├── schedule.js         # Amortization schedule controller (Yearly summary & Monthly detail)
│   │   └── mascot.js           # Apna Rupaiyya contextual financial wisdom engine
│   └── app.js                  # Application orchestrator, 2-way sync & live event pipeline
├── assets/
│   └── icons/
│       ├── rupee-mascot.svg    # Handcrafted vector illustration of Apna Rupaiyya
│       └── motif.svg           # Subtle traditional Indian decorative geometric motif
├── test_verification.py        # Existing file/server, calculation and browser checks
└── test_loan_tracker_browser.html # Browser tests for tracker data, payments & demo isolation
```

---

## 🧮 Financial Calculation Engine

### 1. Monthly Reducing Balance EMI Formula
$$\text{Monthly Rate } r = \frac{\text{Annual Rate}}{12 \times 100}$$

$$\text{Monthly EMI } = P \times r \times \frac{(1 + r)^N}{(1 + r)^N - 1}$$

### 2. Zero-Interest Edge Case ($r = 0$)
$$\text{Monthly EMI } = \frac{P}{N}$$

### 3. Month-by-Month Amortization & Final Balance
* For each month $m$:
  $$\text{Interest Paid} = \text{Opening Balance} \times r$$
  $$\text{Principal Repaid} = \text{EMI} - \text{Interest Paid}$$
  $$\text{Closing Balance} = \text{Opening Balance} - \text{Principal Repaid}$$
* On the final installment ($m = N$), the principal repaid is strictly set to the exact remaining opening balance, ensuring the closing balance terminates at precisely **₹ 0.00** with zero rounding leakage.

---

## Loan tracking, privacy & estimates

- Save loans in the browser with a name, one of the supported categories, a start date, and the current calculator principal, annual rate, and tenure.
- Record an instalment only after paying the lender. Records are unique and entered in order so the outstanding principal follows the reducing-balance schedule. Removing a loan or payment requires confirmation.
- Loan details and payment history use the `loanwatch.loans.v1` browser `localStorage` key. Theme and language preferences are stored locally as well. Clearing browser site data can erase saved records.
- Demo Mode uses a separate in-memory sample set. Changes made in Demo Mode are temporary; entering or leaving it does not write to or replace personal records.
- The dashboard summarizes active loans, original principal, estimated interest, outstanding principal, repayment progress, and upcoming payments. Its charts are calculated from the current personal or demo loan set.
- Loan reports download as compact, one-page PDF summaries with the loan details, estimated financial figures, progress, and a repayment composition chart. They omit payment history and the monthly amortisation table. The report is generated in-browser without a server or external service.
- All amounts are estimates, not lender-confirmed figures; actual lender calculations, fees, and dates can differ. LoanWatch has no bank integration and does not process payments.
- Use the sidebar to move between Main Dashboard, EMI Calculator, Loan Tracker, and How to Use. Demo Mode keeps its sample records in temporary memory and hides detailed payment history.
- Choose English, Hindi, or Marathi from the header, and use the theme control for a persistent light or dark appearance.
- The learning section introduces calculator steps and common loan terms. Apna Rupaiyya offers general guidance, not financial advice.

## Tests

Run the existing Python verification suite from the project directory:

```powershell
python test_verification.py
```

It includes the calculator and invalid-input checks plus browser checks when Google Chrome is installed at the path configured in the script. The focused `test_loan_tracker_browser.html` suite exercises actual loan logic, payment accounting, malformed storage, and separation of demo data from personal storage. `test_pdf_report_browser.html` checks the generated PDF signature, page count, image content, print dimensions, and file structure.
