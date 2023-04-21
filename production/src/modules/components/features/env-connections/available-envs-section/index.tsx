import * as React from 'react';
import * as _ from 'lodash';
import { AvailableEnvsSectionProps } from './interface';
import { envConnectionsClassNamePrefix, getBaseUrl } from '../env-connections-util';
import { EnvironmentConnectionInterface } from "src/types/data-model/HomeScreenConfigModels";
import { localizedStrings } from '../../../HomeScreenConfigConstant';
import './styles.scss';

const AvailableEnvsSection = ({ wsOtherEnvs, linkedEnvs, onAddEnv }: AvailableEnvsSectionProps) => {
    let availableToLinkEnvs = [...wsOtherEnvs];
    // filter to only include environments currently connected to WS and remove any environments that are already linked
    availableToLinkEnvs = availableToLinkEnvs.filter(currEnv => currEnv.isConnected && !linkedEnvs.find(connectedEnv => (currEnv.url === getBaseUrl(connectedEnv.url))));
    availableToLinkEnvs = _.sortBy(availableToLinkEnvs, (e) => e.name); // sort available env list by name

    return <div className={`${envConnectionsClassNamePrefix}-available-envs-section`}>
        <div className={`${envConnectionsClassNamePrefix}-available-envs-table`}>
            <div className={`${envConnectionsClassNamePrefix}-available-envs-table-desc`}>{localizedStrings.ENVIRONMENT_CONNECTION_AVAILABLE_ENVS_DESC}</div>
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
                                onClick={() => onAddEnv(env)}
                            />
                        </div>
                    ))
                    : <div className='empty-available-envs-message'>{localizedStrings.EMPTY_AVAILABLE_ENVS_MSG}</div>
            }
        </div>
        <div className={`${envConnectionsClassNamePrefix}-available-envs-info`}>
            <div className='info-icn' />
            <div className='info-text'>{localizedStrings.AVAILABLE_ENVS_INFO_MSG}</div>
        </div>
    </div>
}

export default AvailableEnvsSection;
