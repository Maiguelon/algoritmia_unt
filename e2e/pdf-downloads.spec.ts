import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';

test.describe.configure({ timeout: 60_000 });

test('descarga un apunte real con un único bloque y páginas A4', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/armar/?chunk=cpp-set');
  await expect(page.getByTestId('notes-content-count')).toHaveText('1');
  await expect(page.getByTestId('notes-index-status')).toContainText('Sin índice');

  const downloading = page.waitForEvent('download', { timeout: 45_000 });
  await page.getByRole('button', { name: 'Descargar apunte PDF', exact: true }).click();
  const download = await downloading;
  expect(await download.failure()).toBeNull();
  expect(download.suggestedFilename()).toBe('apunte-cpp-algoritmia-unt.pdf');
  const file = testInfo.outputPath('apunte-set.pdf');
  await download.saveAs(file);
  const bytes = await fs.readFile(file);
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
  const document = await PDFDocument.load(bytes);
  expect(document.getTitle()).toContain('Apunte de C++17');
  expect(document.getPageCount()).toBeGreaterThan(0);
  for (const page of document.getPages()) {
    expect(page.getWidth()).toBeCloseTo(595.28, 1);
    expect(page.getHeight()).toBeCloseTo(841.89, 1);
  }
  await expect(page.getByRole('button', { name: 'Descargar apunte PDF', exact: true })).toBeEnabled();
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(errors).toEqual([]);
  console.log(`Apunte descargado: ${bytes.length} bytes, ${document.getPageCount()} páginas A4.`);
  await testInfo.attach('Apunte de set descargado', { path: file, contentType: 'application/pdf' });
});

test('descarga los enunciados elegidos de Regional 2025 desde el navegador', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem('algoritmia:selected', JSON.stringify(['regional-2025-h', 'regional-2025-j']));
  });
  await page.goto('/enunciados/');
  await expect(page.getByRole('link', { name: 'H · Harder Horizons', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'J · Judgmental Crowd', exact: true })).toBeVisible();
  await expect(page.getByText('Incluye índice de problemas con enlaces, QR y páginas.', { exact: false })).toBeVisible();

  const downloading = page.waitForEvent('download', { timeout: 45_000 });
  await page.getByRole('button', { name: /Descargar PDF de enunciados/ }).click();
  const download = await downloading;
  expect(await download.failure()).toBeNull();
  expect(download.suggestedFilename()).toBe('enunciados-algoritmia-unt.pdf');
  const file = testInfo.outputPath('regional-2025-h-j.pdf');
  await download.saveAs(file);
  const bytes = await fs.readFile(file);
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
  const document = await PDFDocument.load(bytes);
  expect(document.getTitle()).toContain('Enunciados de práctica');
  // Un índice con enlaces y QR, seguido de los dos originales.
  expect(document.getPageCount()).toBe(3);
  await expect(page.getByRole('button', { name: /Descargar PDF de enunciados/ })).toBeEnabled();
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(errors).toEqual([]);
  console.log(`Enunciados H/J descargados: ${bytes.length} bytes, ${document.getPageCount()} páginas.`);
  await testInfo.attach('Enunciados H y J descargados', { path: file, contentType: 'application/pdf' });
});
