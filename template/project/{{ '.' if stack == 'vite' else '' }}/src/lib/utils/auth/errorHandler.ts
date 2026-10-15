import type { AfterResponseHook, KyInstance } from 'ky';
import { queryClient } from '@/lib/@queryClient';
import { refreshAccessToken } from '@/services/authExample/api';
import { getRefreshToken, removeAuthToken, removeRefreshToken, setAuthToken, setRefreshToken } from './tokens';

let isRedirecting = false;
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (reason?: any) => void;
}> = [];

const handleFailedQueue = (error: unknown | null) => {
    failedQueue.forEach((item) => {
        if (error) {
            item.reject(error);
        } else {
            item.resolve(true);
        }
    });
    failedQueue = [];
};

const cleanUpAndRedirectToLogin = () => {
    removeAuthToken();
    removeRefreshToken();
    queryClient.clear();
    if (!isRedirecting) {
        isRedirecting = true;
        const redirectPath = `${window.location.pathname}${window.location.search}`;
        const url = new URL(`${window.location.origin}/login`);
        url.searchParams.set('redirect', redirectPath);
        window.location.replace(url);
    }
};

export const refreshAccessTokenAndRetry = (instance: KyInstance): AfterResponseHook => {
    return async ({ request, response }) => {
        if (response.status !== 401) {
            return response;
        }
        const originalRequest = request.clone();
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                });
            })
                .then(() => {
                    return instance(originalRequest);
                })
                .catch((error) => {
                    return error;
                });
        }
        isRefreshing = true;
        const currentRefreshToken = getRefreshToken();
        if (!currentRefreshToken) {
            cleanUpAndRedirectToLogin();
            return response;
        }
        try {
            const data = await refreshAccessToken({
                json: {
                    refreshToken: currentRefreshToken,
                    // NOTE: For testing purposes, set expiresInMins to 1 minute
                    expiresInMins: 1,
                },
            });
            setAuthToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            isRefreshing = false;
            handleFailedQueue(null);
            return instance(originalRequest);
        } catch (error) {
            isRefreshing = false;
            handleFailedQueue(error);
            cleanUpAndRedirectToLogin();
            return error;
        }
    };
};
