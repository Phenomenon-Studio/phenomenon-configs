import type { AppRouteId } from '@/lib/types';
import type { AppAbility } from '@/lib/utils/auth/perms/types';
import { AbilityProvider, useAbility } from '@casl/react';
import { useRouteContext } from '@tanstack/react-router';

type PermsProviderProps = {
    from: Extract<AppRouteId, '/_authenticated' | '/_public'>;
    children: React.ReactNode;
};

function PermsProvider({ from, children }: PermsProviderProps) {
    const ability = useRouteContext({
        from,
        select(context) {
            return context.ability;
        },
    });

    return <AbilityProvider value={ability}>{children}</AbilityProvider>;
}

const usePerms = () => {
    const ability = useAbility<AppAbility>();

    return ability;
};

export { PermsProvider, usePerms };
