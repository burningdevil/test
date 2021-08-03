import { store } from '../main';
import { HttpProxy } from '../main';
import * as ActionsCreator from '../store/actions/ActionsCreator';
import { isContentTypeDossier } from '../modules/components/views/HomeScreenUtils'
import * as _ from 'lodash';
import { default as VC, platformType, localizedStrings } from '../modules/components/HomeScreenConfigConstant';

const CONFIG_ENDPOINTS = '/v2/applications/';

export const getApiPathForNewApplication = () => {
    return CONFIG_ENDPOINTS;
}

export const getApiPathForEditApplication = (configId: string) => {
    return CONFIG_ENDPOINTS + configId;
}

export const getApiPathForDuplicateApplication = () => {
    return CONFIG_ENDPOINTS;
}

export const getApiPathForDeleteApplication = (configId: string) => {
    return CONFIG_ENDPOINTS + configId;
}

export async function getSingleDossierInfo (dossierId: string, projectId: string) {
    const response = await HttpProxy.get('/objects/' + dossierId + '?type=55', {'X-MSTR-ProjectID': projectId}).then((response: any) => {
        return response;
    })
    .catch((e: any) => {
        return {dossierName: localizedStrings.INVALID_DOSSIER};
    });

    return response;
}

export const getApiPathForGetBundleContents = (bundleId: string, projIds: Array<string>) => {
    const projectStrs = projIds.map(o=>'projectId='+ o);
    return '/contentBundles/'+ bundleId + '/contents?' + _.join(projectStrs, '&');
}

export const getServerStatus = async () => {
    const response = await HttpProxy.get('/status');
    return response
}

export const downloadSingleConfig = async (configID: string) => {
    const response = await HttpProxy.get(CONFIG_ENDPOINTS + configID).then((res: { data: JSON }) => res.data);
    return response
}

export const loadConfigList = () => {
    store.dispatch(ActionsCreator.loadConfigList());
    HttpProxy.get(CONFIG_ENDPOINTS).then((response: any) => {
        let data = response;
        if (data && response.data) {
          data = response.data;
        }
        data = data.applications;
        data = data.filter((o: any) => o.id !== undefined);
        store.dispatch(ActionsCreator.loadConfigListSuccess(data));
    }).catch((e: any) => {
        store.dispatch(ActionsCreator.loadConfigListFail());
    });
}

export const loadContentBundleList = () => {
    HttpProxy.get('/contentBundles').then((response: any) => {
        let data = response;
        if (data && response.data) {
          data = response.data;
        }
        data = data.contentBundles;
        data = data.filter((o: any) => o.id !== undefined);
        store.dispatch(ActionsCreator.loadContentBundleListSuccess(data));
    }).catch((e: any) => {
        store.dispatch(ActionsCreator.loadContentBundleListFail());
    });
}

export const loadCurrentEditConfig = (configId: string) => {
    HttpProxy.get(CONFIG_ENDPOINTS + configId + '?outputFlag=INCLUDE_LOCALE').then((response: any) => {
        let data = response;
        if (data && response.data) {
          data = response.data;
        }
        if (!_.has(data, VC.PLATFORM)) {
            _.assign(data, {platforms: [platformType.web]});
        }
    
        if (!_.has(data, 'homeScreen.homeLibrary')) {
          data.homeScreen.homeLibrary = {icons:[], sidebars:[], contentBundleIds:[]}
        }
        store.dispatch(ActionsCreator.setCurrentConfig(data));
    });
}

export const loadSearchedDossierDocuments = (name: string) => {
    return HttpProxy.get('/searches/results?name=' + name + '&pattern=4&type=14081&getAncestors=false&limit=-1&certifiedStatus=OFF').then((response: any) => {
        let data = response;
        let totalCount = response.totalItems;
        if (data && response.data) {
          data = response.data;
          totalCount = response.data.totalItems;
        }
        var dossiers = data.result.filter((o: { viewMedia: number; }) => {return isContentTypeDossier(o.viewMedia)});
        var documents = data.result.filter((o: { viewMedia: number; }) => {return !isContentTypeDossier(o.viewMedia)});
        return {dossiers, documents, totalCount};
    })
    .catch((e: any) => (console.log(e)));
}

export const loadBatchDossierDocuments = (offset: number, limit: number) => {
    return HttpProxy.get('/searches/results?pattern=4&type=14081&offset='+ offset +'&getAncestors=false&limit='+ limit + '&certifiedStatus=OFF').then((response: any) => {
        let data = response;
        let totalCount = response.totalItems;
        if (data && response.data) {
          data = response.data;
          totalCount = response.data.totalItems;
        }
        var dossiers = data.result.filter((o: { viewMedia: number; }) => {return isContentTypeDossier(o.viewMedia)});
        var documents = data.result.filter((o: { viewMedia: number; }) => {return !isContentTypeDossier(o.viewMedia)});
        store.dispatch(ActionsCreator.appendContentDossiers(dossiers));
        store.dispatch(ActionsCreator.appendContentDocuments(documents));
        if(totalCount <= offset + limit) {
            store.dispatch(ActionsCreator.finishLoadingDossierListSuccess());
        }
        return {dossiers, documents, totalCount};
    })
    .catch((e: any) => (console.log(e)));
}

export const loadAllDossierDocuments = () => {
    //for now we fetch all dossiers in one request, need to evaluate whether need to load for multiple times
    store.dispatch(ActionsCreator.startLoadingDossierList());
    HttpProxy.get('/searches/results?pattern=4&type=14081&offset=0&getAncestors=false&certifiedStatus=ALL').then((response: any) => {
        let data = response;
        let totalCount = response.totalItems;
        if (data && response.data) {
          data = response.data;
          totalCount = response.data.totalItems;
        }
        const dossiers = data.result.filter((o: { viewMedia: number; }) => {return isContentTypeDossier(o.viewMedia)});
        const documents = data.result.filter((o: { viewMedia: number; }) => {return !isContentTypeDossier(o.viewMedia)});
        store.dispatch(ActionsCreator.finishLoadingDossierListSuccess());
        store.dispatch(ActionsCreator.appendContentDossiers(dossiers));
        store.dispatch(ActionsCreator.appendContentDocuments(documents));
    })
    .catch((e: any) => {
        store.dispatch(ActionsCreator.finishLoadingDossierListFail());
    });
}