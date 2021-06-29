export const loadConfigList = jest.fn(() => {
    console.log('Mocked api loadConfigList is called');
})

export const loadContentBundleList = jest.fn()

export async function getSingleDossierInfo (dossierId: string, projectId: string) {
    return {dossierName: 'Dossier name for Test dossier as home'};
}