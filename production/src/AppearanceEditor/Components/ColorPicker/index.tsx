import * as React from 'react';
import { Popover } from 'antd';
import { SketchPicker } from 'react-color';
import './styles.scss';

type ColorPickerType = {
    color: string;
    onColorChange: any;
    presetColors: Array<string>;
    disableAlpha: boolean;
    children: React.ReactNode;
};

const PICKER_WIDTH = '209px';

const ColorPicker: React.FC<ColorPickerType> = ({
    color,
    onColorChange,
    presetColors,
    disableAlpha,
    children,
}) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover
            overlayClassName="mstr-theme-color-picker-overlay"
            content={
                <SketchPicker
                    color={color}
                    onChangeComplete={(c) => onColorChange(c.hex)}
                    width={PICKER_WIDTH}
                    presetColors={presetColors}
                    disableAlpha={disableAlpha}
                />
            }
            trigger="click"
            visible={open}
            onVisibleChange={(visible) => setOpen(visible)}
            getPopupContainer={trigger => trigger.parentElement}
            arrowPointAtCenter={true}
            placement="bottomLeft"
            align={{ offset: [0, 1]  }}
        >
            {children}
        </Popover>
    );
};

ColorPicker.defaultProps = {
    color: '#ffffff',
    onColorChange: () => {},
    presetColors: [],
    disableAlpha: true
};

export default ColorPicker;
