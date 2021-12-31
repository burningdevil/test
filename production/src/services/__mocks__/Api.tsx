import { mockDossierPicker } from '../../modules/components/__tests__/__mocks__/mock_state';
import {mockColorPalettes} from '../../../mock/colorPalette';
export const loadConfigList = jest.fn(() => {
})

export const loadContentBundleList = jest.fn()

export const loadCurrentEditConfig = jest.fn()

export const loadAllDossierDocuments = jest.fn()

export async function getSingleDossierInfo (dossierId: string, projectId: string) {
    return {dossierName: 'Dossier name for Test dossier as home'};
}

export const loadSearchedDossierDocuments = (name: string) => {
    const dossiers = mockDossierPicker.bundleContent.dossiers.filter(dossier => dossier.name.indexOf(name) !== -1);
    const documents = mockDossierPicker.bundleContent.documents.filter(document => document.name.indexOf(name) !== -1);
    const totalCount = dossiers.length + documents.length;
    return Promise.resolve({dossiers, documents, totalCount});
}
export const loadBatchDossierDocuments = () => {
    const dossiers = mockDossierPicker.bundleContent.dossiers;
    const documents = mockDossierPicker.bundleContent.documents;
    const totalCount = dossiers.length + documents.length;
    return Promise.resolve({dossiers, documents, totalCount});
}
export const getServerStatus = () => {
    return Promise.resolve({webVersion: '11.3.0500'});
}
export const loadColorPaletteList = () => {
    return Promise.resolve(mockColorPalettes);
}
