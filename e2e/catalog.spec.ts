import {test,expect} from '@playwright/test';
test('filtra por URL, conserva selección oculta y muestra ficha sin abrir pistas',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/problemas/?torneo=regional-2025');
 await expect(page.getByLabel('Torneo',{exact:true})).toHaveValue('regional-2025');
 await page.getByRole('checkbox',{name:'Seleccionar Harder Horizons',exact:true}).check();
 await page.getByRole('searchbox').fill('xyz inexistente');
 await expect(page.getByRole('heading',{name:'No hay coincidencias'})).toBeVisible();
 await expect(page.getByLabel('Selección de problemas')).toContainText('1 problemas seleccionados');
 await page.getByRole('button',{name:'Limpiar filtros'}).click();
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);
});
