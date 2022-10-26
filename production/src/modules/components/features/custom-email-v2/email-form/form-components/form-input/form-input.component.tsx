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
        const {label, value, cb, elementId, placeholder, propertyPath, tooltip, enableValidate, errorMessage, validateCb, isNotEncode, tooltipStr, stateData, validate} = props;
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
                            return validate(e, elementId, validateCb)
                        }else {
                            return true;
                        }
                    }}
                    errorMessage={errorMessage ?? customEmailStringDict.formGroup.actionButton.hostInvalidTip}
                    isErrorDisplayed="true"
                    autoFocus = {false}
                    maxLength={250}
                    placeholder = {placeholder}
                    onBlur = {(e: React.ChangeEvent<HTMLInputElement>) => {
                        // considering the performance, change the state in the blur event.
                        // if invalid, not update the value
                        if(enableValidate && !validate(e.target.value, elementId, validateCb)){
                            return;
                        }
                        _.set(stateData, propertyPath, isNotEncode ? e.target.value : _.escape(e.target.value));
                        dispatch(
                            Actions.updateCurrentConfig({
                                emailSettings: stateData
                            })
                        )
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        cb(e.target.value);
                        
                    }}
                />
            </div>
        )
};

  


export default FormInput;