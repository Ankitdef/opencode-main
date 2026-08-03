const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://trekking-pied.vercel.app/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  // Full page screenshot
  await page.screenshot({ path: 'C:/Users/aka54/Downloads/New folder/reference-full.png', fullPage: true });
  
  // Hero section
  await page.screenshot({ path: 'C:/Users/aka54/Downloads/New folder/reference-hero.png' });
  
  // Scroll to treks section
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/aka54/Downloads/New folder/reference-treks.png' });
  
  // Scroll to elevation section
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/aka54/Downloads/New folder/reference-elevation.png' });
  
  // Scroll to about section
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/aka54/Downloads/New folder/reference-about.png' });
  
  // Scroll to reviews section
  await page.evaluate(() => window.scrollTo(0, 5500));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/aka54/Downloads/New folder/reference-reviews.png' });
  
  // Scroll to contact section
  await page.evaluate(() => window.scrollTo(0, 7000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/aka54/Downloads/New folder/reference-contact.png' });
  
  // Get the page title and meta info
  const title = await page.title();
  console.log('Page title:', title);
  
  // Get all section headings
  const headings = await page.$$eval('h1, h2, h3', els => els.map(el => el.textContent.trim()).filter(t => t.length > 0));
  console.log('Headings found:', headings);
  
  await browser.close();
  console.log('Screenshots saved!');
})();
