import { EnvironmentConnectionInterface } from "src/types/data-model/HomeScreenConfigModels"

export type AvailableEnvsSectionProps = {
    wsOtherEnvs: Array<EnvironmentConnectionInterface>,
    linkedEnvs: Array<EnvironmentConnectionInterface>,
    onAddEnv(env: EnvironmentConnectionInterface) : void
}