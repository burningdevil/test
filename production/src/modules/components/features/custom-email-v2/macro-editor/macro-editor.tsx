import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'quill-mention';
import classNames from 'classnames';

import MacroClipboard from './macro-clipboard';
import MacroQuillBlot from './macro-quill-blot';



import { ChangeHandler, MacroEditorProps, Macros, QuillModules } from './macro-types';


import 'react-quill/dist/quill.snow.css';
import './macro-editor.scss';
import { getConfig } from './macro-util';
import * as _ from 'lodash';

Quill.register(MacroQuillBlot);

Quill.register('modules/maxlength', function(quill: any, options: any) {
// it's not recommend by official to restrict the code length in hyper editor. In our case, implement it by undo the input when exceed the max size.
  quill.on('text-change', function(_e: any) {
          let size = quill.getLength();
          if (size > options.value)
              quill.history.undo();

  });

});
Quill.register('modules/counter', function(quill: any, options: any) {
    
    const container = document.querySelector(options.container);
    if(!container) return;
    const calculate = () => {
      let text = quill.getText();
      let length = quill.getLength();
      if (options.unit === 'word') {
        const macroWordCnt = length - text.length;
        text = text.trim();
        // Splitting empty text returns a non-empty array
        return text.length > 0 ? text.split(/\s+/).length + macroWordCnt : 0;
      } else {
        return length - 1;
      }
    }
    const update = () => {
      var length = calculate();
    container.innerText = length + '/' + '1000';
    }
    // update();  // Account for initial contents;
    quill.on('text-change', update);


});


/*
 * Quill formats to enable in the editor
 * See https://quilljs.com/docs/formats/ for complete options
 */
const formats: string[] = ['link', MacroQuillBlot.blotName];

/**
 * Higher order function that creates a closure for the onChangeHandler. The closure maps a Quill event
 * to a simpler structure and passes it to the onChangeHandler callback provided to the component.
 *
 * @param onChangeHandler callback
 * @param setValue set local state of controller component
 * @param multiline removes new lines when false
 */
function onChangeClosure(onChangeHandler: ChangeHandler, setValue: (value: string) => void, multiline: boolean) {
  return (content: string, _delta: any, _sources: string, editor: QuillModules) => {
    
    setValue(content);
    if (_sources === 'user') {
      const delta = editor.getContents();
      onChangeHandler({
        html: editor.getHTML(),
        text: MacroQuillBlot.getTextFromDelta(delta, multiline)
      });
    }
  };
}

const MacroEditor: React.FC<MacroEditorProps> = ({
  placeholder = '',
  defaultValue = '',
  isMultiContent = true,
  isPreviewOpen = false,
  reset = false,
  isContentAdded = false,
  availableMacros = [Macros.DOSSIER_NAME, Macros.BOOKMARK_COUNT, Macros.MENTION_TARGET, Macros.RECIPIENT_NAME, Macros.SENDER_NAME],
  onChangeHandler = _.noop,
}) => {

  const isLoading = false;

  const formattedDefaultValue = MacroQuillBlot.getHtmlFromText(
    isMultiContent,
    defaultValue,
    availableMacros.slice()
  );

  const [value, setValue] = useState(formattedDefaultValue);
  const onChange = onChangeClosure(onChangeHandler, setValue, isMultiContent);
  /*
  * Quill modules to attach to editor
  * See https://quilljs.com/docs/modules/ for complete options
  * here use the memo to memorize the modules, it can be init once to prevent from the closure issue.
  */
  const modules: any = useMemo(() => {return {
    maxlength : {value : 250},
    counter: {
      container: `#${availableMacros.join('-') + "counter"}`,
      unit: 'character'
    },
    history: {
      maxStack: 100,
      userOnly: false,
      syntax: true,
    },
    keyboard: {
      // Bindings for A11Y, we disable Tab from Quill so it follows the natural tabIndex
      bindings: {
        tab: { key: 9, handler: () => true }, // Disable Tab
        shiftTab: { key: 9, shiftKey: true, handler: () => true }, // Disable Shift + Tab
      },
    },
    toolbar: false,
    clipboard: {
      matchVisual: true,
      matchers: [[Node.ELEMENT_NODE, MacroClipboard.nodeMatcher]],
    },
    mention: null,
  }}, []);
  modules.mention = getConfig(
    availableMacros.slice()
  );
  modules.mention.id = availableMacros.join('-');
  modules.maxlength = {value: isMultiContent ? 1000 : 250};
  modules.counter.container = isMultiContent ? modules.counter.container : 'counter';
  const quillClass = classNames({ 'ql-singleline': !isMultiContent && !isPreviewOpen, 'ql-multiline': isMultiContent && !isPreviewOpen, 'ql-singleline-shrink': !isMultiContent && isPreviewOpen, 'ql-multiline-shrink': isMultiContent && isPreviewOpen});
  const quillRef = useRef<ReactQuill>();
  const [isManualChangeSelection, setManualChange]  =useState(false);
  useEffect(() => {
    if (!isLoading) {
      setValue(formattedDefaultValue);
    }
    setValue(formattedDefaultValue);
    // We don't want to listen to changes in formattedDefaultValue
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isContentAdded, reset]);

  /* register the listener to judge whether selected by user.
  * There are two cases triggering the range selection:
  * 1. user click or using the keyboard.
  * 2. click and dragging the cursor. This one we should judged as the manual selection.
  * Then unregister it when gc.
  */
  useEffect(() => { 
    const handle = (_e: any) => {
      setManualChange(true);
    } 
    window.addEventListener('mousemove',handle);
    return () => window.removeEventListener('mousemove', handle)
  }, []);

  return (
    <>
    <ReactQuill
      id = {availableMacros.join('-')}
      ref={quillRef}
      value={value}
      className={quillClass}
      modules={modules}
      formats={formats}
      defaultValue={formattedDefaultValue}
      placeholder={placeholder}
      onChange={onChange}
      onChangeSelection = {(range, _source, editor) => {
        const delta = editor.getContents();
        const extendRange = MacroQuillBlot.getExtendRangeFromSelection(delta, (range as any))
        const extend = extendRange?.map(v => {return v ? 0: 1});
        // here i do not use the window api, because of the api in our editor is not stable enough.
        if(extendRange?.length && extendRange[0] && isManualChangeSelection){
          if(isMultiContent){
            quillRef.current?.getEditor().setSelection(range?.index - extend[1],  2 + (extend[1] === 1 ? extend[2] : 0));
          }else {
            // for the single line case, we discard some corner case, e.g the macro is located at the first location in the line., 
            // because in single line, selection is a little more hard than manually input the {.
            quillRef.current?.getEditor().setSelection(range?.index - 1,  2);
          }
          setManualChange(false);
        }
      }}
    />
    {isMultiContent && <div id={availableMacros.join('-') + "counter"} className = {'macro-editor-counter'}>0</div>}
    </>
  );
};

export default MacroEditor;
