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
        const hexValueWithHash = `#${e.target.value}`;

        const updatedFormatsFromUserInput = {
            ...formats,
            [title]: hexValueWithHash,
        };

        setFormats(updatedFormatsFromUserInput);

        setIsColorCodeListValid({
            ...isColorCodeListValid,
            [title]: isColorCodeValid(hexValueWithHash),
        });

        if (isColorCodeValid(hexValueWithHash)) {
            updateTheme({
                color: {
                    selectedTheme,
                    formatting: updatedFormatsFromUserInput,
                },
            });
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
     * Returns grid rows with a color category and a set of format fields. 
     * Color category
     *      format field1
     *      format field2
     * 
     * For ex:
     *  Toolbar
     *    Background    [ ] F24AC1
     *    Icon          [ ] 29313B
     *
     * @param row
     * @returns Array<Row> []
     */
    const getColorCategoryWithProps = (row: number) => {
        const rows = [];

        // insert color prop category 
        const category : any = colorPropTitles[row].title;
        rows.push(
            (<Row gutter={[gutterHorizontal, gutterVertical]}>{[getCategoryLableCols(category)]}</Row>)
        );

        // insert color prop fields
        colorPropTitles[row].props.forEach(p => rows.push(
            <Row gutter={[gutterHorizontal, gutterVertical]}>
                {
                    getColorPropCols(
                        p.name,
                        p.displayName,
                        formats[p.name].substring(1),
                        p.desc,
                    )
                }
            </Row>
            )
        );
        
        return rows;
    };

    /**
     *
     * @param propName - Display name of format property
     * @param title - format property name
     * @param hexValue - color hex code value
     * @param titleDetailInfo - detail info of format property name 
     * @returns
     */
    const getColorPropCols = (
        propName: string,
        title: string,
        hexValue: string,
        titleDetailInfo: string,
    ) => {
        const hexValueWithHash = `#${hexValue}`;
        return (
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
                    <div className="color-prop-item-title">
                        <Tooltip
                            title={title}
                            placement="bottomLeft"
                            mouseLeaveDelay={0}
                        >
                            <div className="color-prop-item-name">{title}</div>
                        </Tooltip>
                        {!!titleDetailInfo && 
                            <Tooltip
                                title={titleDetailInfo}
                                placement="bottomLeft"
                                mouseLeaveDelay={0}
                            >
                                <span className="icon-msg_info"></span>
                            </Tooltip>}
                    </div>
                    <div
                        id={`mstr-color-prop-${propName}`}
                        className="color-prop-item-content"
                    >
                        <ColorPickerComponent
                            color={hexValueWithHash}
                            visible={false}
                            onColorChange={(v: string) => {
                                // Remove the hash prefix before calling color change callback
                                onColorChange(
                                    { target: { value: v.substring(1) } },
                                    propName
                                );
                            }}
                            // attach color picker to the settings panel to avoid z-index and scroll issues
                            popupContainer={() => settingsPanelRef}
                        >
                            <div
                                className="color-box"
                                // display background color for the valid color code input
                                style={{
                                    background:
                                        isColorCodeValid(hexValueWithHash) &&
                                        hexValueWithHash,
                                }}
                            ></div>
                        </ColorPickerComponent>

                        <Input
                            className="color-value-input"
                            value={hexValue} // hex value without hash prefix
                            bordered={false}
                            maxLength={hexStrLength}
                            onChange={(e: any) => {
                                onColorChange(e, propName);
                            }}
                            onValidate={() => isColorCodeListValid[propName]}
                            isErrorDisplayed={!isColorCodeListValid[propName]}
                            autoFocus={false}
                            onPressEnter={(e: any) => {
                                !isColorCodeListValid[propName] &&
                                    onBlur(propName);
                                e.target.blur();
                            }}
                        ></Input>
                    </div>
                </div>
            </Col>
        );
    };

    const getCategoryLableCols = (propName: string) => (
        <Tooltip title={propName} placement="bottomLeft" mouseLeaveDelay={0}>
            <div className="color-prop-category-title">{propName}</div>
        </Tooltip>
    );

    const rows = [];

    for (let i = 0; i < colorPropTitles.length; i++) {
        rows.push(...getColorCategoryWithProps(i));
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
