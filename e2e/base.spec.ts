import { test, expect } from '@playwright/test';
test('inicio, teclado, identidad y formato móvil', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Un problema más.');
  await expect(page.getByRole('img', { name: /Tres hormigas/ })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused();
  await page.screenshot({ path: 'test-results/inicio-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/inicio-mobile.png', fullPage: true });
  expect(errors).toEqual([]);
});
test('el enlace inexistente tiene una salida útil', async ({ page }) => {
  await page.goto('/404');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Este camino');
  await expect(page.getByRole('link', { name: 'Ver problemas', exact: true })).toHaveAttribute('href', '/problemas/');
});
