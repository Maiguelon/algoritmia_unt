import {test,expect} from '@playwright/test';
test('torneo con población, curva y fuentes; Regional 2026 pendiente',async({page})=>{
 await page.goto('/torneos/regional-2025/');
 await expect(page.getByRole('heading',{level:1})).toContainText('2025');
 await expect(page.getByText('equipos de la población indicada')).toBeVisible();
 await expect(page.getByRole('heading',{name:'Cuántos equipos hicieron cuántos AC'})).toBeVisible();
 await expect(page.locator('.stat').first()).toContainText('201');
 await expect(page.locator('tbody tr')).toHaveCount(12);
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.goto('/torneos/');
 await expect(page.getByText('Regional 2026 pendiente de publicación de problemas.',{exact:true})).toBeVisible();
});
