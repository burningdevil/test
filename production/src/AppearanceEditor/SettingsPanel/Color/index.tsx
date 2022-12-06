import * as React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Radio, Space } from 'antd';
import {
    ApplicationColor,
    ThemeColorFormats,
} from '../../../types/data-model/HomeScreenConfigModels';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import {
    EnumThemeTypes,
    EnumSelectedThemes,
    EnumSelectedThemeLabels,
    isCustomColorTheme,
    prefinedColorSets,
} from '../../utils/appThemeColorHelper';
import { selectCurrentThemeColor } from '../../../store/selectors/AppearanceEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import { t } from '../../../i18n/i18next';
import './styles.scss';
import ColorPropEditor from './ColorPropEditor';

const classNamePrefix = 'mstr-app-theme-colors';
const colorBoxClassNamePrefix = 'color-box';

type ColorProps = {
    color: ApplicationColor;
    updateTheme: (color: {
        selectedTheme: string;
        formatting?: ThemeColorFormats;
    }) => {};
    settingsPanelRef: any;
};

const Color: React.FC<ColorProps> = ({
    color,
    updateTheme,
    settingsPanelRef,
}) => {
    const { selectedTheme = '' } = color || {};
    const isColorPropEditorOpen = isCustomColorTheme(selectedTheme);

    /**
     * Updates redux store with the newly selected color formats
     * If the currently selected theme is custom then sets the formatting properties
     * to previously selected theme option (automatically sets to RED if previously selected theme was 'Light')
     *
     * @param selectedTheme -  Theme currently selected by user
     */
    const onColorChange = (selectedTheme: string) => {
        const colorObj: any = { color: { selectedTheme, formatting: null } };
        if (isCustomColorTheme(selectedTheme)) {
            // if no theme is selected - default to RED theme color
            colorObj.color.formatting = color.selectedTheme
                ? prefinedColorSets[color.selectedTheme]
                : prefinedColorSets[EnumSelectedThemes.RED];
        }
        updateTheme(colorObj);
    };

    /**
     * Return a radio UI option with color box and theme label
     * @param value - The hexcode value to paint the color box UI
     * @param label - The selected theme name
     * @returns
     */
    const getColorRadioOption = (value: string, label: string) => (
        <Radio className={`${classNamePrefix}-option`} value={value}>
            <div className={`${classNamePrefix}-option-content`}>
                <div className={`${colorBoxClassNamePrefix}-wrapper`}>
                    <div
                        className={classnames(colorBoxClassNamePrefix, value)}
                    ></div>
                    <div className={`${colorBoxClassNamePrefix}-label`}>
                        {label}
                    </div>
                </div>
                {isCustomColorTheme(value) && isColorPropEditorOpen ? (
                    <ColorPropEditor settingsPanelRef={settingsPanelRef} />
                ) : null}
            </div>
        </Radio>
    );

    return (
        <div className={classNamePrefix}>
            <div className={`${classNamePrefix}-title`}>{t('App Theme')}</div>
            <div className={`${classNamePrefix}-subtitle`}>
                {t(
                    'Please select a pre-defined theme or create a custom theme'
                )}
            </div>
            <div className={`${classNamePrefix}-options`}>
                <Radio.Group
                    value={selectedTheme}
                    onChange={(e) => onColorChange(e.target.value)}
                >
                    <Space
                        direction="vertical"
                        className={`${classNamePrefix}-option-group`}
                    >
                        {Object.values(EnumThemeTypes).map((color: string) =>
                            getColorRadioOption(
                                EnumSelectedThemes[color],
                                EnumSelectedThemeLabels[color]
                            )
                        )}
                    </Space>
                </Radio.Group>
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

export default connector(Color);
