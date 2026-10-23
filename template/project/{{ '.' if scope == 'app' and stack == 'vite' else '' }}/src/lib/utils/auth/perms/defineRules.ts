import type { RawRuleOf } from '@casl/ability';
import type { AppAbility } from './types';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';

type DefineRulesCallback = (can: AbilityBuilder<AppAbility>['can']) => void;

export const defineRules = (define: DefineRulesCallback): RawRuleOf<AppAbility>[] => {
    const builder = new AbilityBuilder<AppAbility>(createMongoAbility);

    define(builder.can);

    return builder.rules;
};
