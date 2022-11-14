import * as React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Form, Row, Col, Input } from 'antd';
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
    updateTheme: (theme: {
        color: {
            selectedTheme: string;
            formatting: ThemeColorFormats;
        };
    }) => {};
    settingsPanelRef: any;
};

const gutterHorizontal = 0;
const gutterVertical = 6;
const hexStrLengthWithHash = 7;

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
        setFormats({
            ...formats,
            [title]: e.target.value,
        });
        setIsColorCodeListValid({
            ...isColorCodeListValid,
            [title]: isColorCodeValid(e.target.value),
        });
    };

    const onBlur = (e: any, title: string) => {
        if (
            Object.values(isColorCodeListValid).every(
                (colorCodeValid) => colorCodeValid
            )
        ) {
            updateTheme({ color: { selectedTheme, formatting: formats } });
        } else {
            // revert to previous value if any color code is invalid
            setFormats(formatting);
        }
    };

    /**
     * Returns a grid row with 3 color format properties. For ex:
     *
     *  Toolbar BG    Toolbar Icon    Sidebar BG
     *  [ ] #F24AC1   [ ] #FFEAEA     [ ] #FFF0F0
     *
     * @param start
     * @param end
     * @returns
     */
    const getColorPropRow = (start: number, end: number) => {
        const cols = [];
        for (let i = start; i <= end; i++) {
            const propName = colorPropTitles[i][0];
            const title = colorPropTitles[i][1];
            cols.push(getColorPropCols(propName, title, formats[propName]));
        }
        return <Row gutter={[gutterHorizontal, gutterVertical]}>{cols}</Row>;
    };

    /**
     * Returns a grid coloumn with one color format property. For ex:
     *
     *  Toolbar BG
     *  [ ] #F24AC1
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
                onClick={() => setColorPropInFocus(propName)}
                onBlur={(e: any) => onBlur(e, propName)}
            >
                <div className="color-prop-item-title">{title}</div>
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
                            style={{ background: hexValue }}
                        ></div>
                    </ColorPickerComponent>

                    <Input
                        className="color-value-input"
                        value={hexValue}
                        bordered={false}
                        maxLength={hexStrLengthWithHash}
                        onChange={(e) => onColorChange(e, propName)}
                    ></Input>
                </div>
            </div>
        </Col>
    );

    return (
        <div className="mstr-app-theme-color-prop-editor">
            <div className="color-prop-list">
                {getColorPropRow(0, 2)}
                {getColorPropRow(3, 5)}
                {getColorPropRow(6, 8)}
                {getColorPropRow(9, 10)}
            </div>
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
