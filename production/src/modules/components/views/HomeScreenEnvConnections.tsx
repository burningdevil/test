import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import classnames from 'classnames';
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import { Environment, WorkstationModule, EnvironmentStatus } from '@mstr/workstation-types';

import * as Actions from '../../../store/actions/ActionsCreator';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { EnvironmentConnectionSettingType, EnvironmentConnectionInterface, HomeScreenConfigType } from '../../../types/data-model/HomeScreenConfigModels';
import { selectCurrentConfig, selectCurrEnvConnections } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import { localizedStrings } from '../HomeScreenConfigConstant';
import { envConnectionsClassNamePrefix, getBaseUrl, getApplicationListFromServer } from '../features/env-connections/env-connections-util';
import LinkedEnvsSection from '../features/env-connections/linked-envs-section';
import AvailableEnvsSection from '../features/env-connections/available-envs-section';
import '../scss/env-connections/HomeScreenEnvConnections.scss';

declare var workstation: WorkstationModule;
const screenClassNamePrefix = `${envConnectionsClassNamePrefix}-screen`;

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
    isRefreshing: boolean
}

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
            linkedEnvs: [],
            isRefreshing: false
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
            const envBaseUrl = getBaseUrl(env.url);
            const availableEnvObj = workstationAvailableEnvs.find(availableEnv => availableEnv.url === envBaseUrl);
            const isEnvConnected = availableEnvObj?.status === EnvironmentStatus.Connected;
            const errorObject: { errorMessage?: string } = {};
            const envApplicationList = await getApplicationListFromServer(envBaseUrl, env.name, isEnvConnected, errorObject);
            
            linkedEnvs[idx].applicationList = envApplicationList;
            linkedEnvs[idx].errorMessage = errorObject.errorMessage;
            linkedEnvs[idx].isConfigured = !!availableEnvObj;
            linkedEnvs[idx].isConnected = !!isEnvConnected;
            // update state with application lists for each linked environment
            this.setState({ linkedEnvs });
        });
    }

    // update linkedCurrentEnv and Redux Store with new values
    handleLinkedCurrentEnvChange = (newLinkedCurrentEnv: EnvironmentConnectionInterface, newEnvConnections: EnvironmentConnectionSettingType) => {
        this.setState({ linkedCurrentEnv: newLinkedCurrentEnv }); // update state
        this.props.updateCurrentConfig({ environments: newEnvConnections }); // update config in redux store
    }

    // update linkedEnvs and Redux Store with new values
    handleLinkedEnvsChange = (newLinkedEnvs: Array<EnvironmentConnectionInterface>, newEnvConnections: EnvironmentConnectionSettingType) => {
        this.setState({ linkedEnvs: newLinkedEnvs }); // update state
        this.props.updateCurrentConfig({ environments: newEnvConnections }); // update config in redux store
    }

    // Used to add an available environment to the linkedEnvs list. As part of this process, we will fetch the environment's
    // application list to make available to the user for selection. 
    addEnvironmentToLinkedEnvs = async (env: EnvironmentConnectionInterface) => {
        const { currEnvConnections } = this.props;
        const { linkedCurrentEnv, linkedEnvs } = this.state;
        // read latest environment state from workstation, this ensures we only make API calls when environment is available
        const workstationAvailableEnvs = await workstation.environments.getAvailableEnvironments();
        const availableEnvObj = workstationAvailableEnvs.find(availableEnv => availableEnv.url === getBaseUrl(env.url));
        const isEnvConnected = availableEnvObj?.status === EnvironmentStatus.Connected;
        let newLinkedEnvs = [...linkedEnvs];
        const envBaseUrl = getBaseUrl(env.url);
        const errorObject: { errorMessage?: string } = {};
        const envApplicationList = await getApplicationListFromServer(envBaseUrl, env.name, isEnvConnected, errorObject);
        newLinkedEnvs.push({
            ...env,
            applicationList: envApplicationList,
            errorMessage: errorObject.errorMessage,
            isConfigured: !!availableEnvObj,
            isConnected: !!isEnvConnected
        });
        newLinkedEnvs = _.sortBy(newLinkedEnvs, (e) => e.name); // sort new linked envs
        // update state + config in redux store
        this.handleLinkedEnvsChange(newLinkedEnvs, {
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
        
        this.setState({ isRefreshing: true });
        // update linkedEnvs with application lists
        const newLinkedEnvs = await Promise.all(linkedEnvs.map(async (env) => {
            const envBaseUrl = getBaseUrl(env.url);
            const availableEnvObj = wsOtherEnvs.find(availableEnv => availableEnv.url === getBaseUrl(env.url));
            const isEnvConnected = availableEnvObj?.isConnected;
            const errorObject: { errorMessage?: string } = {};
            const envApplicationList = await getApplicationListFromServer(envBaseUrl, env.name, isEnvConnected, errorObject);

            return {
                ...env,
                applicationList: envApplicationList,
                errorMessage: errorObject.errorMessage,
                isConfigured: !!availableEnvObj, // true, since we are in this code block which checks for isEnvConnected
                isConnected: !!isEnvConnected // true, since we are in this code block which checks for isEnvConnected
            }
        }));
        this.setState({ isRefreshing: false });
        // update state with latest environments list retrieved from WS and updated applications lists for newly-connected environments
        this.setState({
            wsCurrentEnv: workstationCurrentEnv,
            wsOtherEnvs,
            linkedEnvs: newLinkedEnvs
        });
    }
 
    render() {
        const { currEnvConnections } = this.props;
        const { wsCurrentEnv, linkedCurrentEnv, wsOtherEnvs, linkedEnvs, isRefreshing } = this.state;
        return (
            <div className={screenClassNamePrefix}>
                <div className={`${screenClassNamePrefix}-title-row`}>
                <div className={`${screenClassNamePrefix}-title`}>{localizedStrings.NAVBAR_ENVIRONMENT_CONNECTION_SETTINGS.toUpperCase()}</div>
                <div className={`${screenClassNamePrefix}-refresh`} onClick={this.refreshEnvironments}>
                    <div className={classnames(`${screenClassNamePrefix}-refresh-icn`, { 'disabled': isRefreshing })} />
                    <div className={`${screenClassNamePrefix}-refresh-text`}>{localizedStrings.REFRESH}</div>
                </div>
                </div>
                <div className={`${screenClassNamePrefix}-desc`}>{localizedStrings.ENVIRONMENT_CONNECTION_SETTINGS_DESC}</div>
                <Spin spinning={isRefreshing}>
                    <div className={`${screenClassNamePrefix}-content`}>
                        <LinkedEnvsSection currEnvConnections={currEnvConnections} wsCurrentEnv={wsCurrentEnv} linkedCurrentEnv={linkedCurrentEnv}
                            wsOtherEnvs={wsOtherEnvs} linkedEnvs={linkedEnvs} onUpdateLinkedCurrentEnv={this.handleLinkedCurrentEnvChange} onUpdateLinkedEnvs={this.handleLinkedEnvsChange} />
                        <AvailableEnvsSection wsOtherEnvs={wsOtherEnvs} linkedEnvs={linkedEnvs} onAddEnv={this.addEnvironmentToLinkedEnvs} />
                    </div>
                </Spin>
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
