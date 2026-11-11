import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {PDFDocument} from 'pdf-lib';

test('primer problema: recorrido, ayudas optativas, copia y siguiente práctica',async({page})=>{
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link',{name:'¿Recién empezás? Arrancá acá'}).click();
  await expect(page).toHaveURL(/\/empeza\/$/);
  await expect(page.getByRole('heading',{level:1})).toContainText('Tu primer problema');
  await expect(page.locator('.beginner-route a')).toHaveCount(6);
  await expect(page.locator('.explained-solution')).not.toHaveAttribute('open');
  await expect(page.getByRole('link',{name:'Leer enunciado en español'})).toHaveAttribute('href','/statements/tap-2026-a.pdf');
  await page.getByRole('link',{name:'3 Escribí',exact:true}).click();
  await page.getByText('Usar una plantilla incompleta',{exact:true}).click();
  const starter=page.getByRole('group',{name:'Plantilla para completar'});
  await expect(starter.locator('code')).toHaveText((await fs.readFile('src/tutorial/primer-ac-starter.cpp','utf8')).trim());
  await page.evaluate(()=>{
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as unknown as {copiedCode:string}).copiedCode=text;}}});
  });
  await starter.getByRole('button',{name:'Copiar plantilla',exact:true}).click();
  await expect(starter.getByRole('status')).toHaveText('Código copiado.');
  expect(await page.evaluate(()=>(window as unknown as {copiedCode:string}).copiedCode)).toContain('cin >> horas >> minutos >> segundos;');
  const selected=['regional-2025-k'];
  await page.evaluate(ids=>localStorage.setItem('algoritmia:selected',JSON.stringify(ids)),selected);
  await page.reload();
  const handout=page.getByRole('link',{name:'Descargar apunte de este problema (PDF)'});
  await expect(handout).toHaveAttribute('href','/downloads/apunte-primer-problema.pdf');
  const downloading=page.waitForEvent('download');
  await handout.click();
  const download=await downloading;
  expect(await download.failure()).toBeNull();
  expect(await fs.readFile((await download.path())!)).toEqual(await fs.readFile('public/downloads/apunte-primer-problema.pdf'));
  const pdf=await PDFDocument.load(await fs.readFile((await download.path())!));
  expect(pdf.getTitle()).toBe('Apunte para tu primer problema - Algoritmia UNT');
  expect(pdf.getPageCount()).toBeGreaterThan(1);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('algoritmia:selected')!))).toEqual(selected);
  await page.goto('/empeza/#proba');
  await expect(page.locator('.beginner-cases tbody tr')).toHaveCount(5);
  await page.getByText('Cómo probarlo en Visual Studio Code',{exact:true}).click();
  await expect(page.locator('.beginner-terminal')).toContainText('Ctrl + J');
  await expect(page.locator('.beginner-terminal')).toContainText('pulsando Enter después de cada número');
  await expect(page.locator('.beginner-terminal pre code')).toHaveText(['g++ -std=c++17 primer-ac.cpp -o primer-ac','./primer-ac','1\n2\n3']);
  await page.getByText('Ver una implementación explicada',{exact:true}).click();
  const complete=page.getByRole('group',{name:'Una implementación posible'});
  await expect(complete.locator('code')).toHaveText((await fs.readFile('src/tutorial/primer-ac.cpp','utf8')).trim());
  await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('No permitido');}}});});
  await complete.getByRole('button',{name:'Copiar implementación',exact:true}).click();
  await expect(complete.getByRole('status')).toContainText('Seleccioná el código');
  await expect(page.getByRole('link',{name:'Ir al problema en Codeforces'})).toHaveAttribute('href','https://codeforces.com/gym/106682/problem/A');
  await page.getByText('¿Qué significan las dificultades de la página?',{exact:true}).click();
  await expect(page.locator('.beginner-levels dt')).toHaveCount(5);
  await expect(page.locator('.beginner-next-grid a')).toHaveCount(3);
  await expect(page.getByRole('link',{name:'Sumate a WhatsApp'})).toHaveAttribute('href','https://chat.whatsapp.com/IHPEtSwNXeXHQfN0w587FQ');
  await page.getByRole('link',{name:'Explorar más Iniciales'}).click();
  await expect(page.getByRole('combobox',{name:'Dificultad',exact:true})).toHaveValue('Inicial');
  expect(errors).toEqual([]);
});

test('primer problema: lectura en escritorio y celular sin desbordes',async({page})=>{
  await page.goto('/empeza/');
  for(const width of [1280,390,320]){
    await page.setViewportSize({width,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`test-results-beginner/inicio-${width}.png`});
    for(const text of ['Usar una plantilla incompleta','Cómo probarlo en Visual Studio Code','Ver una implementación explicada']) {
      const summary=page.getByText(text,{exact:true});
      await summary.click();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      if(text==='Cómo probarlo en Visual Studio Code') await page.screenshot({path:`test-results-beginner/terminal-${width}.png`});
      await summary.click();
    }
    await page.locator('#segui').scrollIntoViewIfNeeded();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`test-results-beginner/siguiente-${width}.png`});
    await page.evaluate(()=>window.scrollTo(0,0));
  }
  const links=await page.locator('main a[href^="/"]').evaluateAll(anchors=>[...new Set(anchors.map(a=>a.getAttribute('href')!.split('#')[0]))]);
  for(const link of links)expect((await page.request.get(link)).ok(),link).toBe(true);
});
