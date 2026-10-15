import type { RegisteredRouter, RouteIds } from '@tanstack/react-router';

export type ObjKeys<TObj> = keyof TObj;

export type ObjValues<TObj> = TObj[ObjKeys<TObj>];

export type Filters = Record<string, string | number | boolean>;

export type AppRouteId = RouteIds<RegisteredRouter['routeTree']>;

export type StateClassName<TState> = string | ((state: TState) => string | undefined) | undefined;
