import {test,expect} from '@playwright/test';
test('ficha directa, selección y pistas cerradas',async({page})=>{
 await page.goto('/problemas/regional-2025-k/');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Kings Conquest');
 expect(await page.locator('details[open]').count()).toBe(0);
 await expect(page.getByText('Cobertura del apunte:',{exact:false})).toContainText('parcial');
 await page.getByRole('button',{name:'＋ Seleccionar problema'}).click();
 await expect(page.getByRole('button',{name:'✓ En tu selección'})).toBeVisible();
 await expect(page.getByRole('region',{name:'Selección de problemas'})).toContainText('1 problema seleccionado');
 await page.reload();
 await expect(page.getByRole('button',{name:'✓ En tu selección'})).toBeVisible();
 await page.getByRole('region',{name:'Selección de problemas'}).getByRole('button',{name:'Vaciar',exact:true}).click();
 await expect(page.getByRole('button',{name:'＋ Seleccionar problema'})).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
