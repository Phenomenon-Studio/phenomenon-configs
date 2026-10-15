import type { StateClassName } from '@/lib/types';

export const resolveClassName = <TState>(className: StateClassName<TState>, state: TState) => {
    return typeof className === 'function' ? className(state) : className;
};
