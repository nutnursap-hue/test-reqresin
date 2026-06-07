import { test as base } from '@playwright/test';

import { ProductCardPage } from 'pageObjects/ProductCardPage';

type UIFixtures = {
    productCardPage: ProductCardPage;
}

export const test = base.extend<UIFixtures>({
    productCardPage: async ({ page }, use) => {
        await use(new ProductCardPage(page));
    },
})

export { expect } from '@playwright/test';
