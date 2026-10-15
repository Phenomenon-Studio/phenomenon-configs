export const LS_AUTH_TOKEN_KEY = '<appName>_ADMIN_AuthToken';
export const LS_REFRESH_TOKEN_KEY = '<appName>_ADMIN_RefreshToken';
// NOTE: Don't forget to change theme name in the index.html
export const LS_THEME_KEY = '<appName>_ADMIN_Theme';
export const ONE_SECOND = 1_000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const COMMON_ERROR_MESSAGE = 'Uh-oh, something went wrong.';
export const FALLBACK_REDIRECT = '/dashboard' as const;
export const ROLES_IDS = {
    admin: 'admin',
    moderator: 'moderator',
    user: 'user',
} as const;
