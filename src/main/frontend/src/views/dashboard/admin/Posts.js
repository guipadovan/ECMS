import {api} from "../../../api/axios";
import Card from "../../../components/card/Card";

export default function Posts() {

  api.get('/post/posts', {
    params: {
      title: '',
      page: 0,
      size: 10,
    }
  }).then(res => {
    console.log(res);
  });

  return (
    <Card label={'Posts'}>

    </Card>
  );
}