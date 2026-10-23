import { useMediaQuery } from '@react-hookz/web';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
    const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    return isMobile ?? false;
}
