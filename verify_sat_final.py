import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        try:
            # Login
            print("Navigating to login page...")
            await page.goto('http://localhost:8081/#/login', timeout=60000)
            await page.wait_for_selector('input[type="text"]', timeout=30000)

            # Find email input (might not have aria-label)
            inputs = await page.query_selector_all('input')
            for i in inputs:
                type_attr = await i.get_attribute('type')
                if type_attr == 'text' or type_attr == 'email':
                    await i.fill('testsat@bijlipay.co.in')
                    break

            await page.fill('input[type="password"]', 'password')

            # Find login button
            buttons = await page.query_selector_all('button')
            for b in buttons:
                text = await b.inner_text()
                if 'LOGIN' in text.upper():
                    await b.click()
                    break

            # Wait for navigation to dashboard
            print("Waiting for dashboard...")
            await page.wait_for_url('**/sat/dashboard', timeout=30000)
            print("Logged in successfully")

            await asyncio.sleep(5) # Wait for data load
            await page.screenshot(path='sat_dashboard_final.png', full_page=True)
            print("Dashboard screenshot saved")

            # Go to Lead Validation
            print("Navigating to Lead Validation...")
            await page.goto('http://localhost:8081/#/sat/LeadValidation', timeout=30000)
            await asyncio.sleep(5) # Wait for table load
            await page.screenshot(path='lead_validation_final.png', full_page=True)
            print("Lead Validation screenshot saved")

            # Check Implementation Queue
            print("Navigating to Implementation Queue...")
            await page.goto('http://localhost:8081/#/sat/ImplementationQueue', timeout=30000)
            await asyncio.sleep(5)
            await page.screenshot(path='implementation_queue_final.png', full_page=True)
            print("Implementation Queue screenshot saved")

        except Exception as e:
            print(f"Error during verification: {e}")
            await page.screenshot(path='error_screenshot.png')
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
