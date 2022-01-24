import { Table, message } from "antd";
import { Tooltip} from '@mstr/rc';
import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllColorPalettes, selectApplicationDefaultPalette, selectApplicationPalettes } from "../../../../../../store/selectors/HomeScreenConfigEditorSelector";
import "./custom-palette-modal-grid.scss";
import { store } from "../../../../../../main";
import { useImperativeHandle } from "react";
import { useState } from "react";
import * as Actions from '../../../../../../store/actions/ActionsCreator';
import {
  default as VC,
  localizedStrings,
} from "../../../../HomeScreenConfigConstant";
import ColorPaletteEditor from "../../color-palette-editor/color-palette-editor";
import { getSupportSingleColorPalette, toHex } from "../../color-palette.util";
import * as api from '../../../../../../services/Api';
import { Resizable } from "react-resizable";
import { ConfirmationDialog, ConfirmationDialogWordings } from "../../../../../../../src/modules/components/common-components/confirmation-dialog";
import { t } from '../../../../../../i18n/i18next';
import { RestApiError } from "../../../../../../server/RestApiError";
interface PaletteGridViewProps {
  paletteList?: any[];
  paletteType?: number;
  cRef?: any;
  checkIndeterminate?: any
}
interface PaletteDataType {
    id: string,
    name: string, 
    colors: string[],
    paletteType: number,
    visible: boolean

}
interface RowSelectionType {
  isDefaultPalette: boolean, 
  selectedRowKeys: any[], 
  setSelectedRowKeys: any, 
  checkIndeterminate: any, 
  dataSource: any[], 
  dispatch: any,
  setCustomPalettes: any;
}
const renderPaletteColors = (colors: Array<string>) => {
  return colors?.map((c, index) => {
    return (
      <div
        className="color-block"
        key = {index}
        style={{
          backgroundColor: toHex(c),
          width: "20px",
          height: "20px",
          float: "left",
        }}
      />
    );
  });
};

const ResizableTitle = (props: any) => {
    const { onResize, width, ...restProps } = props;
  
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
const classNamePrefix = "custom-palette-modal-grid-container";

const CustomPaletteModalGrid: React.FC<any> = (props) => {
    const {
        setPaletteLength,
        nameFilter,
        paletteType,
        checkIndeterminate,
        cRef,
        setCustomPalettes
    } = props;
  const dispatch = useDispatch();
  const paletteList: any[] = useSelector(selectAllColorPalettes);
  const defaultPaletteId = useSelector(selectApplicationDefaultPalette);
  const applicationPalettes = useSelector(selectApplicationPalettes) ?? [];
  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentList, setCurrentList] = useState([]); // used to display;
  const [dataSource, setDataSource] = useState([]); // store the data source backup;
  const [isShowEditPalette, setEditorPalette]   = useState(false);
  const [paletteEditorParams, setEditorParams] = useState({} as any);
  const [isEditConfirmationDialogOpen, setEditConfirmationDialogOpen] = useState(false);
  const [isDeleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
  const [toBeDeleteData, setToBeDeletedData] = useState(null);
  const [highlightRow, setHighlightRow] = useState(null);

  const isDefaultPalette =  paletteType === 1 ? true : false;
  const components = {
    header: {
      cell: ResizableTitle
    }
  };
  let registerEnter: any;
  const initData = (paletteList: any) => {
    const data = [...paletteList];
    let selectedId = defaultPaletteId;
    
    if(data.map((v: any) => v.id).includes(defaultPaletteId)){
        data.find((v: any) => v.id === defaultPaletteId).isDefaultPalette = true;
    }else {
        const item = data.find(v => v.name === 'Categorical')
        if(item){
          item.isDefaultPalette =  true;
          selectedId = item.id;
          checkIndeterminate(1, dataSource.length, [item]);
        }
    }
    
    setDataSource([...data]);
    setCurrentList([...data]);
    setSelectedRowKeys([selectedId]);

  }
  
  useImperativeHandle(cRef, () => ({
    checkAll: (check: boolean) => {
      if(check){
        setSelectedRowKeys(currentList.map((v: any) => v.id));
        dispatch(Actions.updateCurrentConfig({
          applicationPalettes: currentList.map((v: any) => v.id)
        }))
      }else {
        setSelectedRowKeys([]);
        dispatch(Actions.updateCurrentConfig({
          applicationPalettes: []
        }))
      }
    }
}));
  useEffect(() => {
      if(nameFilter){
        const filterList = dataSource.filter(v => v.name.toLowerCase().indexOf(nameFilter.toLowerCase()) > -1);
        setCurrentList(filterList);
      }else {
        setCurrentList(dataSource);
      }
  }, [nameFilter])

  useEffect(()=> {
    initData(paletteList);
  }, [paletteList, defaultPaletteId])

  
  useEffect(() => {
    setPaletteLength(currentList?.length);
  }, [currentList?.length])

  const dispatchUpdateAction = (defaultApplicationPalettes: string[], targetData: string[]) => {
    const defaultData = getSupportSingleColorPalette() ? [] : defaultApplicationPalettes;
    dispatch(Actions.updateCurrentConfig({
        applicationPalettes: Array.from(new Set(defaultData.concat(targetData))) 
    }));
}
  const removeColorPalette = (data: any, dispatch: any, dataSource: any[], setCurrentList: any) => {
    setConfirmDialogWordings(deleteDialogWordings);
    setDeleteConfirmationDialogOpen(true);
    setToBeDeletedData(data);
    
    
  }
  const editPalette = (data: any) => {
    // double confirm
    setEditConfirmationDialogOpen(true);
    setEditorParams(data);
  }
  const duplicatePalette = (data: any) => {
    setEditorPalette(true);
    let cloneObject = {...data};
    cloneObject.name = t("copyApplicationName", {name: data.name});
    cloneObject.isDuplicate = true;
    setEditorParams(cloneObject);
  }
  const setRowHighlight = (target: any) => {
    setHighlightRow(target);
  }
  const renderPaletteOperations = (isDefaultPalette: boolean, data: any, dispatch: any, currentPaletteList: any[], setCurrentList: any) => {
    if(isDefaultPalette) return (
        <>
         <div className="operation-item icon-copy" onClick = {() => {setRowHighlight(data);duplicatePalette(data)}} />
        </>);
      return (
        <>
            <div className="operation-item icon-pnl_delete" onClick = {() => {setRowHighlight(data);removeColorPalette(data, dispatch, currentPaletteList, setCurrentList)}} />
            <div className="operation-item icon-copy" onClick = {() => {setRowHighlight(data); duplicatePalette(data)}} />
            <div className="operation-item icon-info_edit" onClick = {() => {setRowHighlight(data); editPalette(data)}}></div>
        </>
      );
  };
  const handleResize = (index: any) => (e, { size }: any) => {
    const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width
      };
    setColumns(nextColumns);
  };
    
  
  const getColumns = (isDefaultPalette: boolean, dispatch: any, currentPaletteList: any[], setCurrentList: any, firstTime?: boolean) => {
    let columns: any[] = [
      {
        title: t("paletteName"),
        dataIndex: "name",
        key: "id",
        // className: "name-col",
        width: 150,
        sorter: (a: any,b: any) => {
          return a.name < b.name;
        },
        render: (name: string, data: any) => {
          return {
            props: {
              style: {},
            },
            children: (
              <>
              {name}
              {(data.id === defaultPaletteId) && !getSupportSingleColorPalette() && <span className={`default-color-palette`}>(Default)
              <Tooltip
                  title={
                    localizedStrings.DEFAULT_COLOR_PALETTE_TOOLTIP
                  }
                  placement="right"
                >
                  <span className={VC.FONT_MSG_INFO}> </span>
                </Tooltip></span>}
            </>
            ),
          };
        }
      },
      {
        title: t("paletteColors"),
        dataIndex: "colors",
        // width: "75%",
        render: (d: Array<string>, data: any) => {
          return {
            props: {
              style: { background: data.color },
            },
            children: data.colors ? (
              <div className={`color-palette-item-colors-col`}>
                {renderPaletteColors(d)}
                {renderPaletteOperations(data.paletteType === 1, data, dispatch, currentPaletteList, setCurrentList)}
              </div>
            ) : ''
          }
        },
      },
      
    ];
    return columns;
  };
  const [columns, setColumns] =  useState(getColumns(isDefaultPalette, dispatch, currentList, setCurrentList, false));
  const columnData = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column: any) => ({
        width: column.width,
        onResize: handleResize(index)
    })
}));

/* Confirmation dialog related */
const handleCloseEditDialog = () => {
    setEditConfirmationDialogOpen(false);
}
const confirmEdit = () => {
    setEditConfirmationDialogOpen(false);
    setEditorPalette(true)
}
const editDialogWordings: ConfirmationDialogWordings = {
    title: localizedStrings.EDIT,
    actionButtonText:
      localizedStrings.CONTINUE,
    cancelButtonText: localizedStrings.CANCEL,
    summaryText:
        t("confirmEditColorPaletteDialogTitle"),
    detailText:
        t("confirmEditColorPaletteDialogMsg")
  }
const handleCloseDeleteDialog = () => {
    setDeleteConfirmationDialogOpen(false);
}
const processErrorResponse = (e: any, errorMsg: string) => {
  const error = e as RestApiError;
  console.log(error);
  if(error.statusCode === 500) {
    const deleteFailedDialogWordings: ConfirmationDialogWordings = {
      title: localizedStrings.DELETE,
      actionButtonText:
        null,
      cancelButtonText: localizedStrings.OK,
      summaryText:
          t("deletePaletteFailedTitle"),
      detailText:
          t("deletePaletteFailedMsg")
    }
    setDeleteConfirmationDialogOpen(true);
    setConfirmDialogWordings(deleteFailedDialogWordings);
    return;
  }
  
  message.error(errorMsg + error.errorMsg);
}
const confirmDelete = () => {
    setDeleteConfirmationDialogOpen(false);
    const updateState = () => {
        const leftList = dataSource.filter(v => v.id !== toBeDeleteData.id);
        const defaultApplicationPalettes = applicationPalettes.filter(v => !dataSource.map(v => v.id).includes(v));
        dispatchUpdateAction(defaultApplicationPalettes, selectedRowKeys.filter(v => v !== toBeDeleteData.id))
        // special handling, when removed the default item, then the first one in the list will be set to default automatically.
        if(toBeDeleteData.isDefaultPalette){
            if(leftList?.length){
                leftList[0].isDefaultPalette = true;
                dispatch(Actions.updateCurrentConfig({
                    applicationDefaultPalette: leftList[0].id
                }));
            }
        }
        setCurrentList(leftList);
    }
    api.deletePalette(toBeDeleteData.id).then(
        () => {
            api.loadColorPaletteList();
            updateState();
        },
        (err:any) => {
          processErrorResponse(err, localizedStrings.ERR_APP_DELETE)
        }
    )
}
const deleteDialogWordings: ConfirmationDialogWordings = {
    title: localizedStrings.DELETE,
    actionButtonText:
      localizedStrings.DELETE,
    cancelButtonText: localizedStrings.CANCEL,
    summaryText:
        t("confirmDeleteColorPaletteDialogTitle"),
    detailText:
        t("confirmDeleteColorPaletteDialogMsg")
}
const [confirmDialogWordings, setConfirmDialogWordings] = useState(deleteDialogWordings);
  const getRowSelection = (obj: RowSelectionType) => {
    const {selectedRowKeys, setSelectedRowKeys, checkIndeterminate, dataSource} = obj;
    const rowSelection = {
      type: getSupportSingleColorPalette() ? 'radio' : 'checkbox',
      selectedRowKeys,
      onChange: (selectedRowKeys: any, selectedRows: any) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        setSelectedRowKeys(selectedRows.map((v: any) => v.id));
        checkIndeterminate(selectedRows.length, dataSource.length, selectedRows);
        setHighlightRow(null);
      },
      getCheckboxProps: (record: any) => ({
        disabled: !record.colors,
        // Column configuration not to be checked
        name: record.id,
      }),
    };
    return rowSelection;  
  } 
  const generateDisplayData = () => {
    return [
      {
        id: 1,
        name: t("customColorPaletteTitle"),
        children: currentList.filter(v => v.paletteType === 2)
      },{
        id: 2,
        name: t("defaultColorPaletteTitle"),
        children: currentList.filter(v => v.paletteType === 1)
      }
    ]
  }
  return (
    paletteList?.length > 0 && (
      <>
        <div id={`color-palette-edit-grid`} className={"color-palette-modal-grid-container"}>
          <Table
            showHeader={true}
            pagination={false}
            size={'small'}
            rowSelection={getRowSelection({isDefaultPalette, selectedRowKeys, setSelectedRowKeys, checkIndeterminate, dataSource, dispatch, setCustomPalettes})}
            rowKey="id"
            dataSource={generateDisplayData()}
            defaultExpandedRowKeys = {[1]}
            columns={columnData}
            components={components as any}
            rowClassName = {(record: any) => {
                if(!highlightRow) return '';
                return record.id === highlightRow.id ? 'highlight-row' : ''
            }}
            scroll={{ y: 360 }}
          />
          <ColorPaletteEditor visible = {isShowEditPalette} params = {paletteEditorParams} onClose = {() => {setEditorPalette(false)}}></ColorPaletteEditor>
          <ConfirmationDialog
                  isConfirmationDialogDisplayed={isEditConfirmationDialogOpen}
                  closeDialog={handleCloseEditDialog}
                  triggerAction={confirmEdit}
                  wordings={editDialogWordings}
                  elementId = 'palette-edit-confirm'
              />
          <ConfirmationDialog
                  isConfirmationDialogDisplayed={isDeleteConfirmationDialogOpen}
                  closeDialog={handleCloseDeleteDialog}
                  triggerAction={confirmDelete}
                  wordings={confirmDialogWordings}
                  elementId = 'palette-delete-confirm'
              />
        </div>
      </>
    )
  );
};
export default CustomPaletteModalGrid;
