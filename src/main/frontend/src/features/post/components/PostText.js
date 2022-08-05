import React, {useCallback, useMemo} from 'react';
import {Editable, Slate, withReact} from 'slate-react';
import {createEditor} from 'slate';
import {Element, Leaf} from '../../../components/input/RTAComponents';

export const PostText = ({text, disableMaxHeight}) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withReact(createEditor()), []);

  const maxHeight = disableMaxHeight ? '' : '230px';

  return (
    <Slate editor={editor} value={JSON.parse(text)}>
      <Editable renderElement={renderElement} renderLeaf={renderLeaf} readOnly
                style={{
                  maxHeight: maxHeight, padding: '15px 20px', overflow: 'hidden',
                  textOverflow: 'ellipsis', textAlign: 'left'
                }}/>
    </Slate>
  )
}

