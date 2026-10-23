export const defaultParse = <T = string>(value: string | null, fallback: T | null): T | null => {
    if (value === null) {
        return fallback;
    }

    return value as T;
};

export const defaultStringify = (value: string | null) => {
    return value;
};
