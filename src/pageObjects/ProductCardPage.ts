import { expect, Locator, Page } from '@playwright/test';

import { UiRoutesProduct } from 'config/ui/uiRoutesProduct';

export class ProductCardPage {
    readonly page: Page;
    readonly card: Locator;
    readonly buyButton: Locator;
    readonly withdrawButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // data-testid
        this.card = page.getByTestId('product-card');
        this.buyButton = this.card.getByTestId('buy-button');
        this.withdrawButton = this.card.getByTestId('withdraw-button');
    }

    async open(productId: string): Promise<void> {
        await this.page.goto(`${UiRoutesProduct.PRODUCT_CARD}/${productId}`);
        await expect(this.card).toBeVisible();
    }

    async buy(): Promise<void> {
        await this.buyButton.click();
    }

    /**
     * Кнопка «Вывести» рендерится только после того, как фронт получит push-событие по
     * WebSocket (например, "purchase:confirmed"), а не сразу после клика по «Купить».
     * web-first assertion сама опрашивает DOM с интервалом до выполнения условия или
     * истечения таймаута — никаких page.waitForTimeout() и фиксированных задержек.
     *
     * Более строгий вариант синхронизации — дождаться самого сообщения по сокету, а не
     * только итогового состояния DOM (полезно, если нужно дополнительно сверить payload)
     * 
     * Для проверки самого факта появления кнопки в каркасе достаточно web-first assertion —
     * она уже инкапсулирует ожидание любого асинхронного источника изменения DOM.
     */
    async waitForWithdrawAvailable(): Promise<void> {
        await expect(this.withdrawButton).toBeVisible();
        await expect(this.withdrawButton).toBeEnabled();
    }

    async withdraw(): Promise<void> {
        await this.withdrawButton.click();
    }
}
