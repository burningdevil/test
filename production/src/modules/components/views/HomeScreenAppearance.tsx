import * as React from 'react'
import { connect } from 'react-redux'
import 'antd/dist/antd.css';
import * as _ from 'lodash'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig, selectCurrentConfigTheme } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'
import { default as VC, localizedStrings } from '../HomeScreenConfigConstant'
import { ApplicationTheme, HomeScreenConfigType } from '../../../types/data-model/HomeScreenConfigModels'
import { ObjectEditorSettings, WorkstationModule, WindowEvent } from '@mstr/workstation-types'
import { t } from '../../../i18n/i18next';
import '../scss/HomeScreenAppearance.scss'

declare var workstation: WorkstationModule;
class HomeScreenAppearance extends React.Component<any, any> {
    // Life cycle
    constructor(props: any) {
        super(props)
        this.state = {
            currentEnv: {}
        }
    }

    componentDidUpdate() { }

    async componentDidMount() {
        const currentEnvironment = await workstation.environments.getCurrentEnvironment();
        this.setState({
            currentEnv: currentEnvironment
        });
        workstation.window.addHandler(WindowEvent.ONCHILDCLOSE, (info: any) => {
            const { Message } = info || {}
            const { CloseInfo } = Message || {}
            const theme = JSON.parse(CloseInfo)
            if (theme) {
                this.props.updateThemeInCurrentConfig(theme)
            }

            return {}
        })
    }

    openAppearanceEditor = (config: HomeScreenConfigType, theme?: ApplicationTheme) => {
        const objType = VC.APPEARANCE_OBJ_TYPE;

        let options: ObjectEditorSettings = {
            objectType: objType,
            environment: this.state.currentEnv,
            extraContext: JSON.stringify({ config, theme })
        }

        workstation.dialogs.openObjectEditor(options).catch((e: any) =>
            workstation.dialogs.error({
                message: localizedStrings.ERR_EDITOR_OPEN,
                additionalInformation: JSON.stringify(e)
            })
        )
    }

    removeTheme = () => {
        this.props.deleteThemeInCurrentConfig()
    }

    render() {
        const { currConfigTheme, currConfig } = this.props;
        // TODO - Refactor/Implement UI to render list of themes
        return (
            <div className='mstr-custom-app-screen'>
                <div className='mstr-custom-app-screen-title'>{t('customAppScreenTitle')}</div>
                {
                    currConfigTheme ? <div className="mstr-custom-app-theme-content">
                        <div className='existing-theme-icn' />
                        <div className='existing-theme-hover-overlay' />
                        <div className='existing-theme-options'>
                            <div className="edit" onClick={() => this.openAppearanceEditor(currConfig, currConfigTheme)} />
                            <div className="delete" onClick={() => this.removeTheme()} />
                        </div>
                    </div>
                    : <div className='mstr-custom-app-no-theme-content'>
                        <div className='new-theme-icn' />
                        <div className='new-theme-desc'>{t('newThemeDesc')}</div>
                        <div className="add-appearance"
                            tabIndex={0}
                            onClick={() => this.openAppearanceEditor(currConfig)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    this.openAppearanceEditor(currConfig)
                                }
                            }}
                        >
                            <div className='add-appearance-icn' />
                            <div className='add-appearance-text'>{t('newThemeText')}</div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapState = (state: RootState) => ({
    currConfigTheme: selectCurrentConfigTheme(state),
    currConfig: selectCurrentConfig(state)
})

const connector = connect(mapState, {
    deleteThemeInCurrentConfig: Actions.deleteThemeInCurrentConfig,
    updateThemeInCurrentConfig: Actions.updateThemeInCurrentConfig
})

export default connector(HomeScreenAppearance)
