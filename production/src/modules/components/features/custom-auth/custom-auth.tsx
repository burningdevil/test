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
    const [enableAuth, setEnableAuth] = useState(isAuthModesEnabled);
    
    const [dm, setDm] = useState(stateData?.defaultMode);
    const [savedSelected, setSelected] = useState(stateData?.availableModes ?? []);
    
    const [optionData, setOptions] = useState(supportCustomAuthModes);
    React.useEffect(() => {
        if(!savedSelected) return;
        // update the default mode automatically depends on the selected options.
        const isDefaultSelected = savedSelected?.find(v => v === dm);
        if(!isDefaultSelected){
            setDm(savedSelected[0]);
            dispatch(
                Actions.updateCurrentConfig({
                    authModes: {
                        enabled: enableAuth,
                        availableModes: savedSelected,
                        defaultMode: savedSelected[0]
                    }
                })
            )
        }
        if(savedSelected.includes(AuthModeConstants.OIDC)){
            optionData.find(v => v.value === AuthModeConstants.SAML).disabled = true;
            setOptions(JSON.parse(JSON.stringify(optionData)))
        }else {
            optionData.find(v => v.value === AuthModeConstants.SAML).disabled = false;
            setOptions(JSON.parse(JSON.stringify(optionData)))
        }
        if(savedSelected.includes(AuthModeConstants.SAML)){
            optionData.find(v => v.value === AuthModeConstants.OIDC).disabled = true;
            setOptions(JSON.parse(JSON.stringify(optionData)))
        }else {
            optionData.find(v => v.value === AuthModeConstants.OIDC).disabled = false;
            setOptions(JSON.parse(JSON.stringify(optionData)))
        }
    }, [savedSelected])

    React.useEffect(() => {
        if(savedSelected?.length === 0 && enableAuth){
            setDm(0);
            dispatch(Actions.setCustomAuthError(true))
        }else {
            dispatch(Actions.setCustomAuthError(false))
        }

     }, [savedSelected, enableAuth])
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
                    availableModes: savedSelected,
                    defaultMode: dm
                }
            })
        )
      };
    const onOptionChange = (checkedValues: number[]) => {
        setSelected(checkedValues);
        dispatch(
            Actions.updateCurrentConfig({
                authModes: {
                    enabled: enableAuth,
                    availableModes: checkedValues,
                    defaultMode: checkedValues?.length ? dm : 0
                }
            })
        )

    };

    const onDefaultChange = (option: any) => {
        setDm(option.value);
        // if current option is not checked, automatic check it.
        if(!savedSelected.includes(option.value)){
            savedSelected.push(option.value);
            setSelected(savedSelected.slice());
        }
        dispatch(
            Actions.updateCurrentConfig({
                authModes: {
                    enabled: enableAuth,
                    availableModes: savedSelected,
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