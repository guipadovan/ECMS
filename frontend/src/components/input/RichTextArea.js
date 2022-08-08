import React, {useCallback, useEffect, useMemo} from 'react';
import {Editable, ReactEditor, Slate, withReact} from 'slate-react';
import {createEditor, Editor, Node, Transforms} from 'slate';
import {withHistory} from 'slate-history';
import {Box, useColorModeValue,} from '@chakra-ui/react';
import {useField} from 'formik';
import {Element, Leaf, Toolbar} from './RTAComponents';

const RichTextArea = ({isInvalid, name, ...rest}) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const [field, meta, helpers] = useField(name);

  const {value, error, touched} = meta;
  const {setValue, setTouched} = helpers;

  useEffect(() => {
    if (serialize(value).trim().length === 0)
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
  }, [value]);

  const handleClick = (e) => {
    e.stopPropagation();
    ReactEditor.focus(editor);
  };

  const handleBlur = () => {
    if (!touched)
      setTouched(true);
  }

  return (
    <Box onClick={(e) => handleClick(e)} onBlur={() => handleBlur()} borderWidth={'0'} borderRadius={'6px'}
         bg={useColorModeValue('gray.100', 'blackAlpha.400')}
         border={'2px solid'} borderColor={error && touched ? 'red.300' : 'transparent'}
         _hover={{bg: useColorModeValue('gray.200', 'whiteAlpha.100')}}
         _focusWithin={{borderColor: '#63b3ed', bg: 'transparent'}} transition={'0.3s ease'}>
      <Slate editor={editor} {...rest} value={value} onChange={(v) => setValue(v)}>
        <Toolbar/>
        <Editable renderElement={renderElement} renderLeaf={renderLeaf} spellCheck
                  style={{minHeight: '150px', padding: '15px 10px'}}/>
      </Slate>
    </Box>
  );
};

export const serialize = nodes => {
  return nodes.map(n => {
    try {
      return Node.string(n);
    } catch (e) {
      return '';
    }
  }).join('\n');
};

export default RichTextArea;