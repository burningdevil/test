import { Environment } from '@mstr/workstation-types';
import { EnvironmentConnectionSettingType, EnvironmentConnectionInterface } from 'src/types/data-model/HomeScreenConfigModels';

export type LinkedEnvsSectionProps = {
    currEnvConnections: EnvironmentConnectionSettingType,
    wsCurrentEnv: Partial<Environment>,
    linkedCurrentEnv: EnvironmentConnectionInterface,
    wsOtherEnvs: Array<EnvironmentConnectionInterface>,
    linkedEnvs: Array<EnvironmentConnectionInterface>,
    onUpdateLinkedCurrentEnv(newLinkedCurrentEnv: EnvironmentConnectionInterface, newEnvConnections: EnvironmentConnectionSettingType): void,
    onUpdateLinkedEnvs(newLinkedEnvs: Array<EnvironmentConnectionInterface>, newEnvConnections: EnvironmentConnectionSettingType): void 
}