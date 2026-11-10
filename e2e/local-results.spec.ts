import { test, expect } from '@playwright/test';

test('resultados compactos por universidad, clasificaciones y fuentes al final', async ({ page }) => {
  await page.goto('/torneos/tap-2026/');
  const results = page.getByRole('region', { name: 'Resultados de Tucumán', exact: true });
  await expect(results.getByRole('region', { name: 'UNT', exact: true }).locator('article')).toHaveCount(4);
  await expect(results.getByRole('region', { name: 'UNSTA', exact: true }).locator('article')).toHaveCount(1);
  await expect(results.getByRole('region', { name: 'UTN-FRT', exact: true }).locator('article')).toHaveCount(2);
  for (const name of ['Computops', 'Mono Pollo NP++ 18', 'Pandas', 'Noxus']) {
    await expect(results.locator('article').filter({ has: page.getByRole('heading', { name, exact: true }) }).locator('.qualification-badge')).toBeVisible();
  }
  await expect(page.getByRole('heading', { name: 'Notas y contexto' })).toHaveCount(0);
  await expect(page.locator('p.notice')).toHaveCount(0);
  const sources = page.getByRole('heading', { name: 'Fuentes del torneo' });
  const resultsBox = await results.boundingBox();
  const sourcesBox = await sources.boundingBox();
  expect(sourcesBox!.y).toBeGreaterThan(resultsBox!.y + resultsBox!.height);
  await expect(results.getByRole('region', { name: 'UNT', exact: true }).getByRole('link', { name: 'B', exact: true }).first()).toHaveAttribute('href', '/problemas/tap-2026-b/');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
