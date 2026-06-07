import { expect, test } from '@playwright/test'

import { getReqresContext, REQRES_API_KEY } from 'services/reqresApiContext'
import { generateIdempotencyKey } from 'utils/valueGenerator'
import logger from 'utils/logger'

/*
 * Тестовое задание: эмуляция идемпотентности POST /users публичной песочницы reqres.in —
 * отправляем 3 идентичных запроса с одним и тем же X-Idempotency-Key.
 */

test.describe('POST /users — эмуляция идемпотентности (X-Idempotency-Key)', () => {
    test.skip(!REQRES_API_KEY, 'Не задан REQRES_API_KEY — добавь его в .env.dev');

    test('04. Три идентичных запроса с одним X-Idempotency-Key', async () => {
        logger.info('04. Три идентичных запроса с одним X-Idempotency-Key');

        const idempotencyKey = generateIdempotencyKey();
        const requestBody = { name: 'idempotency-probe', job: 'qa' };
        const ids: string[] = [];

        for (let attempt = 1; attempt <= 3; attempt += 1) {
            await test.step(`Запрос #${attempt} с X-Idempotency-Key=${idempotencyKey}`, async () => {
                logger.info(`Запрос #${attempt} с X-Idempotency-Key=${idempotencyKey}`);

                const apiContext = await getReqresContext(REQRES_API_KEY);
                const response = await apiContext.post('users', {
                    data: requestBody,
                    headers: { 'X-Idempotency-Key': idempotencyKey },
                });
                const jsonResponse = await response.json();
                ids.push(jsonResponse.id);

                expect(response.status()).toBe(201);
                logger.info(`Ответ #${attempt}: status=${response.status()}, id=${jsonResponse.id}`);

                await apiContext.dispose();
            });
        }

        /*
         * Контракт идемпотентности для реального бэкенда StarPets выглядел бы так:
         *   1) Все три ответа обязаны быть идентичны (тот же статус, то же тело и id) — сервер
         *      должен закэшировать результат первого запроса по X-Idempotency-Key
         *      и отдавать именно его при повторах, не создавая новый ресурс.
         *   2) В системе должен реально появиться ровно один новый ресурс — это можно проверить
         *      косвенно (например, total в листинге вырос на 1, а не на 3, либо повторный
         *      GET по id из всех трёх ответов возвращает одну и ту же запись).
         *   3) Повтор с тем же ключом, но ДРУГИМ телом запроса — ошибка клиента (как правило
         *      409 Conflict): ключ обязан однозначно
         *      идентифицировать конкретную операцию, а не произвольное тело.
         *
         * reqres.in — песочница и не реализует X-Idempotency-Key: каждый вызов создаёт
         * условно "новый" ресурс со своим id, несмотря на одинаковые тело и заголовок
         * (см. три разных id в логах выше). Поэтому ниже мы фиксируем фактическое поведение
         * песочницы, а не "правильное" поведение бэкенда — иначе тест был бы постоянно
         * красным не по вине тестируемого кода.
         */
        logger.info(`Получены id для одного и того же X-Idempotency-Key: ${ids.join(', ')}`);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
