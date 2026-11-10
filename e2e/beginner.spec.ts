import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

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
  await page.getByText('Quiero preparar un apunte con estas herramientas',{exact:true}).click();
  await page.getByRole('button',{name:'＋ Seleccionar problema',exact:true}).click();
  await expect(page.getByRole('button',{name:'✓ En tu selección',exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Ver mi selección y apunte',exact:false}).click();
  await expect(page.getByTestId('notes-content-count')).toHaveText('3');
  await expect(page.getByRole('radio',{name:'Recomendado',exact:true})).toBeChecked();
  await expect(page.getByRole('region',{name:'Descarga al final del apunte'})).toHaveCount(0);
  await page.goto('/empeza/#proba');
  await expect(page.locator('.beginner-cases tbody tr')).toHaveCount(5);
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
    for(const text of ['Usar una plantilla incompleta','Ver una implementación explicada']) {
      const summary=page.getByText(text,{exact:true});
      await summary.click();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
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
