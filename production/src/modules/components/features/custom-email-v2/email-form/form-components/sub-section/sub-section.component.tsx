import * as React from 'react'
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import * as Actions from '../../../../../../../store/actions/ActionsCreator';
import MacroEditor from '../../../macro-editor/macro-editor';
import { CustomEmailSettingType, EmailContentInterface } from '../../../../../../../../src/types/data-model/HomeScreenConfigModels';
import { Macros } from '../../../macro-editor/macro-types';
import { DEFAULT_EMAIL_SETTING } from '../../../../../../../../src/store/reducers/HomeScreenConfigEditorReducer';
import MacroQuillBlot from '../../../macro-editor/macro-quill-blot';
const classNamePrefix = 'custom-email-form-v2'

interface SubSectionProps {
    sectionObj: any,
    stateKey: keyof EmailContentInterface, 
    value1: string,
    cb1 : Function, 
    value2: string, 
    cb2: Function, 
    availableMacros?: Macros[], 
    resetSubAndBody?: boolean,
    stateData?: CustomEmailSettingType
  }
const SubSection: React.FC<SubSectionProps> = (props: SubSectionProps
    ) => {
    const [needRefresh, setRefresh] = React.useState(false);   
    const dispatch = useDispatch();
    let {stateKey, sectionObj, value1, value2, cb1, cb2, stateData, resetSubAndBody, availableMacros} = props;
    

    /**
     * Here introduced the ctrl v event listener, when trigger it, refresh the editor with short latency.
     */
    const handleKeyDown = useCallback((event: any)=>{
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if((event.ctrlKey || event.metaKey) && charCode === 'v') {
          setTimeout(() => {
            setRefresh(!needRefresh);
          }, 100)
        }
    },[])
    return (
        <>
                    <div id={ stateKey } className = {`${classNamePrefix}-title-box`}>
                        {sectionObj.title}
                    </div>
                    <div className={`${classNamePrefix}-box`}>
                        
                        <span>{sectionObj.label1}</span>
                        <div className="message-editor-wrapper">
                            <MacroEditor
                                id = {stateKey + 'editor-sub'}
                                defaultValue={value1}
                                isMultiContent={false}
                                isNotificationReminder = {props.stateKey + 1}
                                reset = {resetSubAndBody}
                                availableMacros = {availableMacros}
                                placeholder={sectionObj.placeholder1}
                                onChangeHandler={(v: any) => {
                                    if(!Reflect.has(stateData, 'content')){
                                        stateData.content = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content)); 
                                    }
                                    if(!Reflect.has(stateData.content, stateKey)){
                                        stateData.content[stateKey] = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content[stateKey]))
                                    }
                                    if(!stateData.content?.[stateKey]?.subject){
                                        stateData.content[stateKey].subject = DEFAULT_EMAIL_SETTING.content[stateKey].subject;
                                    }
                                    stateData['content'][stateKey]['subject'] = MacroQuillBlot.escapeHTMLBlot(v.text)?.replace(/[\r\n]/gm, '<br>');
                                    cb1(v.text);
                                    dispatch(
                                        Actions.updateCurrentConfig({
                                            emailSettings: stateData
                                        })
                                    )
                            }}
                            />
                    </div >   
                        
                    </div> 
                    <div className = {`${classNamePrefix}-box`}>
                    <span>{sectionObj.label2}</span>
                        <div className="message-editor-wrapper" onKeyDown = {handleKeyDown}>
                            <MacroEditor
                                id = {stateKey + 'editor-body'}
                                defaultValue={value2}
                                isMultiContent={true}
                                isNotificationReminder = {stateKey + 2}
                                reset = {resetSubAndBody}
                                isContentAdded = {needRefresh}
                                availableMacros = {availableMacros}
                                placeholder={sectionObj.placeholder2}
                                onChangeHandler={(v: any) => {
                                    if(!Reflect.has(stateData, 'content')){
                                        stateData.content = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content)); 
                                    } 
                                    if(!Reflect.has(stateData.content, stateKey)){
                                        stateData.content[stateKey] = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content[stateKey]))
                                    }
                                    if(!stateData.content?.[stateKey]?.body){
                                        stateData.content[stateKey].body = DEFAULT_EMAIL_SETTING.content[stateKey].body;
                                    }
                                    stateData['content'][stateKey]['body'] = MacroQuillBlot.escapeHTMLBlot(v.text)?.replace(/[\r\n]/gm, '<br>').trim();
                                    cb2(v.text);
                                    dispatch(
                                        Actions.updateCurrentConfig({
                                            emailSettings: stateData
                                        })
                                    )
                            }}
                            />
                    </div > 
                    </div>
        </>
    );
};

  


export default SubSection;