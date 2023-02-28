import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import {
    IconEnum,
    iconTypes,
    localizedStrings,
} from '../../HomeScreenConfigConstant';
import { ICON_KEY_ENUM } from './icon-key-enum';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../../../../store/actions/ActionsCreator';
import {
    selectCurrentConfig,
    selectSelectedLibraryCustomizedItems,
} from '../../../../../src/store/selectors/HomeScreenConfigEditorSelector';
import * as _ from 'lodash';
import { useEffect } from 'react';
import { t } from '../../../../i18n/i18next';
import { Rule } from 'antd/lib/form';

// there are four types of submit popover, so should define the label and key map
const submitPopoverStringMap = {
    [iconTypes.mobile_helpAndLegal_help.key]: {
        name: {
            label: 'Link Name',
            key: ICON_KEY_ENUM.mobile_helpAndLegal_help_name,
            placeholder: 'Help',
        },
        url: {
            label: 'URL',
            key: ICON_KEY_ENUM.mobile_helpAndLegal_help_addr,
            rules: [{ type: 'url', message: t('hostInvalidTip') }],
        },
    },
    [iconTypes.web_help.key]: {
        name: {
            label: 'Link Name',
            placeholder: 'Help',
            key: ICON_KEY_ENUM.web_help_name,
        },
        url: {
            label: 'URL',
            key: ICON_KEY_ENUM.web_help_addr,
            rules: [{ type: 'url', message: t('hostInvalidTip') }],
        },
    },
    [iconTypes.mobile_helpAndLegal_legal.key]: {
        name: {
            label: 'Name',
            placeholder: 'Legal',
            key: ICON_KEY_ENUM.mobile_helpAndLegal_legal_name,
        },
        url: {
            label: 'URL',
            key: ICON_KEY_ENUM.mobile_helpAndLegal_legal_addr,
            rules: [{ type: 'url', message: t('hostInvalidTip') }],
        },
    },
};
const SubmitPopover: React.FC<any> = (props: {
    close: any;
    iconKey: IconEnum;
}) => {
    const [form] = Form.useForm();
    const [config, setConfig] = useState(useSelector(selectCurrentConfig));
    const dispatch = useDispatch();
    useEffect(() => {
        setConfig(config);
    }, [config]);
    useEffect(() => {
        const fieldInfo = {
            [submitPopoverStringMap[props.iconKey].name?.key]: _.get(
                config,
                submitPopoverStringMap[props.iconKey].name?.key
            ),
            [submitPopoverStringMap[props.iconKey].url?.key]: _.get(
                config,
                submitPopoverStringMap[props.iconKey].url?.key
            ),
        };
        form.setFieldsValue(fieldInfo);
    }, [config, form, props.iconKey]);
    const onFinish = () => {
        const currentConfig = { ...config };
        _.set(
            currentConfig,
            submitPopoverStringMap[props.iconKey].name?.key,
            form.getFieldValue(submitPopoverStringMap[props.iconKey].name?.key)
        );
        _.set(
            currentConfig,
            submitPopoverStringMap[props.iconKey].url?.key,
            form.getFieldValue(submitPopoverStringMap[props.iconKey].url?.key)
        );
        dispatch(Actions.updateCurrentConfig(currentConfig));
        message.success(t('submitSuccess'));
        props.close(false);
    };

    const onCancel = () => {
        props.close(false);
    };
    return (
        <Form
            name="wrap"
            form={form}
            labelCol={
                props.iconKey ===
                iconTypes.mobile_helpAndLegal_reportProblem.key
                    ? { flex: '105px' }
                    : { flex: '80px' }
            }
            labelAlign="left"
            labelWrap
            size="small"
            wrapperCol={{ flex: 1 }}
            colon={false}
            onFinish={onFinish}
            style={{ width: 433, marginLeft: '5px' }}
        >
            <Form.Item
                style={{ marginBottom: '12px', marginTop: '5px' }}
                label={submitPopoverStringMap[props.iconKey].name?.label}
                name={submitPopoverStringMap[props.iconKey].name?.key}
            >
                <Input
                    style={{ height: '28px' }}
                    placeholder={
                        submitPopoverStringMap[props.iconKey].name?.placeholder
                    }
                />
            </Form.Item>

            <Form.Item
                style={{ marginBottom: '15px', height: '28px' }}
                label={submitPopoverStringMap[props.iconKey].url?.label}
                name={submitPopoverStringMap[props.iconKey].url?.key}
                rules={
                    submitPopoverStringMap[props.iconKey]?.url.rules as Rule[]
                }
            >
                <Input style={{ height: '28px' }} />
            </Form.Item>

            <Form.Item
                label=" "
                labelAlign="right"
                style={{ marginBottom: '4px' }}
            >
                <div style={{ float: 'right' }}>
                    <Button
                        type="link"
                        style={{ width: '80px', height: '26px' }}
                        htmlType="button"
                        onClick={onCancel}
                    >
                        {localizedStrings.CANCEL}
                    </Button>

                    <Button
                        type="primary"
                        style={{ width: '80px', height: '26px' }}
                        htmlType="submit"
                    >
                        {localizedStrings.SAVE}
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};
const FilterSummaryPopover: React.FC<any> = (props: {
    dependentValue: boolean;
}) => {
    const [config, setConfig] = useState(useSelector(selectCurrentConfig));
    const [customizedItems, setCustomizedItems] = useState(
        useSelector(selectSelectedLibraryCustomizedItems)
    );
    const [filterSummaryHide, setFilterSummaryHide] = useState(false);
    const [filterSummaryControl, setFilterSummaryControl] = useState(false);
    const [filterSummaryEnable, setFilterSummaryEnable] = useState(
        props.dependentValue
    );
    const dispatch = useDispatch();
    useEffect(() => {
        setConfig(config);
        setCustomizedItems(customizedItems);
        setFilterSummaryHide(
            _.get(config, ICON_KEY_ENUM.filter_summary_checkbox)
        );
        setFilterSummaryControl(
            _.get(config, ICON_KEY_ENUM.filter_summary_control_checkbox)
        );
        setFilterSummaryEnable(customizedItems.filter_summary);
    }, [
        JSON.stringify(customizedItems),
        JSON.stringify(config),
        props.dependentValue,
    ]);

    const onChange = (e: CheckboxChangeEvent) => {
        const currentConfig = config;
        setFilterSummaryHide(e.target.checked);
        _.set(
            currentConfig,
            ICON_KEY_ENUM.filter_summary_checkbox,
            e.target.checked
        );
        dispatch(Actions.updateCurrentConfig(currentConfig));
    };
    const onFilterSummaryControlChange = (e: CheckboxChangeEvent) => {
        const currentConfig = config;
        setFilterSummaryControl(e.target.checked);
        _.set(
            currentConfig,
            ICON_KEY_ENUM.filter_summary_control_checkbox,
            e.target.checked
        );
        dispatch(Actions.updateCurrentConfig(currentConfig));
    };
    return (
        <div style={{ width: '433px', marginLeft: '-4px' }}>
            {/* this checkbox depends on the parent filter's on */}
            {
                <div>
                    <Checkbox
                        checked={filterSummaryControl}
                        onChange={onFilterSummaryControlChange}
                    >
                        {t('allowUserControlFilterSummary')}
                    </Checkbox>
                </div>
            }
            <div>
                {(props.dependentValue || filterSummaryControl) && (
                    <Checkbox checked={filterSummaryHide} onChange={onChange}>
                        {t('hideSummaryMsg')}
                    </Checkbox>
                )}
            </div>
        </div>
    );
};

export { SubmitPopover, FilterSummaryPopover };
