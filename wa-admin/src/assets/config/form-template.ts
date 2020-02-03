import { Validators } from '@angular/forms';

/**
 * The formTemplate objects allows the registration form to be configured.
 * Each entry represents a form field, with all the relevant configuration items.
 * Please note that currently only configuration changes of these items are supported,
 * no items may be removed/added to the list (still a work-in-progress).
 */

const formTemplate = [
  {
    type: 'textInput',
    label: 'E-mail Address',
    fieldName: 'email',
    placeholder: 'email@example.com',
    validators: [Validators.required, Validators.email]
  },
  {
    type: 'textInput',
    label: 'First Name',
    fieldName: 'firstName',
    placeholder: 'John',
    validators: [Validators.required]
  },
  {
    type: 'textInput',
    label: 'Last Name',
    fieldName: 'lastName',
    placeholder: 'Doe',
    validators: [Validators.required]
  },
  {
    type: 'radio',
    label: 'Jurisdiction',
    fieldName: 'jurisdiction',
    placeholder: 'Select a jurisdiction',
    validators: [Validators.required],
    options: [
      { value: 'BC', label: 'British Columbia' },
      { value: 'NS', label: 'Nova Scotia' }
    ]
  },
  {
    type: 'radio',
    label: 'Authentication Method',
    fieldName: 'method',
    placeholder: 'Select an authentication method',
    validators: [Validators.required],
    options: [{ value: 'github', logo: 'logo-github' }]
  }
];

export default formTemplate;
