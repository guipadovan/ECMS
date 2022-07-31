import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import Card from "../../../components/card/Card";
import PostForm from "../../../components/forms/PostForm";
import {useNavigate} from "react-router";

export default function AddPost() {

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  return (
    <Card label={'New Post'}>
      <PostForm defaultValues={{
        title: '',
        subtitle: '',
        text: [
          {
            type: 'paragraph',
            children: [{text: ''}],
          },
        ],
        locked: false,
      }} submit={(values, actions) => {
        axiosPrivate.post('/post/new', {
          title: values.title,
          subtitle: values.subtitle,
          text: JSON.stringify(values.text),
          locked: values.locked,
        }).then(res => {
          actions.resetForm();
          actions.setSubmitting(false);
          navigate('/post/' + res.data.id);
        }).catch(err => {
          actions.setSubmitting(false);
          console.log(err);
        });
      }}/>
    </Card>
  );
}