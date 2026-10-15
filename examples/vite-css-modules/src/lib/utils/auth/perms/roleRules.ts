import type { RawRuleOf } from '@casl/ability';
import type { AuthRole, UserData } from '@/services/authExample/types';
import type { AppAbility } from './types';
import { ROLES_IDS } from '@/lib/constants';
import { PERM_ACTIONS, PERM_SUBJECTS } from './constants';
import { defineRules } from './defineRules';

type RoleRulesFactory = (user: UserData) => RawRuleOf<AppAbility>[];

export const roleRules: Record<AuthRole, RoleRulesFactory> = {
    [ROLES_IDS.admin]() {
        return defineRules((can) => {
            can(PERM_ACTIONS.MANAGE, PERM_SUBJECTS.ALL);
        });
    },
    [ROLES_IDS.moderator]() {
        return defineRules((can) => {
            can(PERM_ACTIONS.READ, PERM_SUBJECTS.MERCHANT);
        });
    },
    [ROLES_IDS.user]() {
        return defineRules(() => {});
    },
};
