import { store } from '../main';
import { HttpProxy } from '../main';
import * as ActionsCreator from '../store/actions/ActionsCreator';
import { isContentTypeDossier } from '../modules/components/views/HomeScreenUtils'

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

export const loadAllDossierDocuments = () => {
    //for now we fetch all dossiers in one request, need to evaluate whether need to load for multiple times
    store.dispatch(ActionsCreator.startLoadingDossierList());
    HttpProxy.get('/searches/results?pattern=4&type=14081&getAncestors=false&limit=-1&certifiedStatus=ALL').then((response: any) => {
        let data = response;
        if (data && response.data) {
          data = response.data;
        }
        const dossiers = data.result.filter((o: { viewMedia: number; }) => {return isContentTypeDossier(o.viewMedia)});
        const documents = data.result.filter((o: { viewMedia: number; }) => {return !isContentTypeDossier(o.viewMedia)});
        store.dispatch(ActionsCreator.appendContentDossiers(dossiers));
        store.dispatch(ActionsCreator.appendContentDocuments(documents));
        store.dispatch(ActionsCreator.finishLoadingDossierList());
    })
    .catch((e: any) => (console.log(e)));
}