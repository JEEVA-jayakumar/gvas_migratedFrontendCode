const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  console.log('Navigating to login page...');
  await page.goto('http://localhost:8081/#/', { waitUntil: 'networkidle' });

  console.log('Performing login...');
  await page.type('input[placeholder="Enter your email id"]', 'testsat@bijlipay.co.in');
  await page.type('input[placeholder="Enter your password"]', 'password');

  await page.click('button:has-text("Log In")');

  console.log('Waiting for success notification...');
  try {
    const successMsg = page.locator('text=Succesfully Logged In');
    await successMsg.waitFor({ timeout: 15000 });
    console.log('Found success message.');

    // Wait for the loader to disappear
    await page.waitForSelector('.q-loading', { state: 'hidden', timeout: 15000 });

    // Check localStorage
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    console.log('Auth Token in localStorage:', token ? 'Present' : 'Missing');

    const ui = await page.evaluate(() => localStorage.getItem('u_i'));
    console.log('User Info in localStorage:', ui ? 'Present' : 'Missing');

    // Wait for URL change
    await page.waitForURL('**/sat/master/BijlipaySat', { timeout: 10000 });
    console.log('Redirected to BijlipaySat.');

  } catch (e) {
    console.log('Login failed or timed out:', e.message);
    await page.screenshot({ path: 'login_error_debug.png' });
  }

  const satPages = [
    { name: 'sat_dashboard', url: 'http://localhost:8081/#/sat/dashboard' },
    { name: 'sat_lead_validation', url: 'http://localhost:8081/#/sat/lead/validation' },
    { name: 'sat_master_tracker', url: 'http://localhost:8081/#/sat/master/tracker' },
    { name: 'sat_exception_queue', url: 'http://localhost:8081/#/sat/exception/queue' },
    { name: 'sat_lead_entry', url: 'http://localhost:8081/#/sat/lead/lead/dataentry' }
  ];

  for (const p of satPages) {
    console.log(`Navigating to ${p.name} at ${p.url}...`);
    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(5000);

      const currentUrl = page.url();
      console.log(`Current URL for ${p.name}: ${currentUrl}`);

      await page.screenshot({ path: `${p.name}.png`, fullPage: true });
      console.log(`Captured ${p.name}.png`);
    } catch (e) {
      console.error(`Failed to capture ${p.name}: ${e.message}`);
    }
  }

  await browser.close();
})();
