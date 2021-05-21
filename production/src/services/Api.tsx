import { store } from '../main';
import { HttpProxy } from '../main';
import * as ActionsCreator from '../store/actions/ActionsCreator';

const CONFIG_ENDPOINTS = '/mstrClients/libraryApplications/configs';

export const downloadSingleMobileConfig = async (configID: string) => {
    const response = await HttpProxy.get(CONFIG_ENDPOINTS + '/' + configID).then((res: { data: JSON }) => res.data);
    return response
}

export const loadConfigList = () => {
    HttpProxy.get(CONFIG_ENDPOINTS).then((response: any) => {
        let data = response;
        if (data && response.data) {
          data = response.data;
        }
        store.dispatch(ActionsCreator.loadConfigListSuccess(data));
    });
}

export const loadContentBundleList = () => {
    HttpProxy.get('/contentBundles').then((response: any) => {
        let data = response;
        if (data && response.data) {
          data = response.data;
        }
        store.dispatch(ActionsCreator.loadContentBundleListSuccess(data.contentBundles));
    });
}