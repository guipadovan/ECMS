import apiPrivate from '../../../services/axios';
import jwtDecode from 'jwt-decode';

const loginRequest = async (values) => {
  return await apiPrivate.post('/auth/login', {
    username: values.username,
    password: values.password,
    rememberMe: values.rememberMe,
  });
}

export const login = (values, setAuth, navigate, actions, setAlert) => {
  loginRequest(values)
    .then(response => {
      setAuth({user: jwtDecode(response.data.token), token: response.data.token});
      navigate('/app/profile');
    })
    .catch(error => {
      actions.setSubmitting(false);

      const errorAlert = (description) =>
        setAlert({
          open: true,
          type: 'error',
          title: 'Error!',
          description: description,
        });

      actions.setSubmitting(false);
      if (error && error.response)
        errorAlert(error.response.data.message);
      else
        errorAlert('Something went wrong');
    });
}