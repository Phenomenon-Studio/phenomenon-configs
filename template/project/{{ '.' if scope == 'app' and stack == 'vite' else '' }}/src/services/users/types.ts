import type { AuthRole } from '@/services/authExample/types';

export type UserHair = {
    color: string;
    type: string;
};

export type UserCoordinates = {
    lat: number;
    lng: number;
};

export type UserAddress = {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: UserCoordinates;
    country: string;
};

export type UserBank = {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
};

export type UserCompany = {
    department: string;
    name: string;
    title: string;
    address: UserAddress;
};

export type UserCrypto = {
    coin: string;
    wallet: string;
    network: string;
};

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: UserHair;
    ip: string;
    address: UserAddress;
    macAddress: string;
    university: string;
    bank: UserBank;
    company: UserCompany;
    ein: string;
    ssn: string;
    userAgent: string;
    crypto: UserCrypto;
    role: AuthRole;
};

export type UsersData = {
    users: User[];
    total: number;
    skip: number;
    limit: number;
};
