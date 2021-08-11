import { HomeScreenConfigType } from "../data-model/HomeScreenConfigModels";

export interface ConfigListBodyModel {
    // waiting to be completed the detail model.
    applications: HomeScreenConfigType[];
    [propName: string]: any;
}
export interface ConfigListModel {
    data: ConfigListBodyModel
}