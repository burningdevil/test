import * as React from 'react'
import { useDispatch } from 'react-redux';
import { ColorPickerDropdown, Input } from '@mstr/rc';

import * as Actions from '../../../../../../../store/actions/ActionsCreator';
import { DEFAULT_EMAIL_SETTING } from '../../../../../../../../src/store/reducers/HomeScreenConfigEditorReducer';
import { validateEmpty } from '../../../custom-email.util';
import { FormBtnColorInputModel } from '../form-input.model';
import * as _ from 'lodash';
import { customEmailStringDict } from '../../../../../HomeScreenConfigConstant';
import { colorGuideHexVals } from '../../../../../../../../src/modules/components/common-components/rc-compat/color-picker.constant';
const classNamePrefix = 'custom-email-form-v2'


const FormBtnColor: React.FC<FormBtnColorInputModel> = (props: FormBtnColorInputModel
    ) => {
        const dispatch = useDispatch();
        const {label, value, cb, elementId, placeholder, fontColor, fontColorCb, bgColor, bgColorCb, validate, stateData} = props;
        return (
            <div className={`${classNamePrefix}-box btn-color-box`}>
                <span>{label}</span>
                <Input
                    className = {'custom-input'}
                    value={value}
                    onValidate={(e: string) => {
                        return validate(e, elementId, validateEmpty)
                    }}
                    errorMessage={customEmailStringDict.emptyValidTip}
                    isErrorDisplayed="true"
                    autoFocus = {false}
                    maxLength={250}
                    placeholder = {placeholder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        cb(e.target.value);
                        if(!stateData?.button){
                            stateData['button'] = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.button));
                        }
                        if(!stateData?.button?.[elementId]){
                            stateData['button'][elementId] = JSON.parse(JSON.stringify((DEFAULT_EMAIL_SETTING.button as any)[elementId]))
                        }
                        (stateData['button'][elementId] as any)['text'] = _.escape(e.target.value);
                        dispatch(
                            Actions.updateCurrentConfig({
                                emailSettings: stateData
                            })
                        )
                    }}
                />
                <ColorPickerDropdown
                    value = {bgColor}
                    ariaLabel="Color Picker Dropdown"
                    className="ml8"
                    colorGuideHexVals = {[...colorGuideHexVals]}
                    useGradient = {false}
                    useOpacity = {false}
                    onChange={
                        (v: any) => {
                            bgColorCb(v);
                            if(!stateData?.button){
                                stateData['button'] = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.button));
                            }
                            if(!stateData?.button?.[elementId]){
                                stateData['button'][elementId] = JSON.parse(JSON.stringify((DEFAULT_EMAIL_SETTING.button as any)[elementId]))
                            }
                            (stateData['button'][elementId] as any)['backgroundColor'] = v;
                            dispatch(
                                Actions.updateCurrentConfig({
                                    emailSettings: stateData
                                })
                            )
                            }
                    }
                    onChangeFavorite={_.noop}
                    onChangeGradient={_.noop}
                    onChangeOpacity={_.noop}
                    onPopoverVisibleChange={_.noop}
                    />
                <ColorPickerDropdown
                    value = {fontColor}
                    ariaLabel="Color Picker Dropdown"
                    className="font-color-picker"
                    useGradient = {false}
                    useOpacity = {false}
                    colorGuideHexVals = {[...colorGuideHexVals]}
                    onChange={(v: any) => {
                            fontColorCb(v);
                            if(!stateData?.button){
                                stateData['button'] = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.button));
                            }
                            if(!stateData?.button?.[elementId]){
                                stateData['button'][elementId] = JSON.parse(JSON.stringify((DEFAULT_EMAIL_SETTING.button as any)[elementId]))
                            }
                            (stateData['button'][elementId] as any)['fontColor'] = v;
                            dispatch(
                                Actions.updateCurrentConfig({
                                    emailSettings: stateData
                                })
                            )
                            }
                    }
                    onChangeFavorite={_.noop}
                    onChangeGradient={_.noop}
                    onChangeOpacity={_.noop}
                    onPopoverVisibleChange={_.noop}
                    />
                    <div className = {'font-color-icon-container'}>
                        <p className = {'font-color-icon'}></p>
                    </div>
                

            </div> 
        )
};

  


export default FormBtnColor;