import {test, expect} from '@playwright/test';

test('la portada conecta comunidad, carrusel manual, camp y equipos del Regional', async ({page}) => {
  await page.goto('/');
  const whatsapp = 'https://chat.whatsapp.com/IHPEtSwNXeXHQfN0w587FQ';
  await expect(page.getByRole('link', {name:'Sumate a la comunidad de WhatsApp'})).toHaveAttribute('href', whatsapp);
  await expect(page.getByRole('link', {name:'Preguntanos por WhatsApp'})).toHaveAttribute('href', whatsapp);
  const carousel = page.getByRole('region', {name:'Fotos de Training Camps anteriores'});
  await expect(carousel.getByRole('button', {name:'Foto siguiente del camp'})).toBeVisible();
  await expect(carousel.locator('output')).toHaveText('1 de 4');
  await carousel.getByRole('button', {name:'Foto siguiente del camp'}).click();
  await expect(carousel.locator('output')).toHaveText('2 de 4');
  const viewport = carousel.locator('.carousel-viewport');
  await expect.poll(() => viewport.evaluate(el => Math.round(el.scrollLeft / el.clientWidth))).toBe(1);
  await viewport.focus();
  await page.keyboard.press('ArrowRight');
  await expect(carousel.locator('output')).toHaveText('3 de 4');
  await expect.poll(() => viewport.evaluate(el => Math.round(el.scrollLeft / el.clientWidth))).toBe(2);
  await carousel.getByRole('button', {name:'Foto anterior del camp'}).click();
  await expect(carousel.locator('output')).toHaveText('2 de 4');
  await expect.poll(() => viewport.evaluate(el => Math.round(el.scrollLeft / el.clientWidth))).toBe(1);
  await viewport.evaluate(el => el.scrollTo({left:0, behavior:'instant'}));
  await expect(carousel.locator('output')).toHaveText('1 de 4');
  await expect(page.locator('.camp-details')).not.toHaveAttribute('open');
  await page.getByText('¿Qué es el Training Camp?', {exact:true}).click();
  await expect(page.locator('.camp-details')).toHaveAttribute('open');
  await expect(page.locator('.camp-details')).toContainText('Dos semanas');
  await page.getByText('¿Qué es el Training Camp?', {exact:true}).click();
  await expect(page.locator('.latest-tournament figure')).toHaveCount(4);
  await expect(page.locator('.latest-tournament figcaption').first()).toContainText('Computops');
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({width,height:844});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('link', {name:'Sumate a la comunidad de WhatsApp'})).toBeVisible();
  }
  await page.setViewportSize({width:1280,height:900});
  await page.getByRole('heading', {level:1}).click();
  await page.screenshot({path:'test-results/comunidad-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'test-results/comunidad-mobile.png',fullPage:true});
  const failedImages = await page.locator('.camp-carousel img, .regional-photos img').evaluateAll(async images => {
    await Promise.all(images.map(image => (image as HTMLImageElement).decode()));
    return images.filter(image => !(image as HTMLImageElement).naturalWidth).length;
  });
  expect(failedImages).toBe(0);
  await page.getByRole('link', {name:'Ver equipos y resultados',exact:false}).click();
  await expect(page).toHaveURL(/\/torneos\/regional-2026\/#tucuman$/);
  await expect(page.locator('.regional-photos figure')).toHaveCount(4);
  await page.goto('/torneos/');
  await expect(page.getByRole('heading', {name:'Analizá cada torneo'})).toBeVisible();
  await expect(page.locator('.grid-three .eyebrow')).toHaveCount(0);
});
