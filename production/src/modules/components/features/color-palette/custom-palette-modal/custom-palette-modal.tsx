import * as React from 'react';
import {
    default as VC,
    localizedStrings,
    bundlePickerSize,
} from '../../../HomeScreenConfigConstant';
import { Button, Modal } from 'antd';
import { SearchInput } from '@mstr/rc';
import CustomPaletteModalGrid from './custom-palette-modal-grid/custom-palette-modal-grid';
import { useState, useEffect } from 'react';
import './custom-palette-modal.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAllColorPalettes,
    selectApplicationDefaultPalette,
    selectApplicationPalettes,
} from '../../../../../store/selectors/HomeScreenConfigEditorSelector';
import ColorPaletteEditor from '../color-palette-editor/color-palette-editor';

import * as Actions from '../../../../../store/actions/ActionsCreator';
import {
    COLOR_PALETTE_SELECTED_FORM,
    getSupportSingleColorPalette,
} from '../color-palette.util';
import { t } from '../../../../../../src/i18n/i18next';
const classNamePrefix = 'custom-palette-add-container';

const ColorPaletteModal: React.FC<any> = (props: any) => {
    const dispatch = useDispatch();
    const paletteList = useSelector(selectAllColorPalettes);
    const applicationPalettes = useSelector(selectApplicationPalettes) ?? [];
    const defaultPaletteId = useSelector(selectApplicationDefaultPalette);
    const [selectedCustomPalettes, setCustomPalettes] =
        useState(applicationPalettes);
    const [currentPalettesLen, setPaletteLength] = useState(
        paletteList?.length
    );
    const [disableSave, setDisableSave] = useState(false);
    const [nameFilter, setFilterName] = useState('');
    const [isShowEditPalette, setEditorPalette] = useState(false);
    useEffect(() => {
        if (applicationPalettes?.length > 0) {
            setDisableSave(false);
        } else {
            setDisableSave(true);
        }
    }, [applicationPalettes?.length]);

    const dispatchUpdateAction = (
        defaultApplicationPalettes: string[],
        targetData: string[]
    ) => {
        const defaultData = getSupportSingleColorPalette()
            ? []
            : defaultApplicationPalettes;
        dispatch(
            Actions.updateCurrentConfig({
                applicationPalettes: Array.from(
                    new Set(defaultData.concat(targetData))
                ),
            })
        );
    };
    const checkIndeterminate = (selectedRows?: any[]) => {
        setCustomPalettes(selectedRows.map((v) => v.id));
        if (selectedRows?.length === 0) {
            setDisableSave(true);
        } else {
            setDisableSave(false);
        }
    };
    const handleSearch = (val: string) => {
        setFilterName(val);
    };
    const handleCancelAdd = () => {
        setFilterName('');
        props.close(false);
        localStorage.setItem(COLOR_PALETTE_SELECTED_FORM, '');
    };
    const handleSaveAdd = () => {
        props.close(false);
        localStorage.setItem(COLOR_PALETTE_SELECTED_FORM, '');
        setFilterName('');
        const paletteRecordMap: any = {};
        paletteList.forEach((item) => {
            paletteRecordMap[item.id] = item.name;
        });
        selectedCustomPalettes.sort((a, b) => {
            return paletteRecordMap[a] < paletteRecordMap[b] ? -1 : 1;
        });
        dispatchUpdateAction([], selectedCustomPalettes);
        // for the single selection case, there is no set default operation. So when the radio selection is changed, should update the default palette at the same time.
        // for the multiple case, always use the first one as default unless the defaultId is in the selected list.
        if (!selectedCustomPalettes.includes(defaultPaletteId)) {
            dispatch(
                Actions.updateCurrentConfig({
                    applicationDefaultPalette: selectedCustomPalettes[0],
                })
            );
        }
    };

    const buttonGroup = () => {
        return (
            <div className={`${classNamePrefix}-btn`}>
                <Button onClick={handleCancelAdd} style={{ paddingTop: 0 }}>
                    {localizedStrings.CANCEL}
                </Button>
                <Button
                    type="primary"
                    style={{ marginLeft: 10, paddingTop: 0 }}
                    onClick={handleSaveAdd}
                    disabled={disableSave}
                >
                    {localizedStrings.OK}
                </Button>
            </div>
        );
    };
    const getAddColorPaletteIcon = () => {
        return (
            <span
                className={`${classNamePrefix}-custom-color-palette-new`}
                onClick={() => setEditorPalette(true)}
            >
                <span
                    tabIndex={0}
                    aria-label={localizedStrings.NEW_COLOE_PALETTE}
                    className={VC.FONT_ADD_NEW}
                />
                <span
                    className={`${classNamePrefix}-custom-color-palette-new-text`}
                >
                    {localizedStrings.NEW_COLOE_PALETTE}
                </span>
            </span>
        );
    };
    return (
        <Modal
            title={localizedStrings.ADD_CUSTOM_COLOR_PALETTES}
            className={`modal-container`}
            destroyOnClose={true}
            width={bundlePickerSize.width}
            maskClosable={false}
            visible={props.visible}
            footer={null}
            onCancel={() => {}}
        >
            <div className={`custom-palette-modal`}>
                <div className={`${classNamePrefix}`}>
                    <div className={`${classNamePrefix}-top`}>
                        <div className={`${classNamePrefix}-header`}>
                            {t('addCustomColorPalettesMessage')}
                        </div>
                        <div className={`${classNamePrefix}-search-container`}>
                            <SearchInput
                                className={`${classNamePrefix}-search`}
                                placeholder={localizedStrings.SEARCH}
                                value={nameFilter}
                                onChange={(value: string) => {
                                    handleSearch(value);
                                }}
                                onClear={() => {
                                    handleSearch('');
                                }}
                            />
                            <div className={`${classNamePrefix}-palette-count`}>
                                {`Palettes: ${currentPalettesLen}`}
                            </div>
                            <div className={`${classNamePrefix}-add-palette`}>
                                {getAddColorPaletteIcon()}
                                <ColorPaletteEditor
                                    visible={isShowEditPalette}
                                    isCreate={true}
                                    onClose={() => setEditorPalette(false)}
                                ></ColorPaletteEditor>
                            </div>
                        </div>
                    </div>
                    <div className={`${classNamePrefix}-middle`}>
                        <div className={`${classNamePrefix}-grid`}>
                            <div
                                className={`${classNamePrefix}-grid-left`}
                            ></div>
                            <div className={`${classNamePrefix}-grid-right`}>
                                <CustomPaletteModalGrid
                                    nameFilter={nameFilter}
                                    paletteType={2}
                                    checkIndeterminate={checkIndeterminate}
                                    setCustomPalettes={setCustomPalettes}
                                    setPaletteLength={setPaletteLength}
                                ></CustomPaletteModalGrid>
                            </div>
                        </div>
                    </div>
                </div>
                {buttonGroup()}
            </div>
        </Modal>
    );
};

export default ColorPaletteModal;
