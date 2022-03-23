import * as React from 'react';
import {
    default as VC,
    localizedStrings,
    bundlePickerSize,
    paletteCountsStr,
} from '../../../HomeScreenConfigConstant';
import { Button, Modal } from 'antd';
import { SearchInput } from '@mstr/rc';
import CustomPaletteModalGrid from './custom-palette-modal-grid/custom-palette-modal-grid';
import { useState, useEffect, useCallback } from 'react';
import './custom-palette-modal.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAllColorPalettes,
    selectApplicationDefaultPalette,
} from '../../../../../store/selectors/HomeScreenConfigEditorSelector';
import ColorPaletteEditor from '../color-palette-editor/color-palette-editor';

import * as Actions from '../../../../../store/actions/ActionsCreator';
const classNamePrefix = 'custom-palette-add-container';
let currentPaletteList: any[];
const ColorPaletteModal: React.FC<any> = (props: any) => {
    const { applicationPalettes } = props;
    const dispatch = useDispatch();
    const paletteList = useSelector(selectAllColorPalettes);
    const defaultPaletteId = useSelector(selectApplicationDefaultPalette);
    const [selectedCustomPalettes, setCustomPalettes] = useState([]);
    const [currentPalettesLen, setPaletteLength] = useState(
        paletteList?.length
    );
    const [disableSave, setDisableSave] = useState(false);
    const [nameFilter, setFilterName] = useState('');
    const [isShowEditPalette, setEditorPalette] = useState(false);
    const [paletteEditorParams, setEditorParams] = useState({} as any);
    useEffect(() => {
        setCustomPalettes(applicationPalettes);
        if (applicationPalettes?.length === 0) {
            setDisableSave(true);
        }
    }, [applicationPalettes]);
    useEffect(() => {
        currentPaletteList = paletteList;
    }, [paletteList]);
    const checkIndeterminate = (selectedRows?: any[]) => {
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
        setCustomPalettes(applicationPalettes);
    };
    const handleSaveAdd = () => {
        setFilterName('');
        const paletteRecordMap: any = {};
        paletteList.forEach((item) => {
            paletteRecordMap[item.id] = item.name;
        });
        selectedCustomPalettes.sort((a: string, b: string) => {
            return paletteRecordMap[a] < paletteRecordMap[b] ? -1 : 1;
        });
        // for the single selection case, there is no set default operation. So when the radio selection is changed, should update the default palette at the same time.
        // for the multiple case, always use the first one as default unless the defaultId is in the selected list.
        if (!selectedCustomPalettes.includes(defaultPaletteId)) {
            dispatch(
                Actions.updateCurrentConfig({
                    applicationDefaultPalette: selectedCustomPalettes[0],
                    applicationPalettes: selectedCustomPalettes,
                })
            );
        } else {
            dispatch(
                Actions.updateCurrentConfig({
                    applicationPalettes: [defaultPaletteId].concat(
                        selectedCustomPalettes.filter(
                            (v: any) => v !== defaultPaletteId
                        )
                    ),
                })
            );
        }
        props.close(false);
    };
    const generateDefaultPaletteName = useCallback(() => {
        let defaultName = localizedStrings.NEW_PALETTE_DEFAULT_NAME;
        if (
            currentPaletteList.filter((p: any) => {
                return p.name?.toLowerCase() === defaultName.toLowerCase();
            }).length === 0
        ) {
            return defaultName;
        }
        for (let i = 1; i < 10000; i++) {
            const newPaletteName = `${defaultName} ${i}`;
            if (
                currentPaletteList.filter((appInfo: any) => {
                    return (
                        appInfo.name.toLowerCase() ===
                        newPaletteName.toLowerCase()
                    );
                }).length === 0
            ) {
                return newPaletteName;
            }
        }
        return defaultName;
    }, []);
    const handleAddPalette = useCallback(() => {
        const newObj: any = {
            name: generateDefaultPaletteName(),
            colors: [],
        };
        setEditorParams(newObj);
        setEditorPalette(true);
    }, []);

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
                onClick={handleAddPalette}
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
                            {localizedStrings.ADD_CUSTOM_COLOR_PALETTE_MESSAGE}
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
                                {paletteCountsStr(currentPalettesLen)}
                            </div>
                            <div className={`${classNamePrefix}-add-palette`}>
                                {getAddColorPaletteIcon()}
                                {isShowEditPalette && (
                                    <ColorPaletteEditor
                                        visible={isShowEditPalette}
                                        isCreate={true}
                                        params={paletteEditorParams}
                                        setCustomPalettes={setCustomPalettes}
                                        selectedCustomPalettes={
                                            selectedCustomPalettes
                                        }
                                        onClose={() => setEditorPalette(false)}
                                    ></ColorPaletteEditor>
                                )}
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
                                    selectedCustomPalettes={
                                        selectedCustomPalettes
                                    }
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
