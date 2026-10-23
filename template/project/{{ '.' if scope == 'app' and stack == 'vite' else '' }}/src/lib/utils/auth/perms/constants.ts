export const PERM_ACTIONS = {
    MANAGE: 'manage', // special casl wildcard
    CREATE: 'CREATE',
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
} as const;

export const PERM_SUBJECTS = {
    ALL: 'all', // special casl wildcard
    MERCHANT: 'MERCHANT',
    VOUCHER: 'VOUCHER',
} as const;
