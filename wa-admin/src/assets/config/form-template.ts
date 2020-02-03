import { Validators } from '@angular/forms';

const formTemplate = [
  {
    type: 'textInput',
    label: 'E-mail Address',
    placeholder: 'email@example.com',
    validators: [Validators.required, Validators.email]
  },
  {
    type: 'textInput',
    label: 'First Name',
    placeholder: 'John',
    validators: [Validators.required]
  },
  {
    type: 'textInput',
    label: 'Last Name',
    placeholder: 'Doe',
    validators: [Validators.required]
  },
  {
    type: 'radio',
    label: 'Jurisdiction',
    placeholder: 'Select a jurisdiction',
    validators: [Validators.required],
    options: [
      { value: 'BC', label: 'British Columbia' },
      { value: 'NS', label: 'Nova Scotia' }
    ]
  },
  {
    type: 'radio',
    label: 'method',
    placeholder: 'Select an authentication method',
    validators: [Validators.required],
    options: [{ value: 'GitHub', logo: 'logo-github' }]
  }
];

export default formTemplate;
