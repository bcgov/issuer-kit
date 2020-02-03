import { Validators } from '@angular/forms';

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
