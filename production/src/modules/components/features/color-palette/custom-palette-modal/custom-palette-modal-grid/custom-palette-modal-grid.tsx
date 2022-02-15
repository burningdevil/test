import { Table, message } from 'antd';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAllColorPalettes,
    selectApplicationDefaultPalette,
    selectApplicationPalettes,
} from '../../../../../../store/selectors/HomeScreenConfigEditorSelector';
import './custom-palette-modal-grid.scss';
import { useImperativeHandle } from 'react';
import { useState } from 'react';
import * as Actions from '../../../../../../store/actions/ActionsCreator';
import {
    default as VC,
    localizedStrings,
} from '../../../../HomeScreenConfigConstant';
import ColorPaletteEditor from '../../color-palette-editor/color-palette-editor';
import { COLOR_PALETTE_SELECTED_FORM, toHex } from '../../color-palette.util';
import * as api from '../../../../../../services/Api';
import { Resizable } from 'react-resizable';
import {
    ConfirmationDialog,
    ConfirmationDialogWordings,
} from '../../../../../../../src/modules/components/common-components/confirmation-dialog';
import { t } from '../../../../../../i18n/i18next';
import { RestApiError } from '../../../../../../server/RestApiError';
import { ColorPaletteType } from 'src/types/data-model/HomeScreenConfigModels';
interface PaletteGridProps {
    nameFilter: string;
    setPaletteLength: Function;
    setCustomPalettes: Function;
    paletteList?: any[];
    paletteType?: number;
    cRef?: any;
    checkIndeterminate?: any;
}
interface RowSelectionType {
    isDefaultPalette: boolean;
    selectedRowKeys: any[];
    setSelectedRowKeys: any;
    checkIndeterminate: any;
    dataSource: any[];
    dispatch: any;
    setCustomPalettes: any;
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

const ResizableTitle = (props: any) => {
    let { onResize, width, ...restProps } = props;
    if (width > 500) width = 500;
    if (width < 100) width = 100;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};
let currentPaletteList: ColorPaletteType[];
const CustomPaletteModalGrid: React.FC<PaletteGridProps> = (
    props: PaletteGridProps
) => {
    const {
        setPaletteLength,
        nameFilter,
        paletteType,
        checkIndeterminate,
        cRef,
        setCustomPalettes,
    } = props;
    const dispatch = useDispatch();
    const paletteList: ColorPaletteType[] = useSelector(selectAllColorPalettes);
    const defaultPaletteId = useSelector(selectApplicationDefaultPalette);
    const applicationPalettes = useSelector(selectApplicationPalettes) ?? [];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [currentList, setCurrentList] = useState([]); // used to display;
    const [dataSource, setDataSource] = useState([]); // store the data source backup;
    const [isShowEditPalette, setEditorPalette] = useState(false);
    const [paletteEditorParams, setEditorParams] = useState({} as any);
    const [isEditConfirmationDialogOpen, setEditConfirmationDialogOpen] =
        useState(false);
    const [isDeleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
        useState(false);
    const [toBeDeleteData, setToBeDeletedData] = useState(null);
    const [highlightRow, setHighlightRow] = useState(null);

    const isDefaultPalette = paletteType === 1 ? true : false;
    const components = {
        header: {
            cell: ResizableTitle,
        },
    };
    const initData = (paletteList: ColorPaletteType[]) => {
        const data = [...paletteList];
        if (data.map((v: any) => v.id).includes(defaultPaletteId)) {
            data.find((v: any) => v.id === defaultPaletteId).isDefaultPalette =
                true;
        }
        setDataSource([...data]);
        setCurrentList([...data]);
        if (applicationPalettes) {
            // should invoke the selected data from local storage.
            if (localStorage.getItem(COLOR_PALETTE_SELECTED_FORM)) {
                const mergeKeys = JSON.parse(
                    localStorage.getItem(COLOR_PALETTE_SELECTED_FORM)
                ).concat(
                    applicationPalettes?.filter(
                        (key) => !currentPaletteList?.find((v) => v.id === key)
                    )
                );
                setSelectedRowKeys([...mergeKeys]);
                // pass data to the parent comp.
                setCustomPalettes([...mergeKeys]);
            } else {
                setSelectedRowKeys([...applicationPalettes]);
                setCustomPalettes([...applicationPalettes]);
            }
        }
    };

    useImperativeHandle(cRef, () => ({
        checkAll: (check: boolean) => {
            if (check) {
                setSelectedRowKeys(currentList.map((v: any) => v.id));
                dispatch(
                    Actions.updateCurrentConfig({
                        applicationPalettes: currentList.map((v: any) => v.id),
                    })
                );
            } else {
                setSelectedRowKeys([]);
                dispatch(
                    Actions.updateCurrentConfig({
                        applicationPalettes: [],
                    })
                );
            }
        },
    }));
    useEffect(() => {
        if (nameFilter) {
            const filterList = dataSource.filter(
                (v) =>
                    v.name.toLowerCase().indexOf(nameFilter.toLowerCase()) > -1
            );
            setCurrentList(filterList);
        } else {
            setCurrentList(dataSource);
        }
    }, [nameFilter]);

    useEffect(() => {
        initData(paletteList);
        currentPaletteList = paletteList;
    }, [paletteList, defaultPaletteId, applicationPalettes]);

    useEffect(() => {
        setPaletteLength(currentList?.length);
    }, [currentList?.length]);

    const dispatchUpdateAction = (
        defaultApplicationPalettes: string[],
        targetData: string[]
    ) => {
        dispatch(
            Actions.updateCurrentConfig({
                applicationPalettes: Array.from(
                    new Set(defaultApplicationPalettes.concat(targetData))
                ),
            })
        );
    };
    const removeColorPalette = (data: any) => {
        setConfirmDialogWordings(deleteDialogWordings);
        setDeleteConfirmationDialogOpen(true);
        setToBeDeletedData(data);
    };
    const editPalette = (data: any) => {
        // double confirm
        setEditConfirmationDialogOpen(true);
        setEditorParams(data);
    };
    const duplicatePalette = (data: any) => {
        setEditorPalette(true);
        let cloneObject = { ...data };
        cloneObject.name = generateDefaultPaletteName(data.name);
        cloneObject.isDuplicate = true;
        setEditorParams(cloneObject);
    };
    const generateDefaultPaletteName = (name: string) => {
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
    };
    const setRowHighlight = (target: any) => {
        setHighlightRow(target);
    };
    const renderPaletteOperations = (isDefaultPalette: boolean, data: any) => {
        if (isDefaultPalette)
            return (
                <>
                    <div
                        className="operation-item icon-copy"
                        onClick={() => {
                            setRowHighlight(data);
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
                        setRowHighlight(data);
                        removeColorPalette(data);
                    }}
                />
                <div
                    className="operation-item icon-copy"
                    onClick={() => {
                        setRowHighlight(data);
                        duplicatePalette(data);
                    }}
                />
                <div
                    className="operation-item icon-info_edit"
                    onClick={() => {
                        setRowHighlight(data);
                        editPalette(data);
                    }}
                ></div>
            </>
        );
    };
    const handleResize =
        (index: any) =>
        (e: any, { size }: any) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            setColumns(nextColumns);
        };

    const getColumns = () => {
        let columns: any[] = [
            {
                title: t('paletteName'),
                dataIndex: 'name',
                key: 'id',
                width: 150,
                sorter: (a: any, b: any) => {
                    return a.name < b.name ? -1 : 1;
                },
                render: (name: string, data: any) => {
                    return {
                        props: {
                            style: {},
                        },
                        children: (
                            <div className={'overflow'}>
                                {data.id === defaultPaletteId && (
                                    <span className={`default-color-palette`}>
                                        ({t('default')})
                                    </span>
                                )}
                                {name}
                            </div>
                        ),
                    };
                },
            },
            {
                title: t('paletteColors'),
                dataIndex: 'colors',
                render: (d: Array<string>, data: any) => {
                    return {
                        props: {
                            style: { background: data.color },
                        },
                        children: data.colors ? (
                            <div className={`color-palette-item-colors-col`}>
                                {renderPaletteColors(d)}
                                {renderPaletteOperations(
                                    data.paletteType === 1,
                                    data
                                )}
                            </div>
                        ) : (
                            ''
                        ),
                    };
                },
            },
        ];
        return columns;
    };
    const [columns, setColumns] = useState(getColumns());
    const columnData = columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column: any) => ({
            width: column.width,
            onResize: handleResize(index),
        }),
    }));

    /* Confirmation dialog related */
    const handleCloseEditDialog = () => {
        setEditConfirmationDialogOpen(false);
    };
    const confirmEdit = () => {
        setEditConfirmationDialogOpen(false);
        setEditorPalette(true);
    };
    const editDialogWordings: ConfirmationDialogWordings = {
        title: localizedStrings.EDIT,
        actionButtonText: localizedStrings.CONTINUE,
        cancelButtonText: localizedStrings.CANCEL,
        summaryText: t('confirmEditColorPaletteDialogTitle'),
        detailText: t('confirmEditColorPaletteDialogMsg'),
    };
    const handleCloseDeleteDialog = () => {
        setDeleteConfirmationDialogOpen(false);
    };
    const processErrorResponse = (e: any, errorMsg: string) => {
        const error = e as RestApiError;
        if (error.statusCode === 500) {
            const deleteFailedDialogWordings: ConfirmationDialogWordings = {
                title: localizedStrings.DELETE,
                actionButtonText: null,
                cancelButtonText: localizedStrings.OK,
                summaryText: t('deletePaletteFailedTitle'),
                detailText: t('deletePaletteFailedMsg'),
            };
            setDeleteConfirmationDialogOpen(true);
            setConfirmDialogWordings(deleteFailedDialogWordings);
            return;
        }
        message.error(errorMsg + error.errorMsg);
    };
    const confirmDelete = () => {
        setDeleteConfirmationDialogOpen(false);
        const updateState = () => {
            const leftList = dataSource.filter(
                (v) => v.id !== toBeDeleteData.id
            );
            const defaultApplicationPalettes = applicationPalettes.filter(
                (v) => !dataSource.map((v) => v.id).includes(v)
            );
            dispatchUpdateAction(
                defaultApplicationPalettes,
                selectedRowKeys.filter((v) => v !== toBeDeleteData.id)
            );
            // special handling, when removed the default item, then the first one in the list will be set to default automatically.
            if (toBeDeleteData.isDefaultPalette) {
                if (leftList?.length) {
                    leftList[0].isDefaultPalette = true;
                    dispatch(
                        Actions.updateCurrentConfig({
                            applicationDefaultPalette: leftList[0].id,
                        })
                    );
                }
            }
            setCurrentList(leftList);
        };
        api.deletePalette(toBeDeleteData.id).then(
            () => {
                api.loadColorPaletteList();
                updateState();
            },
            (err: any) => {
                processErrorResponse(err, localizedStrings.ERR_APP_DELETE);
            }
        );
    };
    const deleteDialogWordings: ConfirmationDialogWordings = {
        title: localizedStrings.DELETE,
        actionButtonText: localizedStrings.DELETE,
        cancelButtonText: localizedStrings.CANCEL,
        summaryText: t('confirmDeleteColorPaletteDialogTitle'),
        detailText: t('confirmDeleteColorPaletteDialogMsg'),
    };
    const [confirmDialogWordings, setConfirmDialogWordings] =
        useState(deleteDialogWordings);
    const getRowSelection = (obj: RowSelectionType) => {
        const {
            selectedRowKeys,
            setSelectedRowKeys,
            checkIndeterminate,
            dataSource,
        } = obj;
        const rowSelection = {
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                localStorage.setItem(
                    COLOR_PALETTE_SELECTED_FORM,
                    JSON.stringify(selectedRowKeys)
                );
                setSelectedRowKeys(selectedRows.map((v: any) => v.id));
                checkIndeterminate(selectedRows);
                setHighlightRow(null);
            },
            getCheckboxProps: (record: any) => ({
                disabled: !record.colors,
                // Column configuration not to be checked
                name: record.id,
            }),
        };
        return rowSelection;
    };
    const generateDisplayData = () => {
        return [
            {
                id: 1,
                name: t('customColorPaletteTitle'),
                children: currentList.filter((v) => v.paletteType === 2),
            },
            {
                id: 2,
                name: t('defaultColorPaletteTitle'),
                children: currentList.filter((v) => v.paletteType === 1),
            },
        ];
    };
    const executeScroll = () => {
        setTimeout(() => {
            document.querySelector('.scroll-row').scrollIntoView();
        }, 1000);
    };
    return (
        paletteList?.length > 0 && (
            <>
                <div
                    id={`color-palette-edit-grid`}
                    className={'color-palette-modal-grid-container'}
                >
                    <Table
                        showHeader={true}
                        pagination={false}
                        showSorterTooltip={false}
                        size={'small'}
                        rowSelection={
                            getRowSelection({
                                isDefaultPalette,
                                selectedRowKeys,
                                setSelectedRowKeys,
                                checkIndeterminate,
                                dataSource,
                                dispatch,
                                setCustomPalettes,
                            }) as any
                        }
                        rowKey="id"
                        dataSource={generateDisplayData()}
                        defaultExpandedRowKeys={[1]}
                        columns={columnData}
                        components={components as any}
                        rowClassName={(record: any, index: number) => {
                            let defaultClass;
                            defaultClass = index === 0 ? 'scroll-row' : '';
                            if (!highlightRow) return defaultClass;
                            return record.id === highlightRow.id
                                ? 'highlight-row'
                                : defaultClass;
                        }}
                        scroll={{ y: 360 }}
                    />
                    <ColorPaletteEditor
                        visible={isShowEditPalette}
                        params={paletteEditorParams}
                        onClose={() => {
                            setEditorPalette(false);
                            executeScroll();
                        }}
                    ></ColorPaletteEditor>
                    <ConfirmationDialog
                        isConfirmationDialogDisplayed={
                            isEditConfirmationDialogOpen
                        }
                        closeDialog={handleCloseEditDialog}
                        triggerAction={confirmEdit}
                        wordings={editDialogWordings}
                        elementId="palette-edit-confirm"
                    />
                    <ConfirmationDialog
                        isConfirmationDialogDisplayed={
                            isDeleteConfirmationDialogOpen
                        }
                        closeDialog={handleCloseDeleteDialog}
                        triggerAction={confirmDelete}
                        wordings={confirmDialogWordings}
                        elementId="palette-delete-confirm"
                    />
                </div>
            </>
        )
    );
};
export default CustomPaletteModalGrid;
