import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import { PDFDocument, PDFDict, PDFName, PDFString, PDFHexString } from 'pdf-lib';

test('TAP históricos: estadísticas conciliadas, aceptados oficiales y cupos 2024 por universidad', async ({ page }) => {
  await page.goto('/torneos/tap-2025/');
  await expect(page.locator('.stat').first()).toContainText('183');
  await expect(page.locator('tbody tr')).toHaveCount(14);
  await expect(page.locator('tbody tr').filter({ has: page.getByRole('link', { name: 'A · Artifact to print', exact: true }) })).toContainText('175 / 183');
  await expect(page.locator('.qualification-cutoff')).toContainText('TAPires');
  await expect(page.locator('.qualification-cutoff')).toContainText('328');
  await expect(page.locator('.qualification-context')).toContainText('límite por institución');
  await expect(page.locator('.stat').nth(2)).toContainText('aceptados en el Regional');
  await expect(page.locator('.stat').nth(2).locator('strong')).toHaveText('3');
  await expect(page.getByRole('region', { name: 'UNT', exact: true }).locator('article')).toHaveCount(6);
  await expect(page.locator('.qualification-badge')).toHaveText(['✓ Aceptado', '✓ Aceptado', '✓ Aceptado']);
  await expect(page.getByRole('region', { name: 'Resultados de Tucumán' })).toContainText('participación de Milanguchito');
  await page.goto('/torneos/tap-2024/');
  await expect(page.locator('.stat').first()).toContainText('155');
  await expect(page.locator('tbody tr')).toHaveCount(14);
  const conflict = page.locator('.local-result').filter({ has: page.getByRole('heading', { name: 'La tupla del gordo silla', exact: true }) });
  await expect(conflict.locator('.result-metrics')).toContainText('AC: 4');
  await expect(conflict.locator('.result-metrics')).toContainText('Penalidad: 339');
  await expect(conflict.locator('.solved-problems a')).toHaveText(['D', 'F', 'G', 'N']);
  await expect(page.locator('.stat').nth(1)).toContainText('4cupos ordinarios por universidad');
  await expect(page.locator('.qualification-summary')).toContainText('cupo femenino adicional');
  await expect(page.locator('.stat').nth(2).locator('strong')).toHaveText('—');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/torneos/regional-2024/');
  await expect(page.getByRole('region', { name: 'Resultados de Tucumán' })).toContainText('No se identificaron equipos de Tucumán');
  await expect(page.getByRole('heading', { name: '[UNT] TuringBot', exact: true })).toHaveCount(0);
  await page.goto('/problemas/tap-2025-f/');
  await expect(page.getByText('Cobertura del apunte:')).toContainText('fuera de alcance');
  await expect(page.locator('.page-heading [data-level]')).toHaveAttribute('data-level', 'Top global');
});

test('un paquete mixto de TAP 2024 y 2025 conserva las páginas originales y ambos Gym', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('algoritmia:selected', JSON.stringify(['tap-2024-a', 'tap-2025-a'])));
  await page.goto('/seleccion/');
  await expect(page.getByRole('region', { name: 'Problemas seleccionados' }).getByRole('listitem')).toHaveCount(2);
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: /Descargar PDF de enunciados/ }).click();
  const download = await downloading;
  expect(await download.failure()).toBeNull();
  const path = testInfo.outputPath('tap-2024-2025.pdf');
  await download.saveAs(path);
  const pdf = await PDFDocument.load(await fs.readFile(path));
  expect(pdf.getPageCount()).toBe(4);
  const targets = pdf.getPage(0).node.Annots()?.asArray().map(ref => {
    const action = pdf.context.lookup(ref, PDFDict).lookupMaybe(PDFName.of('A'), PDFDict);
    const uri = action?.lookup(PDFName.of('URI'));
    return uri instanceof PDFString || uri instanceof PDFHexString ? uri.decodeText() : '';
  }).join('\n') ?? '';
  expect(targets).toContain('codeforces.com/gym/105321/problem/A');
  expect(targets).toContain('codeforces.com/gym/106054/problem/A');
});
