import { test, expect } from '@playwright/test';

test('el carrito se comparte entre ficha, catálogo y torneo, sin recargar', async ({ page, context }) => {
  await page.goto('/problemas/regional-2025-j/');
  await page.getByRole('button', { name: '＋ Seleccionar problema' }).click();
  const cart = page.getByRole('region', { name: 'Selección de problemas' });
  await expect(cart).toContainText('1 problema seleccionado');
  await page.goto('/torneos/regional-2025/');
  await expect(page.getByRole('checkbox', { name: 'Seleccionar Judgmental Crowd', exact: true })).toBeChecked();
  await page.getByRole('checkbox', { name: 'Seleccionar Harder Horizons', exact: true }).check();
  await expect(cart).toContainText('2 problemas seleccionados');
  await page.goto('/problemas/');
  await expect(page.getByRole('checkbox', { name: 'Seleccionar Harder Horizons', exact: true })).toBeChecked();
  await expect(cart).toContainText('2 problemas seleccionados');

  const otherTab = await context.newPage();
  await otherTab.goto('/problemas/regional-2025-k/');
  await otherTab.getByRole('button', { name: '＋ Seleccionar problema' }).click();
  await expect(cart).toContainText('3 problemas seleccionados');
  await cart.getByRole('button', { name: 'Vaciar', exact: true }).click();
  await expect(cart).toHaveCount(0);
  await expect(otherTab.getByRole('button', { name: '＋ Seleccionar problema' })).toBeVisible();
  await expect(otherTab.getByRole('region', { name: 'Selección de problemas' })).toHaveCount(0);
});
