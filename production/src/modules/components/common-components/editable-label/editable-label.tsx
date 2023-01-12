import * as React from 'react';
import classnames from 'classnames';
import { Input } from '@mstr/rc';

import { EditableLabelProps } from './interface';
import './editable-label.scss';

const ENUM_TRIGGER_TYPE = {
    'DOUBLECLICK': 'doubleClick',
    'CLICK': 'click'
};

const EditableLabel = ({ className = '', value = '', onValueChange = () => {}, placeholder = '', allowEmptySave = false, trigger = ENUM_TRIGGER_TYPE.DOUBLECLICK }: EditableLabelProps) => {
    let [editing, setEditing] = React.useState(false);
    let editingDiv = React.useRef(null);
    const displayedValue = value || placeholder;
    const isEmpty = !value;

    const handleValueChange = (e: { target: { value: string; }; }) => {
        setEditing(false);
        if (e?.target?.value !== value) {
            if (allowEmptySave) {
                onValueChange(e.target.value || '');
            } else if (e.target.value && e.target.value.trim()) {
                onValueChange(e.target.value);
            }
        }
    };
  
    return editing
        ? <Input
            ref={editingDiv}
            defaultValue={value}
            placeholder={placeholder}
            className={classnames(className, 'mstr-singleline-label-editing')}
            onBlur={handleValueChange}
            onPressEnter={handleValueChange}
            spellCheck={false}
        />
        : <div
            className={classnames(className, 'mstr-singleline-label-editable', { empty : isEmpty })}
            onDoubleClick={() => {
                if (trigger === ENUM_TRIGGER_TYPE.DOUBLECLICK) {
                    setEditing(true);
                }
            }}
            onClick={() => {
                if (trigger === ENUM_TRIGGER_TYPE.CLICK) {
                    setEditing(true);
                }
            }}
            title={displayedValue}
        >
            {displayedValue}
        </div>
}

export default EditableLabel;
