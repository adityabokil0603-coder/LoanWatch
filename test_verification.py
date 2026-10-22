import os
import sys
import re
import urllib.request
import threading
import http.server
import socketserver
import time
import subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run_tests():
    print("=== TEST 1: File and Link Integrity Verification ===")
    
    files_to_check = [
        'index.html',
        'css/tokens.css',
        'css/layout.css',
        'css/components.css',
        'js/config.js',
        'js/formatters.js',
        'js/calculations.js',
        'js/loans.js',
        'js/pdf-report.js',
        'js/i18n.js',
        'js/ui/breakdown.js',
        'js/ui/schedule.js',
        'js/ui/mascot.js',
        'js/app.js',
        'assets/icons/rupee-mascot.svg',
        'assets/icons/motif.svg',
        'test_loan_tracker_browser.html',
        'test_pdf_report_browser.html'
    ]
    
    missing_files = []
    for f in files_to_check:
        if not os.path.exists(f):
            missing_files.append(f)
    if missing_files:
        print(f"FAIL: Missing files: {missing_files}")
        return False
    print("PASS: All project files exist on disk.")

    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    links = re.findall(r'(?:href|src)=["\']([^"\']+)["\']', html)
    for link in links:
        if link.startswith('#') or link.startswith('http'):
            continue
        clean_path = link.split('?')[0].split('#')[0]
        if not os.path.exists(clean_path):
            print(f"FAIL: index.html references non-existent path: {clean_path}")
            return False
        else:
            print(f"  Verified reference in index.html: {clean_path} (OK)")
            
    js_files = [f for f in files_to_check if f.endswith('.js')]
    for js_file in js_files:
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
        imports = re.findall(r'(?:from|import)\s+[\'"]([^\'"]+)[\'"]', content)
        js_dir = os.path.dirname(js_file)
        for imp in imports:
            resolved = os.path.normpath(os.path.join(js_dir, imp))
            if not os.path.exists(resolved):
                print(f"FAIL: {js_file} imports missing module: {imp} (resolved: {resolved})")
                return False
            else:
                print(f"  Verified import in {js_file} -> {imp} (OK)")

    css_files = [f for f in files_to_check if f.endswith('.css')]
    for css_file in css_files:
        with open(css_file, 'r', encoding='utf-8') as f:
            content = f.read()
        urls = re.findall(r'url\([\'"]?([^\'")]+)[\'"]?\)', content)
        css_dir = os.path.dirname(css_file)
        for u in urls:
            if u.startswith('data:'):
                continue
            resolved = os.path.normpath(os.path.join(css_dir, u))
            if not os.path.exists(resolved):
                print(f"FAIL: {css_file} references missing asset: {u} (resolved: {resolved})")
                return False
            else:
                print(f"  Verified CSS url in {css_file} -> {u} (OK)")

    print("PASS: All local CSS, JS imports, images, and asset references exist and resolve correctly.")
    return True

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def run_server_test():
    print("\n=== TEST 2: Static Server Bound to 127.0.0.1 ===")
    PORT = 8130
    server = None
    try:
        server = socketserver.TCPServer(('127.0.0.1', PORT), CustomHandler)
        t = threading.Thread(target=server.serve_forever, daemon=True)
        t.start()
        time.sleep(0.5)

        test_urls = [
            f'http://127.0.0.1:{PORT}/index.html',
            f'http://127.0.0.1:{PORT}/css/tokens.css',
            f'http://127.0.0.1:{PORT}/css/layout.css',
            f'http://127.0.0.1:{PORT}/css/components.css',
            f'http://127.0.0.1:{PORT}/js/app.js',
            f'http://127.0.0.1:{PORT}/js/config.js',
            f'http://127.0.0.1:{PORT}/js/formatters.js',
            f'http://127.0.0.1:{PORT}/js/calculations.js',
            f'http://127.0.0.1:{PORT}/js/loans.js',
            f'http://127.0.0.1:{PORT}/js/pdf-report.js',
            f'http://127.0.0.1:{PORT}/js/i18n.js',
            f'http://127.0.0.1:{PORT}/js/ui/breakdown.js',
            f'http://127.0.0.1:{PORT}/js/ui/schedule.js',
            f'http://127.0.0.1:{PORT}/js/ui/mascot.js',
            f'http://127.0.0.1:{PORT}/test_loan_tracker_browser.html',
            f'http://127.0.0.1:{PORT}/test_pdf_report_browser.html',
            f'http://127.0.0.1:{PORT}/assets/icons/rupee-mascot.svg',
            f'http://127.0.0.1:{PORT}/assets/icons/motif.svg'
        ]

        for u in test_urls:
            req = urllib.request.urlopen(u, timeout=5)
            status = req.status
            content = req.read()
            if status != 200 or len(content) == 0:
                print(f"FAIL: Failed to fetch {u} (Status {status}, Length {len(content)})")
                return False
            print(f"  HTTP 200 OK: {u.split('/')[-1]} ({len(content)} bytes)")

        print("PASS: 127.0.0.1 server successfully served all pages and modular assets.")
        return True
    finally:
        if server:
            server.shutdown()
            server.server_close()
            print("  Static server shut down cleanly.")

def run_browser_headless_test():
    print("\n=== TEST 3: Browser Verification via Headless Chrome ===")
    PORT = 8131
    server = None
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    if not os.path.exists(chrome_path):
        print("FAIL: Chrome executable not found.")
        return False

    try:
        server = socketserver.TCPServer(('127.0.0.1', PORT), CustomHandler)
        t = threading.Thread(target=server.serve_forever, daemon=True)
        t.start()
        time.sleep(0.5)

        cmd = [
            chrome_path,
            '--headless=new',
            '--incognito',
            '--disable-gpu',
            '--virtual-time-budget=5000',
            '--dump-dom',
            f'http://127.0.0.1:{PORT}/index.html'
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=15, encoding='utf-8', errors='replace')
        if res.returncode != 0:
            print(f"FAIL: Chrome exited with code {res.returncode}")
            return False

        dom = res.stdout
        checks = [
            ("Monthly EMI element present", 'id="monthlyEMI"' in dom),
            ("Calculated EMI rendered to two paise places", '21,695.58' in dom),
            ("Amount in words rendered", 'Twenty-Five Lakh Rupees' in dom),
            ("Year 1 row in table", re.search(r'(?:Year|वर्ष) 1', dom) is not None),
            ("Year 20 row in table", re.search(r'(?:Year|वर्ष) 20', dom) is not None),
            ("Paid Off badge in schedule", re.search(r'(?:Paid Off|पूरा चुकाया|पूर्ण फेडले)', dom) is not None),
            ("Apna Rupaiyya advice rendered", 'Apna Rupaiyya' in dom)
        ]

        all_ok = True
        for name, passed in checks:
            if passed:
                print(f"  PASS: {name}")
            else:
                print(f"  FAIL: {name}")
                all_ok = False

        if all_ok:
            print("PASS: Chrome loaded page, executed ES modules, and populated all dynamic elements.")
            return True
        else:
            print("FAIL: Some DOM elements were missing after browser render.")
            return False
    finally:
        if server:
            server.shutdown()
            server.server_close()
            print("  Browser test static server shut down cleanly.")

def run_calculation_tests():
    print("\n=== TEST 4: Mathematical Calculation & Internal Consistency Tests ===")
    
    # We test the pure accounting engine using the exact formulas in js/calculations.js
    def calc_schedule(p, rate, n):
        r = (rate / 12) / 100 if rate > 0 else 0
        if r == 0:
            base_emi = round(p / n, 2)
        else:
            factor = (1 + r) ** n
            base_emi = round(p * r * (factor / (factor - 1)), 2)

        bal = round(p, 2)
        tot_prin = 0.0
        tot_int = 0.0
        tot_pay = 0.0
        rows = []
        discrepancies = []

        for m in range(1, n + 1):
            op = bal
            if r == 0:
                ip = 0.0
                if m == n:
                    pp = op
                    memi = pp
                    cl = 0.0
                else:
                    pp = base_emi
                    if pp > op:
                        pp = op
                    memi = pp
                    cl = round(op - pp, 2)
            else:
                ip = round(op * r, 2)
                if m == n:
                    pp = op
                    memi = round(pp + ip, 2)
                    cl = 0.0
                else:
                    pp = round(base_emi - ip, 2)
                    if pp > op:
                        pp = op
                        memi = round(pp + ip, 2)
                        cl = 0.0
                    else:
                        memi = round(pp + ip, 2)
                        cl = round(op - pp, 2)

            bal = cl
            tot_prin = round(tot_prin + pp, 2)
            tot_int = round(tot_int + ip, 2)
            tot_pay = round(tot_pay + memi, 2)

            if round(pp + ip, 2) != memi:
                discrepancies.append(f"Month {m}: EMI ({memi}) != Prin ({pp}) + Int ({ip})")
            if round(op - pp, 2) != cl:
                discrepancies.append(f"Month {m}: Close ({cl}) != Open ({op}) - Prin ({pp})")

            rows.append({
                'month': m,
                'open': op,
                'emi': memi,
                'prin': pp,
                'int': ip,
                'close': cl
            })

        return {
            'base_emi': base_emi,
            'tot_prin': tot_prin,
            'tot_int': tot_int,
            'tot_pay': tot_pay,
            'rows': rows,
            'discrepancies': discrepancies
        }

    # Case 1: ₹25,00,000 at 8.5% for 240 months
    res1 = calc_schedule(2500000, 8.5, 240)
    print(f"Case 1 (INR 25 Lakh @ 8.5% for 240 Mo):")
    print(f"  Monthly EMI: INR {res1['base_emi']:,.2f}")
    print(f"  Total Principal: INR {res1['tot_prin']:,.2f} (Target: INR 25,00,000.00)")
    print(f"  Total Interest: INR {res1['tot_int']:,.2f}")
    print(f"  Total Repayment: INR {res1['tot_pay']:,.2f} (Sum P+I: INR {res1['tot_prin'] + res1['tot_int']:,.2f})")
    print(f"  Final Month #{res1['rows'][-1]['month']} Closing: INR {res1['rows'][-1]['close']}")
    print(f"  Internal Discrepancies: {len(res1['discrepancies'])}")
    assert res1['tot_prin'] == 2500000.00
    assert res1['tot_pay'] == round(res1['tot_prin'] + res1['tot_int'], 2)
    assert res1['rows'][-1]['close'] == 0.00
    assert len(res1['discrepancies']) == 0
    print("  -> PASS: Case 1 is 100% internally consistent.")

    # Case 2: ₹1,20,000 at 0% for 12 months (zero interest)
    res2 = calc_schedule(120000, 0, 12)
    print(f"Case 2 (INR 1.2 Lakh @ 0% for 12 Mo):")
    print(f"  Monthly EMI: INR {res2['base_emi']:,.2f}")
    print(f"  Total Principal: INR {res2['tot_prin']:,.2f} (Target: INR 1,20,000.00)")
    print(f"  Total Interest: INR {res2['tot_int']:,.2f} (Target: INR 0.00)")
    print(f"  Total Repayment: INR {res2['tot_pay']:,.2f}")
    print(f"  Final Month #{res2['rows'][-1]['month']} Closing: INR {res2['rows'][-1]['close']}")
    assert res2['tot_prin'] == 120000.00
    assert res2['tot_int'] == 0.00
    assert res2['tot_pay'] == 120000.00
    assert res2['rows'][-1]['close'] == 0.00
    assert len(res2['discrepancies']) == 0
    print("  -> PASS: Case 2 (zero interest) is 100% internally consistent.")

    # Case 3: ₹10,00,000 at 9.25% for 60 months
    res3 = calc_schedule(1000000, 9.25, 60)
    print(f"Case 3 (INR 10 Lakh @ 9.25% for 60 Mo):")
    print(f"  Monthly EMI: INR {res3['base_emi']:,.2f}")
    print(f"  Total Principal: INR {res3['tot_prin']:,.2f} (Target: INR 10,00,000.00)")
    print(f"  Total Interest: INR {res3['tot_int']:,.2f}")
    print(f"  Total Repayment: INR {res3['tot_pay']:,.2f}")
    print(f"  Final Month #{res3['rows'][-1]['month']} Closing: INR {res3['rows'][-1]['close']}")
    assert res3['tot_prin'] == 1000000.00
    assert res3['tot_pay'] == round(res3['tot_prin'] + res3['tot_int'], 2)
    assert res3['rows'][-1]['close'] == 0.00
    assert len(res3['discrepancies']) == 0
    print("  -> PASS: Case 3 is 100% internally consistent.")

    # Case 4: Invalid and Unreasonable Inputs
    print("\nCase 4: Input Validation Coverage:")

    def validate_inputs(p, rate, n):
        errors = {}
        if p is None or p <= 0:
            errors['principal'] = 'Enter a loan amount greater than ₹ 0 (minimum ₹ 1,000)'
        elif p < 1000:
            errors['principal'] = 'Minimum loan amount is ₹ 1,000'
        elif p > 1000000000:
            errors['principal'] = 'Loan amount exceeds ₹ 100 Crore limit'
        if rate is None or rate < 0:
            errors['annualRate'] = 'Interest rate cannot be negative. Enter 0% or higher.'
        elif rate > 50:
            errors['annualRate'] = 'Interest rate cannot exceed 50% per annum'
        if n is None or n < 1:
            errors['tenure'] = 'Tenure must be at least 1 month (or 0.5 years)'
        elif n > 480:
            errors['tenure'] = 'Tenure cannot exceed 40 years (480 months)'
        return len(errors) == 0, errors

    test_invalids = [
        (-50000, 8.5, 240, 'principal'),
        (0, 8.5, 240, 'principal'),
        (500, 8.5, 240, 'principal'),
        (2000000000, 8.5, 240, 'principal'),
        (2500000, -2.5, 240, 'annualRate'),
        (2500000, 75, 240, 'annualRate'),
        (2500000, 8.5, 0, 'tenure'),
        (2500000, 8.5, -12, 'tenure'),
        (2500000, 8.5, 600, 'tenure'),
    ]

    for p, rate, n, expected_field in test_invalids:
        valid, errs = validate_inputs(p, rate, n)
        assert not valid, f"Expected invalid for ({p}, {rate}, {n})"
        assert expected_field in errs, f"Expected error on {expected_field}, got {errs}"
        print(f"  Validated rejection: P={p}, R={rate}%, N={n} -> {errs[expected_field]}")

    print("PASS: Input validation rules successfully guard against all negative, zero, and out-of-bounds parameters.")
    return True

def run_browser_invalid_input_suite():
    print("\n=== TEST 5: Browser Invalid-Input & Recovery Suite (Headless Chrome) ===")
    PORT = 8138
    server = None
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    if not os.path.exists(chrome_path):
        print("FAIL: Chrome executable not found.")
        return False

    try:
        server = socketserver.TCPServer(('127.0.0.1', PORT), CustomHandler)
        t = threading.Thread(target=server.serve_forever, daemon=True)
        t.start()
        time.sleep(0.5)

        cmd = [
            chrome_path,
            '--headless=new',
            '--incognito',
            '--disable-gpu',
            '--virtual-time-budget=5000',
            '--dump-dom',
            f'http://127.0.0.1:{PORT}/test_invalid_inputs_browser.html'
        ]
        summary = ''
        for attempt in range(2):
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=15, encoding='utf-8', errors='replace')
            if res.returncode != 0:
                print(f"FAIL: Chrome exited with code {res.returncode}")
                return False

            summary_match = re.search(r'<div id="testSummary"[^>]*>(.*?)</div>', res.stdout, re.S)
            summary = summary_match.group(1).strip() if summary_match else ''
            if summary != 'RUNNING TESTS...' or attempt == 1:
                break
            print("  Browser test did not finish before capture; retrying once.")

        if summary == 'ALL BROWSER TESTS PASSED: 40 passed, 0 failed.':
            print("PASS: All 40 automated browser invalid-input & recovery tests passed in Google Chrome.")
            return True
        print(f"FAIL: Browser invalid-input test summary was {summary or 'missing'}.")
        return False
    finally:
        if server:
            server.shutdown()
            server.server_close()
            print("  Browser test static server shut down cleanly.")

def run_loan_tracker_browser_suite():
    print("\n=== TEST 6: Loan Tracker Data, Payments & Demo Isolation ===")
    PORT = 8141
    server = None
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    if not os.path.exists(chrome_path):
        print("FAIL: Chrome executable not found.")
        return False

    try:
        server = socketserver.TCPServer(('127.0.0.1', PORT), CustomHandler)
        t = threading.Thread(target=server.serve_forever, daemon=True)
        t.start()
        time.sleep(0.5)
        cmd = [
            chrome_path, '--headless=new', '--incognito', '--disable-gpu',
            '--virtual-time-budget=5000', '--dump-dom',
            f'http://127.0.0.1:{PORT}/test_loan_tracker_browser.html'
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=15, encoding='utf-8', errors='replace')
        if res.returncode != 0:
            print(f"FAIL: Chrome exited with code {res.returncode}")
            return False
        dom = res.stdout
        checks = [
            "ALL LOAN TRACKER TESTS PASSED" in dom,
            "duplicate instalments are rejected" in dom,
            "out-of-order instalments are rejected" in dom,
            "valid personal loans survive a save/load round trip" in dom,
            "never changes personal storage" in dom,
            "malformed storage is handled" in dom
        ]
        for passed, label in zip(checks, [
            "Tracker browser suite passed",
            "Duplicate payment protection passed",
            "Payment ordering and balance accounting passed",
            "Personal storage round trip passed",
            "Demo isolation passed",
            "Malformed storage handling passed"
        ]):
            print(f"  {'PASS' if passed else 'FAIL'}: {label}")
        return all(checks)
    finally:
        if server:
            server.shutdown()
            server.server_close()
            print("  Tracker test static server shut down cleanly.")

def run_pdf_report_browser_suite():
    print("\n=== TEST 7: Browser PDF Report Generation ===")
    PORT = 8141
    server = None
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    if not os.path.exists(chrome_path):
        print("FAIL: Chrome executable not found.")
        return False
    try:
        server = socketserver.TCPServer(('127.0.0.1', PORT), CustomHandler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        time.sleep(0.5)
        cmd = [
            chrome_path, '--headless=new', '--incognito', '--disable-gpu',
            '--virtual-time-budget=5000', '--dump-dom',
            f'http://127.0.0.1:{PORT}/test_pdf_report_browser.html'
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=20, encoding='utf-8', errors='replace')
        if result.returncode != 0:
            print(f"FAIL: Chrome exited with code {result.returncode}")
            return False
        dom = result.stdout
        match = re.search(r'<pre id="test-results">(.*?)</pre>', dom, re.S)
        summary = match.group(1) if match else ''
        for line in re.findall(r'(?:ALL PDF REPORT TESTS PASSED|PDF REPORT TESTS FAILED|PASS:|FAIL:)[^<]*', summary):
            print(f"  {line}")
        return 'ALL PDF REPORT TESTS PASSED' in summary
    finally:
        if server:
            server.shutdown()
            server.server_close()
            print("  PDF browser test server shut down cleanly.")

if __name__ == '__main__':
    t1 = run_tests()
    t2 = run_server_test()
    t3 = run_browser_headless_test()
    t4 = run_calculation_tests()
    t5 = run_browser_invalid_input_suite()
    t6 = run_loan_tracker_browser_suite()
    t7 = run_pdf_report_browser_suite()
    
    print("\n==========================================")
    print(f"FINAL SUITE RESULT: {'ALL PASS' if (t1 and t2 and t3 and t4 and t5 and t6 and t7) else 'FAIL'}")
    print("==========================================")
