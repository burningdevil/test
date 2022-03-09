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
interface PaletteGridViewProps {
    paletteList?: any[];
    paletteType: number;
    cRef?: any;
    checkIndeterminate?: any;
    classNamePrefix?: string;
}
const renderPaletteColors = (colors: Array<string>) => {
    return colors.map((c, index) => {
        return (
            <div
                className="color-block"
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

const PaletteGridView: React.FC<PaletteGridViewProps> = (props) => {
    const dispatch = useDispatch();
    const paletteList: any[] = useSelector(selectAllColorPalettes);
    const defaultPaletteId = useSelector(selectApplicationDefaultPalette);
    const applicationPalettes = useSelector(selectApplicationPalettes) ?? [];
    const [currentList, setCurrentList] = useState(null);

    useEffect(() => {
        getData();
    }, [applicationPalettes, paletteList]);
    const getData = () => {
        let data;
        if (applicationPalettes?.length && paletteList?.length) {
            data = paletteList.filter((v) =>
                applicationPalettes.includes(v.id)
            );
            initData(paletteList, data);
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
    const initData = (paletteList: any[], currentData: any[]) => {
        // init the default palette. it's redundant for the single selection case.
        if (!currentData?.length) return;
        paletteList.forEach((p) => (p.isDefaultPalette = false));
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
        dispatchUpdateAction(leftList.map((v: any) => v.id));
        // special handling, if remove the default item, then the first one in the list will be set to default automatically.
        if (data.isDefaultPalette) {
            if (leftList?.length) {
                leftList[0].isDefaultPalette = true;
                dispatch(
                    Actions.updateCurrentConfig({
                        applicationDefaultPalette: leftList[0].id,
                    })
                );
            } else {
                dispatch(
                    Actions.updateCurrentConfig({
                        applicationDefaultPalette: '',
                    })
                );
            }
        }
        setCurrentList(leftList);
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
        paletteList.forEach((item) => {
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
                        className="icon-pnl_close operation-item"
                        onClick={() => removeColorPalette(data)}
                    />
                )}
            </>
        );
    };
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
                            {data.isDefaultPalette && (
                                <span className={`default-color-palette`}>
                                    ({t('default')})
                                </span>
                            )}
                            {name}
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
                id={`color-palette-grid-${props.paletteType}`}
                className={'color-palette-grid-container'}
            >
                <Table
                    showHeader={false}
                    pagination={false}
                    loading={!currentList}
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
