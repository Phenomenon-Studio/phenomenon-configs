import type { Options } from 'ky';
import type { User, UsersData } from './types';
import { httpPrivate } from '@/lib/@http';

export const getUsers = async (options?: Options) => {
    const res = await httpPrivate.get<UsersData>('users', options);
    return res.json();
};

export const getUser = async (id: number, options?: Options) => {
    const res = await httpPrivate.get<User>(`users/${id}`, options);
    return res.json();
};
