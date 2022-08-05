import * as Yup from 'yup';
import {serialize} from '../../../components/input/RichTextArea';

export const validate = Yup.object({
  title: Yup.string()
    .min(3, 'Title  must be at least 3 characters')
    .max(64, 'Title must be 64 characters or less')
    .test('has-text',
      () => 'Title is required',
      (value) => {
        if (value === undefined)
          return true;
        return value.trim().length !== 0;
      })
    .required('Title is required'),
  subtitle: Yup.string()
    .max(128, 'Subtitle must be 128 characters or less')
    .test('has-text',
      () => 'Subtitle is required',
      (value) => {
        if (value === undefined)
          return true;
        return value.trim().length !== 0;
      }),
  text: Yup.array()
    .test('has-text',
      () => 'Text is required',
      (value) => serialize(value).trim().length !== 0),
  locked: Yup.bool(),
});