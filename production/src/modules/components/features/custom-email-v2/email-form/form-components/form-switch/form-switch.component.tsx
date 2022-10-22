import * as React from 'react'
import { useDispatch } from 'react-redux';
import {Switch} from 'antd';
import * as Actions from '../../../../../../../store/actions/ActionsCreator';
import { FormSwitchInputModel } from '../form-input.model';
import * as _ from 'lodash';
const classNamePrefix = 'custom-email-form-v2'


const FormSwitch: React.FC<FormSwitchInputModel> = (props: FormSwitchInputModel
    ) => {
        const dispatch = useDispatch();
        const {label, value, cb, elementId, stateData} = props;
        const switchChange = (key:  string, value: boolean, cb: React.Dispatch<React.SetStateAction<boolean>>) =>{
            cb(value);
            _.set(stateData, key, value);
            dispatch(
                Actions.updateCurrentConfig({
                    emailSettings: stateData
                })
            )
        }
        const switchRender = (checked: any, value: string,cb: React.Dispatch<React.SetStateAction<boolean>>, ariaLabel: string) => {
            return <Switch
                        element-id = {value}
                        aria-label = {ariaLabel}
                        checked={checked}
                        onChange={(e: any) => switchChange(value,e, cb)}
                        size = 'small'
                    />
        }
        return (
            <div className={`${classNamePrefix}-box`}>
                <span>{label}</span>
                {switchRender(value, elementId, cb, label)}
            </div> 
        )
};

  


export default FormSwitch;