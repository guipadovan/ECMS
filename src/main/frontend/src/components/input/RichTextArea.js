import React, { useCallback, useEffect, useMemo } from 'react';
import { Editable, ReactEditor, Slate, useSlate, withReact } from 'slate-react';
import { createEditor, Editor, Element as SlateElement, Node, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import {
  Box,
  chakra,
  Heading,
  HStack,
  IconButton,
  ListItem,
  OrderedList,
  UnorderedList,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  MdCode,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatUnderlined,
  MdLooksOne,
  MdLooksTwo,
} from 'react-icons/all';
import { useField } from 'formik';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const RichTextArea = ({ isInvalid, name, ...rest }) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const [field, meta, helpers] = useField(name);

  const { value, error, touched } = meta;
  const { setValue, setTouched } = helpers;

  useEffect(() => {
    if (serialize(value).trim().length === 0)
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
  }, [value]);

  const handleclick = (e) => {
    e.stopPropagation();
    ReactEditor.focus(editor);
    if (!touched)
      setTouched(true, false);
  };

  return (
    <Box onClick={(e) => handleclick(e)} borderWidth={'0'} borderRadius={'6px'}
         bg={useColorModeValue('gray.100', 'blackAlpha.400')}
         border={'2px solid'} borderColor={error && touched ? 'red.300' : 'transparent'}
         _hover={{ bg: useColorModeValue('gray.200', 'whiteAlpha.100') }}
         _focusWithin={{ borderColor: '#63b3ed', bg: 'transparent' }} transition={'0.3s ease'}>
      <Slate editor={editor} value={value} onChange={(v) => setValue(v)} {...rest}>
        <HStack padding={'5px 5px'} spacing={'5px'} wrap={'wrap'} bg={'blackAlpha.100'}>
          <MarkButton format='bold' icon={<MdFormatBold />} />
          <MarkButton format='italic' icon={<MdFormatItalic />} />
          <MarkButton format='underline' icon={<MdFormatUnderlined />} />
          <MarkButton format='code' icon={<MdCode />} />
          <BlockButton format='heading-one' icon={<MdLooksOne />} />
          <BlockButton format='heading-two' icon={<MdLooksTwo />} />
          <BlockButton format='block-quote' icon={<MdFormatQuote />} />
          <BlockButton format='numbered-list' icon={<MdFormatListNumbered />} />
          <BlockButton format='bulleted-list' icon={<MdFormatListBulleted />} />
          <BlockButton format='left' icon={<MdFormatAlignLeft />} />
          <BlockButton format='center' icon={<MdFormatAlignCenter />} />
          <BlockButton format='right' icon={<MdFormatAlignRight />} />
          <BlockButton format='justify' icon={<MdFormatAlignJustify />} />
        </HStack>
        <Box padding={'15px 10px'}>
          <Editable renderElement={renderElement} renderLeaf={renderLeaf} spellCheck style={{ minHeight: '150px' }} />
        </Box>
      </Slate>
    </Box>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type');
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) && !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });

  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    }),
  );

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const BlockquoteStyle = {
  margin: '1.5em 10px',
  padding: '0.5em 10px',
};

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'block-quote':
      return (
        <chakra.blockquote style={BlockquoteStyle} borderLeftWidth={'10px'}
                           borderLeftColor={'gray.200'} {...attributes}>
          {children}
        </chakra.blockquote>
      );
    case 'bulleted-list':
      return (
        <UnorderedList {...attributes}>
          {children}
        </UnorderedList>
      );
    case 'heading-one':
      return (
        <Heading as='h1' size='3xl' align={element.align} {...attributes}>
          {children}
        </Heading>
      );
    case 'heading-two':
      return (
        <Heading as='h2' size='2xl' align={element.align} {...attributes}>
          {children}
        </Heading>
      );
    case 'list-item':
      return (
        <ListItem {...attributes}>
          {children}
        </ListItem>
      );
    case 'numbered-list':
      return (
        <OrderedList {...attributes}>
          {children}
        </OrderedList>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  const { colorMode } = useColorMode();

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = (
      <chakra.code padding={'3px'} backgroundColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
                   fontSize={'90%'}>
        {children}
      </chakra.code>
    );
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <IconButton variant='outline' colorScheme='blue' isActive={isBlockActive(editor, format)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  toggleBlock(editor, format);
                }}
                aria-label={format} icon={icon} borderWidth={0} fontSize={'20px'}
    />
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <IconButton variant='outline' colorScheme='blue' isActive={isMarkActive(editor, format)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  toggleMark(editor, format);
                }}
                aria-label={format} icon={icon} borderWidth={0} fontSize={'20px'}
    />
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