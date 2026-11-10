import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';

const block = (page: Page, name: string) => page.locator('.builder-chunk').filter({ has: page.getByRole('checkbox', { name, exact: true }) });
async function select(page: Page, ids: string[]) {
  await page.goto('/');
  await page.evaluate(ids => localStorage.setItem('algoritmia:selected', JSON.stringify(ids)), ids);
  await page.goto('/seleccion/');
}

test('entra con las recomendaciones actuales, muestra el resumen arriba y descarga también al final', async ({page, context}, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('algoritmia:selected', JSON.stringify(['tap-2026-b']));
    localStorage.setItem('algoritmia:notes:v2', JSON.stringify({version:2,mode:'personalizado',custom:{'cpp-vectores':{descripcion:true,operaciones:true,ejemplos:true}}}));
  });
  await page.goto('/seleccion/#apuntes');
  await expect(page.getByRole('radio', {name:'Recomendado',exact:true})).toBeChecked();
  const summary = page.getByRole('region', {name:'Resumen del apunte'});
  await expect(summary).toContainText('Tu apunte lleva 3 bloques + plantilla');
  await expect(summary.getByRole('button', {name:'Descargar apunte PDF'})).toBeInViewport();
  await expect(summary.getByRole('link', {name:'Vectores ↗',exact:true})).toHaveCount(0);
  await page.getByRole('radio', {name:'Personalizado',exact:true}).check();
  await page.getByRole('checkbox', {name:'Set',exact:true}).uncheck();
  expect((await summary.boundingBox())!.y).toBeLessThan((await page.locator('.builder-controls').boundingBox())!.y);
  const other = await context.newPage();
  await other.goto('/problemas/tap-2026-k/');
  await other.getByRole('button', {name:'＋ Seleccionar problema'}).click();
  await expect(page.getByRole('radio', {name:'Recomendado',exact:true})).toBeChecked();
  await expect(page.getByTestId('notes-content-count')).toHaveText('6');
  await expect(page.getByRole('region', {name:'Descarga al final del apunte'})).toHaveCount(0);
  await page.getByRole('radio', {name:'Personalizado',exact:true}).check();
  const bottom = page.getByRole('region', {name:'Descarga al final del apunte'});
  const downloading = page.waitForEvent('download');
  await bottom.getByRole('button', {name:'Descargar apunte PDF'}).click();
  const download = await downloading;
  expect(await download.failure()).toBeNull();
  const path = testInfo.outputPath('apunte-desde-abajo.pdf');
  await download.saveAs(path);
  expect((await PDFDocument.load(await fs.readFile(path))).getPageCount()).toBeGreaterThan(1);
  await page.getByRole('radio', {name:'Personalizado',exact:true}).check();
  await page.getByRole('navigation', {name:'Material de tu selección'}).getByRole('link', {name:'Apuntes ↓',exact:true}).click();
  await page.screenshot({path:'test-results-material/apunte-resumen-arriba.png'});
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('navigation', {name:'Material de tu selección'}).getByRole('link', {name:'Apuntes ↓',exact:true}).click();
  await expect(summary.getByRole('button', {name:'Descargar apunte PDF'})).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:'test-results-material/apunte-resumen-mobile.png'});
});

test('los modos automáticos reúnen herramientas y se actualizan al quitar problemas o cambiar de pestaña', async ({ page, context }) => {
  await select(page, ['tap-2026-b', 'tap-2026-k']);
  await expect(page.getByRole('radio', { name: 'Recomendado', exact: true })).toBeChecked();
  await expect(page.getByTestId('notes-content-count')).toHaveText('6');
  await expect(page.getByRole('region', { name: 'Herramientas incluidas' }).getByRole('link', { name: 'Strings ↗', exact: true })).toHaveCount(1);
  await page.getByRole('radio', { name: 'Completo', exact: true }).check();
  await expect(page.getByRole('region', {name:'Descarga al final del apunte'})).toHaveCount(0);
  await expect(page.getByTestId('notes-content-count')).toHaveText('6');
  await page.getByRole('link', { name: 'Revisar vista previa ↓', exact: true }).click();
  await expect(page.locator('#preview-cpp-strings').getByRole('heading', { name: 'Ejemplos', exact: true })).toHaveCount(1);
  await page.getByRole('button', { name: 'Quitar Kilograms Exceeded', exact: true }).click();
  await expect(page.getByTestId('notes-content-count')).toHaveText('3');
  await page.getByRole('radio', { name: 'Solo funciones', exact: true }).check();
  await expect(page.locator('#preview-cpp-strings').getByRole('heading', { name: 'Descripción', exact: true })).toHaveCount(0);
  await expect(page.locator('#preview-cpp-strings').getByRole('heading', { name: 'Funciones y operaciones', exact: true })).toHaveCount(1);
  const other = await context.newPage();
  await other.goto('/problemas/tap-2026-k/');
  await other.getByRole('button', { name: '＋ Seleccionar problema' }).click();
  await expect(page.getByTestId('notes-content-count')).toHaveText('6');
  await page.reload();
  await expect(page.getByRole('radio', { name: 'Recomendado', exact: true })).toBeChecked();
  await expect(page.getByTestId('notes-content-count')).toHaveText('6');
  await page.getByRole('radio', { name: 'Recomendado', exact: true }).check();
  await page.screenshot({ path: 'test-results-material/seleccion-desktop.png', fullPage: true });
});

test('Personalizado conserva cambios durante la visita y vuelve a Recomendado al recargar o cambiar los problemas', async ({ page }) => {
  await select(page, ['tap-2026-b']);
  await page.getByRole('radio', { name: 'Personalizado', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Set', exact: true }).uncheck();
  await block(page, 'Strings').getByRole('checkbox', { name: 'Funciones y operaciones', exact: true }).uncheck();
  await page.getByRole('radio', { name: 'Completo', exact: true }).check();
  await expect(page.getByTestId('notes-content-count')).toHaveText('3');
  await page.getByRole('radio', { name: 'Personalizado', exact: true }).check();
  await expect(page.getByRole('checkbox', { name: 'Set', exact: true })).not.toBeChecked();
  await expect(block(page, 'Strings').getByRole('checkbox', { name: 'Descripción', exact: true })).toBeChecked();
  await expect(block(page, 'Strings').getByRole('checkbox', { name: 'Funciones y operaciones', exact: true })).not.toBeChecked();
  await expect(page.getByRole('region', { name: 'Problemas seleccionados' })).toContainText('2/3 herramientas sugeridas incluidas');
  await page.reload();
  await expect(page.getByRole('radio', { name: 'Recomendado', exact: true })).toBeChecked();
  await expect(page.getByTestId('notes-content-count')).toHaveText('3');
  await page.getByRole('radio', { name: 'Personalizado', exact: true }).check();
  await expect(page.getByRole('checkbox', { name: 'Set', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Quitar Breaking Rosarigasino', exact: true }).click();
  await expect(page.getByText('Todavía no seleccionaste problemas.', { exact: true })).toBeVisible();
  await expect(page.getByTestId('notes-content-count')).toHaveText('0');
  await page.reload();
  await expect(page.getByTestId('notes-content-count')).toHaveText('0');
});

test('la descarga rápida usa Recomendado aunque el borrador esté vacío, y permite reintentar un error de conexión', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('algoritmia:selected', JSON.stringify(['tap-2026-b']));
    localStorage.setItem('algoritmia:notes:v2', JSON.stringify({ version: 2, mode: 'personalizado', custom: {} }));
  });
  const materialRequests: string[] = [];
  page.on('request', request => { if (request.url().includes('/material/')) materialRequests.push(request.url()); });
  await page.goto('/problemas/tap-2026-b/');
  const cart = page.getByRole('region', { name: 'Selección de problemas' });
  await expect(cart.getByRole('link', { name: 'Ver selección →' })).toHaveAttribute('href', '/seleccion/');
  expect(materialRequests).toHaveLength(0);
  let attempts = 0;
  await page.route('**/material/catalogo.json', route => ++attempts === 1
    ? route.fulfill({ status: 503, body: 'Temporalmente no disponible' }) : route.continue());
  await cart.getByRole('button', { name: 'Apunte recomendado', exact: true }).click();
  await expect(cart.getByRole('alert')).toContainText('No se pudo cargar el material');
  const downloading = page.waitForEvent('download');
  await cart.getByRole('button', { name: 'Apunte recomendado', exact: true }).click();
  const download = await downloading;
  expect(await download.failure()).toBeNull();
  const path = testInfo.outputPath('recomendado-rapido.pdf');
  await download.saveAs(path);
  const pdf = await PDFDocument.load(await fs.readFile(path));
  expect(pdf.getTitle()).toContain('Apunte de C++17');
  expect(pdf.getPageCount()).toBeGreaterThan(1);
  expect(attempts).toBe(2);
  expect(materialRequests.some(url => url.includes('apuntes.json'))).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('algoritmia:notes:v2')!).custom)).toEqual({});
  await expect(cart.getByRole('alert')).toHaveCount(0);
});

test('en celular las descargas están en un menú, funciona con teclado y no desborda', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await select(page, ['regional-2025-h']);
  await page.goto('/problemas/');
  const cart = page.getByRole('region', { name: 'Selección de problemas' });
  await expect(cart.getByRole('button', { name: 'Descargar enunciados', exact: true })).toBeHidden();
  const menu = cart.locator('details');
  await menu.locator('summary').click();
  await expect(menu).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(menu.locator('summary')).toBeFocused();
  await menu.locator('summary').click();
  await page.screenshot({ path: 'test-results-material/carrito-mobile.png' });
  const downloading = page.waitForEvent('download');
  await cart.getByRole('button', { name: 'Enunciados PDF', exact: true }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe('enunciados-algoritmia-unt.pdf');
  expect(await download.failure()).toBeNull();
  await expect(menu).not.toHaveAttribute('open', '');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await cart.getByRole('link', { name: 'Ver selección →' }).click();
  await expect(page.getByTestId('notes-content-count')).toHaveText('3');
  await page.screenshot({ path: 'test-results-material/seleccion-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('cobertura parcial y Top global no prometen un apunte completo', async ({ page }) => {
  await select(page, ['tap-2026-c', 'regional-2026-k']);
  const chosen = page.getByRole('region', { name: 'Problemas seleccionados' });
  await expect(chosen).toContainText('Cobertura parcial.');
  await expect(chosen).toContainText('no hay bloque de DP/minimax');
  await expect(chosen).toContainText('Top global · Fuera del alcance actual de los apuntes.');
  await page.getByRole('radio', { name: 'Completo', exact: true }).check();
  await expect(page.getByTestId('notes-content-count')).toHaveText('2');
  await page.getByRole('button', { name: 'Quitar Confrontation of Numbers', exact: true }).click();
  await expect(page.getByTestId('notes-content-count')).toHaveText('0');
  await expect(page.getByRole('region', { name:'Resumen del apunte' }).getByRole('button', { name: 'Descargar apunte PDF', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: /Descargar PDF de enunciados/ })).toBeEnabled();
});
