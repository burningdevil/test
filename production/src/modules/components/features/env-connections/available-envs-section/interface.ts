import { EnvironmentConnectionInterface } from "src/types/data-model/HomeScreenConfigModels"

export type AvailableEnvsSectionProps = {
    availableEnvs: Array<EnvironmentConnectionInterface>,
    onAddEnv(env: EnvironmentConnectionInterface) : void
}