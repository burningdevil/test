import { mockDossierPicker } from '../../modules/components/__tests__/__mocks__/mock_state';

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