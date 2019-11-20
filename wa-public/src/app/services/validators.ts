import { AbstractControl } from '@angular/forms';

export function phoneNumberValidator() {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = !/^^[\+]?[0-9]{1,3}[ ][(]?[0-9]{3}[)]?[ ][-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gim.test(
      control.value
    );
    return forbidden
      ? { invalid: { value: `${control.value} is not valid` } }
      : null;
  };
}

export function postalCodeValidator() {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(
      control.value
    );
    return forbidden
      ? { invalid: { value: `${control.value} is not valid` } }
      : null;
  };
}
