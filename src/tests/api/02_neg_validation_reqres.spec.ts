import { expect, test } from '@playwright/test'

import { getReqresContext, REQRES_API_KEY } from 'services/reqresApiContext'
import logger from 'utils/logger'

/*
 * Тестовое задание: негативные сценарии валидации на POST /register публичной песочницы reqres.in.
 * В отличие от POST /users, этот эндпоинт реально проверяет тело запроса и возвращает разные
 * сообщения об ошибке для "поля нет" и "поле есть, но данные не подходят".
 */

test.describe('POST /register — негативные сценарии валидации данных', () => {
    test.skip(!REQRES_API_KEY, 'Не задан REQRES_API_KEY — добавь его в .env.dev');

    test('02.1. Запрос без обязательного поля password → 400 с ожидаемой ошибкой', async () => {
        logger.info('02.1. Запрос без обязательного поля password → 400 с ожидаемой ошибкой');

        const apiContext = await getReqresContext(REQRES_API_KEY);
        const response = await apiContext.post('register', {
            data: { email: 'eve.holt@reqres.in' },
        });
        const jsonResponse = await response.json();

        expect(response.status()).toBe(400);
        expect(jsonResponse).toHaveProperty('error', 'Missing password');

        logger.info(`Ответ от сервера: ${response.status()}, error="${jsonResponse.error}"`);
        await apiContext.dispose();
    });

    test('02.2. Запрос без обязательных полей (пустое тело) → 400 с ожидаемой ошибкой', async () => {
        logger.info('02.2. Запрос без обязательных полей (пустое тело) → 400 с ожидаемой ошибкой');

        const apiContext = await getReqresContext(REQRES_API_KEY);
        const response = await apiContext.post('register', { data: {} });
        const jsonResponse = await response.json();

        expect(response.status()).toBe(400);
        expect(jsonResponse).toHaveProperty('error', 'Missing email or username');

        logger.info(`Ответ от сервера: ${response.status()}, error="${jsonResponse.error}"`);
        await apiContext.dispose();
    });

    test('02.3. Запрос с невалидными данными (незарегистрированный email) → 400 с ожидаемой ошибкой', async () => {
        logger.info('02.3. Запрос с невалидными данными (незарегистрированный email) → 400 с ожидаемой ошибкой');

        const apiContext = await getReqresContext(REQRES_API_KEY);
        const response = await apiContext.post('register', {
            data: { email: 'random.unknown.user@example.com', password: 'pistol' },
        });
        const jsonResponse = await response.json();

        expect(response.status()).toBe(400);
        expect(jsonResponse).toHaveProperty('error', 'Note: Only defined users succeed registration');

        logger.info(`Ответ от сервера: ${response.status()}, error="${jsonResponse.error}"`);
        await apiContext.dispose();
    });
});
