import { useEffect } from 'react';

export const useSetRootCustomProperty = (name: string, value?: string) => {
    useEffect(
        function setCutomProperty() {
            if (value) {
                document.documentElement.style.setProperty(name, value);
            } else {
                document.documentElement.style.removeProperty(name);
            }
        },
        [name, value]
    );
};
