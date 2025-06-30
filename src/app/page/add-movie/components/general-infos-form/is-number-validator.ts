import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '') return null;

    const isValid = !isNaN(value) && /^-?\d+(\.\d+)?$/.test(value.toString().trim());

    return isValid ? null : { isNumber: true };
  };
}