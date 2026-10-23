import type { ROLES_IDS } from '@/lib/constants';
import type { ObjValues } from '@/lib/types';

export type AuthRole = ObjValues<typeof ROLES_IDS>;

export type UserData = {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    role: AuthRole;
};

export type AuthenticatedState = {
    isAuthenticated: true;
    me: UserData;
};

export type UnauthenticatedState = {
    isAuthenticated: false;
    me: null;
};

export type AuthContext = AuthenticatedState | UnauthenticatedState;

export type RefreshAccessTokenRequestData = {
    refreshToken: string;
    // NOTE: For testing purposes, set expiresInMins to 1 minute
    expiresInMins?: number;
};

export type ResfreshAccessTokenData = { refreshToken: string; accessToken: string };

export type LoginRequestData = {
    username: UserData['username'];
    password: string;
    // NOTE: For testing purposes, set expiresInMins to 1 minute
    expiresInMins?: number;
};

export type LoginData = UserData & ResfreshAccessTokenData;
