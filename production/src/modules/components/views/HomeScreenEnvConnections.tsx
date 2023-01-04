import * as React from 'react'
import { connect } from 'react-redux'
import 'antd/dist/antd.css';
import * as _ from 'lodash'
import { Checkbox } from '@mstr/rc';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig, selectCurrEnvConnections } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'
import { default as VC, localizedStrings } from '../HomeScreenConfigConstant'
import { EnvironmentConnectionSettingType, EnvironmentConnectionInterface } from '../../../types/data-model/HomeScreenConfigModels'
import { WorkstationModule, EnvironmentStatus } from '@mstr/workstation-types'
import { t } from '../../../i18n/i18next';
import '../scss/HomeScreenEnvConnections.scss'

declare var workstation: WorkstationModule;
class HomeScreenEnvConnections extends React.Component<any, any> {
    // Life cycle
    constructor(props: any) {
        super(props)
        this.state = {
            currentEnv: props.currEnvConnections?.current || {},
            allEnvs: [],
            connectedEnvs: props.currEnvConnections?.other || [] // by connected, we mean linked via the feature not connected thru workstation
        }
    }

    componentDidUpdate() { }

    async componentDidMount() {
        const currentEnvironment = await workstation.environments.getCurrentEnvironment();
        const allEnvironments = await workstation.environments.getAvailableEnvironments();
        this.setState({
            currentEnv: { name: currentEnvironment.name, url: currentEnvironment.url },
            // only allow connection to connected/active environments that are not the current env 
            allEnvs: allEnvironments.filter(env => (env.name !== currentEnvironment.name) && (env.status === EnvironmentStatus.Connected)).map(env => ({ name: env.name, url: env.url }))
        });
    }

    handleEnvConnectionsChange = (envConnections: EnvironmentConnectionSettingType) => {
        this.props.updateCurrentConfig({ environments: envConnections })
    }

    render() {
        const { currConfig, currEnvConnections, updateCurrentConfig } = this.props;
        const { currentEnv, allEnvs, connectedEnvs } = this.state;
        console.log(currentEnv);
        console.log(allEnvs);
        console.log(connectedEnvs);
        console.log(currConfig);
        return (
            <div className='mstr-env-connections-screen'>
                <div className='mstr-env-connections-screen-title'>{t('environmentConnectionSettings').toUpperCase()}</div>
                <div className='mstr-env-connections-screen-desc'>{t('environmentConnectionSettingsDesc')}</div>
                {
                    allEnvs.map((env: EnvironmentConnectionInterface) => (
                        <div>
                            <Checkbox onChange={(e: any) => {
                                let newConnectedEnvs = [...connectedEnvs]
                                if (e.target.checked) {
                                    newConnectedEnvs.push(env)
                                } else {
                                    newConnectedEnvs = newConnectedEnvs.filter((iteratedEnv: EnvironmentConnection) => iteratedEnv.name !== env.name)
                                }
                                this.setState({ connectedEnvs: newConnectedEnvs })
                                updateCurrentConfig({
                                    environments: {
                                        current: currEnvConnections.current || currentEnv.name,
                                        other: newConnectedEnvs
                                    }
                                })
                            }}></Checkbox>
                            <span>{env.name}</span>: <span>{env.url}</span>
                        </div>
                    ))
                }
            </div>
        )
    }
}

const mapState = (state: RootState) => ({
    currConfig: selectCurrentConfig(state),
    currEnvConnections: selectCurrEnvConnections(state)
})

const connector = connect(mapState, {
    updateCurrentConfig: Actions.updateCurrentConfig
})

export default connector(HomeScreenEnvConnections)
