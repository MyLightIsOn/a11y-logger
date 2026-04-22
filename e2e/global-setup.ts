import { chromium } from '@playwright/test';

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3000/api/settings/language', {
      waitUntil: 'domcontentloaded',
    });
    await page.request.put('http://localhost:3000/api/settings/language', {
      data: { value: 'en' },
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await browser.close();
  }
}
