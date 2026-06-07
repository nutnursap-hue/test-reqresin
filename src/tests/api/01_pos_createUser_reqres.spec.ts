import { expect, test } from '@playwright/test'

import { getReqresContext, REQRES_API_KEY } from 'services/reqresApiContext'
import { ReqresCreatedUser } from 'src/services/types'
import logger from 'utils/logger'

/*
 * Тестовое задание: позитивный контракт POST /users на публичной песочнице reqres.in.
 * Эндпоинт ничего не валидирует и всегда отвечает 201, эхо-я переданные поля + { id, createdAt } —
 * это удобный демо-эндпоинт "создания ресурса" для проверки структуры и типов полей ответа.
 */

test.describe('POST /users — позитивный контракт создания ресурса', () => {
    test.skip(!REQRES_API_KEY, 'Не задан REQRES_API_KEY — добавь его в .env.dev');

    test('01. Создание ресурса с валидными данными возвращает 201 и ожидаемую структуру', async () => {
        logger.info('01. Создание ресурса с валидными данными возвращает 201 и ожидаемую структуру');

        const apiContext = await getReqresContext(REQRES_API_KEY);
        const requestBody = { name: 'morpheus', job: 'leader' };
        let jsonResponse: ReqresCreatedUser = { name: '', job: '', id: '', createdAt: '' };

        await test.step('1. Отправляем POST /users с валидными данными', async () => {
            logger.info('1. Отправляем POST /users с валидными данными');

            const response = await apiContext.post('users', { data: requestBody });
            jsonResponse = await response.json();

            expect(response.status()).toBe(201);
            logger.info(`Ответ от сервера: ${response.status()}`);
        });

        await test.step('2. Проверка структуры и типов полей ответа', async () => {
            logger.info('2. Проверка структуры и типов полей ответа');

            expect(jsonResponse).toHaveProperty('name', requestBody.name);
            expect(jsonResponse).toHaveProperty('job', requestBody.job);
            expect(jsonResponse).toHaveProperty('id');
            expect(jsonResponse).toHaveProperty('createdAt');

            expect(typeof jsonResponse.name).toBe('string');
            expect(typeof jsonResponse.job).toBe('string');
            expect(typeof jsonResponse.id).toBe('string');
            expect(typeof jsonResponse.createdAt).toBe('string');
            expect(new Date(jsonResponse.createdAt).toString()).not.toBe('Invalid Date');

            logger.info('Структура и типы полей ответа соответствуют ожиданиям');
        });

        await apiContext.dispose();
    });
});
