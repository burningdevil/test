import { Button, Image } from 'antd'
import * as React from 'react'
import { connect } from 'react-redux'
import 'antd/dist/antd.css';
import * as _ from 'lodash'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfigTheme, selectCurrentConfig } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'
import { env } from '../../../main'
import { default as VC, localizedStrings } from '../HomeScreenConfigConstant'
import { ApplicationTheme } from '../../../types/data-model/HomeScreenConfigModels'
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
        workstation.window.addHandler(WindowEvent.ONCHILDCLOSE, (info) => {
           const { Message } = info || {}
            const { ChildInfo } = Message || {} 
            const { theme } = ChildInfo || {}
            if (theme) {
                this.props.updateCurrentConfig({ homeScreen: {
                    theme
                }})
            }
            
            return {}
        })
        workstation.window.addHandler(WindowEvent.POSTMESSAGE, (info: any) => {
            const { Message } = info || {}
            const { theme } = Message || {}
            if (theme) {
                this.props.updateCurrentConfig({ homeScreen: {
                    theme
                }})
            }
            return {}
        })
    }

    openAppDesignEditor = (theme?: ApplicationTheme) => {
        const objType = VC.APP_DESIGN_OBJTYPE;

        let options: ObjectEditorSettings = {
            objectType: objType,
            environment: this.state.currentEnv,
            extraContext: JSON.stringify(theme)
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
        const { theme } = this.props;
        // TODO - Refactor/Implement UI to render list of themes
        return (
            <div className='mstr-custom-app-screen'>
                <div className='mstr-custom-app-screen-title'>{t('customAppScreenTitle')}</div>
                {
                    theme ? <div className="mstr-custom-app-theme-content">
                        <div className='existing-theme-icn' />
                        <div className='existing-theme-hover-overlay' />
                        <div className='existing-theme-options'>
                            <div className="edit" onClick={() => this.openAppDesignEditor(theme)} />
                            <div className="delete" onClick={() => this.removeTheme()} />
                        </div>
                    </div>
                    : <div className='mstr-custom-app-no-theme-content'>
                        <div className='new-theme-icn' />
                        <div className='new-theme-desc'>{t('newThemeDesc')}</div>
                        <div className="add-design"
                            tabIndex={0}
                            onClick={() => this.openAppDesignEditor()}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    this.openAppDesignEditor()
                                }
                            }}
                        >
                            <div className='add-design-icn' />
                            <div className='add-design-text'>{t('newThemeText')}</div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapState = (state: RootState) => ({
    theme: selectCurrentConfigTheme(state),
    config: selectCurrentConfig(state)
})

const connector = connect(mapState, {
    deleteThemeInCurrentConfig: Actions.deleteThemeInCurrentConfig,
    updateCurrentConfig :Actions.updateCurrentConfig
})

export default connector(HomeScreenAppearance)
