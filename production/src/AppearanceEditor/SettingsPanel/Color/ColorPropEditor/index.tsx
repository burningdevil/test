import * as React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Row, Col } from 'antd';
import { Tooltip, Input } from '@mstr/rc';
import {
    ApplicationColor,
    ThemeColorFormats,
} from '../../../../types/data-model/HomeScreenConfigModels';
import { RootState } from '../../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentThemeColor } from '../../../../store/selectors/AppearanceEditorSelector';
import * as Actions from '../../../../store/actions/ActionsCreator';
import './styles.scss';
import {
    colorPropTitles,
    EnumFormattingPropNames,
    isColorCodeValid,
} from '../../../utils/appThemeColorHelper';
import ColorPickerComponent from '../../../Components/ColorPicker';

type ColorPropEditorProps = {
    color: ApplicationColor;
    updateTheme: (theme: { color: ApplicationColor }) => {};
    settingsPanelRef: any;
};

const gutterHorizontal = 0;
const gutterVertical = 6;
const hexStrLength = 6;

const ColorPropEditor: React.FC<ColorPropEditorProps> = ({
    color,
    updateTheme,
    settingsPanelRef,
}) => {
    const { selectedTheme, formatting } = color;

    // Initialize validity of color code properties to true
    const initColorCodeValidity: { [key: string]: boolean } = {};
    Object.keys(EnumFormattingPropNames).forEach(
        (key) => (initColorCodeValidity[key] = true)
    );

    // current list of color format values
    const [formats, setFormats] = React.useState<ThemeColorFormats>(formatting);

    // List of booleans indicating whether current list of color format values are valid 3 or 6 digit hex values
    const [isColorCodeListValid, setIsColorCodeListValid] = React.useState(
        initColorCodeValidity
    );

    // Variable to track the current property being edited
    const [colorPropInFocus, setColorPropInFocus] = React.useState('');

    const onColorChange = (e: { target: { value: any } }, title: string) => {
        const updatedFormatsFromUserInput = {
            ...formats,
            [title]: e.target.value,
        };

        setFormats(updatedFormatsFromUserInput);

        setIsColorCodeListValid({
            ...isColorCodeListValid,
            [title]: isColorCodeValid(e.target.value),
        });

        if (isColorCodeValid(e.target.value)) {
            updateTheme({ color: { selectedTheme, formatting: updatedFormatsFromUserInput} });
        }
    };

    const onBlur = (title: string) => {
        if (Object.values(isColorCodeListValid).includes(false)) {
            // revert to previous value if any color code is invalid
            setFormats(formatting);
            setIsColorCodeListValid({
                ...isColorCodeListValid,
                [title]: true,
            });
        }   
    };

     /**
     * Returns a grid row with either a color category or a format property. For ex:
     *  Toolbar 
     *    or 
     *  Background    [ ] #F24AC1  
     *
     * @param row
     * @returns
     */
    const getColorPropRow = (row: number) => {
        const cols = [];

        const propName = colorPropTitles[row][0];
        if (colorPropTitles[row].length === 1) {
            cols.push(getCategoryLableCols(propName));
        } else {
            const title = colorPropTitles[row][1];
            cols.push(getColorPropCols(propName, title, formats[propName]));
        }
          
        return <Row gutter={[gutterHorizontal, gutterVertical]}>{cols}</Row>; 
    };

    /**
     *
     * @param propName - Display name of format property
     * @param title - format property name
     * @param hexValue - color hex code value
     * @returns
     */
    const getColorPropCols = (
        propName: string,
        title: string,
        hexValue: string
    ) => (
        <Col
            className={classnames(
                colorPropInFocus === propName ? 'in-focus' : ''
            )}
            span={8}
        >
            <div
                className="color-prop-item"
                onMouseEnter={() => setColorPropInFocus(propName)}
                onMouseLeave={() => setColorPropInFocus('')}
                onBlur={() => onBlur(propName)}
            >
                <Tooltip
                    title={title}
                    placement='bottomLeft'
                    mouseLeaveDelay={0}
                >
                       <div className="color-prop-item-title">{title}</div>
                </Tooltip>
                <div
                    id={`mstr-color-prop-${propName}`}
                    className="color-prop-item-content"
                >
                    <ColorPickerComponent
                        color={hexValue}
                        visible={false}
                        onColorChange={(v: string) => {
                            onColorChange({ target: { value: v } }, propName);
                        }}
                        // attach color picker to the settings panel to avoid z-index and scroll issues
                        popupContainer={() => settingsPanelRef}
                    >
                        <div
                            className="color-box"
                            // display background color for the valid color code input
                            style={{background: isColorCodeValid(hexValue) && hexValue }}
                        ></div>
                    </ColorPickerComponent>

                    <Input
                        className="color-value-input"
                        value={hexValue.substring(1)} // hex value without hash prefix
                        bordered={false}
                        maxLength={hexStrLength}
                        onChange={(e: any) => {
                            // Add the hash prefix before calling color change callback
                            e.target.value = `#${e.target.value}`
                            onColorChange(e, propName)
                        }}
                        onValidate={() => isColorCodeListValid[propName]}
                        isErrorDisplayed={!isColorCodeListValid[propName]}
                        autoFocus={false}
                        onPressEnter={(e: any) => {
                            !isColorCodeListValid[propName] && onBlur(propName);
                            e.target.blur();
                        }}
                    ></Input>
                </div>
            </div>
        </Col>
    );

    const getCategoryLableCols = (propName: string) => (
        <Tooltip
            title={propName}
            placement='bottomLeft'
            mouseLeaveDelay={0}
        >
               <div className="color-prop-category-title">{propName}</div>
        </Tooltip>
    );

    const rows = [];
    
    for (let i = 0; i < colorPropTitles.length; i++) {
        rows.push(getColorPropRow(i));
    }

    return (
        <div className="mstr-app-theme-color-prop-editor">
            <div className="color-prop-list">{rows}</div>
        </div>
    );
};

const mapState = (state: RootState) => ({
    color: selectCurrentThemeColor(state),
});

const connector = connect(mapState, {
    updateTheme: Actions.updateTheme,
});

export default connector(ColorPropEditor);
