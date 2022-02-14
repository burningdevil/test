import { Table } from 'antd';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllColorPalettes,
  selectApplicationDefaultPalette,
  selectApplicationPalettes,
} from '../../../../../store/selectors/HomeScreenConfigEditorSelector';
import '../color-palette.scss';
import './palette-grid-view.scss';
import { useImperativeHandle } from 'react';
import { useState } from 'react';
import * as Actions from '../../../../../store/actions/ActionsCreator';
import {
  default as VC,
  localizedStrings,
} from '../../../HomeScreenConfigConstant';
import {
  getSupportSingleColorPalette,
  toHex,
} from '../color-palette.util';
import ColorPaletteEditor from '../color-palette-editor/color-palette-editor';
import { Tooltip } from '@mstr/rc';
import { t } from '../../../../../../src/i18n/i18next';
interface PaletteGridViewProps {
  paletteList?: any[];
  paletteType: number;
  cRef?: any;
  checkIndeterminate?: any;
  classNamePrefix?: string;
}
interface RowSelectionType {
  isDefaultPalette: boolean;
  selectedRowKeys: any[];
  setSelectedRowKeys: any;
  checkIndeterminate: any;
  dataSource: any[];
  dispatch: any;
}
const renderPaletteColors = (colors: Array<string>) => {
  return colors.map((c, index) => {
    return (
      <div
        className='color-block'
        key={index}
        style={{
          backgroundColor: toHex(c),
          width: '19px',
          height: '19px',
          float: 'left',
        }}
      />
    );
  });
};
const setPaletteDefault = (
  data: any,
  dispatch: any,
  dataSource: any[],
  setCurrentList: any
) => {
  if (data.isDefaultPalette) return;
  dataSource.forEach((one) => (one.isDefaultPalette = false));
  dataSource.find((v) => v.id === data.id).isDefaultPalette = true;
  setCurrentList(dataSource);
  dispatch(
    Actions.updateCurrentConfig({
      applicationDefaultPalette: data.id,
    })
  );
};

const PaletteGridView: React.FC<PaletteGridViewProps> = (props) => {
  const { classNamePrefix, paletteType } = props;
  const dispatch = useDispatch();

  const paletteList: any[] = useSelector(selectAllColorPalettes);
  const defaultPaletteId = useSelector(selectApplicationDefaultPalette);
  const applicationPalettes = useSelector(selectApplicationPalettes) ?? [];
  const [currentList, setCurrentList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isShowEditPalette, setEditorPalette] = useState(false);
  const [paletteEditorParams, setEditorParams] = useState({});
  const isDefaultPalette = paletteType === 1 ? true : false;

  const getData = () => {
    let data;
    if (applicationPalettes?.length) {
      data = paletteList.filter((v) => applicationPalettes.includes(v.id));
      initData(paletteList, data)
      setCurrentList([...data]);
    }
  };
  const initData = (paletteList: any[], currentData: any[]) => {
    // init the default palette. it's redundant for the single selection case.
    if(getSupportSingleColorPalette()) return;
    const data = currentData;
    data.forEach(one => one.isDefaultPalette = false)
    if (data.map((v) => v.id).includes(defaultPaletteId)) {
      const item = data.find((v) => v.id === defaultPaletteId);
      if (item) {
        item.isDefaultPalette = true;
      }
    } else {
      if (paletteList.map((v) => v.id).includes(defaultPaletteId)) {
        dataSource.forEach((one) => (one.isDefaultPalette = false));
      } else {
        // todo
        const item = data.find((v) => v.name === 'Categorical');
        if (item) {
          item.isDefaultPalette = true;
        }
      }
    }
  };
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
  useImperativeHandle(props.cRef, () => ({
    checkAll: (check: boolean) => {
      const defaultApplicationPalettes = applicationPalettes.filter(
        (v) => !dataSource.map((v) => v.id).includes(v)
      );
      if (check) {
        setSelectedRowKeys(dataSource.map((v) => v.id));
        dispatchUpdateAction(
          defaultApplicationPalettes,
          dataSource.map((v) => v.id)
        );
      } else {
        setSelectedRowKeys([]);
        dispatchUpdateAction(defaultApplicationPalettes, []);
      }
    },
  }));

  useEffect(() => {
    getData();
  }, [applicationPalettes, paletteList]);

  const getRowSelection = (obj: RowSelectionType) => {
    const {
      isDefaultPalette,
      selectedRowKeys,
      setSelectedRowKeys,
      checkIndeterminate,
      dataSource,
      dispatch,
    } = obj;
    const rowSelection = {
      type: getSupportSingleColorPalette() ? 'radio' : 'checkbox',
      selectedRowKeys,
      onChange: (selectedRowKeys: any, selectedRows: any) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          'selectedRows: ',
          selectedRows
        );
        setSelectedRowKeys(selectedRows.map((v: any) => v.id));
        checkIndeterminate(selectedRows.length, dataSource.length);
        const defaultApplicationPalettes = applicationPalettes.filter(
          (v) => !dataSource.map((v) => v.id).includes(v)
        );
        dispatchUpdateAction(
          defaultApplicationPalettes,
          selectedRows.map((v: any) => v.id)
        );
        // for the single selection case, there is no set default operation. So when the radio selection is changed, should update the default palette at the same time.
        if (getSupportSingleColorPalette()) {
          setPaletteDefault(
            selectedRows[0],
            dispatch,
            dataSource,
            setCurrentList
          );
        }
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.paletteType === 2,
        // Column configuration not to be checked
        name: record.id,
      }),
    };
    if (isDefaultPalette) {
      return rowSelection;
    }
  };
  const removeColorPalette = (
    data: any,
    dispatch: any,
    dataSource: any[],
    setCurrentList: any
  ) => {
    const leftList = dataSource.filter((v) => v.id !== data.id);
    const defaultApplicationPalettes = applicationPalettes.filter(
      (v) => !dataSource.map((v) => v.id).includes(v)
    );
    dispatchUpdateAction(
      defaultApplicationPalettes,
      leftList.map((v: any) => v.id)
    );
    // special handling, if remove the default item, then the first one in the list will be set to default automatically.
    if (data.isDefaultPalette) {
      leftList[0].isDefaultPalette = true;
      dispatch(
        Actions.updateCurrentConfig({
          applicationDefaultPalette: leftList[0].id,
        })
      );
    }
    setCurrentList(leftList);
  };
  const duplicatePalette = (data: any) => {
    setEditorPalette(true);
    let cloneObject = { ...data };
    cloneObject.name = `Copy of ${data.name}`;
    cloneObject.isDuplicate = true;
    cloneObject.isDuplicateFromDefault = true;
    setEditorParams(cloneObject);
  };
  const renderPaletteOperations = (
    isDefaultPalette: boolean,
    data: any,
    dispatch: any,
    currentPaletteList: any[],
    setCurrentList: any
  ) => {
    return (
      <>
        {!data.isDefaultPalette && !getSupportSingleColorPalette() && (
          <span
            className='set-default-col operation-item'
            onClick={() =>
              setPaletteDefault(
                data,
                dispatch,
                currentPaletteList,
                setCurrentList
              )
            }
          >
            {t("setAsDefault")}
          </span>
        )}
        <span
          className='icon-pnl_close operation-item'
          onClick={() =>
            removeColorPalette(
              data,
              dispatch,
              currentPaletteList,
              setCurrentList
            )
          }
        />
      </>
    );
  };
  const getColumns = (
    isDefaultPalette: boolean,
    dispatch: any,
    currentPaletteList: any[],
    setCurrentList: any
  ) => {
    let columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        className: 'name-col',
        width: '150px',
        render: (name: string, data: any) => {
          return (
            <>
              {name}
              {data.isDefaultPalette && !getSupportSingleColorPalette() && (
                <span className={`default-color-palette`}>
                  (Default)
                  <Tooltip
                    title={localizedStrings.DEFAULT_COLOR_PALETTE_TOOLTIP}
                    placement='right'
                  >
                    <span className={VC.FONT_MSG_INFO}> </span>
                  </Tooltip>
                </span>
              )}
            </>
          )
        },
      },
      {
        title: 'Colors',
        dataIndex: 'colors',
        width: '80%',
        render: (d: Array<string>, data: any) => {
          return (
            <div className={'color-palette-item-colors-col'}>
              {renderPaletteColors(d)}
              {renderPaletteOperations(
                false,
                data,
                dispatch,
                currentPaletteList,
                setCurrentList
              )}
            </div>
          );
        },
      },
    ];

    return columns;
  };
  return (
    <>
      <div
        id={`color-palette-grid-${props.paletteType}`}
        className={'color-palette-grid-container'}
      >
        <Table
          showHeader={false}
          pagination={false}
          rowKey='id'
          size={'small'}
          dataSource={currentList}
          scroll={{ y: 255 }}
          columns={getColumns(
            isDefaultPalette,
            dispatch,
            currentList,
            setCurrentList
          )}
        />
        <ColorPaletteEditor
          visible={isShowEditPalette}
          params={paletteEditorParams}
          onClose={() => setEditorPalette(false)}
        ></ColorPaletteEditor>
      </div>
    </>
  );
};
export default PaletteGridView;
