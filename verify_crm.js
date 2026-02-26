const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const pages = [
    { name: 'phonepePendingCrm', url: 'http://localhost:8081/#/phonepePendingCrm' },
    { name: 'bijlipayCrm', url: 'http://localhost:8081/#/bijlipayCrm' },
    { name: 'globalTicketSearch', url: 'http://localhost:8081/#/globalTicketSearch' },
    { name: 'docviewer', url: 'http://localhost:8081/#/docviewer' },
    { name: 'serviceticket', url: 'http://localhost:8081/#/serviceticket' }
  ];

  for (const p of pages) {
    console.log(`Navigating to ${p.name} at ${p.url}...`);
    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
      // Wait a bit more for Quasar components to settle
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `${p.name}.png` });
      console.log(`Saved ${p.name}.png`);
    } catch (e) {
      console.error(`Failed to capture ${p.name}: ${e.message}`);
    }
  }

  await browser.close();
})();
