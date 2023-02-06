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
import { EnvironmentConnectionSettingType, EnvironmentConnectionInterface, HomeScreenConfigType, ThemePropObject } from '../../../types/data-model/HomeScreenConfigModels'
import '../scss/env-connections/HomeScreenEnvConnections.scss'

declare var workstation: WorkstationModule;
const classNamePrefix = 'mstr-env-connection';
const screenClassNamePrefix = `${classNamePrefix}-screen`;
const customAppPath = 'app/config/';
interface EnvConnectionTableDataType {
    key: string,
    name: string,
    wsName: string,
    baseUrl: string,
    selectedApplication?: EnvApplicationType,
    applicationList?: Array<EnvApplicationType>,
    isConfigured: boolean,
    isConnected: boolean
}

interface EnvApplicationType {
    id: string,
    isDefault: boolean,
    name: string,
    logo?: ThemePropObject
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
    linkedCurrentEnv: EnvironmentConnectionInterface, // represents the current env object saved in the application config
    wsOtherEnvs: Array<EnvironmentConnectionInterface>, // represents the other envs available, as read from WS directly
    linkedEnvs: Array<EnvironmentConnectionInterface> // represents the linked envs saved in the application config
}

const getApplicationOptionLabel = (name: string, logo: ThemePropObject) => (
    <div className="application-list-obj">
        {logo?.value ? (
            <div
                className="application-list-obj-icn"
                style={{ backgroundImage: `url(${logo.value})` }}
            />
        ) : (
            <div className="application-list-obj-icn" />
        )}
        <div className="application-list-obj-text">{name}</div>
    </div>
);

class HomeScreenEnvConnections extends React.Component<HomeScreenEnvConnectionsProps, HomeScreenEnvConnectionsState> {
    // Life cycle
    constructor(props: any) {
        super(props);
        this.state = {
            wsCurrentEnv: {},
            linkedCurrentEnv: {
                name: '',
                url: ''
            },
            wsOtherEnvs: [],
            linkedEnvs: []
        }
    }

    async componentDidMount() {
        const { currEnvConnections } = this.props;
        const workstationCurrentEnv = await workstation.environments.getCurrentEnvironment();
        const workstationAvailableEnvs = await workstation.environments.getAvailableEnvironments();
        const wsOtherEnvs = workstationAvailableEnvs
            .filter(env => (env.url !== workstationCurrentEnv.url))
            .map(env => ({ name: env.name, url: env.url, isConnected: env.status === EnvironmentStatus.Connected }));
        // initialize state
        this.setState({
            wsCurrentEnv: workstationCurrentEnv,
            linkedCurrentEnv: { name: currEnvConnections.current || workstationCurrentEnv.name, url: workstationCurrentEnv.url },
            wsOtherEnvs,
            linkedEnvs: currEnvConnections.other
        });
        const linkedEnvs = [...currEnvConnections.other];
        linkedEnvs.forEach(async (env, idx) => {
            const envBaseUrl = this.getBaseUrl(env.url);
            const availableEnvObj = workstationAvailableEnvs.find(availableEnv => availableEnv.url === envBaseUrl);
            const isEnvConnected = availableEnvObj && (availableEnvObj.status === EnvironmentStatus.Connected);
            let envApplicationList: Array<EnvApplicationType> = [];

            if (isEnvConnected) {
                try {
                    const response = await api.fetchAllApplicationsForOtherEnv(envBaseUrl);
                    const { applications: fetchedEnvApplicationList } = response;
                    // TODO: do we want to save the homeScreen.theme object too? in case we want to display custom logo as part of UI
                    envApplicationList = fetchedEnvApplicationList.map((app: EnvApplicationType) => ({ name: app.name, id: app.id, isDefault: app.isDefault, logo: app.homeScreen?.theme?.logos?.web }));
                } catch (e) {
                    // TODO: err handling
                }
            }
            
            linkedEnvs[idx].applicationList = envApplicationList;
            linkedEnvs[idx].isConfigured = !!availableEnvObj;
            linkedEnvs[idx].isConnected = isEnvConnected;
            // update state with application lists for each linked environment
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
    getLinkedEnvsTableDataSource = () => {
        const { wsCurrentEnv, linkedCurrentEnv, wsOtherEnvs, linkedEnvs } = this.state;
        // initialize dataSource with current env, which always come first in the table
        let dataSource: Array<EnvConnectionTableDataType> = [
            {
                key: '0',
                name: linkedCurrentEnv.name,
                wsName: wsCurrentEnv.name,
                baseUrl: linkedCurrentEnv.url,
                isConfigured: true, // always true for current env
                isConnected: true // always true for current env
            }
        ];
        // push rest of linked envs to dataSource list
        linkedEnvs.forEach((env, idx) => {
            const baseUrl = this.getBaseUrl(env.url);
            const selectedApplicationId = this.getApplicationIdFromUrl(env.url);
            let wsName = '';
            let selectedApplication: EnvApplicationType = { id: selectedApplicationId };
            if (env.isConfigured) {
                // get and update env's WS saved name. this is accessible as long as the env is configured on user's WS
                const wsEnvObj = wsOtherEnvs.find(e => e.url === baseUrl);
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

    getAvailableToLinkEnvs = () => {
        const { wsOtherEnvs, linkedEnvs } = this.state;
        let availableToLinkEnvs = [...wsOtherEnvs];
        // filter to only return environments currently connected to WS
        // as well as remove any available envs that the user has already opted to link to
        availableToLinkEnvs = availableToLinkEnvs.filter(currEnv => currEnv.isConnected && !linkedEnvs.find(connectedEnv => (currEnv.url === this.getBaseUrl(connectedEnv.url))))

        return availableToLinkEnvs;
    }

    // Used to add an available environment to the linkedEnvs list. As part of this process, we will fetch the environment's
    // application list to make available to the user for selection. 
    addEnvironmentToLinkedEnvs = async (env: EnvironmentConnectionInterface) => {
        const { currEnvConnections } = this.props;
        const { linkedCurrentEnv, linkedEnvs } = this.state;
        // read latest environment state from workstation, this ensures we only make API calls when environment is available
        const workstationAvailableEnvs = await workstation.environments.getAvailableEnvironments();
        const availableEnvObj = workstationAvailableEnvs.find(availableEnv => availableEnv.url === this.getBaseUrl(env.url));
        const isEnvConnected = availableEnvObj && (availableEnvObj.status === EnvironmentStatus.Connected);
        let newLinkedEnvs = [...linkedEnvs];
        let envApplicationList: Array<EnvApplicationType> = [];
        if (isEnvConnected) {
            try {
                const response = await api.fetchAllApplicationsForOtherEnv(this.getBaseUrl(env.url));
                const { applications: fetchedEnvApplicationList } = response;
                envApplicationList = fetchedEnvApplicationList.map((app: EnvApplicationType) => ({ name: app.name, id: app.id, isDefault: app.isDefault, logo: app.homeScreen?.theme?.logos?.web }));
            } catch (e) {
                // TODO: err handling
            }
        }
        newLinkedEnvs.push({
            ...env,
            applicationList: envApplicationList,
            isConfigured: !!availableEnvObj,
            isConnected: !!isEnvConnected
        });
        newLinkedEnvs = _.sortBy(newLinkedEnvs, (e) => e.name); // sort new linked envs
        this.setState({ linkedEnvs: newLinkedEnvs }); // update state
        this.handleEnvConnectionsChange({
            current: currEnvConnections.current || linkedCurrentEnv.name,
            other: newLinkedEnvs
        }); 
    }

    // Used to refresh the state with the latest environment and application lists from Workstation and the server
    refreshEnvironments = async () => {
        const { linkedEnvs } = this.state;
        const workstationCurrentEnv = await workstation.environments.getCurrentEnvironment();
        const workstationAvailableEnvs = await workstation.environments.getAvailableEnvironments();
        const wsOtherEnvs = workstationAvailableEnvs
            .filter(env => (env.url !== workstationCurrentEnv.url))
            .map(env => ({ name: env.name, url: env.url, isConnected: env.status === EnvironmentStatus.Connected }));
        // update linkedEnvs with application lists
        const newLinkedEnvs = await Promise.all(linkedEnvs.map(async (env) => {
            const envBaseUrl = this.getBaseUrl(env.url);
            const availableEnvObj = wsOtherEnvs.find(availableEnv => availableEnv.url === this.getBaseUrl(env.url));
            const isEnvConnected = availableEnvObj?.isConnected;
            let envApplicationList = env.applicationList;
            // fetch latest application list for all linked envs that are actively connected to WS
            if (isEnvConnected) {
                try {
                    const response = await api.fetchAllApplicationsForOtherEnv(envBaseUrl);
                    const { applications: fetchedEnvApplicationList } = response;
                    envApplicationList = fetchedEnvApplicationList.map((app: EnvApplicationType) => ({ name: app.name, id: app.id, isDefault: app.isDefault, logo: app.homeScreen?.theme?.logos?.web }));
                } catch (e) {
                    // TODO: err handling
                }

                return {
                    ...env,
                    applicationList: envApplicationList,
                    isConfigured: true, // true, since we are in this code block which checks for isEnvConnected
                    isConnected: true // true, since we are in this code block which checks for isEnvConnected
                }
            } else {
                // return unmodified env object if there is no need to fetch & update its application list
                return env;
            }
        }));
        // update state with latest environments list retrieved from WS and updated applications lists for newly-connected environments
        this.setState({
            wsCurrentEnv: workstationCurrentEnv,
            wsOtherEnvs,
            linkedEnvs: newLinkedEnvs
        });
    }
 
    render() {
        const { currEnvConnections } = this.props;
        const { linkedCurrentEnv, linkedEnvs } = this.state;
        const linkedEnvsTableDataSource = this.getLinkedEnvsTableDataSource();
        let availableToLinkEnvs = this.getAvailableToLinkEnvs();
        availableToLinkEnvs = _.sortBy(availableToLinkEnvs, (e) => e.name); // sort by name
        return (
            <div className={screenClassNamePrefix}>
                <div className={`${screenClassNamePrefix}-title-row`}>
                <div className={`${screenClassNamePrefix}-title`}>{localizedStrings.NAVBAR_ENVIRONMENT_CONNECTION_SETTINGS.toUpperCase()}</div>
                <div className={`${screenClassNamePrefix}-refresh`} onClick={this.refreshEnvironments}>
                    <div className={`${screenClassNamePrefix}-refresh-icn`} />
                    <div className={`${screenClassNamePrefix}-refresh-text`}>{localizedStrings.REFRESH}</div>
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
                                                                        let newCurrentEnv = { ...linkedCurrentEnv };
                                                                        newCurrentEnv.name = newNameToSave; // update name in current env's object entry
                                                                        this.setState({ linkedCurrentEnv: newCurrentEnv }); // update state
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
                                                                    current: currEnvConnections.current || linkedCurrentEnv.name,
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
                                const url = (isFirstRow || !record.selectedApplication?.id || record.selectedApplication?.isDefault) ? baseUrl : (record.baseUrl + customAppPath + record.selectedApplication?.id);
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
                            render={(application: EnvApplicationType, record: EnvConnectionTableDataType, idx) => {
                                const isFirstRow = idx === 0;
                                const selectedApplicationValue = (!isFirstRow && record.isConfigured && record.isConnected) ? application?.id : undefined 
                                const applicationSelectOptionsList = record.applicationList?.map(a => ({
                                    label: getApplicationOptionLabel(a.name, a.logo),
                                    value: a.id,
                                    isDefault: a.isDefault
                                }));
                                return (
                                    isFirstRow
                                        ? null
                                        : <Select
                                            className='connected-env-application-select'
                                            popupClassName='connected-env-application-select-dropdown'
                                            value={selectedApplicationValue}
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
                                                    current: currEnvConnections.current || linkedCurrentEnv.name,
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
                                            newLinkedEnvs.splice(idx - 1, 1); // remove the selected row env
                                            this.setState({ linkedEnvs: newLinkedEnvs }); // update state
                                            this.handleEnvConnectionsChange({
                                                current: currEnvConnections.current || linkedCurrentEnv.name,
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
                            availableToLinkEnvs.length 
                                ? availableToLinkEnvs.map((env: EnvironmentConnectionInterface, idx) => (
                                    <div className='available-env-row' key={idx}>
                                        <div className='available-env-name' title={env.name}>
                                            <div className='available-env-name-icn' />
                                            <div className='available-env-name-text'>{env.name}</div>
                                        </div>
                                        <div className='available-env-url' title={env.url}>{env.url}</div>
                                        <div
                                            className='add-available-env-icn'
                                            onClick={() => this.addEnvironmentToLinkedEnvs(env)}
                                        />
                                    </div>
                                ))
                                : <div className='empty-available-envs-message'>{localizedStrings.EMPTY_AVAILABLE_ENVS_MSG}</div>
                        }
                    </div>
                    <div className={`${classNamePrefix}-available-envs-info`}>
                        <div className='info-icn' />
                        <div className='info-text'>{localizedStrings.AVAILABLE_ENVS_INFO_MSG}</div>
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
