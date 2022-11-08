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
} from '../../../utils/appThemeColorHelper';
import ColorPicker from '../../../Components/ColorPicker';

type ColorPropEditorProps = {
    color: ApplicationColor;
    updateTheme: (theme: {
        color: {
            selectedTheme: string;
            formatting: ThemeColorFormats;
        };
    }) => {};
};

const gutterHorizontal = 0;
const gutterVertical = 6;
const hexStrLengthWithHash = 7;

const ColorPropEditor: React.FC<ColorPropEditorProps> = ({
    color,
    updateTheme,
}) => {
    const { selectedTheme, formatting } = color;

    const [formats, setFormats] = React.useState<ThemeColorFormats>(formatting);

    const initColorCodeValidity: { [key: string]: boolean } = {};
    Object.keys(EnumFormattingPropNames).forEach(
        (key) => (initColorCodeValidity[key] = true)
    );
    const [isColorCodeListValid, setIsColorCodeListValid] = React.useState(
        initColorCodeValidity
    );

    const [colorPropInFocus, setColorPropInFocus] = React.useState('');

    const isColorCodeValid = (hexCode: string) => {
        const threeHexPattern = new RegExp('#[A-Fa-f0-9]{3}$');
        const sixHexPattern = new RegExp('#[A-Fa-f0-9]{6}$');
        return threeHexPattern.test(hexCode) || sixHexPattern.test(hexCode);
    };

    const onColorCodeChange = (
        e: { target: { value: any } },
        title: string
    ) => {
        setFormats({
            ...formats,
            [title]: e.target.value,
        });
        setIsColorCodeListValid({
            ...isColorCodeListValid,
            [title]: isColorCodeValid(e.target.value),
        });
    };

    const onEnter = (e: any, title: string) => {
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

    const getColorPropRow = (start: number, end: number) => {
        const cols = [];
        for (let i = start; i <= end; i++) {
            const propName = colorPropTitles[i][0];
            const title = colorPropTitles[i][1];
            cols.push(getColorPropCols(propName, title, formats[propName]));
        }
        return <Row gutter={[gutterHorizontal, gutterVertical]}>{cols}</Row>;
    };

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
            <Form.Item className="color-prop-item" label={title}>
                <div
                    className="color-prop-item-content"
                    onFocus={(e: any) => setColorPropInFocus(propName)}
                >
                    <ColorPicker
                        color={hexValue}
                        onColorChange={(v: string) =>
                            onColorCodeChange(
                                { target: { value: v } },
                                propName
                            )
                        }
                    >
                        <div
                            className="color-box"
                            style={{ background: hexValue }}
                        ></div>
                    </ColorPicker>
                    <Input
                        className="color-value-input"
                        value={hexValue}
                        bordered={false}
                        maxLength={hexStrLengthWithHash}
                        onChange={(e) => onColorCodeChange(e, propName)}
                        onPressEnter={(e: any) => onEnter(e, propName)}
                        onBlur={(e: any) => onEnter(e, propName)}
                    ></Input>
                </div>
            </Form.Item>
        </Col>
    );

    return (
        <div className="mstr-app-theme-color-prop-editor">
            <Form className="color-prop-list" layout={'vertical'}>
                {getColorPropRow(0, 2)}
                {getColorPropRow(3, 5)}
                {getColorPropRow(6, 8)}
                {getColorPropRow(9, 10)}
            </Form>
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
