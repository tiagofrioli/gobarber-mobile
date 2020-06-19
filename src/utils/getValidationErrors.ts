import { ValidationError } from 'yup';

interface Errors {
  [keyObject: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  // percorre o array inner de validationErrors
  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
