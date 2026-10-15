import type { UserData } from '@/services/authExample/types';
import type { AppAbility } from './types';
import { createMongoAbility } from '@casl/ability';
import { roleRules } from './roleRules';

export const createAppAbility = (user?: UserData) => {
    return createMongoAbility<AppAbility>(user && roleRules[user.role] ? roleRules[user.role](user) : []);
};
