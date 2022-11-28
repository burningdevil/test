export const wsWebViews = {
    customAppHomeScreen: 'homescreenConfigMain', //custom app list main window
    customAppEditor: 'homescreenConfigEditor',   //new/edit application window
    libraryAdmin: 'workstation-library-admin'    //library admin in environment info dialog
}

export const wsConfig = {
    webViewQueryTimeout: 30, // maximum timeout = 30s to find expected webview window
    waitForWebElementTimeout: 120000, //  maximum timeout = 30s to find web object
    authModesSeperator: ','  // e.g. LDAP, OIDC, Standard in application list grid
}



