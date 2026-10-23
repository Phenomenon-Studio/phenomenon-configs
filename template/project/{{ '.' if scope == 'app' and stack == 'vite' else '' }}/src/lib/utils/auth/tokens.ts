import { LS_AUTH_TOKEN_KEY, LS_REFRESH_TOKEN_KEY } from '@/lib/constants';

export const setAuthToken = (token: string) => {
    localStorage.setItem(LS_AUTH_TOKEN_KEY, token);
};

export const getAuthToken = () => {
    return localStorage.getItem(LS_AUTH_TOKEN_KEY);
};

export const removeAuthToken = () => {
    localStorage.removeItem(LS_AUTH_TOKEN_KEY);
};

export const setRefreshToken = (token: string) => {
    localStorage.setItem(LS_REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = () => {
    return localStorage.getItem(LS_REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = () => {
    localStorage.removeItem(LS_REFRESH_TOKEN_KEY);
};
