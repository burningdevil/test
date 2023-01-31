import * as React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import * as api from '../../../services/Api';
import classnames from 'classnames'
import { Table, Select } from 'antd';
import 'antd/dist/antd.css';
import { Environment, WorkstationModule, EnvironmentStatus } from '@mstr/workstation-types'
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
    wsName: string,
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
    wsCurrentEnv: Partial<Environment>, // represents the current env object read from WS directly
    savedCurrentEnv: EnvironmentConnectionInterface, // represents the current env object saved in the application config
    otherEnvs: Array<EnvironmentConnectionInterface>, // represents the other envs available, as read from WS directly
    linkedEnvs: Array<EnvironmentConnectionInterface> // represents the linked envs saved in the application config
}

class HomeScreenEnvConnections extends React.Component<HomeScreenEnvConnectionsProps, HomeScreenEnvConnectionsState> {
    // Life cycle
    constructor(props: any) {
        super(props);
        this.state = {
            wsCurrentEnv: {},
            savedCurrentEnv: {
                name: '',
                url: ''
            },
            otherEnvs: [],
            linkedEnvs: []
        }
    }

    async componentDidMount() {
        const { currEnvConnections } = this.props;
        const workstationCurrentEnv = await workstation.environments.getCurrentEnvironment();
        const workstationAvailableEnvs = await workstation.environments.getAvailableEnvironments();
        const otherEnvs = workstationAvailableEnvs
            .filter(env => (env.url !== workstationCurrentEnv.url))
            .map(env => ({ name: env.name, url: env.url, isConnected: env.status === EnvironmentStatus.Connected }));
        // initialize state
        this.setState({
            wsCurrentEnv: workstationCurrentEnv,
            savedCurrentEnv: { name: currEnvConnections.current || workstationCurrentEnv.name, url: workstationCurrentEnv.url },
            otherEnvs,
            linkedEnvs: currEnvConnections.other
        });
        const linkedEnvs = [...currEnvConnections.other];
        linkedEnvs.forEach(async (env, idx) => {
            const envBaseUrl = this.getBaseUrl(env.url);
            const availableEnvObj = workstationAvailableEnvs.find(availableEnv => availableEnv.url === envBaseUrl);
            const isEnvConnected = availableEnvObj && (availableEnvObj.status === EnvironmentStatus.Connected);
            let envApplicationList: Array<Partial<HomeScreenConfigType>> = [];

            if (isEnvConnected) {
                try {
                    const response = await api.fetchAllApplicationsForOtherEnv(envBaseUrl);
                    const { applications: fetchedEnvApplicationList } = response;
                    // TODO: do we want to save the homeScreen.theme object too? in case we want to display custom logo as part of UI
                    envApplicationList = fetchedEnvApplicationList.map((app: Partial<HomeScreenConfigType>) => ({ name: app.name, id: app.id, isDefault: app.isDefault }));
                } catch (e) {
                    // TODO: err handling
                }
            }
            
            linkedEnvs[idx].applicationList = envApplicationList;
            linkedEnvs[idx].isConfigured = !!availableEnvObj;
            linkedEnvs[idx].isConnected = isEnvConnected;
            // update state with application lists for each connected environment
            this.setState({ linkedEnvs });
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

    // take state information and convert it into dataSource format readable by AntD's Table component
    getConnectedEnvsTableDataSource = () => {
        const { wsCurrentEnv, savedCurrentEnv, otherEnvs, linkedEnvs } = this.state;
        // initialize dataSource with current env, which always come first in the table
        let dataSource: Array<EnvConnectionTableDataType> = [
            {
                key: '0',
                name: savedCurrentEnv.name,
                wsName: wsCurrentEnv.name,
                baseUrl: savedCurrentEnv.url,
            }
        ];
        // push rest of linked envs to dataSource list
        linkedEnvs.forEach((env, idx) => {
            const baseUrl = this.getBaseUrl(env.url);
            const selectedApplicationId = this.getApplicationIdFromUrl(env.url);
            let wsName = '';
            let selectedApplication: Partial<HomeScreenConfigType> = { id: selectedApplicationId };
            if (env.isConfigured) {
                // get and update env's WS saved name. this is accessible as long as the env is configured on user's WS
                const wsEnvObj = otherEnvs.find(e => e.url === baseUrl);
                wsName = wsEnvObj.name || '';
                // then, check for connectivity in order to access env's application list
                if (env.isConnected) {
                    // set selectedApplication as the corresponding application obj. if we don't have
                    // a selectedApplicationId, it is because the user has selected the default application
                    selectedApplication = selectedApplicationId
                    ? env.applicationList.find(a => a.id === selectedApplicationId)
                    : env.applicationList.find(a => a.isDefault);
                }
            }
            dataSource.push({
                key: `${idx + 1}`, // +1 to prevent starting from 0, since current env entry already has key of '0'
                name: env.name, // represents name of env as saved in application config
                wsName, // represents name of env as saved in WS
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
        const { otherEnvs, linkedEnvs } = this.state;
        let availableToConnectEnvs = [...otherEnvs];
        // filter to only return environments currently connected to WS
        // as well as remove any available envs that the user has already opted to connect to
        availableToConnectEnvs = availableToConnectEnvs.filter(currEnv => currEnv.isConnected && !linkedEnvs.find(connectedEnv => (currEnv.url === this.getBaseUrl(connectedEnv.url))))

        return availableToConnectEnvs;
    }

    // Used to add an available environment to the linkedEnvs list. As part of this process, we will fetch the environment's
    // application list to make available to the user for selection. 
    addEnvironmentToConnectedEnvs = async (env: EnvironmentConnectionInterface) => {
        const { currEnvConnections } = this.props;
        const { savedCurrentEnv, linkedEnvs } = this.state;
        // TODO: should we re-check workstation available envs to ensure the env is still configured/connected?
        // or should we force trigger the refresh workflow instead? TBA!
        let newLinkedEnvs = [...linkedEnvs];
        let envApplicationList: Array<Partial<HomeScreenConfigType>> = [];
        try {
            const response = await api.fetchAllApplicationsForOtherEnv(this.getBaseUrl(env.url));
            const { applications: fetchedEnvApplicationList } = response;
            envApplicationList = fetchedEnvApplicationList.map((app: Partial<HomeScreenConfigType>) => ({ name: app.name, id: app.id, isDefault: app.isDefault }));
        } catch (e) {
            // TODO: err handling
        }
        newLinkedEnvs.push({
            ...env,
            applicationList: envApplicationList,
            isConfigured: true,
            isConnected: true
        });
        newLinkedEnvs = _.sortBy(newLinkedEnvs, (e) => e.name); // sort new connected envs
        this.setState({ linkedEnvs: newLinkedEnvs }); // update state
        this.handleEnvConnectionsChange({
            current: currEnvConnections.current || savedCurrentEnv.name,
            other: newLinkedEnvs
        }); 
    }

    // Used to refresh the state with the latest environment and application lists from Workstation and the server
    refreshEnvironments = async () => {
        const { linkedEnvs } = this.state;
        const workstationCurrentEnv = await workstation.environments.getCurrentEnvironment();
        const workstationAvailableEnvs = await workstation.environments.getAvailableEnvironments();
        const otherEnvs = workstationAvailableEnvs
            .filter(env => (env.url !== workstationCurrentEnv.url))
            .map(env => ({ name: env.name, url: env.url, isConnected: env.status === EnvironmentStatus.Connected }));
        // update linkedEnvs with application lists if they were previously unavailable for a now connected environment
        const newLinkedEnvs = await Promise.all(linkedEnvs.map(async (env) => {
            const envBaseUrl = this.getBaseUrl(env.url);
            const availableEnvObj = workstationAvailableEnvs.find(availableEnv => availableEnv.url === this.getBaseUrl(env.url));
            const isEnvConnected = availableEnvObj && (availableEnvObj.status === EnvironmentStatus.Connected);
            let envApplicationList = env.applicationList;
            // if a linked environment was previously not configured/connected and therefore did not have a saved application list in the state,
            // but is now configured & connected as of the user clicking refresh, then we will attempt to fetch its application list now
            if ((!env.isConfigured || !env.isConnected) && isEnvConnected) {
                try {
                    const response = await api.fetchAllApplicationsForOtherEnv(envBaseUrl);
                    const { applications: fetchedEnvApplicationList } = response;
                    envApplicationList = fetchedEnvApplicationList.map((app: Partial<HomeScreenConfigType>) => ({ name: app.name, id: app.id, isDefault: app.isDefault }));
                } catch (e) {
                    // TODO: err handling
                }

                return {
                    name: env.name,
                    url: env.url,
                    applicationList: envApplicationList,
                    isConfigured: !!availableEnvObj,
                    isConnected: isEnvConnected
                }
            } else {
                // return unmodified env object if there is no need to fetch & update its application list
                return env;
            }
        }));
        // update state with latest environments list retrieved from WS and updated applications lists for newly-connected environments
        this.setState({
            wsCurrentEnv: workstationCurrentEnv,
            otherEnvs,
            linkedEnvs: newLinkedEnvs
        });
    }
 
    render() {
        const { currEnvConnections } = this.props;
        const { savedCurrentEnv, linkedEnvs } = this.state;
        const linkedEnvsTableDataSource = this.getConnectedEnvsTableDataSource();
        let availableToConnectEnvs = this.getAvailableToConnectEnvs();
        availableToConnectEnvs = _.sortBy(availableToConnectEnvs, (e) => e.name); // sort by name
        return (
            <div className={screenClassNamePrefix}>
                <div className={`${screenClassNamePrefix}-title-row`}>
                <div className={`${screenClassNamePrefix}-title`}>{localizedStrings.NAVBAR_ENVIRONMENT_CONNECTION_SETTINGS.toUpperCase()}</div>
                <div className={`${screenClassNamePrefix}-refresh`} onClick={this.refreshEnvironments}>
                    <div className={`${screenClassNamePrefix}-refresh-icn`} />
                    <div className={`${screenClassNamePrefix}-refresh-text`}>{'Refresh'/* TODO: i18n */}</div>
                </div>
                </div>
                <div className={`${screenClassNamePrefix}-desc`}>{localizedStrings.ENVIRONMENT_CONNECTION_SETTINGS_DESC}</div>
                <div className={`${screenClassNamePrefix}-content`}>
                    <Table className={`${classNamePrefix}-table-wrapper`} dataSource={linkedEnvsTableDataSource} tableLayout='fixed' pagination={false}>
                        <Table.Column
                            title={localizedStrings.NAME}
                            dataIndex={VC.NAME}
                            key={VC.NAME}
                            width={220}
                            render={(name: string, record: EnvConnectionTableDataType, idx) => {
                                const isFirstRow = idx === 0;
                                return (
                                    <div className='connected-env-name-wrapper'>
                                            <div className='connected-env-name-icn' />
                                            <div className={classnames('connected-env-name-text', { 'is-current-env': isFirstRow })}>
                                                {
                                                    isFirstRow
                                                        ? <React.Fragment>
                                                                <EditableLabel
                                                                    className={'current-env-name'}
                                                                    value={name}
                                                                    allowEmptySave
                                                                    onValueChange={(newName: string) => {
                                                                        const newNameToSave = newName || record.wsName; // fall back to WS saved current env name if user saves empty string
                                                                        let newCurrentEnv = { ...savedCurrentEnv };
                                                                        newCurrentEnv.name = newNameToSave; // update name in current env's object entry
                                                                        this.setState({ savedCurrentEnv: newCurrentEnv }); // update state
                                                                        this.handleEnvConnectionsChange({
                                                                            current: newNameToSave,
                                                                            other: currEnvConnections.other
                                                                        });
                                                                    }}
                                                                />
                                                                <div className='current-env-suffix'>{localizedStrings.CURRENT_ENV_LABEL}</div>
                                                        </React.Fragment>
                                                        : <EditableLabel
                                                            className={'connected-env-name'}
                                                            value={name}
                                                            allowEmptySave
                                                            onValueChange={(newName: string) => {
                                                                const newNameToSave = newName || record.wsName; // fall back to WS saved env name if user saves empty string
                                                                let newLinkedEnvs = [...linkedEnvs];
                                                                let currConnectedEnv = newLinkedEnvs[idx - 1];
                                                                currConnectedEnv.name = newNameToSave; // update name in env's object entry
                                                                newLinkedEnvs = _.sortBy(newLinkedEnvs, (e) => e.name); // re-sort in case new name moves it out of position
                                                                this.setState({ linkedEnvs: newLinkedEnvs }); // update state
                                                                this.handleEnvConnectionsChange({
                                                                    current: currEnvConnections.current || savedCurrentEnv.name,
                                                                    other: newLinkedEnvs
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
                            title={localizedStrings.URL}
                            dataIndex={VC.BASE_URL}
                            key={VC.BASE_URL}
                            width={160}
                            render={(baseUrl: string, record: EnvConnectionTableDataType, idx) => {
                                const isFirstRow = idx === 0;
                                const url = (isFirstRow || !record.selectedApplication.id || record.selectedApplication?.isDefault) ? baseUrl : (record.baseUrl + customAppPath + record.selectedApplication?.id);
                                return (
                                    <div className='connected-env-url' title={url}>{url}</div>
                                );
                            }}
                        />
                        <Table.Column
                            title={localizedStrings.APPLICATION}
                            dataIndex={VC.SELECTED_APPLICATION}
                            key={VC.SELECTED_APPLICATION}
                            width={284}
                            render={(application: Partial<HomeScreenConfigType>, record: EnvConnectionTableDataType, idx) => {
                                const isFirstRow = idx === 0;
                                const applicationSelectOptionsList = record.applicationList?.map(a => ({
                                    label: <div className='application-list-obj'><div className='application-list-obj-icn' /><div className='application-list-obj-text'>{a.name}</div></div>,
                                    value: a.id,
                                    isDefault: a.isDefault
                                }));
                                return (
                                    isFirstRow
                                        ? null
                                        : <Select
                                            className='connected-env-application-select'
                                            popupClassName='connected-env-application-select-dropdown'
                                            value={(record.isConfigured && record.isConnected) ? application.id : undefined} // only display the selected value when env is configured/connected
                                            placeholder={localizedStrings.SELECT_APPLICATION}
                                            options={applicationSelectOptionsList}
                                            bordered={false}
                                            onChange={(newApplicationId, newApplicationObj : { label: JSX.Element, value: string, isDefault: boolean}) => {
                                                // update url based on application selection
                                                let newLinkedEnvs = [...linkedEnvs];
                                                let currConnectedEnv = newLinkedEnvs[idx - 1];
                                                currConnectedEnv.url = newApplicationObj.isDefault ? record.baseUrl : (record.baseUrl + customAppPath + newApplicationId); // update url with new application id
                                                this.setState({ linkedEnvs: newLinkedEnvs }); // update state
                                                this.handleEnvConnectionsChange({
                                                    current: currEnvConnections.current || savedCurrentEnv.name,
                                                    other: newLinkedEnvs
                                                });
                                            }}
                                        />
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
                                            let newLinkedEnvs = [...linkedEnvs];
                                            newLinkedEnvs.splice(idx - 1, 1); // remove the clicked row env
                                            this.setState({ linkedEnvs: newLinkedEnvs }); // update state
                                            this.handleEnvConnectionsChange({
                                                current: currEnvConnections.current || savedCurrentEnv.name,
                                                other: newLinkedEnvs
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
                            availableToConnectEnvs.length 
                                ? availableToConnectEnvs.map((env: EnvironmentConnectionInterface, idx) => (
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
                                : <div className='empty-available-envs-message'>{'Connect to new environments in Workstation and refresh on this page to see the updated list.'/* TODO: i18n */}</div>
                        }
                    </div>
                    <div className={`${classNamePrefix}-available-envs-info`}>
                        <div className='info-icn' />
                        <div className='info-text'>{'Only connected environments are included in the list.'/* TODO: i18n */}</div>
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
