import jwtDecode from 'jwt-decode';

export const TOKEN_KEY = 'ecms@token';

export const login = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const isAuthenticated = () => getToken() !== null;
export const getDecodedToken = () => {
  if (getToken() === null)
    return null;

  return jwtDecode(getToken());
};