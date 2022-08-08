export const deleteUser = (axiosPrivate, userId) => {
  return axiosPrivate.delete('/user/' + userId + '/delete', {
    userId: userId,
  });
}