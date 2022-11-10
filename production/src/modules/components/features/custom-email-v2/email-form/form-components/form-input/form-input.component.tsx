import * as React from 'react'
import { useDispatch } from 'react-redux';
import { Input, Tooltip } from '@mstr/rc';

import * as Actions from '../../../../../../../store/actions/ActionsCreator';
import { FormInputModel } from '../form-input.model';
import * as _ from 'lodash';
import { default as VC, customEmailStringDict } from '../../../../../HomeScreenConfigConstant';
const classNamePrefix = 'custom-email-form-v2'


const FormInput: React.FC<FormInputModel> = (props: FormInputModel
    ) => {
        const dispatch = useDispatch();
        const {label, value, cb, elementId, placeholder, propertyPath, tooltip, enableValidate, errorMessage, validateCb, isNotEncode, tooltipStr, stateData, validate, disabled} = props;
        const [errorMsg, setErrMsg] = React.useState(errorMessage);
        return (
            <div className={`${classNamePrefix}-box`}>
                <span>{label}
                    {tooltip && <Tooltip
                                    title={tooltipStr}
                                    placement='rightTop'
                                >
                                    <span className={VC.FONT_MSG_INFO}> </span>
                                </Tooltip>}
                </span>
                
                <Input
                    value={value}
                    onValidate={(e: string) => {
                        if(enableValidate){
                            const validAndMsg = validate(e, elementId, validateCb);
                            if(typeof validAndMsg === 'string'){
                                setErrMsg(validAndMsg);
                                return false;
                            }else {
                                setErrMsg(errorMessage);
                            }
                            return validAndMsg === true;
                        }else {
                            return true;
                        }
                    }}
                    disabled = {disabled}
                    errorMessage={errorMsg}
                    isErrorDisplayed="true"
                    autoFocus = {false}
                    maxLength={250}
                    placeholder = {placeholder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        cb(e.target.value);
                        if(!enableValidate || (enableValidate && validate(e.target.value, elementId, validateCb))){
                            _.set(stateData, propertyPath, isNotEncode ? e.target.value : _.escape(e.target.value));
                        }
                        dispatch(
                            Actions.updateCurrentConfig({
                                emailSettings: stateData
                            })
                        )
                    }}
                />
            </div>
        )
};

  


export default FormInput;