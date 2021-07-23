import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenDossierSetting.scss'
import { default as VC, localizedStrings } from '../HomeScreenConfigConstant'
import { Checkbox, Divider} from 'antd'
import { Tooltip } from '@mstr/rc'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig, selectColorPalettes } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'
import ColorPaletteEditor from './ColorPaletteEditor'
import DragToSortTable from './DragToSortTable'

const classNamePrefix = 'home-screen-dossiersetting';

const mockColorPalettes = [
    {
        id: '001',
        name: 'Ocean',
        colors: [
            '#DB6657',
            '#D76322',
            '#E69912',
            '#83C962',
            '#55BFC3',
            '#1C8DD4',
        ],
        paletteType: 0
    },
    {
        id: '002',
        name: 'Beach',
        colors: [
            '#DB6657',
            '#D76322',
            '#E69912',
            '#83C962',
            '#55BFC3',
            '#1C8DD4',
            '#4F60D6',
            '#834FBD',
            '#000000',
            '#35383A',
            '#6C6C6C',
            '#ABABAB',
            '#DEDEDE',
            '#EBEBEB',
            '#F4F4F4',
            '#FFFFFF'
        ],
        paletteType: 0
    },
    {
        id: '003',
        name: 'Desert',
        colors: [
            'red',
            'orange',
            'yellow',
            'lightgreen',
            'lightblue',
            'blue',
            'purple'
        ],
        paletteType: 0
    }
];


class HomeScreenDossierSetting extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            showColorPaletteEditor: false,
            currentColorPaletteId: undefined
        }
    }

    handleEnableDefaultColorPaletteChange = (enabled: boolean) => {
        this.props.updateCurrentConfig({ showBuiltinPalattes: enabled });
    }

    handleAddColorPalette = () => {
        this.setState({
            currentColorPaletteId: undefined,
            showColorPaletteEditor: true
        });
    }

    handleEditColorPalette = (id: string) => {
        this.setState({
            currentColorPaletteId: id,
            showColorPaletteEditor: true
        });
    }

    renderPaletteColors = (colors: Array<string>) => {
        return colors.map(c => {
            return <div className='color-block' style={{backgroundColor: c, width: '16px', height: '16px', float: 'left'}} />
        });
    }
    
    columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          className: 'name-col',
          width: '10%'
        },
        {
            title: 'Default',
            dataIndex: 'default',
            className: 'default-col',
            width: '5%'
        },
        {
          title: 'Colors',
          dataIndex: 'colors',
          width: '60%',
          render: (d: Array<string>) => {
            return (
              <div className={`${classNamePrefix}-color-palette-item-colors-col`}>
                  {this.renderPaletteColors(d)}
              </div>
            )
          },
        },
        {
            title: 'SetDefault',
            dataIndex: 'setDefault',
            width: '10%',
            render: (_: any, record: any) => {
                return <span className='set-default-col'>{'Set as Default'}</span>
            },
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            width: '5%',
            render: (_: any, record: any) => {
                return <span className='item-edit'/>
            },
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            width: '5%',
            render: (_: any, record: any) => {
                return <span className='item-delete'/>
            },
        },
    ];

    renderColorPalettes = () => {
        const data = mockColorPalettes.map((cp, index) => {
            return {
                key: cp.id,
                name: cp.name,
                colors: cp.colors,
                default: cp.id === '002' ? 'Default' : '',
                index: index
            }
        });
        return <div className={`${classNamePrefix}-custom-color-palettes-container`}>
            <DragToSortTable dataSource={data} columns={this.columns}/>
        </div>
    }

    renderTooltip = () => {
        return <span className={'tooltip'}>{localizedStrings.ENABLE_MICORSTRATEGY_COLOR_PALETTE_TOOLTIP}</span>
    }

    render() {
        const { showBuiltinPalattes } = this.props.config;
        const applicationPalettes = mockColorPalettes;
        return  <div className={`${classNamePrefix}-container`}>
                    <div className={`${classNamePrefix}-title`}>
                        {localizedStrings.COLOR_PALETTE}
                    </div>
                    {/* Default Color Palette Section*/}
                    <div className={`${classNamePrefix}-default-color-palette-container`}>
                        <Checkbox
                            checked={ showBuiltinPalattes }
                            onChange={(e) => this.handleEnableDefaultColorPaletteChange(e.target.checked)}
                        >
                        </Checkbox>
                        <span className={`${classNamePrefix}-default-color-palette-title`}>
                            {localizedStrings.ENABLE_MICORSTRATEGY_COLOR_PALETTE_DESC}
                        </span>
                        <Tooltip 
                            title={localizedStrings.ENABLE_MICORSTRATEGY_COLOR_PALETTE_TOOLTIP}
                            placement='right'>
                            <span className={VC.FONT_MSG_INFO}> </span>
                        </Tooltip>
                    </div>

                    <Divider/>

                    {/* Custom Color Palette section */}
                    <div className={`${classNamePrefix}-custom-color-palette-container`}>
                        <div className={`${classNamePrefix}-custom-color-palette-title-section`}>
                            <span className={`${classNamePrefix}-custom-color-palette-title`}>
                                {localizedStrings.CUSTOM_COLOR_PALETTE_TITLE}
                            </span>
                            <span className={`${classNamePrefix}-custom-color-palette-new`} onClick={this.handleAddColorPalette}>
                                <span tabIndex={0} aria-label={localizedStrings.NEW_COLOE_PALETTE} className={VC.FONT_ADD_NEW}/>
                                <span className={`${classNamePrefix}-custom-color-palette-new-text`}>{localizedStrings.NEW_COLOE_PALETTE}</span>
                            </span>
                        </div>
                        {/* Custom Color Palette List */}
                        {
                            applicationPalettes && applicationPalettes.length > 0 ? <div>{this.renderColorPalettes()}</div> : <div>{localizedStrings.EMPTY_COLOR_PALETTE_LIST_HINT}</div>
                        }
                    </div>
                    <ColorPaletteEditor visible={this.state.showColorPaletteEditor} colorPaletteId={this.state.currentColorPaletteId}/>
                </div>
    }
}

const mapState = (state: RootState) => ({
    config: selectCurrentConfig(state),
    colorPalettes: selectColorPalettes(state)
})
  
const connector = connect(mapState, {
    updateCurrentConfig: Actions.updateCurrentConfig
})
  
export default connector(HomeScreenDossierSetting)