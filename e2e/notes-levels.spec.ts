import {test,expect,type Page} from '@playwright/test';
import {PDFDocument} from 'pdf-lib';
import fs from 'node:fs/promises';

async function choose(page:Page,ids:string[]) {
  await page.goto('/');
  await page.evaluate(ids=>localStorage.setItem('algoritmia:selected',JSON.stringify(ids)),ids);
  await page.goto('/seleccion/#apuntes');
  await expect(page.getByRole('radio',{name:'Recomendado',exact:true})).toBeChecked();
}
const block=(page:Page,name:string)=>page.locator('.builder-chunk').filter({has:page.getByRole('checkbox',{name,exact:true})});

test('el menor nivel gobierna la base, la plantilla y las partes recomendadas',async({page})=>{
  await choose(page,['tap-2026-a']);
  await expect(page.getByTestId('notes-content-count')).toHaveText('5');
  await page.getByRole('radio',{name:'Personalizado',exact:true}).check();
  await expect(page.getByRole('checkbox',{name:'Incluir plantilla de C++17'})).toBeChecked();
  await expect(page.getByRole('checkbox',{name:'Recorridos y ciclos',exact:true})).toBeChecked();
  await expect(block(page,'Recorridos y ciclos').getByRole('checkbox',{name:'Ejemplos',exact:true})).toBeChecked();
  await choose(page,['tap-2026-b']);
  await page.getByRole('radio',{name:'Personalizado',exact:true}).check();
  await expect(page.getByRole('checkbox',{name:'Incluir plantilla de C++17'})).toBeChecked();
  await expect(page.getByRole('checkbox',{name:'Recorridos y ciclos',exact:true})).not.toBeChecked();
  await expect(page.getByRole('checkbox',{name:'Cuentas enteras y restos',exact:true})).not.toBeChecked();
  await expect(block(page,'Set').getByRole('checkbox',{name:'Descripción',exact:true})).toBeChecked();
  await expect(block(page,'Set').getByRole('checkbox',{name:'Ejemplos',exact:true})).toBeChecked();
  await choose(page,['regional-2025-k']);
  await expect(page.getByRole('region',{name:'Resumen del apunte'})).not.toContainText('+ plantilla');
  await page.getByRole('radio',{name:'Personalizado',exact:true}).check();
  await expect(page.getByRole('checkbox',{name:'Incluir plantilla de C++17'})).not.toBeChecked();
  await expect(block(page,'Vectores').getByRole('checkbox',{name:'Descripción',exact:true})).not.toBeChecked();
  await expect(block(page,'Vectores').getByRole('checkbox',{name:'Funciones y operaciones',exact:true})).toBeChecked();
  await expect(block(page,'Vectores').getByRole('checkbox',{name:'Ejemplos',exact:true})).not.toBeChecked();
  await expect(page.locator('.builder-preview')).not.toContainText('int main()');
  await page.getByRole('checkbox',{name:'Incluir plantilla de C++17'}).check();
  await expect(page.locator('.builder-preview')).toContainText('int main()');
  await page.getByRole('checkbox',{name:'Incluir plantilla de C++17'}).uncheck();
  await expect(page.locator('.builder-preview')).not.toContainText('int main()');
  await page.locator('.builder-summary-card').scrollIntoViewIfNeeded();
  await page.screenshot({path:'test-results-material/salto-sin-plantilla.png'});
  await choose(page,['tap-2026-a','regional-2025-k']);
  await expect(page.getByRole('region',{name:'Resumen del apunte'})).toContainText('+ plantilla');
  await page.getByRole('radio',{name:'Personalizado',exact:true}).check();
  await expect(block(page,'Vectores').getByRole('checkbox',{name:'Descripción',exact:true})).toBeChecked();
  await expect(block(page,'Vectores').getByRole('checkbox',{name:'Ejemplos',exact:true})).toBeChecked();
});

test('la descarga rápida de Salto usa el mismo perfil y Avanzado no genera un apunte automático',async({page},testInfo)=>{
  await choose(page,['regional-2025-k']);
  await page.goto('/problemas/regional-2025-k/');
  const downloading=page.waitForEvent('download');
  await page.getByRole('region',{name:'Selección de problemas'}).getByRole('button',{name:'Apunte recomendado',exact:true}).click();
  const download=await downloading;
  expect(await download.failure()).toBeNull();
  const path=testInfo.outputPath('salto-recomendado.pdf');
  await download.saveAs(path);
  expect((await PDFDocument.load(await fs.readFile(path))).getPageCount()).toBeGreaterThan(2);
  await choose(page,['tap-2024-c']);
  await expect(page.getByTestId('notes-content-count')).toHaveText('0');
  await expect(page.getByRole('region',{name:'Resumen del apunte'}).getByRole('button',{name:'Descargar apunte PDF'})).toBeDisabled();
  await expect(page.getByRole('region',{name:'Problemas seleccionados'})).toContainText('Apunte automático pendiente para Avanzado');
  await expect(page.getByRole('button',{name:/Descargar PDF de enunciados/})).toBeEnabled();
});
