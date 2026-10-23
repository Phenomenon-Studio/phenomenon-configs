import { useLayoutEffect } from 'react';

export const useRemoveInitialStyle = () => {
    useLayoutEffect(function removeInitialStyle() {
        document.getElementById('initial-style')?.remove();
    }, []);
};
