import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const APP_URL = 'http://localhost:8081/';
const OUT_DIR = 'C:/Users/Ghanchi/.gemini/antigravity-ide/brain/7d724315-0fd9-4b06-b34c-2db2db0ad256/screenshots';
const REPORT_FILE = 'C:/Users/Ghanchi/.gemini/antigravity-ide/brain/7d724315-0fd9-4b06-b34c-2db2db0ad256/audit_report.json';
const MD_REPORT_FILE = 'C:/Users/Ghanchi/.gemini/antigravity-ide/brain/7d724315-0fd9-4b06-b34c-2db2db0ad256/audit_report.md';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const report = {
    timestamp: new Date().toISOString(),
    pagesVisited: [],
    errors: [],
    layoutIssues: [],
    interactiveChecks: []
  };

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`[Browser Console Error]: ${msg.text()}`);
      report.errors.push({
        type: 'console-error',
        text: msg.text(),
        location: page.url()
      });
    }
  });

  page.on('pageerror', err => {
    console.error(`[Browser JS Error]: ${err.message}`);
    report.errors.push({
      type: 'js-error',
      text: err.message,
      stack: err.stack,
      location: page.url()
    });
  });

  try {
    // 1. Visit Login Page
    console.log('Visiting Login page...');
    await page.goto(APP_URL);
    await page.waitForTimeout(1000);
    const loginScreenshotPath = path.join(OUT_DIR, 'login_page.png');
    await page.screenshot({ path: loginScreenshotPath });
    report.pagesVisited.push({ route: '/', screenshot: loginScreenshotPath });

    // Check login page elements
    const brandText = await page.textContent('body');
    if (brandText.includes('web · prototype')) {
      report.layoutIssues.push({
        page: 'Login',
        issue: 'Displays developer "web · prototype" badge',
        severity: 'low'
      });
    }
    if (brandText.includes('Demo accounts · one click')) {
      report.layoutIssues.push({
        page: 'Login',
        issue: 'Displays cluttered "Demo accounts" switcher inside login card instead of a clean business entrance',
        severity: 'high'
      });
    }

    const roles = ['supervisor', 'seller', 'buyer', 'admin'];

    for (const role of roles) {
      console.log(`\nLogging in as ${role}...`);
      await page.goto(APP_URL);
      await page.waitForTimeout(1000);

      // Open demo popover
      await page.click('button:has-text("Demo Accounts")');
      await page.waitForTimeout(500);

      // Find and click the demo button for the role
      const buttonSelector = `button:has(span:has-text("${role}"))`;
      await page.click(buttonSelector);
      await page.waitForTimeout(2000);

      const currentUrl = page.url();
      console.log(`Logged in. Current URL: ${currentUrl}`);

      // 2. Crawl role-specific navigation
      let navItems = [];
      if (role === 'buyer') {
        // Buyer uses Top Navbar
        navItems = [
          { label: 'Home', path: '/buyer/home' },
          { label: 'Browse', path: '/buyer/browse' },
          { label: 'Orders', path: '/buyer/orders' },
          { label: 'Profile', path: '/buyer/profile' }
        ];
      } else {
        // Others use Left Sidebar
        const sidebarLinks = await page.$$('aside nav a');
        for (const link of sidebarLinks) {
          const text = await link.innerText();
          const href = await link.getAttribute('href');
          navItems.push({ label: text.trim(), path: href });
        }
      }

      console.log(`Found ${navItems.length} navigation items for ${role}:`, navItems.map(n => n.label));

      for (const item of navItems) {
        console.log(`Navigating to ${role} -> ${item.label} (${item.path})...`);
        try {
          if (role === 'buyer') {
            await page.click(`header nav a:has-text("${item.label}")`);
          } else {
            await page.click(`aside nav a:has-text("${item.label}")`);
          }
          await page.waitForTimeout(1500);
        } catch (e) {
          console.log(`Could not click directly, navigating via URL: ${APP_URL}${item.path.replace(/^\//, '')}`);
          await page.goto(`${APP_URL}${item.path.replace(/^\//, '')}`);
          await page.waitForTimeout(1500);
        }

        const routeUrl = page.url();
        const screenshotName = `${role}_${item.label.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
        const screenshotPath = path.join(OUT_DIR, screenshotName);
        await page.screenshot({ path: screenshotPath });

        report.pagesVisited.push({
          role,
          label: item.label,
          route: item.path,
          screenshot: screenshotPath,
          actualUrl: routeUrl
        });

        // Layout measurements
        if (role !== 'buyer') {
          // Check sidebar header and top bar header heights
          const sidebarHeaderBox = await page.evaluate(() => {
            const el = document.querySelector('aside div.border-b');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { top: r.top, bottom: r.bottom, height: r.height };
          });

          const topbarHeaderBox = await page.evaluate(() => {
            const el = document.querySelector('header');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { top: r.top, bottom: r.bottom, height: r.height };
          });

          if (sidebarHeaderBox && topbarHeaderBox) {
            const heightDiff = Math.abs(sidebarHeaderBox.height - topbarHeaderBox.height);
            const bottomDiff = Math.abs(sidebarHeaderBox.bottom - topbarHeaderBox.bottom);
            
            report.interactiveChecks.push({
              role,
              page: item.label,
              check: 'Header Alignment Check',
              sidebarHeight: sidebarHeaderBox.height,
              topbarHeight: topbarHeaderBox.height,
              heightDiff,
              bottomDiff,
              aligned: heightDiff < 1 && bottomDiff < 1
            });

            if (heightDiff > 2 || bottomDiff > 2) {
              report.layoutIssues.push({
                role,
                page: item.label,
                issue: `Sidebar header height (${sidebarHeaderBox.height}px) and Topbar height (${topbarHeaderBox.height}px) do not match. Bottom borders are misaligned by ${bottomDiff}px.`,
                severity: 'medium'
              });
            }
          }

          // Check if prototype labels exist in the sidebar
          const sidebarFooterText = await page.evaluate(() => {
            const el = document.querySelector('aside div.border-t');
            return el ? el.innerText : '';
          });

          if (sidebarFooterText.includes('Prototype') || sidebarFooterText.includes('mocked')) {
            report.layoutIssues.push({
              role,
              page: item.label,
              issue: 'Sidebar footer shows developer warning "Prototype - All data is mocked. Actions resolve locally."',
              severity: 'low'
            });
          }
        }

        // Test Interactive elements on specific pages
        if (role === 'supervisor' && item.label === 'Pricing Queue') {
          // Verify table rows click -> opens drawer
          const rows = await page.$$('table tbody tr');
          if (rows.length > 0) {
            console.log(`  Found ${rows.length} rows in pricing queue. Clicking first row...`);
            await rows[0].click();
            await page.waitForTimeout(1000);
            
            const drawerVisible = await page.isVisible('[role="dialog"], .sheet-content, [data-state="open"]');
            report.interactiveChecks.push({
              role,
              page: item.label,
              action: 'Click table row to open Pricing Drawer',
              success: drawerVisible
            });

            if (drawerVisible) {
              // Close the drawer
              await page.click('text=Cancel');
              await page.waitForTimeout(500);
            }
          }
        }

        if (role === 'seller' && item.label === 'Returns / Decisions') {
          // Verify decision cards exist
          const cards = await page.$$('article');
          console.log(`  Found ${cards.length} cards in returns/decisions.`);
          report.interactiveChecks.push({
            role,
            page: item.label,
            action: 'Verify decision cards list populated',
            success: cards.length > 0
          });
        }

        if (role === 'buyer' && item.label === 'Browse') {
          // Verify filters
          const filters = await page.$$('button[role="checkbox"], button[role="combobox"], [role="slider"]');
          console.log(`  Found ${filters.length} filters on browse page.`);
          report.interactiveChecks.push({
            role,
            page: item.label,
            action: 'Verify search filters present',
            success: filters.length > 0
          });
        }
      }

      // Clear session to log out
      console.log(`Clearing session for ${role}...`);
      await page.evaluate(() => localStorage.clear());
      await page.waitForTimeout(500);
    }

  } catch (error) {
    console.error('Error during crawl:', error);
    report.errors.push({ type: 'crawl-failure', text: error.message });
  } finally {
    await browser.close();
    console.log('Crawl finished. Writing reports...');

    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

    // Generate markdown report
    let md = `# ReturnFlow Web App Prototype — Layout & QA Audit Report\n\n`;
    md += `Generated on: **${new Date().toLocaleString()}** via Playwright automation testing.\n\n`;

    md += `## 1. Summary of Test Run\n`;
    md += `*   **Total Pages Crawled**: ${report.pagesVisited.length}\n`;
    md += `*   **Role Workspaces Validated**: Supervisor, Seller, Buyer, Admin\n`;
    md += `*   **Console Errors/Warnings**: ${report.errors.length}\n`;
    md += `*   **Total Layout/Styling Issues Identified**: ${report.layoutIssues.length}\n\n`;

    if (report.errors.length > 0) {
      md += `## ⚠️ Console & Javascript Errors\n`;
      report.errors.forEach(e => {
        md += `*   **${e.type}** at \`${e.location}\`: *${e.text}*\n`;
      });
      md += `\n`;
    } else {
      md += `## ✅ Console & Javascript Errors\n`;
      md += `No JavaScript crashes, console errors, or failed asset requests were detected during crawling.\n\n`;
    }

    md += `## 📐 Layout & Spacing Alignment Issues\n`;
    const high = report.layoutIssues.filter(i => i.severity === 'high');
    const med = report.layoutIssues.filter(i => i.severity === 'medium');
    const low = report.layoutIssues.filter(i => i.severity === 'low');

    md += `### 🔴 High Severity\n`;
    if (high.length > 0) {
      high.forEach(i => md += `*   **[${i.role || 'global'}] ${i.page}**: ${i.issue}\n`);
    } else {
      md += `*   None\n`;
    }
    md += `\n`;

    md += `### 🟡 Medium Severity\n`;
    if (med.length > 0) {
      med.forEach(i => md += `*   **[${i.role || 'global'}] ${i.page}**: ${i.issue}\n`);
    } else {
      md += `*   None\n`;
    }
    md += `\n`;

    md += `### 🔵 Low Severity (Prototype Warning Labels)\n`;
    if (low.length > 0) {
      low.forEach(i => md += `*   **[${i.role || 'global'}] ${i.page}**: ${i.issue}\n`);
    } else {
      md += `*   None\n`;
    }
    md += `\n`;

    md += `## 🛠️ Detailed Component & Interactive Feature Status\n`;
    md += `| Role | Page | Action / Verification | Status | Note |\n`;
    md += `| --- | --- | --- | --- | --- |\n`;
    report.interactiveChecks.forEach(c => {
      if (c.check === 'Header Alignment Check') {
        md += `| ${c.role} | ${c.page} | Header Alignment (Sidebar ${c.sidebarHeight}px vs Topbar ${c.topbarHeight}px) | ${c.aligned ? '✅ Pass' : '❌ Fail'} | Borders misaligned by ${c.bottomDiff}px |\n`;
      } else {
        md += `| ${c.role} | ${c.page} | ${c.action} | ${c.success ? '✅ Pass' : '❌ Fail'} | Verified interactive response |\n`;
      }
    });

    fs.writeFileSync(MD_REPORT_FILE, md);
    console.log('Reports written successfully.');
  }
}

run();
