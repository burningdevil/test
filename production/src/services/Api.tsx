import { HttpProxy } from '../main';

const CONFIG_ENDPOINTS = '/mstrClients/libraryApplications/configs';

export const downloadSingleMobileConfig = async (configID: string) => {
    const response = await HttpProxy.get(CONFIG_ENDPOINTS + '/' + configID).then((res: { data: JSON }) => res.data);
    return response
}
