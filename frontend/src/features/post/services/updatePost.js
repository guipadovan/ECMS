export const updatePost = (axiosPrivate, postId, values) => {
  return axiosPrivate.put('/post/' + postId + '/update', {
    title: values.title,
    subtitle: values.subtitle,
    text: JSON.stringify(values.text),
    locked: values.locked,
  });
}

export const deletePost = (axiosPrivate, postId) => {
  return axiosPrivate.delete('/post/' + postId + '/delete', {
    postId: postId,
  });
}

export const switchPostLock = (axiosPrivate, postId) => {
  return axiosPrivate.put('/post/' + postId + '/switch-lock', {
    postId: postId,
  });
}