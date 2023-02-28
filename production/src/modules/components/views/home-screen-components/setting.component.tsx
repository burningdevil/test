import React, { useState } from 'react';
import './setting.scss';
import { Popover } from 'antd';
import {
    FilterSummaryPopover,
    SubmitPopover,
} from './submit-popover.component';
import { iconTypes } from '../../HomeScreenConfigConstant';
import { useEffect } from 'react';

const SettingIcon: React.FC<{
    enabled: boolean;
    iconKey: string;
    independentSetting?: boolean;
}> = (props: {
    enabled: boolean;
    iconKey: string;
    independentSetting?: boolean;
}) => {
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        if (!props.enabled && !props.independentSetting) return;
        setOpen(newOpen);
    };
    const generateClassName = () => {
        if (!props.enabled && !props.independentSetting) {
            return 'icon-settings icon-settings-disabled';
        }
        if (open) {
            return 'icon-settings-open';
        }
        return 'icon-settings';
    };
    const generateContent = () => {
        switch (props.iconKey) {
            case iconTypes.filter_summary.key:
                return (
                    <FilterSummaryPopover
                        dependentValue={props.enabled}
                    ></FilterSummaryPopover>
                );
            default:
                return (
                    <SubmitPopover
                        close={setOpen}
                        iconKey={props.iconKey}
                    ></SubmitPopover>
                );
        }
    };
    useEffect(() => {
        const hidePopover = () => {
            setOpen(false);
        };
        document
            .querySelector('.home-screen-components-scrollcontainer')
            .addEventListener('scroll', hidePopover);
        return () => {
            document
                .querySelector('.home-screen-components-scrollcontainer')
                .removeEventListener('scroll', hidePopover);
        };
    }, []);
    return (
        <Popover
            content={generateContent()}
            title=""
            align={{ offset: [100, -5] }}
            trigger="click"
            open={open && (props.enabled || props.independentSetting)}
            placement="bottom"
            style={{ width: 600 }}
            onOpenChange={handleOpenChange}
        >
            {<span className={generateClassName()} />}
        </Popover>
    );
};

export default SettingIcon;
