export const getNameInitials = (name: string, maxLength = 2) => {
    return name
        .trim()
        .split(' ')
        .map((word) => {
            return word.charAt(0);
        })
        .join('')
        .toUpperCase()
        .slice(0, maxLength);
};
