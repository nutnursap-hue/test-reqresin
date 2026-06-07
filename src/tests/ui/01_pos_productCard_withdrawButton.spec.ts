import { expect, test } from 'fixtures/ProductCardFixture'

import logger from 'utils/logger'

/*
 * Каркас UI-теста: динамическая карточка товара, кнопка «Вывести» появляется
 * асинхронно — после того как фронт получит push-сообщение по WebSocket, а не
 * сразу по клику. Тест намеренно не завязан на тайминги — вся синхронизация идёт
 * через web-first assertions внутри ProductCardPage.waitForWithdrawAvailable().
 */

test.describe('Карточка товара — динамическое появление кнопки «Вывести»', () => {
    test('01. Кнопка «Вывести» появляется после ответа WebSocket без хардкодных задержек', async ({ productCardPage }) => {
        logger.info('01. Кнопка «Вывести» появляется после ответа WebSocket без хардкодных задержек');

        await test.step('1. Открываем карточку товара', async () => {
            logger.info('1. Открываем карточку товара');

            await productCardPage.open('demo-product-id');
            await expect(productCardPage.withdrawButton).toBeHidden();
        });

        await test.step('2. Инициируем покупку — сервер присылает подтверждение по WebSocket', async () => {
            logger.info('2. Инициируем покупку — сервер присылает подтверждение по WebSocket');

            await productCardPage.buy();
        });

        await test.step('3. Дожидаемся появления кнопки «Вывести» (асинхронно, без waitForTimeout)', async () => {
            logger.info('3. Дожидаемся появления кнопки «Вывести» (асинхронно, без waitForTimeout)');

            await productCardPage.waitForWithdrawAvailable();
        });

        await test.step('4. Кнопка доступна для взаимодействия', async () => {
            logger.info('4. Кнопка доступна для взаимодействия');

            await productCardPage.withdraw();
        });
    });
});
