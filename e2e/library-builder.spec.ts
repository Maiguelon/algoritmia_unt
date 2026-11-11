import { test, expect, type Page } from '@playwright/test';

const block = (page: Page, name: string) => page.locator('.builder-chunk').filter({
  has: page.getByRole('checkbox', { name, exact: true }),
});

test('biblioteca completa: grupos, búsqueda sin acentos y entrada al armador', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/apuntes/');
  await expect(page.getByRole('status')).toHaveText('30 de 30 bloques');
  await page.getByRole('button', { name: 'Contenedores', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('9 de 30 bloques');
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Buscar una herramienta' }).fill('inicializacion');
  await expect(page.getByRole('heading', { name: 'Variables, tipos e inicialización' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('1 de 30 bloques');
  await page.getByRole('searchbox', { name: 'Buscar una herramienta' }).fill('set');
  await expect(page.getByRole('heading', { name: 'Set', exact: true })).toBeVisible();
  const setCard = page.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Set', exact: true }) });
  await expect(setCard.getByRole('link', { name: 'Usar en apunte' })).toHaveAttribute('href', '/seleccion/?chunk=cpp-set');
  await page.getByRole('searchbox', { name: 'Buscar una herramienta' }).clear();
  await page.screenshot({ path: 'test-results-library/apuntes-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results-library/apuntes-mobile.png' });
  expect(errors).toEqual([]);
});

test('una herramienta respeta partes y desmarcados al recargar', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/seleccion/?chunk=cpp-set');
  await expect(page.getByTestId('notes-content-count')).toHaveText('1');
  await expect(page.getByTestId('notes-index-status')).toContainText('Sin índice');
  await expect(page).toHaveURL(/\/seleccion\/(?:#apuntes)?$/);
  await block(page, 'Set').getByRole('checkbox', { name: 'Descripción', exact: true }).check();
  await block(page, 'Set').getByRole('checkbox', { name: 'Funciones y operaciones', exact: true }).uncheck();
  await expect(page.locator('#preview-cpp-set').getByRole('heading', { name: 'Descripción', exact: true })).toBeVisible();
  await expect(page.locator('#preview-cpp-set').getByRole('heading', { name: 'Funciones y operaciones', exact: true })).toHaveCount(0);
  await expect(page.locator('.builder-preview pre')).toHaveCount(1);
  await expect(page.locator('.builder-preview pre')).toContainText('int main()');
  await page.reload();
  await expect(block(page, 'Set').getByRole('checkbox', { name: 'Descripción', exact: true })).toBeChecked();
  await expect(block(page, 'Set').getByRole('checkbox', { name: 'Funciones y operaciones', exact: true })).not.toBeChecked();
  await page.getByRole('checkbox', { name: 'Set', exact: true }).uncheck();
  await page.getByRole('checkbox', {name:'Incluir plantilla de C++17'}).uncheck();
  await expect(page.getByTestId('notes-content-count')).toHaveText('0');
  await page.reload();
  await expect(page.getByTestId('notes-content-count')).toHaveText('0');
  await expect(page.getByRole('region', { name:'Resumen del apunte' }).getByRole('button', { name: 'Descargar apunte PDF' })).toBeDisabled();
  expect(errors).toEqual([]);
});

test('el índice cuenta bloques distintos y los apoyos solo se suman por decisión del usuario', async ({ page }) => {
  await page.goto('/armar/?chunk=cpp-set&chunk=cpp-map&chunk=cpp-set');
  await expect(page.getByTestId('notes-content-count')).toHaveText('2');
  await expect(page.getByTestId('notes-index-status')).toHaveText('Con índice de contenidos.');
  await expect(page.locator('.builder-preview nav').getByRole('listitem')).toHaveCount(2);
  await page.getByRole('checkbox', { name: 'Map', exact: true }).uncheck();
  await expect(page.getByTestId('notes-content-count')).toHaveText('1');
  await expect(page.locator('.builder-preview nav')).toHaveCount(0);
  await expect(page.getByRole('checkbox', { name: 'Iteradores y rangos', exact: true })).not.toBeChecked();
  await page.getByRole('button', { name: '+ Iteradores y rangos', exact: true }).click();
  await expect(page.getByTestId('notes-content-count')).toHaveText('2');
  await page.getByRole('checkbox', { name: 'Iteradores y rangos', exact: true }).uncheck();
  await page.reload();
  await expect(page.getByTestId('notes-content-count')).toHaveText('1');
  await expect(page.getByRole('checkbox', { name: 'Iteradores y rangos', exact: true })).not.toBeChecked();
  await expect(page.getByRole('button', { name: '+ Iteradores y rangos', exact: true })).toBeVisible();
});

test('una configuración antigua no rompe el armador y la plantilla sigue siendo única', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('algoritmia:notes:v1', JSON.stringify({ version: 1, selection: {
      'cpp-no-existe': { descripcion: true, operaciones: true, ejemplos: true },
      'cpp-set': { descripcion: false, operaciones: true, ejemplos: false },
      'cpp-plantilla': { descripcion: true, operaciones: false, ejemplos: true },
    } }));
  });
  await page.goto('/armar/');
  await expect(page.getByTestId('notes-content-count')).toHaveText('1');
  await expect(page.getByTestId('notes-index-status')).toContainText('Sin índice');
  await expect(page.locator('.builder-preview article').getByRole('heading', { name: 'Plantilla de C++', exact: true })).toHaveCount(1);
  await expect(page.locator('.builder-preview article').first().getByRole('heading', { name: 'Descripción', exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('algoritmia:notes:v2') ?? '{}').custom)).not.toHaveProperty('cpp-no-existe');
});

test('armador y vista previa permanecen dentro de la pantalla en computadora y celular', async ({ page }) => {
  await page.goto('/armar/?chunk=cpp-set&chunk=cpp-vectores');
  await expect(page.getByTestId('notes-content-count')).toHaveText('2');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results-library/armador-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results-library/armador-mobile.png' });
  await page.locator('#vista-previa').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results-library/armador-preview-mobile.png' });
});
