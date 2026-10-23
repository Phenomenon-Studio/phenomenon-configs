import type { ToastState } from '../types';
import { TOAST_TRANSFORMS } from '../constants';

export const getToastTransform = ({ expanded, limited, transitionStatus, swipeDirection }: ToastState) => {
    if (transitionStatus === 'starting') {
        return TOAST_TRANSFORMS.offscreen;
    }

    if (transitionStatus === 'ending') {
        if (swipeDirection) {
            return TOAST_TRANSFORMS[swipeDirection];
        }

        // NOTE: Limited toasts fade out in place (see `data-limited:opacity-0`) instead of sliding away.
        if (!limited) {
            return TOAST_TRANSFORMS.offscreen;
        }
    }

    return expanded ? TOAST_TRANSFORMS.expanded : TOAST_TRANSFORMS.stacked;
};
