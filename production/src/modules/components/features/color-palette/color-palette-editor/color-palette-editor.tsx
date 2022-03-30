import { Modal, message, Button } from 'antd';
import { Input } from '@mstr/rc';
import * as React from 'react';
import { useState } from 'react';
import {
    default as VC,
    localizedStrings,
} from '../../../HomeScreenConfigConstant';
import ColorPickerContainer from '../../../common-components/rc-compat/color-picker-container';
import './color-palette-editor.scss';
import { hexToDecimal, toHex } from '../color-palette.util';
import { useEffect, useRef } from 'react';
import * as api from '../../../../../services/Api';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAllColorPalettes,
    selectApplicationPalettes,
} from '../../../../../../src/store/selectors/HomeScreenConfigEditorSelector';

import { RestApiError } from '../../../../../server/RestApiError';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragColorCell from './draggable-color-cell';
import {
    ConfirmationDialog,
    ConfirmationDialogWordings,
} from './../../../../../../src/modules/components/common-components/confirmation-dialog';
import { validName } from '../../../../../modules/components/views/HomeScreenUtils';
const colorGuideHexVals = [
    { name: 'Rose ###', color: '#FBDAD9' },
    { name: 'Peach ###', color: '#FFDEC6' },
    { name: 'Buttermilk ###', color: '#FFF3B3' },
    { name: 'Honeydew ###', color: '#E1F5C9' },
    { name: 'Mint ###', color: '#D7F6F0' },
    { name: 'Iceberg ###', color: '#DCECF1' },
    { name: 'Fog ###', color: '#DEDDFF' },
    { name: 'Lavender ###', color: '#DDCAFF' },
    { name: 'Pink ###', color: '#FDA29A' },
    { name: 'Coral ###', color: '#FFAE8B' },
    { name: 'Sweet Corn ###', color: '#FAD47F' },
    { name: 'Green Pea ###', color: '#BFE2A2' },
    { name: 'Aqua ###', color: '#AADED7' },
    { name: 'Frost ###', color: '#A6CCDD' },
    { name: 'Pale Purple ###', color: '#9D9FE0' },
    { name: 'Orchid ###', color: '#B496DD' },
    { name: 'Salmon ###', color: '#DB6657' },
    { name: 'Orange ###', color: '#D76322' },
    { name: 'Honey ###', color: '#E69912' },
    { name: 'Grass ###', color: '#83C962' },
    { name: 'Turquoise ###', color: '#55BFC3' },
    { name: 'Ocean Blue ###', color: '#1C8DD4' },
    { name: 'Royal Blue ###', color: '#4F60D6' },
    { name: 'Violet ###', color: '#834FBD' },
    { name: 'Ruby Red ###', color: '#C1292F' },
    { name: 'Rust ###', color: '#9A3A0A' },
    { name: 'Caramel ###', color: '#B27B11' },
    { name: 'Emerald ###', color: '#38AE6F' },
    { name: 'Teal ###', color: '#028F94' },
    { name: 'Indigo ###', color: '#0F6095' },
    { name: 'Sapphire ###', color: '#31329D' },
    { name: 'Plum ###', color: '#5C388C' },
    { name: 'Maroon ###', color: '#7E0F16' },
    { name: 'Chestnut ###', color: '#733413' },
    { name: 'Nutmeg ###', color: '#7B5B31' },
    { name: 'Forest ###', color: '#1D6F31' },
    { name: 'Pine Green ###', color: '#156962' },
    { name: 'Navy ###', color: '#193B67' },
    { name: 'Midnight ###', color: '#1B1575' },
    { name: 'Deep Purple ###', color: '#3A2471' },
    { name: 'Black ###', color: '#000000' },
    { name: 'Charcoal ###', color: '#35383A' },
    { name: 'Dark Gray ###', color: '#6C6C6C' },
    { name: 'Silver ###', color: '#ABABAB' },
    { name: 'Porcelain ###', color: '#DEDEDE' },
    { name: 'Mist ###', color: '#EBEBEB' },
    { name: 'Smoke White ###', color: '#F4F4F4' },
    { name: 'White ###', color: '#FFFFFF' },
];
const colorPickerProps: any = {
    chosenTab: 'grid',
    colorGuideHexVals: colorGuideHexVals,
    gradientConfig: {},
    solidFavorites: [],
    customVals: [],
    paletteHexVals: [],
    displayMode: 'palette',
    opacity: 100,
    useGradient: false,
    useOpacity: false,
    value: '#000000',
    allowResetDefault: true,
};

const ColorPaletteEditor: React.FC<any> = (props: any) => {
    const { params, isCreate, selectedCustomPalettes, setCustomPalettes } =
        props;
    const [currentVal, setCurrentValue] = useState('#000000');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const dispatch = useDispatch();
    const applicationPalettes = useSelector(selectApplicationPalettes) ?? [];
    const paletteList = useSelector(selectAllColorPalettes);
    const name = params?.name ?? localizedStrings.NEW_PALETTE_DEFAULT_NAME;
    const colors = params?.colors?.map((v: any) => v) ?? [];
    const [colorList, setColorList] = useState(colors);
    const nameRef: any = useRef();
    const [nameForm, setName] = useState(name);
    const [handleSaving, setHandleSaving] = useState(false);
    const [nameErrMsg, setNameErrMsg] = useState(
        localizedStrings.DUPLICATE_APP_NAME_ERROR
    );
    const [isCancelConfirmationDialogOpen, setCancelConfirmDialogOpen] =
        useState(false);
    let colorsForm: string[] = null;
    const packageParams = () => {
        return {
            name: nameForm,
            colors: colorList,
        };
    };
    const saveColorList = (colors: string[]) => {
        setColorList(colors);
    };
    const processErrorResponse = (e: any, errorMsg: string) => {
        setHandleSaving(false);
        const error = e as RestApiError;
        message.error(errorMsg + error.errorMsg);
    };
    const handleOk = () => {
        let savePromise;
        let body = packageParams();
        const postUpdateAction = (resp: any) => {
            // create and duplicate, set selected by default.
            if (params?.isDuplicate || isCreate) {
                setCustomPalettes(selectedCustomPalettes.concat(resp?.id));
            }
            api.loadColorPaletteList();
            props.onClose();
        };
        setHandleSaving(true);
        if (isCreate || params.isDuplicate) {
            savePromise = api.createPalette(body);
            savePromise
                .then((resp: any) => {
                    postUpdateAction(resp);
                })
                .catch((e: any) =>
                    processErrorResponse(e, localizedStrings.ERR_APP_SAVE)
                );
        } else {
            // the update operation should divide into two tasks: update name by object api and update colors.
            // and cannot use the promise.all
            const updateColors = api.updatePalette(params.id, body);
            updateColors
                .then(() => {
                    const updateName = api.updatePaletteName(params.id, {
                        name: nameForm,
                    });
                    updateName.then((resp: any) => {
                        postUpdateAction(resp);
                    });
                })
                .catch((e: any) =>
                    processErrorResponse(e, localizedStrings.ERR_APP_SAVE)
                );
        }
    };
    const handleCancel = () => {
        // simply check the state change with name and colors.
        const nameChange = () => {
            return params && params.name !== nameForm;
        };
        const colorChange = () => {
            if (!params) {
                // create case
                return colorList.length;
            }
            if (colorList.length !== params.colors.length) {
                return true;
            } else {
                return colorList.join('-') !== params.colors.join('-');
            }
        };
        if (nameChange() || colorChange()) {
            setCancelConfirmDialogOpen(true);
        } else {
            confirmCancel();
        }
    };
    const onChange = (val: any) => {
        setCurrentValue(val);
    };
    const onChangeFavorite = (val: any) => {};
    colorPickerProps.onchange = onChange;
    colorPickerProps.onChangeFavorite = onChangeFavorite;
    colorPickerProps.value = currentVal;
    function onClick(c: any) {
        onChange(c);
        setCurrentValue(toHex(c));
    }

    /**
     * This function is used to change the color when Enter is pressed.
     * Same as onClick.
     * @param {DOM Event} event - Keyboard event
     */
    const handleKeyDownEvent = (event: any) => {
        if (event.key === 'Enter') {
            onChange(currentVal);
            event.stopPropagation();
            event.preventDefault();
        }
    };
    const sortColors = () => {
        if (!colorsForm) return;
        colorList.sort((a: any, b: any) => {
            const ai = colorsForm.indexOf(a);
            const bi = colorsForm.indexOf(b);
            return ai < bi ? -1 : 1;
        });
    };
    const onRemoveFavorite = (color: any) => {
        sortColors();
        const temp = colorList.filter((v: any) => v !== color.key);
        setColorList(temp);
        if (color.key === hexToDecimal(currentVal)) {
            if (temp.length > 0) {
                onClick(temp[0]);
            } else {
                onClick('0')
            }
        }
    };
    const onAddFavorite = () => {
        if (colorList?.length >= 16) return;
        sortColors();
        const temp = hexToDecimal(currentVal);
        if (!colorList.includes(temp)) {
            colorList.push(temp);
            setColorList([...colorList]);
        }
    };
    const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handleEnter = (event: any) => {
        if (event?.keyCode === 13) {
            onAddFavorite();
        }
    };
    useEffect(() => {
        // initiate the event handler
        window.addEventListener('keyup', handleEnter, false);
        // this will clean up the event every time the component is re-rendered
        return function cleanup() {
            window.removeEventListener('keyup', handleEnter, false);
        };
    });
    useEffect(() => {
        const colors: string[] = params?.colors?.map((v: any) => v) ?? [];
        setColorList(colors);
        if (colors?.length) {
            setCurrentValue(toHex(colors[colors.length - 1]));
        }
        if (isCreate || params?.isDuplicate) {
            nameRef.current.select();
        }
    }, [params]);
    useEffect(() => {
        const names = paletteList.map((v) => v.name);
        if (!colorList?.length || !nameForm) {
            setButtonDisabled(true);
        } else if (
            names.includes(nameForm) &&
            (isCreate || params.isDuplicate)
        ) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    }, [colorList?.length, nameForm]);
    useEffect(() => {
        setName(name);
    }, [name]);
    const checkNameValid = (name: string) => {
        // blank validation
        if (!name?.trim()) {
            setNameErrMsg(localizedStrings.BLANK_APP_NAME_ERROR);
            return false;
        }
        // special character
        if (!validName(name)) {
            setButtonDisabled(true);
            setNameErrMsg(localizedStrings.INVALID_CHARACTER_APP_NAME_ERROR);
            return false;
        }
        // check duplicate
        let names = paletteList.map((v) => v.name);
        if (!isCreate && !params.isDuplicate) {
            names = names.filter((v) => v !== params.name);
        }
        if (names.includes(name)) {
            return false;
        }
        return true;
    };
    /* Confirmation dialog related */
    const handleCloseCancelDialog = () => {
        setCancelConfirmDialogOpen(false);
    };
    const confirmCancel = () => {
        setCancelConfirmDialogOpen(false);
        // to provide the disappear in sequence, so just adding the extra timeout.It's no issue related.
        setTimeout(() => {
            props.onClose();
        }, 100);
    };
    const cancelDialogWordings: ConfirmationDialogWordings = {
        title: localizedStrings.CANCEL,
        actionButtonText: localizedStrings.YES,
        cancelButtonText: localizedStrings.NO,
        summaryText: localizedStrings.CONFIRM_CANCEL_DIALOG_MSG_TITLE,
        detailText: localizedStrings.CONFIRM_CANCEL_DIALOG_MSG_DETAIL,
    };
    const renderDraggableColorGrid = (colors: string[]) => {
        return (
            <DndProvider backend={HTML5Backend}>
                <DragColorCell
                    colors={colors}
                    onRemoveFavorite={onRemoveFavorite}
                    handleKeyDownEvent={handleKeyDownEvent}
                    onClick={onClick}
                    saveColorList={saveColorList}
                    onAddFavorite={onAddFavorite}
                />
            </DndProvider>
        );
    };
    const buttonGroup = () => {
        return (
            <div className={`color-palette-editor-btn`}>
                <Button onClick={handleCancel}>
                    {localizedStrings.CANCEL}
                </Button>
                <Button
                    type="primary"
                    style={{ marginLeft: 10, marginRight: 18 }}
                    onClick={handleOk}
                    disabled={buttonDisabled}
                    loading={handleSaving}
                >
                    {localizedStrings.OK}
                </Button>
            </div>
        );
    };
    return (
        <>
            <Modal
                width="221px"
                destroyOnClose={true}
                visible={props.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{ disabled: buttonDisabled }}
                footer={null}
                maskClosable={false}
            >
                <div className="modal-content">
                    <div className={`modal-content-name`}>
                        <div style={{ marginRight: '10px', marginTop: '4px' }}>
                            {localizedStrings.NAME}
                        </div>
                        <Input
                            ref={nameRef}
                            onChange={(val: any) => handleName(val)}
                            value={nameForm}
                            onValidate={(e: string) => {
                                return checkNameValid(e);
                            }}
                            maxLength={80}
                            isErrorDisplayed="true"
                            errorMessage={nameErrMsg}
                        ></Input>
                    </div>
                    <div style={{ lineHeight: '28px' }}>
                        {localizedStrings.PALETTE}
                    </div>
                    <div className={'modal-content-palette-list'}>
                        {renderDraggableColorGrid(colorList)}
                    </div>
                    <div>
                        <ColorPickerContainer
                            {...colorPickerProps}
                            onChange={onChange}
                        ></ColorPickerContainer>
                    </div>
                    {buttonGroup()}
                </div>
                <ConfirmationDialog
                    isConfirmationDialogDisplayed={
                        isCancelConfirmationDialogOpen
                    }
                    closeDialog={handleCloseCancelDialog}
                    triggerAction={confirmCancel}
                    wordings={cancelDialogWordings}
                    elementId="palette-delete-confirm"
                />
            </Modal>
        </>
    );
};
export default ColorPaletteEditor;
