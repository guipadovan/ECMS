const addPostRequest = (axiosPrivate, values) => {
  return axiosPrivate.post('/post/new', {
    title: values.title,
    subtitle: values.subtitle,
    text: JSON.stringify(values.text),
    locked: values.locked,
  });
}

export const addPost = (axiosPrivate, values, actions, navigate) => {
  addPostRequest(axiosPrivate, values)
    .then(res => {
      actions.resetForm();
      actions.setSubmitting(false);
      navigate('/post/' + res.data.id);
    })
    .catch(() => {
      actions.setSubmitting(false);
    });
}