import jwtDecode from 'jwt-decode';

export const TOKEN_KEY = 'ecms@token';
export const USER_KEY = 'ecms@user';
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getDecodedToken = () => {
  if (getToken() === null)
    return null;

  return jwtDecode(getToken());
};
export const getUser = () => {
  return localStorage.getItem(USER_KEY);
}
export const login = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, user);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
};