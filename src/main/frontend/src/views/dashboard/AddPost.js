import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useNavigate} from 'react-router';
import {addPost, PostForm} from '../../features/post';
import {Card} from '../../features/dashboard';

const AddPost = () => {

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const defaultValues = {
    title: '',
    subtitle: '',
    text: [
      {
        type: 'paragraph',
        children: [{text: ''}],
      },
    ],
    locked: false,
  };

  return (
    <Card label={'New Post'}>
      <PostForm defaultValues={defaultValues} submit={(values, actions) =>
        addPost(axiosPrivate, values, actions, navigate)
      }/>
    </Card>
  );
}

export default AddPost;