import * as React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import classnames from 'classnames'
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { WorkstationModule, EnvironmentStatus } from '@mstr/workstation-types'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig, selectCurrEnvConnections } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'
import { default as VC, localizedStrings } from '../HomeScreenConfigConstant'
import EditableLabel from '../common-components/editable-label/editable-label'
import { EnvironmentConnectionSettingType, EnvironmentConnectionInterface, HomeScreenConfigType } from '../../../types/data-model/HomeScreenConfigModels'
import { t } from '../../../i18n/i18next';
import '../scss/HomeScreenEnvConnections.scss'

declare var workstation: WorkstationModule;
const classNamePrefix = 'mstr-env-connection';
const screenClassNamePrefix = `${classNamePrefix}-screen`;
interface EnvConnectionTableDataType {
    key: string,
    name: string,
    url: string,
    application: string
}

interface HomeScreenEnvConnectionsProps {
    currConfig: Partial<HomeScreenConfigType>,
    currEnvConnections: EnvironmentConnectionSettingType,
    updateCurrentConfig(settings: Partial<HomeScreenConfigType>) : {
        type: string,
        data: Partial<HomeScreenConfigType>
    }
}

interface HomeScreenEnvConnectionsState {
    currentEnv: EnvironmentConnectionInterface,
    otherEnvs: Array<EnvironmentConnectionInterface>,
    connectedEnvs: Array<EnvironmentConnectionInterface>
}

class HomeScreenEnvConnections extends React.Component<HomeScreenEnvConnectionsProps, HomeScreenEnvConnectionsState> {
    // Life cycle
    constructor(props: any) {
        super(props)
        this.state = {
            currentEnv: {
                name: props.currEnvConnections?.current || 'TEMP', // TODO: remove 'TEMP', replace with empty string
                url: 'www.TEMP.com' // TODO: update with empty string
            },
            otherEnvs: [],
            connectedEnvs: props.currEnvConnections?.other || [] // by connected, we mean linked via the feature not connected thru workstation
        }
    }

    componentDidUpdate() { }

    async componentDidMount() {
        const currentEnvironment = await workstation.environments.getCurrentEnvironment();
        const availableEnvironments = await workstation.environments.getAvailableEnvironments();
        this.setState({
            currentEnv: { name: this.state.currentEnv.name || currentEnvironment.name, url: currentEnvironment.url },
            // only allow connection to connected/active environments, excluding the current env
            otherEnvs: availableEnvironments.filter(env => (env.name !== currentEnvironment.name) && (env.status === EnvironmentStatus.Connected)).map(env => ({ name: env.name, url: env.url }))
        });
    }

    handleEnvConnectionsChange = (envConnections: EnvironmentConnectionSettingType) => {
        this.props.updateCurrentConfig({ environments: envConnections })
    }

    getConnectedEnvsTableDataSource = () => {
        const { currentEnv, connectedEnvs } = this.state;
        // initialize dataSource with current env, which always come first in the table
        let dataSource: Array<EnvConnectionTableDataType> = [
            {
                key: '0',
                name: currentEnv.name,
                url: currentEnv.url,
                application: ''
            }
        ];
        connectedEnvs.forEach((env, idx) => {
            dataSource.push({
                key: (idx + 1).toString(), // +1 to prevent starting from 0, since current env entry already has key of '0'
                name: env.name,
                url: env.url,
                application: '' // TODO: add logic to extract application id from url prior to this step
            })
        })

        return dataSource
    }

    getAvailableToConnectEnvs = () => {
        const { otherEnvs, connectedEnvs } = this.state;
        let availableToConnectEnvs = [...otherEnvs];
        // remove any available envs that the user has already opted to connect to
        availableToConnectEnvs = availableToConnectEnvs.filter(currEnv => !connectedEnvs.find(connectedEnv => currEnv.name === connectedEnv.name))

        return availableToConnectEnvs;
    }
 
    render() {
        const { currConfig, currEnvConnections } = this.props;
        const { currentEnv, otherEnvs, connectedEnvs } = this.state;
        const currentEnvLabelText = '(Current)';
        const connectedEnvsTableDataSource = this.getConnectedEnvsTableDataSource();
        // let availableToConnectEnvs = this.getAvailableToConnectEnvs();
        // availableToConnectEnvs = _.sortBy(availableToConnectEnvs, (o) => o.name); // sort by name
        const availableToConnectEnvs : Array<EnvironmentConnectionInterface> = [
            {
                "name": "automation",
                "url": "http://10.23.39.231:8080/m2021/"
            },
            {
                "name": "latest",
                "url": "https://env-299367.customer.cloud.microstrategy.com/MicroStrategyLibrary/"
            },
            {
                "name": "aqueduct.microstrategy.com",
                "url": "https://aqueduct.microstrategy.com/MicroStrategyLibrary/"
            },
            {
                "name": "aqueduct-tech3.customer.cloud.microstrategy.com",
                "url": "https://aqueduct-tech3.customer.cloud.microstrategy.com/MicroStrategyLibrary/"
            }
        ]
        console.log(currentEnv);
        console.log(otherEnvs);
        console.log(connectedEnvs);
        console.log(currConfig);
        return (
            <div className={screenClassNamePrefix}>
                <div className={`${screenClassNamePrefix}-title`}>{localizedStrings.NAVBAR_ENVIRONMENT_CONNECTION_SETTINGS.toUpperCase()}</div>
                <div className={`${screenClassNamePrefix}-desc`}>{localizedStrings.ENVIRONMENT_CONNECTION_SETTINGS_DESC}</div>
                <div className={`${screenClassNamePrefix}-content`}>
                    <Table className={`${classNamePrefix}-table-wrapper`} dataSource={connectedEnvsTableDataSource} tableLayout='fixed' pagination={false}>
                        <Table.Column
                            title={localizedStrings.NAME}
                            dataIndex={VC.NAME}
                            key={VC.NAME}
                            width={220}
                            render={(name, _, idx) => {
                                const isFirstRow = idx === 0;
                                return (
                                    <div className='connected-env-name-wrapper'>
                                            <div className='connected-env-name-icn' />
                                            <div className={classnames('connected-env-name-text', { 'is-current-env': isFirstRow })}>
                                                {
                                                    isFirstRow
                                                        ? <React.Fragment>
                                                                <div className='current-env-name' title={name}>{name}</div>
                                                                <div className='current-env-suffix'>{currentEnvLabelText}</div>
                                                        </React.Fragment>
                                                        : <EditableLabel
                                                            className={'connected-env-name'}
                                                            value={name}
                                                            onValueChange={(newName: string) => {
                                                                let newConnectedEnvs = [...connectedEnvs];
                                                                let currConnectedEnv = newConnectedEnvs[idx - 1];
                                                                currConnectedEnv.name = newName; // update name in current env's object entry
                                                                this.setState({ connectedEnvs: newConnectedEnvs }); // update state
                                                                this.handleEnvConnectionsChange({
                                                                    current: currEnvConnections.current || currentEnv.name,
                                                                    other: newConnectedEnvs
                                                                });
                                                            }}
                                                        />
                                                }
                                            </div>
                                    </div>
                                )
                            }}
                        />
                        <Table.Column
                            title='URL' /* TODO: add localized string for 'URL' */
                            dataIndex={VC.URL}
                            key={VC.URL}
                            width={160}
                            render={(url, _, __) => (
                                <div className='connected-env-url' title={url}>{url}</div>
                            )}
                        />
                        <Table.Column title='Application' /* TODO: add localized string for 'Application' */ dataIndex={VC.APPLICATION} key={VC.APPLICATION} />
                        <Table.Column
                            width={38}
                            render={(_, __, idx) => (
                                (idx !== 0)
                                    ? <div
                                        className='remove-connected-env-icn'
                                        onClick={() => {
                                            let newConnectedEnvs = [...connectedEnvs];
                                            newConnectedEnvs.splice(idx - 1, 1); // remove the clicked row env
                                            this.setState({ connectedEnvs: newConnectedEnvs }); // update state
                                            this.handleEnvConnectionsChange({
                                                current: currEnvConnections.current || currentEnv.name,
                                                other: newConnectedEnvs
                                            });
                                        }}
                                    />
                                    : <React.Fragment />
                            )}
                        />
                    </Table>
                    <div className={`${classNamePrefix}-available-envs-section`}>
                        <div className={`${classNamePrefix}-available-envs-section-desc`}>{localizedStrings.ENVIRONMENT_CONNECTION_AVAILABLE_ENVS_DESC}</div>
                        {
                            availableToConnectEnvs.map((env: EnvironmentConnectionInterface, idx) => (
                                <div className='available-env-row' key={idx}>
                                    <div className='available-env-name' title={env.name}>
                                        <div className='available-env-name-icn' />
                                        <div className='available-env-name-text'>{env.name}</div>
                                    </div>
                                    <div className='available-env-url' title={env.url}>{env.url}</div>
                                    <div
                                        className='add-available-env-icn'
                                        onClick={() => {
                                            let newConnectedEnvs = [...connectedEnvs];
                                            newConnectedEnvs.push(env);
                                            newConnectedEnvs = _.sortBy(newConnectedEnvs, (o) => o.name); // sort new connected envs
                                            this.setState({ connectedEnvs: newConnectedEnvs }); // update state
                                            this.handleEnvConnectionsChange({
                                                current: currEnvConnections.current || currentEnv.name,
                                                other: newConnectedEnvs
                                            });
                                        }}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
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
