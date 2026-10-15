import type { Options } from 'ky';
import ky from 'ky';
import { refreshAccessTokenAndRetry } from './utils/auth/errorHandler';
import { getAuthToken } from './utils/auth/tokens';

export interface OptionsWithTypedJson<TJson> extends Options {
    json: TJson;
}

export interface OptionsWithTypedBody<TBody extends BodyInit | null | undefined> extends Options {
    body: TBody;
}

// TODO: The API error messages should be aligned with BE engineers
// NOTE: Should be used like `HTTPError<BaseErrorData>`
export type BaseErrorData<TData = unknown> = { message: string } & TData;

export const http = ky.create({
    prefix: import.meta.env.VITE_API_URL,
    timeout: false,
    retry: 0,
});

export let httpPrivate = http.extend({
    hooks: {
        beforeRequest: [
            ({ request }) => {
                const token = getAuthToken();
                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`);
                }
            },
        ],
    },
    credentials: 'include',
});
httpPrivate = httpPrivate.extend({
    hooks: {
        afterResponse: [refreshAccessTokenAndRetry(httpPrivate)],
    },
});
