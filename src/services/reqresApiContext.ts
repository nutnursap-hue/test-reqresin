import { APIRequestContext, request } from '@playwright/test';

export const REQRES_BASE_URL = 'https://reqres.in/api/';
export const REQRES_API_KEY = process.env.REQRES_API_KEY;

export const getReqresContext = (apiKey?: string): Promise<APIRequestContext> => request.newContext({
    baseURL: REQRES_BASE_URL,
    extraHTTPHeaders: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
    },
});
