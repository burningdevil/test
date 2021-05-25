import { store } from '../main';
import { HttpProxy } from '../main';
import * as ActionsCreator from '../store/actions/ActionsCreator';
import { isContentTypeDossier } from '../modules/components/views/HomeScreenUtils'
import * as _ from 'lodash';

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

export const loadCurrentEditConfig = (configId: string) => {
    HttpProxy.get('/mstrClients/libraryApplications/configs/' + configId).then((response: any) => {
        let data = response;
        if (data && response.data) {
          data = response.data;
        }
        if (!_.has(data, 'platform')) {
            _.assign(data, {platform: ['Mobile']});
        }
    
        if (!_.has(data, 'homeScreen.homeLibrary')) {
          data.homeScreen.homeLibrary = {icons:[], sidebars:[], contentBundleIds:[]}
        }
        store.dispatch(ActionsCreator.setCurrentConfig(data));
    });
}

export const loadBatchDossierDocuments = (offset: number, limit: number) => {
    return HttpProxy.get('/searches/results?pattern=4&type=14081&offset='+ offset +'&getAncestors=false&limit='+ limit + '&certifiedStatus=ALL').then((response: any) => {
        let data = response;
        if (data && response.data) {
          data = response.data;
        }
        const dossiers = data.result.filter((o: { viewMedia: number; }) => {return isContentTypeDossier(o.viewMedia)});
        const documents = data.result.filter((o: { viewMedia: number; }) => {return !isContentTypeDossier(o.viewMedia)});
        store.dispatch(ActionsCreator.appendContentDossiers(dossiers));
        store.dispatch(ActionsCreator.appendContentDocuments(documents));
        return {dossiers, documents};
    })
    .catch((e: any) => (console.log(e)));
}

export const loadAllDossierDocuments = () => {
    //for now we fetch all dossiers in one request, need to evaluate whether need to load for multiple times
    const firstLoad = 1000;
    store.dispatch(ActionsCreator.startLoadingDossierList());
    HttpProxy.get('/searches/results?pattern=4&type=14081&offset=0&getAncestors=false&limit='+ firstLoad + '&certifiedStatus=ALL').then((response: any) => {
        let data = response;
        let totalCount = response.totalItems;
        if (data && response.data) {
          data = response.data;
          totalCount = response.data.totalItems;
        }
        const dossiers = data.result.filter((o: { viewMedia: number; }) => {return isContentTypeDossier(o.viewMedia)});
        const documents = data.result.filter((o: { viewMedia: number; }) => {return !isContentTypeDossier(o.viewMedia)});
        store.dispatch(ActionsCreator.appendContentDossiers(dossiers));
        store.dispatch(ActionsCreator.appendContentDocuments(documents));
        if(totalCount > firstLoad) {
            loadBatchDossierDocuments(firstLoad, totalCount - firstLoad)
            .then(()=>{
                store.dispatch(ActionsCreator.finishLoadingDossierList())
            });
        }else {
            store.dispatch(ActionsCreator.finishLoadingDossierList());
        }
        
    })
    .catch((e: any) => (console.log(e)));
}