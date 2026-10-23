import type { MutationFunction, MutationKey, MutationOptions, QueryKey } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type { BaseErrorData } from '@/lib/@http';
import { useMutation } from '@tanstack/react-query';

type OptimisticProps<TData, TError, TVariables, TQueryFnData> = {
    mutationKey: MutationKey;
    mutationFn: MutationFunction<TData, TVariables>;
    queryKey: QueryKey;
    updater: (variables: TVariables) => (input: TQueryFnData | undefined) => TQueryFnData | undefined;
    invalidates: QueryKey[];
} & Omit<MutationOptions<TData, TError, TVariables>, 'mutationKey' | 'mutationFn' | 'onMutate' | 'onSettled'>;

export const useOptimisticMutation = <
    TData = unknown,
    TError = HTTPError<BaseErrorData>,
    TVariables = void,
    TQueryFnData = unknown,
>({
    mutationKey,
    mutationFn,
    queryKey,
    updater,
    invalidates,
    ...rest
}: OptimisticProps<TData, TError, TVariables, TQueryFnData>) => {
    return useMutation({
        ...rest,
        mutationKey,
        mutationFn,
        async onMutate(variables, { client }) {
            await client.cancelQueries({
                queryKey,
            });
            const querySnapshot = client.getQueryData(queryKey);
            client.setQueryData(queryKey, updater(variables));
            return () => {
                client.setQueryData(queryKey, querySnapshot);
            };
        },
        onError(error, variables, onMutateResult, context) {
            rest?.onError?.(error, variables, onMutateResult, context);
            onMutateResult?.();
        },
        onSettled(_data, _error, _variables, _onMutateResult, { client, mutationKey }) {
            if (client.isMutating({ mutationKey }) === 1) {
                invalidates.forEach((invalidate) => {
                    client.invalidateQueries({
                        queryKey: invalidate,
                    });
                });
            }
        },
    });
};
