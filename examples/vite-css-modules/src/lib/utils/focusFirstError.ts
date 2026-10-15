import type { StandardSchemaV1Issue } from '@tanstack/react-form';

export const focusFirstError = (formSelector: string, errorMap?: Record<string, StandardSchemaV1Issue[]>) => {
    if (!errorMap) {
        return;
    }
    const invalidInputs = [...document.querySelectorAll(`${formSelector} [aria-invalid="true"]`)] as HTMLInputElement[];
    let firstInvalidInput: HTMLInputElement | undefined;
    for (const input of invalidInputs) {
        if (errorMap[input.name]) {
            firstInvalidInput = input;
            break;
        }
    }
    firstInvalidInput?.focus();
};
