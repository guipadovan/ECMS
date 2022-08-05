import apiPrivate from '../../../services/axios';

const registerRequest = async (values) => {
  return await apiPrivate.post('/auth/register', {
    username: values.username,
    email: values.email,
    password: values.password,
    confirmPassword: values.confirmPassword,
  });
}

export const register = (values, actions, setAlert) => {
  registerRequest(values)
    .then(() => {
      actions.resetForm();
      actions.setSubmitting(false);
      setAlert({
        open: true,
        type: 'success',
        title: 'Success! Confirmation email sent',
        description: 'To complete your registration confirm your account.',
      });
    })
    .catch(error => {
      actions.setSubmitting(false);

      const errorAlert = () =>
        setAlert({
          open: true,
          type: 'error',
          title: 'Error!',
          description: 'Something went wrong, please try again later.',
        });

      if (error && error.response) {
        if (error.response.data.message.includes('Username'))
          actions.setErrors({username: error.response.data.message});
        else if (error.response.data.message.includes('Email'))
          actions.setErrors({email: error.response.data.message});
        else
          errorAlert();
      } else
        errorAlert();
    });
}