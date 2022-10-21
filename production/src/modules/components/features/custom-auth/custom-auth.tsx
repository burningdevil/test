import * as React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Checkbox, RadioChangeEvent, Radio, Space} from 'antd';


import * as Actions from '../../../../store/actions/ActionsCreator';
const classNamePrefix = 'custom-auth-form'
import './custom-auth.scss'
import { AuthModeConstants, CustomAuthModes, supportCustomAuthModes } from './custom-auth.model';
import { selectAuthModes, selectAuthModesEnabled } from '../../../../../src/store/selectors/HomeScreenConfigEditorSelector';
import { localizedStrings } from '../../HomeScreenConfigConstant';
const CustomAuth: React.FC<any> = () => {
    let stateData: CustomAuthModes = useSelector(selectAuthModes);
    const dispatch = useDispatch();
    const isAuthModesEnabled = useSelector(selectAuthModesEnabled);
    const [enableAuth, setEnableAuth] = useState(false);
    
    const [dm, setDm] = useState(0);
    const [savedSelected, setSelected] = useState([]);
    
    const [optionsData, setOptions] = useState(supportCustomAuthModes);

    React.useEffect( () => {
        if(!stateData) return;
        setEnableAuth(Reflect.has(stateData, 'enabled') ? stateData?.enabled : stateData?.defaultMode !== 0);
        setSelected(stateData?.availableModes ?? []);
        setDm(stateData?.defaultMode ?? 0);
    }, [stateData])
    
    
    React.useEffect(() => {
        if(!savedSelected) return;
        // update the default mode automatically depends on the selected options.
        
        if(savedSelected.includes(AuthModeConstants.OIDC)){
            optionsData.find(v => v.value === AuthModeConstants.SAML).disabled = true;
            setOptions(JSON.parse(JSON.stringify(optionsData)))
        }else {
            optionsData.find(v => v.value === AuthModeConstants.SAML).disabled = false;
            setOptions(JSON.parse(JSON.stringify(optionsData)))
        }
        if(savedSelected.includes(AuthModeConstants.SAML)){
            optionsData.find(v => v.value === AuthModeConstants.OIDC).disabled = true;
            setOptions(JSON.parse(JSON.stringify(optionsData)))
        }else {
            optionsData.find(v => v.value === AuthModeConstants.OIDC).disabled = false;
            setOptions(JSON.parse(JSON.stringify(optionsData)))
        }
    }, [savedSelected])

    React.useEffect(() => {
        if(savedSelected?.length === 0 && enableAuth){
            dispatch(Actions.setCustomAuthError(true))
        }else {
            dispatch(Actions.setCustomAuthError(false))
        }
     }, [savedSelected, enableAuth])
    
    const onChange = (e: RadioChangeEvent) => {
        dispatch(
        Actions.updateCurrentConfig({
            authModes: {
                enabled: e.target.value,
                availableModes: savedSelected,
                defaultMode: dm
            }
        })
    )
      };
    const onOptionChange = (checkedValues: number[]) => {
        // follow the sequence as the UI options.
        
        checkedValues.sort((a: number,b: number) => {
            let a_index = supportCustomAuthModes?.findIndex(m => m.value === a);
            let b_index = supportCustomAuthModes?.findIndex(m => m.value === b);
            return a_index < b_index ? -1 : 1;
        })
        let defaultMode = dm;
        if(!checkedValues?.length){
            defaultMode = 0;
        }
        const isDefaultSelected = checkedValues?.find(v => v === dm);
        if(!isDefaultSelected && checkedValues?.length){
            defaultMode = checkedValues[0];
        }
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
        // if current option is not checked, automatic check it.
        let checkedSelected = [...savedSelected];
        if(!checkedSelected.includes(option.value)){
            checkedSelected.push(option.value);
        }
        checkedSelected.sort((a: number,b: number) => {
            let a_index = supportCustomAuthModes?.findIndex(m => m.value === a);
            let b_index = supportCustomAuthModes?.findIndex(m => m.value === b);
            return a_index < b_index ? -1 : 1;
        })
        dispatch(
            Actions.updateCurrentConfig({
                authModes: {
                    enabled: enableAuth,
                    availableModes: checkedSelected,
                    defaultMode: option.value
                }
            })
        )
    }
    
    const renderOption = () => {
        return (
            <>
            {                
                optionsData.map((option: any) => {
                    return (
                        <div className = "group-row" key = {option.value}>
                                <div className = "option-row">
                                    <Checkbox value={option.value} disabled = {option.disabled} style = {{'margin': '5px 8px 2px 15px'}}> {option.label}</Checkbox>
                                    {
                                        option.value === dm && <span className = "defaultClass">{localizedStrings.DEFAULT_AUTH}</span>
                                    }
                                    {
                                        option.value !== dm && !option.disabled&& <span className = "operation-item" onClick={() => onDefaultChange(option)}>{localizedStrings.SET_AS_DEFAULT}</span>
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
                <Checkbox.Group style={{ width: '100%' }} defaultValue= {savedSelected} value = {savedSelected} onChange={onOptionChange}>
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
                                <Radio value={false}>{localizedStrings.USE_EXIST_SERVER_LEVEL_AUTH}</Radio>
                                
                                <Radio value={true}>{localizedStrings.USE_SPECIFIC_AUTH}</Radio>
                                
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