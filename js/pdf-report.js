import { formatINR } from './formatters.js';
import { getTranslation } from './i18n.js';

const PAGE_WIDTH = 1275;
const PAGE_HEIGHT = 1650;

export function createLoanReportPDF(loan, progress, language = 'en') {
  const dictionary = getTranslation(language);
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_WIDTH;
  canvas.height = PAGE_HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not create a canvas for the PDF report.');

  drawReport(context, loan, progress, dictionary, language);
  const jpegData = canvas.toDataURL('image/jpeg', 0.94).split(',')[1];
  const jpegBytes = Uint8Array.from(atob(jpegData), character => character.charCodeAt(0));
  return new Blob([buildPdf(jpegBytes)], { type: 'application/pdf' });
}

export function downloadLoanPDF(loan, progress, language = 'en') {
  const blob = createLoanReportPDF(loan, progress, language);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeName = loan.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'loan';
  anchor.href = url;
  anchor.download = `LoanWatch_${safeName}_Report.pdf`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function drawReport(context, loan, progress, dictionary, language) {
  const navy = '#0C1A30';
  const emerald = '#0F764E';
  const saffron = '#D95D1E';
  const muted = '#5C708A';
  const border = '#E8E2D5';
  const principal = progress.schedule.totals.totalPrincipal;
  const interest = progress.schedule.totals.totalInterest;
  const total = principal + interest;
  const currentEMI = progress.upcoming?.amount || loan.monthlyEMI;
  const generated = new Intl.DateTimeFormat(language === 'en' ? 'en-IN' : language, {
    day: 'numeric', month: 'short', year: 'numeric'
  }).format(new Date());

  context.fillStyle = '#FAF7F2';
  context.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  context.fillStyle = navy;
  context.fillRect(0, 0, PAGE_WIDTH, 265);
  context.fillStyle = emerald;
  context.fillRect(0, 0, 18, PAGE_HEIGHT);
  context.fillStyle = '#DDA027';
  context.beginPath();
  context.roundRect(72, 58, 72, 72, 18);
  context.fill();
  context.fillStyle = navy;
  context.font = '700 44px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.textAlign = 'center';
  context.fillText('₹', 108, 108);
  context.textAlign = 'left';
  context.fillStyle = '#FFFFFF';
  context.font = '700 34px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText('LoanWatch', 166, 91);
  context.fillStyle = '#DCE5EF';
  context.font = '500 44px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText(dictionary.reportTitle || 'Loan Summary Report', 72, 188);
  context.font = '400 22px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText(`${dictionary.pdfGenerated || 'Report generated'}: ${generated}`, 74, 228);

  let nameY = 334;
  context.fillStyle = navy;
  context.font = '700 42px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  const nameLines = wrapText(context, loan.name, 1110);
  nameLines.slice(0, 2).forEach(line => {
    context.fillText(line, 78, nameY);
    nameY += 52;
  });

  const detailsTop = nameY + 34;
  drawSectionTitle(context, dictionary.category === 'श्रेणी' ? 'ऋण विवरण' : language === 'mr' ? 'कर्ज तपशील' : language === 'hi' ? 'ऋण विवरण' : 'Loan details', 78, detailsTop);
  const category = dictionary.categories?.[loan.category === 'Home Loan' ? 0 : loan.category === 'Car Loan' ? 1 : loan.category === 'Education Loan' ? 2 : 3] || loan.category;
  const detailPairs = [
    [dictionary.category, category],
    [dictionary.reportPrincipal, formatINR(loan.principal)],
    [dictionary.reportRate, `${loan.annualRate.toFixed(2)}%`],
    [dictionary.reportTenure, `${loan.tenureMonths} ${dictionary.months}`],
    [dictionary.reportStart, loan.startDate]
  ];
  const detailRowsY = detailsTop + 42;
  detailPairs.forEach(([label, value], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 78 + col * 560;
    const y = detailRowsY + row * 92;
    drawDetail(context, x, y, label, value, navy, muted, border);
  });

  const summaryTop = detailRowsY + 3 * 92 + 22;
  drawSectionTitle(context, language === 'hi' ? 'वित्तीय सारांश' : language === 'mr' ? 'आर्थिक सारांश' : 'Financial summary', 78, summaryTop);
  const summaryPairs = [
    [dictionary.reportEMI, formatINR(currentEMI)],
    [dictionary.reportInterest, formatINR(interest)],
    [dictionary.reportTotal, formatINR(progress.schedule.totals.totalPayment)],
    [dictionary.reportOutstanding, formatINR(progress.outstandingPrincipal)]
  ];
  summaryPairs.forEach(([label, value], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 78 + col * 560;
    const y = summaryTop + 42 + row * 120;
    drawMetric(context, x, y, label, value, navy, muted, border);
  });

  const progressY = summaryTop + 320;
  context.fillStyle = muted;
  context.font = '500 22px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText(`${dictionary.progress}: ${progress.progressPercent.toFixed(2)}%`, 78, progressY);
  context.fillStyle = '#E3E8ED';
  context.beginPath();
  context.roundRect(78, progressY + 20, 1080, 18, 9);
  context.fill();
  context.fillStyle = emerald;
  context.beginPath();
  context.roundRect(78, progressY + 20, Math.max(18, 1080 * progress.progressPercent / 100), 18, 9);
  context.fill();

  const chartY = progressY + 120;
  drawSectionTitle(context, language === 'hi' ? 'मूलधन और ब्याज का विभाजन' : language === 'mr' ? 'मुद्दल आणि व्याजाचे विभाजन' : 'Repayment composition', 78, chartY);
  drawDonut(context, 170, chartY + 145, principal, interest, emerald, saffron);
  context.fillStyle = navy;
  context.font = '600 22px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText(`${dictionary.totalPrincipal}: ${formatINR(principal)}`, 340, chartY + 118);
  context.fillText(`${dictionary.estimatedInterest}: ${formatINR(interest)}`, 340, chartY + 166);
  context.fillStyle = muted;
  context.font = '400 19px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText(`${language === 'hi' ? 'अनुमानित कुल भुगतान' : language === 'mr' ? 'अंदाजित एकूण परतफेड' : 'Estimated total repayment'}: ${formatINR(total)}`, 340, chartY + 214);

  const footerY = 1510;
  context.strokeStyle = border;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(78, footerY - 32);
  context.lineTo(1195, footerY - 32);
  context.stroke();
  context.fillStyle = '#674000';
  context.font = '700 22px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText(dictionary.estimate, 78, footerY + 8);
  context.fillStyle = muted;
  context.font = '400 18px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  const footnote = language === 'hi'
    ? 'वास्तविक ऋणदाता गणना, शुल्क और भुगतान तिथियां अलग हो सकती हैं।'
    : language === 'mr'
      ? 'प्रत्यक्ष कर्जदात्याची गणना, शुल्क आणि भरण्याच्या तारखा वेगळ्या असू शकतात.'
      : 'Actual lender calculations, fees, and payment dates may differ.';
  context.fillText(footnote, 78, footerY + 46);
  context.fillStyle = muted;
  context.font = '400 16px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText('LoanWatch · Stored and generated locally in your browser', 78, footerY + 93);
}

function drawSectionTitle(context, title, x, y) {
  context.fillStyle = '#0C1A30';
  context.font = '700 26px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText(title, x, y);
}

function drawDetail(context, x, y, label, value, navy, muted, border) {
  context.strokeStyle = border;
  context.lineWidth = 1;
  context.beginPath();
  context.roundRect(x, y, 520, 78, 12);
  context.stroke();
  context.fillStyle = muted;
  context.font = '400 18px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText(label, x + 16, y + 27);
  context.fillStyle = navy;
  context.font = '600 23px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText(truncateText(context, value, 486), x + 16, y + 59);
}

function drawMetric(context, x, y, label, value, navy, muted, border) {
  context.fillStyle = '#FFFFFF';
  context.strokeStyle = border;
  context.lineWidth = 1;
  context.beginPath();
  context.roundRect(x, y, 520, 102, 14);
  context.fill();
  context.stroke();
  context.fillStyle = muted;
  context.font = '400 18px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText(truncateText(context, label, 480), x + 16, y + 32);
  context.fillStyle = navy;
  context.font = '700 25px "Noto Sans Devanagari", "Nirmala UI", Arial, sans-serif';
  context.fillText(truncateText(context, value, 480), x + 16, y + 74);
}

function drawDonut(context, x, y, principal, interest, emerald, saffron) {
  const total = principal + interest;
  const fraction = total > 0 ? principal / total : 1;
  context.lineWidth = 24;
  context.strokeStyle = saffron;
  context.beginPath();
  context.arc(x, y, 54, 0, Math.PI * 2);
  context.stroke();
  context.strokeStyle = emerald;
  context.beginPath();
  context.arc(x, y, 54, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * fraction);
  context.stroke();
}

function wrapText(context, text, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && context.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function truncateText(context, text, maxWidth) {
  let value = String(text);
  while (value.length > 1 && context.measureText(value).width > maxWidth) {
    value = `${value.slice(0, -2)}…`;
  }
  return value;
}

function buildPdf(jpegBytes) {
  const ascii = value => new TextEncoder().encode(value);
  const chunks = [ascii('%PDF-1.4\n')];
  let byteOffset = chunks[0].length;
  const offsets = [0];
  const appendObject = (id, parts) => {
    offsets[id] = byteOffset;
    for (const part of parts) {
      const bytes = typeof part === 'string' ? ascii(part) : part;
      chunks.push(bytes);
      byteOffset += bytes.length;
    }
  };
  appendObject(1, ['1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n']);
  appendObject(2, ['2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n']);
  appendObject(3, ['3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n']);
  appendObject(4, [
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${PAGE_WIDTH} /Height ${PAGE_HEIGHT} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,
    jpegBytes,
    '\nendstream\nendobj\n'
  ]);
  const pageCommands = 'q\n612 0 0 792 0 0 cm\n/Im0 Do\nQ\n';
  appendObject(5, [`5 0 obj\n<< /Length ${pageCommands.length} >>\nstream\n${pageCommands}endstream\nendobj\n`]);
  const xrefOffset = byteOffset;
  const xref = ['xref\n0 6\n0000000000 65535 f \n'];
  for (let id = 1; id <= 5; id += 1) xref.push(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
  xref.push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);
  chunks.push(ascii(xref.join('')));
  return new Blob(chunks, { type: 'application/pdf' });
}
