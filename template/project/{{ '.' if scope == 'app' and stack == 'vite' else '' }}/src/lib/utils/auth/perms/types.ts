import type { MongoAbility } from '@casl/ability';
import type { ObjValues } from '@/lib/types';
import type { PERM_ACTIONS, PERM_SUBJECTS } from './constants';

export type Actions = ObjValues<typeof PERM_ACTIONS>;

export type SubjectName = ObjValues<typeof PERM_SUBJECTS>;

export type Subjects = SubjectName;

export type AppAbility = MongoAbility<[Actions, Subjects]>;
