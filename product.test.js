const { test, expect } = require('@playwright/test');

const config = { 
  baseURL: 'https://www.ozon.ru'
}

const imgIdRegex = /(?<=\/)\d+?\.jpg/

function productUrl(baseUrl, slug) {
  return `${baseUrl}/product/${slug}`
}

async function navigateToProduct(page, slug) {
  await page.goto(productUrl(config.baseURL, slug));
}

async function navigateToIpadPro(page) {
  await navigateToProduct(page, 'planshet-apple-ipad-pro-2021-wi-fi-12-9-256gb-seryy-590971109/?sh=VzpVUxjSLQ');
}

 // Title test
test('title exists', async ({ page }) => {
  await navigateToIpadPro(page);
  const title = page.locator('div[data-widget="webProductHeading"] > h1');
  await expect(title).toHaveText('Планшет Apple iPad Pro (2021) Wi-Fi, 12.9", 256GB, серый');
});


// Button test
test('add to cart', async ({ page }) => { 
  await navigateToIpadPro(page);
  const button = page.locator('div[data-widget="webAddToCart"]');
  await expect(button).toContainText("Добавить в корзину");
  await button.click();

  const widget = page.locator('div[data-widget="webAddToCart"]');
  await expect(widget).toContainText("В корзине");

  const cart = page.locator('a[data-widget="headerIcon"]');
  await expect(cart).toContainText("1");
});


test('gallery initial state', async ({ page }) => {
  await navigateToIpadPro(page);
  const gallery = page.locator('div[data-widget="webGallery"]');
  const galleryThumbnails = gallery.locator('div[data-index]')
  const detailedView = gallery.locator('img >> nth=0');
  const firstThumbnail = galleryThumbnails.locator(`img >> nth=0`);
  const imageSrc = await firstThumbnail.getAttribute('src').then((value) => value.match(imgIdRegex)[0]);
  await expect(detailedView).toHaveAttribute('src', new RegExp(`(?<=\/)${imageSrc}`));
});

test('gallery traversal', async ({ page }) => {
  await navigateToIpadPro(page);
  const gallery = page.locator('div[data-widget="webGallery"]');
  const galleryThumbnails = gallery.locator('div[data-index]')
  const detailedView = gallery.locator('img >> nth=0');
  const count = await galleryThumbnails.count();

  for (let index = 0; index < count; index++) {
    const currentThumbnail = galleryThumbnails.locator(`img >> nth=${index}`);
    const imageSrc = await currentThumbnail.getAttribute('src').then((value) => value.match(imgIdRegex)[0]);
    await currentThumbnail.click().then(() => expect(detailedView).toHaveAttribute('src', new RegExp(`(?<=\/)${imageSrc}`)));
  }
});
