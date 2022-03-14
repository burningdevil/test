import { message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import * as React from 'react';
import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
    selectAllColorPalettes,
    selectApplicationDefaultPalette,
} from '../../../../../../store/selectors/HomeScreenConfigEditorSelector';
import './custom-palette-modal-grid.scss';
import { useState } from 'react';
import {
    default as VC,
    localizedStrings,
} from '../../../../HomeScreenConfigConstant';
import ColorPaletteEditor from '../../color-palette-editor/color-palette-editor';
import { toHex } from '../../color-palette.util';
import * as api from '../../../../../../services/Api';
import {
    ConfirmationDialog,
    ConfirmationDialogWordings,
} from '../../../../../../../src/modules/components/common-components/confirmation-dialog';
import { t } from '../../../../../../i18n/i18next';
import { RestApiError } from '../../../../../../server/RestApiError';
import { ColorPaletteType } from 'src/types/data-model/HomeScreenConfigModels';
import {
    GridReadyEvent,
    SelectionChangedEvent,
    CheckboxSelectionCallbackParams,
    RowNode,
    ICellRendererFunc,
    ICellRendererParams,
    ModelUpdatedEvent,
} from 'ag-grid-community';
interface PaletteGridProps {
    nameFilter: string;
    setPaletteLength: Function;
    setCustomPalettes: Function;
    paletteList?: any[];
    paletteType?: number;
    cRef?: any;
    checkIndeterminate?: any;
    selectedCustomPalettes: string[];
}
const renderPaletteColors = (colors: Array<string>) => {
    return colors?.map((c, index) => {
        return (
            <div
                className="color-block"
                key={index}
                style={{
                    backgroundColor: toHex(c),
                    width: '20px',
                    height: '20px',
                    float: 'left',
                }}
            />
        );
    });
};

let currentPaletteList: ColorPaletteType[];
let gridApi: any;
const CustomPaletteModalGrid: React.FC<PaletteGridProps> = (
    props: PaletteGridProps
) => {
    const {
        setPaletteLength,
        nameFilter,
        checkIndeterminate,
        setCustomPalettes,
        selectedCustomPalettes,
    } = props;

    const paletteList: ColorPaletteType[] = useSelector(selectAllColorPalettes);
    const defaultPaletteId = useSelector(selectApplicationDefaultPalette);

    const [isShowEditPalette, setEditorPalette] = useState(false);
    const [paletteEditorParams, setEditorParams] = useState({} as any);
    const [isEditConfirmationDialogOpen, setEditConfirmationDialogOpen] =
        useState(false);
    const [isDeleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
        useState(false);
    const [toBeDeleteData, setToBeDeletedData] = useState(null);
    // grid related
    const gridRef: any = useRef();
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([
        {
            field: 'name',
            rowGroup: true,
            hide: true,
            getQuickFilterText: (params: any) => {
                return params.data.colors ? params.data.name : '';
            },
        },

        {
            field: 'colors',
            headerName: t('paletteColors'),
            sortable: false,
            flex: 3,
            getQuickFilterText: (params: any) => {
                return '';
            },
            cellRendererFramework: (params: any) => {
                const d = params.data;
                if (!d.colors) {
                    return ' ';
                }
                if (d.colors) {
                    return (
                        <div className={`color-palette-item-colors-col`}>
                            {renderPaletteColors(d.colors)}
                            {renderPaletteOperations(d.paletteType === 1, d)}
                        </div>
                    );
                } else {
                    return ' ';
                }
            },
        },
    ]);
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            filter: false,
            sortable: true,
            resizable: true,
            menuTabs: [] as string[],
        };
    }, []);
    const NameRenderer: ICellRendererFunc = (params: ICellRendererParams) => {
        const d = params.data;
        let elem = document.createElement('div');
        elem.classList.add('overflow');
        if (d.id === defaultPaletteId) {
            const defaultSpan = document.createElement('span');
            defaultSpan.innerText = `(${t('default')})`;

            const textSpan = document.createElement('span');
            elem.appendChild(defaultSpan);
            textSpan.innerText = d.name;
            elem.appendChild(textSpan);
        } else {
            elem.innerText = d.name;
        }
        return elem;
    };
    const autoGroupColumnDef = useMemo(() => {
        return {
            headerName: t('paletteName'),
            headerCheckboxSelection: true,
            minWidth: 200,
            maxWidth: 380,
            checkboxSelection: (params: CheckboxSelectionCallbackParams) => {
                return params.node.data.colors !== undefined;
            },
            getQuickFilterText: (params: any) => {
                return params.data.colors ? params.data.name : '';
            },
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: {
                suppressCount: true,
                innerRenderer: NameRenderer,
            },
        };
    }, []);
    const getDataPath = useCallback(function (data) {
        return data.org;
    }, []);
    const isRowSelectable = useCallback((node: RowNode) => {
        return !!node.data.colors;
    }, []);
    // enabled the related api in ag-grid version higher than 27.
    // after upgrading the version, then can set the default expand.
    // const isGroupExpanded = useCallback((params: any) => {
    //   if(nameFilter){
    //     return true;
    //   }else {
    //     return params.data.id === 1 ? true : false;
    //   }
    // }, [nameFilter])
    const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
        const selections = event.api.getSelectedNodes();
        const selectedRows = selections.map((o) => o.data);
        const selectedRowKeys = selectedRows.map((v: any) => v.id);
        checkIndeterminate(selectedRows);
        setCustomPalettes(selectedRowKeys);
    }, []);
    const initData = useCallback((paletteList: ColorPaletteType[]) => {
        const data = [...paletteList];
        if (data.map((v: any) => v.id).includes(defaultPaletteId)) {
            data.find((v: any) => v.id === defaultPaletteId).isDefaultPalette =
                true;
        }
        setRowData(generateDisplayData(data));
    }, []);
    const onGridReady = useCallback((params: GridReadyEvent) => {
        gridApi = params.api;
    }, []);
    const generateDisplayData = useCallback((currentList: any) => {
        return [
            {
                id: 1,
                name: t('customColorPaletteTitle'),
                org: [t('customColorPaletteTitle')],
            },
        ]
            .concat(
                currentList
                    .filter((v: any) => v.paletteType === 2)
                    .map((one: any) => {
                        return {
                            ...one,
                            org: [t('customColorPaletteTitle'), one.name],
                        };
                    })
            )
            .concat([
                {
                    id: 2,
                    name: t('defaultColorPaletteTitle'),
                    org: [t('defaultColorPaletteTitle')],
                },
            ])
            .concat(
                currentList
                    .filter((v: any) => v.paletteType === 1)
                    .map((one: any) => {
                        return {
                            ...one,
                            org: [t('defaultColorPaletteTitle'), one.name],
                        };
                    })
            );
    }, []);

    useEffect(() => {
        gridRef?.current?.api.setQuickFilter(nameFilter);
        if (nameFilter) {
            gridRef.current.api.expandAll();
        }
    }, [nameFilter]);

    useEffect(() => {
        initData(paletteList);
        currentPaletteList = paletteList;
    }, [paletteList, defaultPaletteId]);

    useEffect(() => {
        setTimeout(() => {
            gridRef.current?.api?.forEachNode((node: RowNode) => {
                node.setSelected(selectedCustomPalettes.includes(node.data.id));
            });
        }, 0);
    }, [selectedCustomPalettes, rowData]);

    const removeColorPalette = useCallback((data: any) => {
        setConfirmDialogWordings(deleteDialogWordings);
        setDeleteConfirmationDialogOpen(true);
        setToBeDeletedData(data);
    }, []);
    const editPalette = useCallback((data: any) => {
        // double confirm
        setEditConfirmationDialogOpen(true);
        setEditorParams(data);
    }, []);
    const duplicatePalette = useCallback((data: any) => {
        setEditorPalette(true);
        let cloneObject = { ...data };
        cloneObject.name = generateDefaultPaletteName(data.name);
        cloneObject.isDuplicate = true;
        setEditorParams(cloneObject);
    }, []);
    const generateDefaultPaletteName = useCallback((name: string) => {
        let defaultName = t('copyApplicationName', { name });
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

    const renderPaletteOperations = useCallback(
        (isDefaultPalette: boolean, data: any) => {
            if (isDefaultPalette)
                return (
                    <>
                        <div
                            className="operation-item icon-copy"
                            onClick={() => {
                                duplicatePalette(data);
                            }}
                        />
                    </>
                );
            return (
                <>
                    <div
                        className="operation-item icon-pnl_delete"
                        onClick={() => {
                            removeColorPalette(data);
                        }}
                    />
                    <div
                        className="operation-item icon-copy"
                        onClick={() => {
                            duplicatePalette(data);
                        }}
                    />
                    <div
                        className="operation-item icon-info_edit"
                        onClick={() => {
                            editPalette(data);
                        }}
                    ></div>
                </>
            );
        },
        []
    );

    /* Confirmation dialog related */
    const handleCloseEditDialog = useCallback(() => {
        setEditConfirmationDialogOpen(false);
    }, []);
    const confirmEdit = useCallback(() => {
        setEditConfirmationDialogOpen(false);
        setEditorPalette(true);
    }, []);
    const editDialogWordings: ConfirmationDialogWordings = useMemo(() => {
        return {
            title: localizedStrings.EDIT,
            actionButtonText: localizedStrings.CONTINUE,
            cancelButtonText: localizedStrings.CANCEL,
            summaryText: t('confirmEditColorPaletteDialogTitle'),
            detailText: t('confirmEditColorPaletteDialogMsg'),
        };
    }, []);
    const handleCloseDeleteDialog = useCallback(() => {
        setDeleteConfirmationDialogOpen(false);
    }, []);
    const processErrorResponse = useCallback((e: any, errorMsg: string) => {
        const error = e as RestApiError;
        if (error.statusCode === 500) {
            const deleteFailedDialogWordings: ConfirmationDialogWordings = {
                title: localizedStrings.DELETE,
                actionButtonText: null,
                cancelButtonText: localizedStrings.OK,
                summaryText: t('deletePaletteFailedTitle'),
                detailText: t('deletePaletteFailedMsg'),
            };
            // distinguish the msg by the iServerCode
            // -2147217387 used by application.
            // -2147216619 used by dossier
            if (error.iServerErrorCode === -2147216619) {
                deleteFailedDialogWordings.detailText = t(
                    'deletePaletteFailedMsgDossier'
                );
            }
            setDeleteConfirmationDialogOpen(true);
            setConfirmDialogWordings(deleteFailedDialogWordings);
            return;
        }
        message.error(errorMsg + error.errorMsg);
    }, []);
    const confirmDelete = useCallback(() => {
        setDeleteConfirmationDialogOpen(false);
        gridRef.current.api.clearFocusedCell();
        api.deletePalette(toBeDeleteData.id).then(
            () => {
                api.loadColorPaletteList();
            },
            (err: any) => {
                processErrorResponse(err, localizedStrings.ERR_APP_DELETE);
            }
        );
    }, [toBeDeleteData]);
    const deleteDialogWordings: ConfirmationDialogWordings = useMemo(() => {
        return {
            title: localizedStrings.DELETE,
            actionButtonText: localizedStrings.DELETE,
            cancelButtonText: localizedStrings.CANCEL,
            summaryText: t('confirmDeleteColorPaletteDialogTitle'),
            detailText: t('confirmDeleteColorPaletteDialogMsg'),
        };
    }, []);
    const [confirmDialogWordings, setConfirmDialogWordings] =
        useState(deleteDialogWordings);

    const executeScroll = () => {
        setTimeout(() => {
            document.querySelector('.ag-row-group-indent-0').scrollIntoView();
        }, 1000);
    };
    const onModelUpdate = useCallback((event: ModelUpdatedEvent) => {
        let cnt = 0;
        event.api.forEachNodeAfterFilter((node: RowNode) => {
            if (node.data.colors) {
                cnt++;
            }
        });
        setPaletteLength(cnt);
    }, []);
    return (
        paletteList?.length > 0 && (
            <>
                <div
                    id={`color-palette-edit-grid`}
                    className={'color-palette-modal-grid-container'}
                >
                    <div style={gridStyle} className="ag-theme-alpine">
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            autoGroupColumnDef={autoGroupColumnDef}
                            treeData={true}
                            animateRows={true}
                            getDataPath={getDataPath}
                            isRowSelectable={isRowSelectable}
                            groupDefaultExpanded={1}
                            rowSelection={'multiple'}
                            suppressAggFuncInHeader={true}
                            rowMultiSelectWithClick={true}
                            suppressRowClickSelection={true}
                            onSelectionChanged={onSelectionChanged}
                            onModelUpdated={onModelUpdate}
                            onGridReady={onGridReady}
                        ></AgGridReact>
                    </div>
                    {isShowEditPalette && (
                        <ColorPaletteEditor
                            visible={isShowEditPalette}
                            params={paletteEditorParams}
                            setCustomPalettes={setCustomPalettes}
                            selectedCustomPalettes={selectedCustomPalettes}
                            onClose={() => {
                                setEditorPalette(false);
                                executeScroll();
                                gridRef.current?.api?.clearFocusedCell();
                            }}
                        ></ColorPaletteEditor>
                    )}
                    {isEditConfirmationDialogOpen && (
                        <ConfirmationDialog
                            isConfirmationDialogDisplayed={
                                isEditConfirmationDialogOpen
                            }
                            closeDialog={handleCloseEditDialog}
                            triggerAction={confirmEdit}
                            wordings={editDialogWordings}
                            elementId="palette-edit-confirm"
                        />
                    )}
                    {isDeleteConfirmationDialogOpen && (
                        <ConfirmationDialog
                            isConfirmationDialogDisplayed={
                                isDeleteConfirmationDialogOpen
                            }
                            closeDialog={handleCloseDeleteDialog}
                            triggerAction={confirmDelete}
                            wordings={confirmDialogWordings}
                            elementId="palette-delete-confirm"
                        />
                    )}
                </div>
            </>
        )
    );
};
export default CustomPaletteModalGrid;
