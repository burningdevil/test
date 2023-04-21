export const wsWebViews = {
    customAppHomeScreen: 'homescreenConfigMain', //custom app list main window
    customAppEditor: 'homescreenConfigEditor',   //new/edit application window
    libraryAdmin: 'workstation-library-admin',   //library admin in environment info dialog
    appearanceEditor: 'appearanceEditor',         //appearance edit dialog 
    contentGroupEditor: 'contentBundleEditor'     //content group editor
}

export const wsConfig = {
    webViewQueryTimeout: 30, // maximum timeout = 30s to find expected webview window
    waitForWebElementTimeout: 120000, //  maximum timeout = 30s to find web object
    authModesSeperator: ',',  // e.g. LDAP, OIDC, Standard in application list grid
    defaultApplicationName: 'MicroStrategy',
    contentGroupNotDelete: 'Automation-Used-Not-Delete'
}

export const imageCompareConfig = {
    appDetailGrid: 'detailGrid', // application list grid in custom app main home
    customEmail: 'customEmail',   // custom email settings section in app editor
    envConnectionCurrentUrl: 'envConnectionCurrentUrl', // env connections current env url
    contextMenuInContentTab: 'contextMenuOfContentTab', //context menu in content groups grid of content tab in custom app editor
    tolerance: 0.02,
    toleranceMax: 100

}

export const wsNativeWindows = {
    wsMainWindow: 'Workstation Main Window',
    newCustomAppWindow: 'New Application',
    editCustomAppWindow: 'Edit Application',
    customAppInfo: 'Application info',

    contentGroupEditor: 'ContentGroup Editor',
    contentGroupInfo: 'ContentGroup Properties',

    themeEditor: 'Appearance Editor'
}

export const componentStatus = {
    shown: 'show',
    hidden: "hide"
}



