import { lazy } from 'react';
import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './context/FormContext';
import { FormFieldWrapper } from './components/FormFieldWrapper';
import { InputField } from './components/InputField';

// NOTE: Tree-shaking field components if needed
const PasswordInputField = lazy(async () => {
    const res = await import('./components/PasswordInputField');

    return {
        default: res.PasswordInputField,
    };
});

const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        FormFieldWrapper,
        InputField,
        PasswordInputField,
    },
    formComponents: {},
});

export { useAppForm, withForm, withFieldGroup };
