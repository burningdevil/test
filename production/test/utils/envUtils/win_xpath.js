const win_xpath = {
  env: {
    addNewEnv: '/Window/Custom[7]/Custom[1]/List/Group[1]/ListItem/Button',
    cancelConnectToEnv: '/Window/Window/Button[2]',
    envConnect: '/Window/Window/Button[3]',
    envCheckBox: '/Window/Window/Window/List/ListItem[1]/CheckBox',
    envCheckBoxAcceptButton: '/Window/Window/Window/Button[3]',
    connectedEnvironment: '/Window/Custom[7]/Custom[1]/List/Group[1]/ListItem[2]',
    connectionFile: "consume-e2e.mstrc",
    connectionFileUpload: "/Window/Window/Button[4]",
    connectionFileInputBox: "/Window/Window/Window/ComboBox[1]/Edit",
    connectionFileOpen: "/Window/Window/Window/Button[1]",
    connectionCredentialsBox: "/Window/Window/Window/Edit[1]",
    connectionCredentialsAccept: "/Window/Window/Window/Button[3]",
  },
  quickSearch: {
    searchInputBox: "/Window/Custom[6]/Edit",
    clearSearchInput: "/Window/Custom[6]/Button[1]/Image",
  },
  dossierEditor: {
    close: "/Window/Button[3]/Image"
  },
  workstationMainWindow: {
    closeWorkstation: "/Window/Button[3]/Image"
  }
}

module.exports = win_xpath;