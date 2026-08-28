


import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  
  
  type EditorState,
  
  type LexicalEditor,
  ParagraphNode,
  TextNode,
} from 'lexical';

import ExampleTheme from './ExampleTheme.ts';
import ToolbarPlugin from './plugins/ToolbarPlugin';


import type { QuestionObject } from '../QuestionParent';
import { Button } from 'react-bootstrap';
import './plugins/styles.css';
import './plugins/styleConfig.ts'



interface QuestionDropDownProps {
  list: QuestionObject[];
  setList: React.Dispatch<React.SetStateAction<QuestionObject[]>>;
  Index:number
  
  
};
const placeholder = 'Enter some rich text...';








export function InstructionBox(
    {list,
    setList,
    Index
}:QuestionDropDownProps) {

  const editorConfig = {
  namespace: 'React.js Demo',
  nodes: [ParagraphNode, TextNode],
  theme: ExampleTheme,
  onError(error: Error) {
    throw error;  
  },
  editorState: (editor: LexicalEditor) => {
    editor.update(() => {
      const root = $getRoot();
      if (root.getChildrenSize() === 0) {
        const saved = list[Index].Question
        if (typeof saved === 'string' && saved.length > 0) {
          try {
            const parsedState = editor.parseEditorState(saved);
            editor.setEditorState(parsedState);
          } catch {
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(saved));
            root.append(paragraph);
          }
        }
      }
    });
  },
};

  function deleteQ(id:number){
        //Creates a copy of the list and deletes the element at the given index
        //Code to delete the data
        const newList:QuestionObject[] = [...list]
        newList.splice(id,1);
        setList(newList)
    }
    

  function onChange(editorState: EditorState) {
  editorState.read(() => {
    const jsonString = JSON.stringify(editorState.toJSON());
    const newQ = structuredClone(list[Index])
    newQ.Question = jsonString
    const newList = structuredClone(list)
    newList[Index] = newQ
    setList(newList);
  });
}
return (
    <div>
    <LexicalComposer initialConfig={editorConfig}>
      <OnChangePlugin onChange={onChange} />
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          
          
        </div>
      </div>
    </LexicalComposer>
    <Button
                        variant="danger"
                        onClick={() => {
                            deleteQ(Index);
                        }}
                        size="sm"
                        >
                    {"Delete Instruction Box"}
                </Button>
    </div>
    
  );
}

