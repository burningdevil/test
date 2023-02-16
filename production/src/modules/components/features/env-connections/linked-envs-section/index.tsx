import * as React from 'react';
import * as _ from 'lodash';
import classnames from 'classnames';
import { Select, Table } from 'antd';
import { Tooltip } from '@mstr/rc';
import EditableLabel from '../editable-label';
import { default as VC } from '../../../HomeScreenConfigConstant';
import { LinkedEnvsSectionProps } from './interface';
import { envConnectionsUrlCustomAppPath, envConnectionsClassNamePrefix, getBaseUrl, getApplicationIdFromUrl } from '../env-connections-util';
import { ThemePropObject, EnvironmentConnectionTableDataType, EnvironmentConnectionApplicationType } from "src/types/data-model/HomeScreenConfigModels";
import { localizedStrings } from '../../../HomeScreenConfigConstant';
import './styles.scss';

const LinkedEnvsSection = ({ currEnvConnections, wsCurrentEnv, linkedCurrentEnv, wsOtherEnvs, linkedEnvs, onUpdateLinkedCurrentEnv, onUpdateLinkedEnvs }: LinkedEnvsSectionProps) => {
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

    /** 
     * Returns a JSX component of the application list dropdown
     * @param record - linked environment object
     * @param application - application 
     * @param idx - index of the linked environment
     * @returns application list dropdown JSX
    */
    const getApplicationDropDown = (record: EnvironmentConnectionTableDataType, application: EnvironmentConnectionApplicationType, idx: number) => {
        const isFirstRow = idx === 0;
        const selectedApplicationValue = (!isFirstRow && record.isConfigured && record.isConnected) ? application?.id : undefined;
        const sortedApplicationList = _.sortBy(record.applicationList, (a) => a.name); // sort application list alphabetically
        const applicationSelectOptionsList = sortedApplicationList.map((a: EnvironmentConnectionApplicationType) => ({
            label: getApplicationOptionLabel(a.name, a.logo),
            value: a.id,
            isDefault: a.isDefault
        }));
        const { errorMessage } = record;
        const isErrorPresent = !!errorMessage;

        const applicationDropDown = (<Select
            className='connected-env-application-select'
            popupClassName='connected-env-application-select-dropdown'
            value={selectedApplicationValue}
            disabled={isErrorPresent}
            placeholder={''}
            options={applicationSelectOptionsList}
            bordered={false}
            onChange={(newApplicationId, newApplicationObj : { label: JSX.Element, value: string, isDefault: boolean}) => {
                // update url based on application selection
                let newLinkedEnvs = [...linkedEnvs];
                let currConnectedEnv = newLinkedEnvs[idx - 1];
                currConnectedEnv.url = newApplicationObj.isDefault ? record.baseUrl : (record.baseUrl + envConnectionsUrlCustomAppPath + newApplicationId); // update url with new application id
                onUpdateLinkedEnvs(newLinkedEnvs, {
                    current: currEnvConnections.current || linkedCurrentEnv.name,
                    other: newLinkedEnvs
                });
            }}
        />)

        return isErrorPresent ? (
        <Tooltip
            title = {errorMessage}
            placement = 'top'
        >
            {applicationDropDown}
        </Tooltip>) : applicationDropDown
    };

    // take existing current/linked env information and convert it into dataSource format readable by Table component
    const getLinkedEnvsTableDataSource = () => {
        // initialize dataSource with current env, which always come first in the table
        let dataSource: Array<EnvironmentConnectionTableDataType> = [
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
            const baseUrl = getBaseUrl(env.url);
            const selectedApplicationId = getApplicationIdFromUrl(env.url);
            let wsName = '';
            let selectedApplication: EnvironmentConnectionApplicationType = {
                id: selectedApplicationId,
                isDefault: false,
                name: ''
            };
            if (env.isConfigured) {
                // get and update env's WS saved name. this is accessible as long as the env is configured on user's WS
                const wsEnvObj = wsOtherEnvs.find(e => e.url === baseUrl);
                wsName = wsEnvObj?.name || '';
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
                isConnected: env.isConnected,
                errorMessage: env.errorMessage 
            })
        })

        return dataSource
    };

    return <Table className={`${envConnectionsClassNamePrefix}-table-wrapper`} dataSource={getLinkedEnvsTableDataSource()} tableLayout='fixed' pagination={false}>
        <Table.Column
            title={localizedStrings.NAME}
            dataIndex={VC.NAME}
            key={VC.NAME}
            width={220}
            render={(name: string, record: EnvironmentConnectionTableDataType, idx) => {
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
                                                        onUpdateLinkedCurrentEnv(newCurrentEnv, {
                                                            current: newNameToSave,
                                                            other: currEnvConnections.other
                                                        });
                                                    }}
                                                    wsName={record.wsName}
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
                                                onUpdateLinkedEnvs(newLinkedEnvs, {
                                                    current: currEnvConnections.current || linkedCurrentEnv.name,
                                                    other: newLinkedEnvs
                                                });
                                            }}
                                            wsName={record.wsName}
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
            width={220}
            render={(baseUrl: string, record: EnvironmentConnectionTableDataType, idx) => {
                const isFirstRow = idx === 0;
                const url = (isFirstRow || !record.selectedApplication?.id || record.selectedApplication?.isDefault) ? baseUrl : (record.baseUrl + envConnectionsUrlCustomAppPath + record.selectedApplication?.id);
                return (
                    <div className='connected-env-url' title={url}>{url}</div>
                );
            }}
        />
        <Table.Column
            title={localizedStrings.APPLICATION}
            dataIndex={VC.SELECTED_APPLICATION}
            key={VC.SELECTED_APPLICATION}
            width={224}
            render={(application: EnvironmentConnectionApplicationType, record: EnvironmentConnectionTableDataType, idx) => {
                const isFirstRow = idx === 0;
                return isFirstRow ? null : getApplicationDropDown(record, application, idx);
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
                            onUpdateLinkedEnvs(newLinkedEnvs, {
                                current: currEnvConnections.current || linkedCurrentEnv.name,
                                other: newLinkedEnvs
                            });
                        }}
                    />
                    : <React.Fragment />
            )}
        />
    </Table>
}

export default LinkedEnvsSection;
