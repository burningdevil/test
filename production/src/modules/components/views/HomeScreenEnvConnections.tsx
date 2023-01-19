import * as React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import * as api from '../../../services/Api';
import classnames from 'classnames'
import { Table, Select } from 'antd';
import 'antd/dist/antd.css';
import { WorkstationModule, EnvironmentStatus } from '@mstr/workstation-types'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig, selectCurrEnvConnections } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'
import { default as VC, localizedStrings } from '../HomeScreenConfigConstant'
import EditableLabel from '../common-components/editable-label/editable-label'
import { EnvironmentConnectionSettingType, EnvironmentConnectionInterface, HomeScreenConfigType } from '../../../types/data-model/HomeScreenConfigModels'
import '../scss/HomeScreenEnvConnections.scss'

declare var workstation: WorkstationModule;
const classNamePrefix = 'mstr-env-connection';
const screenClassNamePrefix = `${classNamePrefix}-screen`;
const customAppPath = 'app/config/';
interface EnvConnectionTableDataType {
    key: string,
    name: string,
    baseUrl: string,
    selectedApplication?: Partial<HomeScreenConfigType>,
    applicationList?: Array<Partial<HomeScreenConfigType>>,
    isConfigured?: boolean,
    isConnected?: boolean
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
        super(props);
        this.state = {
            currentEnv: {
                name: '',
                url: ''
            },
            otherEnvs: [],
            connectedEnvs: [] // in this case, connected = linked
        }
    }

    componentDidUpdate() { }

    async componentDidMount() {
        const { currEnvConnections } = this.props;
        const workstationCurrentEnv = await workstation.environments.getCurrentEnvironment();
        const workstationAvailableEnvs = await workstation.environments.getAvailableEnvironments();
        const otherEnvs = workstationAvailableEnvs
            .filter(env => (env.name !== workstationCurrentEnv.name) && (env.status === EnvironmentStatus.Connected))
            .map(env => ({ name: env.name, url: env.url }));
        // initialize state
        this.setState({
            currentEnv: { name: currEnvConnections.current || workstationCurrentEnv.name, url: workstationCurrentEnv.url },
            otherEnvs,
            connectedEnvs: currEnvConnections.other
        });
        const connectedEnvs = [...currEnvConnections.other];
        connectedEnvs.forEach(async (env, idx) => {
            const envBaseUrl = this.getBaseUrl(env.url);
            const availableEnvObj = workstationAvailableEnvs.find(availableEnv => availableEnv.url === envBaseUrl);
            const isEnvConnected = availableEnvObj && (availableEnvObj.status === EnvironmentStatus.Connected);
            let envApplicationList: Array<Partial<HomeScreenConfigType>> = [];

            if (isEnvConnected) {
                try {
                    const response = await api.fetchAllApplicationsForOtherEnv(envBaseUrl);
                    const { applications: fetchedEnvApplicationList } = response;
                    envApplicationList = fetchedEnvApplicationList.map((app: Partial<HomeScreenConfigType>) => ({ name: app.name, id: app.id, isDefault: app.isDefault }));
                } catch (e) {
                    // TODO: err handling
                }
            }
            
            connectedEnvs[idx].applicationList = envApplicationList;
            connectedEnvs[idx].isConfigured = !!availableEnvObj;
            connectedEnvs[idx].isConnected = isEnvConnected;
            // update state with application lists for each connected environment
            this.setState({ connectedEnvs });
        });
    }

    getBaseUrl = (url: string) => {
        return url.split(customAppPath)[0];
    }

    getApplicationIdFromUrl = (url: string) => {
        return url.split(customAppPath)[1];
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
                baseUrl: currentEnv.url,
            }
        ];
        connectedEnvs.forEach((env, idx) => {
            const baseUrl = this.getBaseUrl(env.url);
            const selectedApplicationId = this.getApplicationIdFromUrl(env.url);
            const selectedApplication = env.applicationList?.find(a => a.id === selectedApplicationId);
            dataSource.push({
                key: `${idx + 1}`, // +1 to prevent starting from 0, since current env entry already has key of '0'
                name: env.name,
                baseUrl,
                selectedApplication,
                applicationList: env.applicationList || [],
                isConfigured: env.isConfigured,
                isConnected: env.isConnected 
            })
        })

        return dataSource
    }

    getAvailableToConnectEnvs = () => {
        const { otherEnvs, connectedEnvs } = this.state;
        let availableToConnectEnvs = [...otherEnvs];
        // remove any available envs that the user has already opted to connect to
        availableToConnectEnvs = availableToConnectEnvs.filter(currEnv => !connectedEnvs.find(connectedEnv => (currEnv.url === this.getBaseUrl(connectedEnv.url))))

        return availableToConnectEnvs;
    }

    // Used to add an available environment to the connectedEnvs list. As part of this process, we will fetch the environment's
    // application list to make available to the user for selection. 
    addEnvironmentToConnectedEnvs = async (env: EnvironmentConnectionInterface) => {
        const { currEnvConnections } = this.props;
        const { currentEnv, connectedEnvs } = this.state;
        // TODO: should we re-check workstation available envs to ensure the env is still configured/connected?
        // or should we force trigger the refresh workflow instead? TBA!
        let newConnectedEnvs = [...connectedEnvs];
        let envApplicationList: Array<Partial<HomeScreenConfigType>> = [];
        try {
            const response = await api.fetchAllApplicationsForOtherEnv(this.getBaseUrl(env.url));
            const { applications: fetchedEnvApplicationList } = response;
            envApplicationList = fetchedEnvApplicationList.map((app: Partial<HomeScreenConfigType>) => ({ name: app.name, id: app.id, isDefault: app.isDefault }));
        } catch (e) {
            // TODO: err handling
        }
        newConnectedEnvs.push({
            ...env,
            applicationList: envApplicationList,
            isConfigured: true,
            isConnected: true
        });
        newConnectedEnvs = _.sortBy(newConnectedEnvs, (e) => e.name); // sort new connected envs
        this.setState({ connectedEnvs: newConnectedEnvs }); // update state
        this.handleEnvConnectionsChange({
            current: currEnvConnections.current || currentEnv.name,
            other: newConnectedEnvs
        }); 
    }
 
    render() {
        const { currEnvConnections } = this.props;
        const { currentEnv, otherEnvs, connectedEnvs } = this.state;
        const currentEnvLabelText = '(Current)'; // TODO: i18n
        const connectedEnvsTableDataSource = this.getConnectedEnvsTableDataSource();
        let availableToConnectEnvs = this.getAvailableToConnectEnvs();
        availableToConnectEnvs = _.sortBy(availableToConnectEnvs, (e) => e.name); // sort by name
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
                            render={(name: string, __, idx) => {
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
                                                                newConnectedEnvs = _.sortBy(newConnectedEnvs, (e) => e.name); // re-sort in case new name moves it out of position
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
                            dataIndex={'baseUrl'}
                            key={'baseUrl'}
                            width={160}
                            render={(baseUrl: string, record: EnvConnectionTableDataType, idx) => {
                                const isFirstRow = idx === 0;
                                const url = (isFirstRow || !record.selectedApplication || record.selectedApplication?.isDefault) ? baseUrl : (record.baseUrl + customAppPath + record.selectedApplication?.id);
                                return (
                                    <div className='connected-env-url' title={url}>{url}</div>
                                );
                            }}
                        />
                        <Table.Column
                            title='Application' /* TODO: add localized string for 'Application' */
                            dataIndex={VC.APPLICATION}
                            key={VC.APPLICATION}
                            width={284}
                            render={(application, record: EnvConnectionTableDataType, idx) => {
                                const isFirstRow = idx === 0;
                                const applicationSelectOptionsList = record.applicationList?.map(a => ({ label: a.name, value: a.id, isDefault: a.isDefault }))
                                return (
                                    isFirstRow
                                        ? null
                                        : <div className='connected-env-application-wrapper'>
                                            <Select
                                                className='connected-env-application-select'
                                                value={application}
                                                defaultValue='Select an application' // TODO: i18n
                                                options={applicationSelectOptionsList}
                                                onChange={(newApplicationId, newApplicationObj : { label: string, value: string, isDefault: boolean}) => {
                                                    // update url based on application selection
                                                    let newConnectedEnvs = [...connectedEnvs];
                                                    let currConnectedEnv = newConnectedEnvs[idx - 1];
                                                    currConnectedEnv.url = newApplicationObj.isDefault ? record.baseUrl : (record.baseUrl + customAppPath + newApplicationId); // update url with new application id
                                                    this.setState({ connectedEnvs: newConnectedEnvs }); // update state
                                                    this.handleEnvConnectionsChange({
                                                        current: currEnvConnections.current || currentEnv.name,
                                                        other: newConnectedEnvs
                                                    });
                                                }}
                                            />
                                        </div>
                                )
                            }}
                        />
                        <Table.Column
                            width={38}
                            render={(__, ___, idx) => (
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
                                        onClick={() => this.addEnvironmentToConnectedEnvs(env)}
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
