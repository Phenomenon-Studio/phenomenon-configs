import { useMutation } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { isHTTPError } from 'ky';
import { FALLBACK_REDIRECT } from '@/lib/constants';
import { focusFirstError } from '@/lib/utils/focusFirstError';
import { loginMutationOptions } from '@/services/authExample/queries';
import { useAppForm } from '@/components/Form';
import { Button } from '@/components/ui/Button';
import { Field, FieldGroup, FieldSet } from '@/components/ui/Field';
import { toast } from '@/components/ui/Toast';
import { loginSchema } from './schemas';
import s from './styles.module.css';

const routeApi = getRouteApi('/_unauthenticated/login/');

function LoginForm() {
    const navigate = routeApi.useNavigate();
    const redirectSearch = routeApi.useSearch({
        select({ redirect }) {
            return redirect;
        },
    });
    const { mutateAsync: login } = useMutation(loginMutationOptions());

    const form = useAppForm({
        defaultValues: {
            username: '',
            password: '',
        },
        validators: {
            onSubmit: loginSchema,
        },
        async onSubmit({ value, formApi }) {
            await login(
                {
                    json: {
                        ...value,
                        // NOTE: For testing purposes, set expiresInMins to 1 minute
                        expiresInMins: 1,
                    },
                },
                {
                    onSuccess() {
                        navigate({
                            to: redirectSearch || FALLBACK_REDIRECT,
                            replace: true,
                        });
                    },
                    onError(error) {
                        if (isHTTPError(error) && typeof error.data === 'object') {
                            formApi.setErrorMap({
                                onSubmit: {
                                    fields: {
                                        // TODO: The API error messages should be aligned with BE engineers
                                        username: {
                                            message: error.data.message,
                                        },
                                        password: {
                                            message: error.data.message,
                                        },
                                    },
                                },
                            });
                        } else {
                            toast.add({ type: 'error', title: error.message });
                        }
                    },
                }
            );
        },
        onSubmitInvalid({ formApi }) {
            focusFirstError('#login-form', formApi.state.errorMap.onSubmit);
        },
    });

    return (
        <div className={s.wrap}>
            <div className={s.header}>
                <h1 className={s.title}>Welcome back</h1>
                <p className={s.subtitle}>Login to your account</p>
            </div>
            <form
                id="login-form"
                noValidate={true}
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <FieldSet>
                    <FieldGroup>
                        <form.AppField
                            name="username"
                            children={(field) => {
                                return (
                                    <field.FormFieldWrapper label="Username">
                                        <field.InputField placeholder="emilys" autoComplete="username" />
                                    </field.FormFieldWrapper>
                                );
                            }}
                        />
                        <form.AppField
                            name="password"
                            children={(field) => {
                                return (
                                    <field.FormFieldWrapper
                                        labelClassName={s['password-label']}
                                        label={
                                            <>
                                                Password{' '}
                                                <Link to="/login" className={s.forgot}>
                                                    Forgot your password?
                                                </Link>
                                            </>
                                        }
                                    >
                                        <field.PasswordInputField placeholder="Enter password" />
                                    </field.FormFieldWrapper>
                                );
                            }}
                        />
                        <Field>
                            <form.Subscribe
                                selector={(state) => {
                                    return [state.canSubmit, state.isSubmitting];
                                }}
                                children={([canSubmit, isSubmitting]) => {
                                    return (
                                        <Button
                                            type="submit"
                                            className={s.submit}
                                            disabled={!canSubmit}
                                            isLoading={isSubmitting}
                                        >
                                            Login
                                        </Button>
                                    );
                                }}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </form>
        </div>
    );
}

export { LoginForm };
