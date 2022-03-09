import * as React from 'react';
import {
    default as VC,
    localizedStrings,
} from '../../HomeScreenConfigConstant';
import { Checkbox } from 'antd';
import PaletteGridView from './palette-grid-view/palette-grid-view';
import { useState, useEffect } from 'react';
import './color-palette.scss';
import * as api from '../../../../services/Api';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectApplicationPalettes,
    selectUseConfigPalettes,
} from '../../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../../store/actions/ActionsCreator';
import CustomPaletteModal from './custom-palette-modal/custom-palette-modal';
const classNamePrefix = 'home-screen-dossiersetting';

const ColorPaletteBlade: React.FC<any> = () => {
    const useConfigPalettes = useSelector(selectUseConfigPalettes) ?? false;
    const applicationPalettes = useSelector(selectApplicationPalettes);
    const [isUseConfigurationPalettes, setUseConfigurationPalettes] =
        useState(useConfigPalettes);
    const [showColorPaletteEditor, openColorPaletteEditor] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        isUseConfigurationPalettes && api.loadColorPaletteList();
    }, [isUseConfigurationPalettes]);

    useEffect(() => {
        setUseConfigurationPalettes(useConfigPalettes);
    }, [useConfigPalettes]);

    const handleAddColorPalette = () => {
        openColorPaletteEditor(true);
    };
    const onCheckChangeUseProject = (e: any, dispatch: any) => {
        setUseConfigurationPalettes(e.target.checked);
        dispatch(
            Actions.updateCurrentConfig({
                useConfigPalettes: e.target.checked,
            })
        );
    };
    return (
        <div
            id="color-palette-setting"
            className={`${classNamePrefix}-container`}
        >
            <div className={`${classNamePrefix}-title`}>
                {localizedStrings.COLOR_PALETTE}
            </div>
            <div className={`${classNamePrefix}-desc`}>
                {localizedStrings.CUSTOM_COLOR_PALETTE_TAB_DESC}
            </div>
            {/* Default Color Palette Section*/}
            <div
                className={`${classNamePrefix}-default-color-palette-container`}
            >
                <Checkbox
                    onChange={(e) => onCheckChangeUseProject(e, dispatch)}
                    checked={isUseConfigurationPalettes}
                >
                    {localizedStrings.USE_NEW_COLOR_PALETTE_DESC}
                </Checkbox>
            </div>

            {/* Custom Color Palette section */}
            {isUseConfigurationPalettes && (
                <div
                    className={`${classNamePrefix}-custom-color-palette-container`}
                >
                    <div
                        className={`${classNamePrefix}-custom-color-palette-title-section`}
                    >
                        <span
                            className={`${classNamePrefix}-custom-color-palette-title`}
                        >
                            {localizedStrings.CUSTOM_COLOR_PALETTE_TITLE}
                        </span>
                        {applicationPalettes?.length > 0 && (
                            <span
                                className={`${classNamePrefix}-custom-color-palette-new`}
                                onClick={handleAddColorPalette}
                            >
                                <span
                                    className={`${classNamePrefix}-custom-color-palette-new-text`}
                                >
                                    {localizedStrings.EDIT}
                                </span>
                            </span>
                        )}
                    </div>
                    {!applicationPalettes?.length && (
                        <div style={{ marginTop: '20px' }}>
                            <span
                                className={`${classNamePrefix}-custom-color-palette-new`}
                                onClick={handleAddColorPalette}
                            >
                                <span
                                    tabIndex={0}
                                    aria-label={
                                        localizedStrings.NEW_COLOE_PALETTE
                                    }
                                    className={VC.FONT_ADD_NEW}
                                />
                                <span
                                    className={`${classNamePrefix}-custom-color-palette-new-text`}
                                >
                                    {localizedStrings.NEW_COLOE_PALETTE}
                                </span>
                            </span>
                        </div>
                    )}

                    {/* Custom Color Palette List */}
                    {applicationPalettes?.length > 0 && (
                        <PaletteGridView
                            paletteType={0}
                            classNamePrefix="home-dossier-setting-grid-custom"
                        />
                    )}
                    {showColorPaletteEditor && (
                        <CustomPaletteModal
                            applicationPalettes={applicationPalettes}
                            visible={showColorPaletteEditor}
                            close={openColorPaletteEditor}
                        ></CustomPaletteModal>
                    )}
                </div>
            )}
        </div>
    );
};

export default ColorPaletteBlade;
