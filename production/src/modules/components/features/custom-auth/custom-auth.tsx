import * as React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Checkbox, RadioChangeEvent, Radio, Space} from 'antd';


import * as Actions from '../../../../store/actions/ActionsCreator';
const classNamePrefix = 'custom-auth-form'
import './custom-auth.scss'
import { AuthModeConstants, CustomAuthModes, supportCustomAuthModes } from './custom-auth.model';
import { selectAuthMode, selectEnableAuthMods } from '../../../../../src/store/selectors/HomeScreenConfigEditorSelector';
import { localizedStrings } from '../../HomeScreenConfigConstant';
const CustomAuth: React.FC<any> = () => {
    let stateData: CustomAuthModes = useSelector(selectAuthMode);
    const dispatch = useDispatch();
    const isEnableAuthMode = useSelector(selectEnableAuthMods);
    const [enableAuth, setEnableAuth] = useState(isEnableAuthMode);
    
    const [dm, setDm] = useState(stateData?.defaultMode);
    const [saveSelected, setSelected] = useState(stateData?.availableModes ?? []);
    
    const [optionData, setOptions] = useState(supportCustomAuthModes);
    React.useEffect(() => {
        if(!saveSelected) return;
        // update the default mode automatically depends on the selected options.
        const isDefaultSelected = saveSelected?.find(v => v === dm);
        if(!isDefaultSelected){
            setDm(saveSelected[0]);
            dispatch(
                Actions.updateCurrentConfig({
                    authModes: {
                        enabled: enableAuth,
                        availableModes: saveSelected,
                        defaultMode: saveSelected[0]
                    }
                })
            )
        }
        if(saveSelected.includes(AuthModeConstants.OIDC)){
            optionData.find(v => v.value === AuthModeConstants.SAML).disabled = true;
            setOptions(JSON.parse(JSON.stringify(optionData)))
        }else {
            optionData.find(v => v.value === AuthModeConstants.SAML).disabled = false;
            setOptions(JSON.parse(JSON.stringify(optionData)))
        }
        if(saveSelected.includes(AuthModeConstants.SAML)){
            optionData.find(v => v.value === AuthModeConstants.OIDC).disabled = true;
            setOptions(JSON.parse(JSON.stringify(optionData)))
        }else {
            optionData.find(v => v.value === AuthModeConstants.OIDC).disabled = false;
            setOptions(JSON.parse(JSON.stringify(optionData)))
        }
        if(saveSelected?.length === 0 && enableAuth){
            setDm(0);
            dispatch(Actions.setCustomEmailNameError(true))
        }else {
            dispatch(Actions.setCustomEmailNameError(false))
        }
    }, [saveSelected, enableAuth])
    React.useEffect(() => {
       setDm(stateData?.defaultMode);
       setSelected(stateData?.availableModes);
    }, [stateData])
    const onChange = (e: RadioChangeEvent) => {
        setEnableAuth(e.target.value);
        dispatch(
            Actions.updateCurrentConfig({
                authModes: {
                    enabled: e.target.value,
                    availableModes: saveSelected,
                    defaultMode: dm
                }
            })
        )
      };
    const onOptionChange = (checkedValues: number[]) => {
        // should judge whether uncheck the default one. if true, will slip to the first select one.
        let defaultMode = dm;
        if( checkedValues.length && checkedValues?.length < saveSelected?.length && !checkedValues.includes(dm)){
            let d = supportCustomAuthModes.find(v => checkedValues.includes(v.value));
            defaultMode = d.value;
            setDm(d.value);
        }
        if(!checkedValues?.length){
            defaultMode = 0;
            setDm(0);
        }
        setSelected(checkedValues);
        dispatch(
            Actions.updateCurrentConfig({
                authModes: {
                    enabled: enableAuth,
                    availableModes: checkedValues,
                    defaultMode: defaultMode
                }
            })
        )

    };

    const onDefaultChange = (option: any) => {
        setDm(option.value);
        // if current option is not checked, automatic check it.
        if(!saveSelected.includes(option.value)){
            saveSelected.push(option.value);
            setSelected(saveSelected.slice());
        }
        dispatch(
            Actions.updateCurrentConfig({
                authModes: {
                    enabled: enableAuth,
                    availableModes: saveSelected,
                    defaultMode: option.value
                }
            })
        )
    }
    
    const renderOption = () => {
        return (
            <>
            {                
                optionData.map((option: any) => {
                    return (
                        <div className = "group-row" key = {option.value}>
                                <div className = "option-row">
                                    <Checkbox value={option.value} disabled = {option.disabled} style = {{'margin': '5px 8px 2px 15px'}}> {option.label}</Checkbox>
                                    {
                                        option.value === dm && <span className = "defaultClass">default</span>
                                    }
                                    {
                                        option.value !== dm && !option.disabled&& <span className = "operation-item" onClick={() => onDefaultChange(option)}>set as default</span>
                                    }
                                </div>
                                
                        </div>
                    )
                })
            }
            </>
            
        )
    }
    const renderCustomList = () => {
        return (
            <div className = {`${classNamePrefix}-option-container`}>
                <Checkbox.Group style={{ width: '100%' }} defaultValue= {saveSelected} value = {saveSelected} onChange={onOptionChange}>
                    {renderOption()}
                </Checkbox.Group>
            </div>
        )
    }
    return (
        <div
            id="custom-auth-form"
            className={`${classNamePrefix}`}
        >
                    <div className={`${classNamePrefix}-title`}>
                        {localizedStrings.AUTH_MODES}
                    </div>
                    <div className={`${classNamePrefix}-content`} >
                        <Radio.Group onChange={onChange} value={enableAuth} style = {{lineHeight: '15px', width: '100%'}}>
                            <Space direction="vertical" style = {{ width: '100%'}}>
                                <Radio value={false}>{'Use existing server level authentication modes.'}</Radio>
                                
                                <Radio value={true}>{'Choose specific authentication modes for the app'}</Radio>
                                
                                {
                                    enableAuth === true ? 
                                    renderCustomList() 
                                    : null
                                }
                            </Space>

                        </Radio.Group>
                    </div>
                    
                    
                    
        </div>
    );
};

export default CustomAuth;