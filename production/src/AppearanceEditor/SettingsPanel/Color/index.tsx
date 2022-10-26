import * as React from 'react';
import { connect } from 'react-redux';
import { Radio, Space } from 'antd';
import {
    ApplicationColor,
    ThemeColorFormats,
} from '../../../types/data-model/HomeScreenConfigModels';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import {
    EnumSelectedThemes,
    EnumSelectedThemeLabels,
    isCustomColorTheme,
} from '../../utils/appThemeColorHelper';
import { selectCurrentThemeColor } from '../../../store/selectors/AppearanceEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import { t } from '../../../i18n/i18next';
import './styles.scss';

const classNamePrefix = 'mstr-app-theme-colors';
const colorBoxClassNamePrefix = 'color-box';

type ColorProps = {
    color: ApplicationColor;
    updateTheme: (color: {
        selectedTheme: string;
        formatting?: ThemeColorFormats;
    }) => {};
};

const Color: React.FC<ColorProps> = ({ color, updateTheme }) => {
    const { selectedTheme = '', formatting = null } = color || {};
    const [selectedThemeColor, setSelectedThemeColor] =
        React.useState(selectedTheme);

    React.useEffect(() => {
        setSelectedThemeColor(color.selectedTheme);
    }, [color]);

    const onColorChange = (selectedTheme: string) => {
        setSelectedThemeColor(selectedTheme);
        if (!isCustomColorTheme(selectedTheme)) {
            const colorObj: any = {
                color: { selectedTheme },
            };
            updateTheme(colorObj);
        }
    };

    const getColorRadioOption = (value: string, label: string) => (
        <Radio className={`${classNamePrefix}-${value}`} value={value}>
            <div className={`${colorBoxClassNamePrefix}-wrapper`}>
                <div className={colorBoxClassNamePrefix}></div>
                <div className={`${colorBoxClassNamePrefix}-label`}>
                    {label}
                </div>
            </div>
        </Radio>
    );

    return (
        <React.Fragment>
            <div className={classNamePrefix}>
                <div className={`${classNamePrefix}-title`}>
                    {t('App Theme')}
                </div>
                <div className={`${classNamePrefix}-subtitle`}>
                    {t(
                        'Please select a pre-defined theme or create a custom theme'
                    )}
                </div>
                <div className={`${classNamePrefix}-options`}>
                    <Radio.Group
                        value={selectedThemeColor}
                        onChange={(e) => onColorChange(e.target.value)}
                    >
                        <Space
                            direction="vertical"
                            className={`${classNamePrefix}-option-group`}
                        >
                            {getColorRadioOption(
                                EnumSelectedThemes.USE_SYSTEM_SETTING,
                                EnumSelectedThemeLabels.USE_SYSTEM_SETTING
                            )}
                            {getColorRadioOption(
                                EnumSelectedThemes.LIGHT,
                                EnumSelectedThemeLabels.LIGHT
                            )}
                            {getColorRadioOption(
                                EnumSelectedThemes.DARK,
                                EnumSelectedThemeLabels.DARK
                            )}
                            {getColorRadioOption(
                                EnumSelectedThemes.DARK_BLUE,
                                EnumSelectedThemeLabels.DARK_BLUE
                            )}
                            {getColorRadioOption(
                                EnumSelectedThemes.BLUE,
                                EnumSelectedThemeLabels.BLUE
                            )}
                            {getColorRadioOption(
                                EnumSelectedThemes.RED,
                                EnumSelectedThemeLabels.RED
                            )}
                            {getColorRadioOption(
                                EnumSelectedThemes.GREEN,
                                EnumSelectedThemeLabels.GREEN
                            )}
                            {getColorRadioOption(
                                EnumSelectedThemes.YELLOW,
                                EnumSelectedThemeLabels.YELLOW
                            )}
                            {getColorRadioOption(
                                EnumSelectedThemes.CUSTOM,
                                EnumSelectedThemeLabels.CUSTOM
                            )}
                        </Space>
                    </Radio.Group>
                </div>
            </div>
        </React.Fragment>
    );
};

const mapState = (state: RootState) => ({
    color: selectCurrentThemeColor(state),
});

const connector = connect(mapState, {
    updateTheme: Actions.updateTheme,
});

export default connector(Color);
