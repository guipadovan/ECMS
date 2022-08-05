import * as Yup from 'yup';

export const validateLogin = Yup.object({
  username: Yup.string()
    .min(4, 'Username must be at least 4 characters')
    .max(16, 'Username must be 16 characters or less')
    .test('has-text',
      () => 'Username is required',
      (value) => {
        if (value === undefined)
          return true;
        return value.trim().length !== 0;
      })
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .test('has-text',
      () => 'Password is required',
      (value) => {
        if (value === undefined)
          return true;
        return value.trim().length !== 0;
      })
    .required('Password is required'),
});

export const validateRegister = Yup.object({
  username: Yup.string()
    .min(4, 'Username must be at least 4 characters')
    .max(16, 'Username must be 16 characters or less')
    .test('has-text',
      () => 'Username is required',
      (value) => {
        if (value === undefined)
          return true;
        return value.trim().length !== 0;
      })
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email')
    .test('has-text',
      () => 'Email is required',
      (value) => {
        if (value === undefined)
          return true;
        return value.trim().length !== 0;
      })
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Password must have numbers and letters')
    .test('has-text',
      () => 'Password is required',
      (value) => {
        if (value === undefined)
          return true;
        return value.trim().length !== 0;
      })
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .test('has-text',
      () => 'Confirm password is required',
      (value) => {
        if (value === undefined)
          return true;
        return value.trim().length !== 0;
      })
    .required('Confirm password is required'),
});