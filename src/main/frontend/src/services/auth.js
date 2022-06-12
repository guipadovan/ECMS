import jwtDecode from 'jwt-decode';

export const TOKEN_KEY = 'auth-token';
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser = () => {
  if (getToken() === null)
    return null;

  return jwtDecode(getToken());
};
export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};