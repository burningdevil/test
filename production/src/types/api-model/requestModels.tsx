import { HomeScreenConfigType } from "../data-model/HomeScreenConfigModels";

export interface ConfigListBodyModel {
    applications: HomeScreenConfigType[];
}
export interface ConfigListModel {
    applications?: HomeScreenConfigType[];
    data: ConfigListBodyModel;
}