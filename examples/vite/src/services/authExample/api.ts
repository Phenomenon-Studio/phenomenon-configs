import type { Options } from 'ky';
import type { OptionsWithTypedJson } from '@/lib/@http';
import type {
    LoginData,
    LoginRequestData,
    RefreshAccessTokenRequestData,
    ResfreshAccessTokenData,
    UserData,
} from './types';
import { http, httpPrivate } from '@/lib/@http';

// Example with JSON:
// export const doSomethingWithJSON = async (options: OptionsWithTypedJson<SomeData>) => {
//     const res = await httpPrivate.post<SomeResultData>('api/do', options);
//     return res.json();
// };

// Example with FormData:
// export const doSomethingWithFormData = async (options: OptionsWithTypedBody<SomeData>) => {
//     const res = await httpPrivate.post<SomeResultData>('api/do', options);
//     return res.json();
// };

export const login = async (options: OptionsWithTypedJson<LoginRequestData>) => {
    const res = await http.post<LoginData>('auth/login', { credentials: 'include', ...options });
    return res.json();
};

export const logout = () => {
    return Promise.resolve(true);
};

export const refreshAccessToken = async (options?: OptionsWithTypedJson<RefreshAccessTokenRequestData>) => {
    const res = await http.post<ResfreshAccessTokenData>('auth/refresh', { credentials: 'include', ...options });
    return res.json();
};

export const me = async (options?: Options) => {
    const res = await httpPrivate.get<UserData>('auth/me', options);
    return res.json();
};
