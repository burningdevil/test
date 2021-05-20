export interface HomeScreenConfigType {
    'id': string,
    'name': string,
    'description': string,
    'lastUpdate': number,
    'schemaVersion': number,
    'icons': Array<string>,
    'mode': number,
    'platform': Array<string>
    'contentBundleIds': Array<string>
    // To be extended.
}

export interface GeneralSettingsType {
    name: string,
    description: string,
    platform: string
}