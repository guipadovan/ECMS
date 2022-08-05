const addCommentRequest = async (axiosPrivate, id, values) => {
  return await axiosPrivate.post('/post/' + id + '/comment', {
    comment: JSON.stringify(values.comment),
  });
}

export const addComment = (axiosPrivate, id, values, actions, getPost) => {
  return addCommentRequest(axiosPrivate, id, values)
    .then(() => {
      actions.resetForm();
      actions.setSubmitting(false);
      getPost();
    })
    .catch(() => {
      actions.setSubmitting(false);
    })
}