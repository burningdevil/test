import * as React from 'react';
import { Button, Popover } from 'antd';
// import { SketchPicker } from 'react-color';
import { localizedStrings } from '../../../modules/components/HomeScreenConfigConstant';
import ColorPickerContainer from '../../../modules/components/common-components/rc-compat/color-picker-container';
import { colorGuideHexVals } from '../../../modules/components/common-components/rc-compat/color-picker.constant';
import './styles.scss';

type ColorPickerType = {
    color: string;
    visible: boolean;
    onColorChange: any;
    popupContainer: any;
    children: any;
};

const ColorPickerComponent: React.FC<ColorPickerType> = ({
    color,
    onColorChange,
    popupContainer,
    children,
}) => {
    const colorPickerProps: any = {
        chosenTab: 'palette',
        colorGuideHexVals: colorGuideHexVals,
        gradientConfig: {},
        solidFavorites: [],
        customVals: [],
        paletteHexVals: [],
        displayMode: 'palette',
        opacity: 100,
        useGradient: false,
        useOpacity: false,
        allowResetDefault: true,
        value: color,
    };

    const [open, setOpen] = React.useState(false);
    const [currColorValue, setCurrColorValue] = React.useState(color);
    const [buttonDisabled, setButtonDisabled] = React.useState(
        color === currColorValue
    );

    const onColorValueChange = (v: string) => {
        setCurrColorValue(v);
        setButtonDisabled(v === color);
    };

    /**
     * Button group with the folowing functions
     * OK - Applies the changed color before closing the color picker (disabled if value has not change )
     * Cancel - closes color picker
     * @returns Button group
     */
    const buttonGroup = () => {
        return (
            <div className={`color-palette-editor-btn`}>
                <Button onClick={() => setOpen(false)}>
                    {localizedStrings.CANCEL}
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        onColorChange(currColorValue);
                        setOpen(false);
                    }}
                    disabled={buttonDisabled}
                >
                    {localizedStrings.OK}
                </Button>
            </div>
        );
    };

    /**
     * Color picker component
     */
    const popoverContent = (
        <div className="mstr-color-picker-content">
            <ColorPickerContainer
                {...colorPickerProps}
                onChange={onColorValueChange}
            ></ColorPickerContainer>
            {buttonGroup()}
        </div>
    );

    return (
        <Popover
            overlayClassName="mstr-theme-color-picker-overlay"
            trigger="click"
            content={popoverContent}
            visible={open}
            onVisibleChange={(visible) => setOpen(visible)}
            getPopupContainer={popupContainer}
            arrowPointAtCenter={true}
            placement="bottomLeft"
            zIndex={open ? 99999 : 1}
        >
            {children}
        </Popover>
    );
};

ColorPickerComponent.defaultProps = {
    color: '#ffffff',
    visible: false,
    onColorChange: () => {},
    children: null,
};

export default ColorPickerComponent;
