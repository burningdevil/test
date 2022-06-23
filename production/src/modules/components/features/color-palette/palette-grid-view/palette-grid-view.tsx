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
import { useState } from 'react';
import * as Actions from '../../../../../store/actions/ActionsCreator';
import { toHex } from '../color-palette.util';
import { t } from '../../../../../i18n/i18next';
import { ColorPaletteType } from 'src/types/data-model/HomeScreenConfigModels';
import { Tooltip } from '@mstr/rc';
import { useCallback } from 'react';
interface PaletteGridViewProps {
    paletteType: number;
}
const renderPaletteColors = (colors: Array<string>) => {
    return colors.map((c, index) => {
        const colorStr = toHex(c);
        return (
            <div
                className={colorStr === '#ffffff' ? "color-block white-cell": "color-block"}
                key={index}
                style={{
                    backgroundColor: colorStr,
                    width: '19px',
                    height: '19px',
                    float: 'left',
                }}
            />
        );
    });
};

const PaletteGridView: React.FC<PaletteGridViewProps> = (props) => {
    const { paletteType } = props;
    const dispatch = useDispatch();
    const paletteList: any[] = useSelector(selectAllColorPalettes);
    const defaultPaletteId = useSelector(selectApplicationDefaultPalette);
    const applicationPalettes = useSelector(selectApplicationPalettes) ?? [];
    const [currentList, setCurrentList] = useState([]);
    const [showToolTip, setShowToolTip] = useState(false);
    const [hoverRowId, setHoverRowId] = useState('');
    useEffect(() => {
        getData();
    }, [applicationPalettes, paletteList]);
    const getData = () => {
        let data;
        if (applicationPalettes?.length && paletteList?.length) {
            data = paletteList.filter((v) =>
                applicationPalettes.includes(v.id)
            );
            initData(data);
            data.sort((a, b) => {
                if (a.isDefaultPalette) {
                    return -1;
                } else if (b.isDefaultPalette) {
                    return 1;
                } else
                    return applicationPalettes.indexOf(a.id) <
                        applicationPalettes.indexOf(b.id)
                        ? -1
                        : 1;
            });
            setCurrentList([...data]);
        }
    };
    const initData = (currentData: any[]) => {
        // init the default palette. it's redundant for the single selection case.
        if (!currentData?.length) return;
        const data = currentData;
        data.forEach((one) => (one.isDefaultPalette = false));
        if (data.map((v) => v.id).includes(defaultPaletteId)) {
            const item = data.find((v) => v.id === defaultPaletteId);
            if (item) {
                item.isDefaultPalette = true;
            }
        } else {
            data[0].isDefaultPalette = true;
        }
    };
    const dispatchUpdateAction = (targetData: string[]) => {
        dispatch(
            Actions.updateCurrentConfig({
                applicationPalettes: Array.from(new Set(targetData)),
            })
        );
    };

    const removeColorPalette = (data: any) => {
        const leftList = currentList.filter(
            (v: ColorPaletteType) => v.id !== data.id
        );
        // special handling, if remove the default item, then the first one in the list will be set to default automatically.
        if (data.isDefaultPalette) {
            if (leftList?.length) {
                dispatch(
                    Actions.updateCurrentConfig({
                        applicationDefaultPalette: leftList[0].id,
                        applicationPalettes: leftList.map((v: any) => v.id),
                    })
                );
            } else {
                dispatch(
                    Actions.updateCurrentConfig({
                        applicationDefaultPalette: '',
                        applicationPalettes: leftList.map((v: any) => v.id),
                    })
                );
            }
        } else {
            dispatchUpdateAction(leftList.map((v: any) => v.id));
        }
    };
    const setPaletteDefault = (data: any) => {
        if (data.isDefaultPalette) return;
        currentList.forEach(
            (one: ColorPaletteType) => (one.isDefaultPalette = false)
        );
        currentList.find(
            (v: ColorPaletteType) => v.id === data.id
        ).isDefaultPalette = true;
        setCurrentList(currentList);
        // should pop up the default to the first.
        const newApplicationPalettes = applicationPalettes.filter(
            (v) => v !== data.id
        );
        const paletteRecordMap: any = {};
        currentList.forEach((item) => {
            paletteRecordMap[item.id] = item.name;
        });
        newApplicationPalettes.sort((a, b) => {
            return paletteRecordMap[a] < paletteRecordMap[b] ? -1 : 1;
        });
        newApplicationPalettes.unshift(data.id);
        dispatch(
            Actions.updateCurrentConfig({
                applicationDefaultPalette: data.id,
                applicationPalettes: newApplicationPalettes,
            })
        );
    };
    const renderPaletteOperations = (data: any) => {
        return (
            <>
                {!data.isDefaultPalette && (
                    <div
                        className="set-default-col operation-item"
                        onClick={() => setPaletteDefault(data)}
                    >
                        {t('setAsDefault')}
                    </div>
                )}
                {currentList?.length > 1 && (
                    <div
                        className={data.isDefaultPalette ? "icon-pnl_close operation-item-only" : "icon-pnl_close operation-item"}
                        onClick={() => removeColorPalette(data)}
                    />
                )}
            </>
        );
    };
    const handleTooltip = useCallback((event: any, rowData: any) => {
        if(event.target?.offsetWidth < event.target?.scrollWidth){
            setShowToolTip(true);
            setHoverRowId(rowData.id);
        }else {
          setShowToolTip(false);
        }
      }, [])
    const hideTooltip = useCallback(() => {
        setShowToolTip(false);
      }, []);
    const getColumns = () => {
        let columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                className: 'name-col',
                width: '200px',
                ellipsis: true,
                render: (name: string, data: any) => {
                    return (
                        <>
                            
                            <Tooltip
                                title={<span>{name}</span>}
                                placement='top'
                                visible = {showToolTip && data.id === hoverRowId}
                                triggerMode='hover'>
                                    <div className = "overflow" onMouseEnter={(e) => handleTooltip(e, data)} onMouseLeave={hideTooltip}>
                                            {data.isDefaultPalette && (
                                                    <span className={`default-color-palette`}>
                                                        ({t('default')})
                                                    </span>
                                                )}
                                            {name}
                                    </div>
                            </Tooltip>
                        </>
                    );
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
                            {renderPaletteOperations(data)}
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
                id={`color-palette-grid-${paletteType}`}
                className={'color-palette-grid-container'}
            >
                <Table
                    showHeader={false}
                    pagination={false}
                    loading={!currentList?.length}
                    rowKey="id"
                    size={'small'}
                    dataSource={currentList}
                    scroll={{ y: 500 }}
                    columns={getColumns()}
                />
            </div>
        </>
    );
};
export default PaletteGridView;
