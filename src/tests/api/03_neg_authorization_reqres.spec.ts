import { expect, test } from '@playwright/test'

import { getReqresContext } from 'services/reqresApiContext'
import logger from 'utils/logger'

/*
 * Тестовое задание: негативные сценарии авторизации POST /users публичной песочницы reqres.in.
 * Все /api/* эндпоинты требуют заголовок x-api-key — песочница удобно различает два случая:
 * ключ отсутствует (401 missing_api_key) и ключ присутствует, но недействителен (403 invalid_api_key).
 */

test.describe('POST /users — авторизация', () => {
    test('03.1. Запрос без заголовка x-api-key → 401', async () => {
        logger.info('03.1. Запрос без заголовка x-api-key → 401');

        const apiContext = await getReqresContext();
        const response = await apiContext.post('users', { data: { name: 'morpheus', job: 'leader' } });
        const jsonResponse = await response.json();

        expect(response.status()).toBe(401);
        expect(jsonResponse).toHaveProperty('error', 'missing_api_key');

        logger.info(`Ответ от сервера: ${response.status()}, error="${jsonResponse.error}"`);
        await apiContext.dispose();
    });

    test('03.2. Запрос с недействительным x-api-key → 403', async () => {
        logger.info('03.2. Запрос с недействительным x-api-key → 403');

        const apiContext = await getReqresContext('invalid-key-123');
        const response = await apiContext.post('users', { data: { name: 'morpheus', job: 'leader' } });
        const jsonResponse = await response.json();

        expect(response.status()).toBe(403);
        expect(jsonResponse).toHaveProperty('error', 'invalid_api_key');

        logger.info(`Ответ от сервера: ${response.status()}, error="${jsonResponse.error}"`);
        await apiContext.dispose();
    });
});
