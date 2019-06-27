const application = "/AXApplication[@AXTitle='MicroStrategy Workstation']";
const osMenuBar = `${application}/AXMenuBar[0]`;
const mainWindow = `${application}/AXWindow[@AXSubrole='AXStandardWindow']`;
const envDialoguePath = `${application}/AXWindow[@AXTitle='Connect to Environment' and @AXSubrole='AXDialog']`;
const toolbar = `${mainWindow}/AXToolbar[0]`;
const smartTabGroup = `${mainWindow}/AXSplitGroup[0]/AXGroup[0]/AXScrollArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]`;


const mac_xpath = {
  env: {
    addNewEnv: `${mainWindow}/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXList[@AXSubrole='AXCollectionList']/AXList[@AXSubrole='AXSectionList']/AXGroup[@AXIdentifier='connectEnvItemPrototype']/AXGroup[@AXIdentifier='Add New Environment Connection']/AXImage[0]`,
    connectDialog: envDialoguePath,
    inputEnvName: `${envDialoguePath}/AXTextField[0]`,
    inputEnvUrl: `${envDialoguePath}/AXTextField[1]`,
    loginMode: `${envDialoguePath}/AXRadioButton[@AXTitle='ReplaceMe']`,
    userName: `${envDialoguePath}/AXTextField[0]`,
    userPwd: `${envDialoguePath}/AXTextField[1]`,
    connect: `${envDialoguePath}/AXButton[@AXTitle='Connect']`,
    continueToConnect: `${envDialoguePath}/AXButton[@AXTitle='Continue']`,
    projectList: `${application}/AXWindow[@AXTitle='Select Applications' and @AXSubrole='AXDialog']`,
    selectProject: `${application}/AXWindow[@AXTitle='Select Applications' and @AXSubrole='AXDialog']/AXScrollArea[0]/AXTable[0]/AXRow[@AXSubrole='AXTableRow']/AXCell[0]/AXCheckBox[@AXTitle='ReplaceMe']`,
    OKToConnect: `${application}/AXWindow[@AXTitle='Select Applications' and @AXSubrole='AXDialog']/AXButton[@AXTitle='OK']`,
    existingEnv: `${application}/AXWindow[@AXTitle='MicroStrategy Workstation - Environments']/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXList[@AXSubrole='AXCollectionList']/AXList[@AXSubrole='AXSectionList']/AXGroup[@AXIdentifier='environmentItemPrototype']/AXGroup[0]/AXStaticText[@AXValue='ReplaceMe']`,
    envContextOption: `${application}/AXWindow[@AXTitle='MicroStrategy Workstation - Environments']/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXList[@AXSubrole='AXCollectionList']/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceMe']`,
  },
  toolbar: {
    refresh: `${toolbar}/AXButton[0]`,
    iconView: `${toolbar}/AXGroup[1]/AXRadioGroup[0]/AXRadioButton[0]`,
    listView: `${toolbar}/AXGroup[1]/AXRadioGroup[0]/AXRadioButton[1]`,
    arrangeBy: `${toolbar}/AXGroup[2]/AXMenuButton[@AXTitle='Arrange By: Type']`,
    sortBy: `${toolbar}/AXGroup[3]/AXMenuButton[@AXTitle='Sort By: Name']`,
    selectApplication: `${toolbar}/AXButton[1]`,
    searchInputBox: `${toolbar}/AXGroup[4]/AXTextField[@AXSubrole='AXSearchField']`,
    clearSearchInput: `${toolbar}/AXGroup[4]/AXTextField[@AXSubrole='AXSearchField']/AXButton[1]`
  },
  smartTab: {
    tab: `${smartTabGroup}/AXStaticText[@AXValue='ReplaceMe']`,
    createNewItem: `${smartTabGroup}/AXButton[@AXHelp='ReplaceMe']`,
  },
  quickSearch: {
    listContainer: `${mainWindow}/AXToolbar[0]/AXGroup[4]/AXTextField[0]/AXPopover[0]`
  },
  dossierEditor: {
    container: `${application}/AXWindow[@AXTitle='ReplaceMe']`,
    close: `${application}/AXWindow[@AXTitle='ReplaceMe']/AXButton[@AXSubrole='AXCloseButton']`
  },
  workstationMainWindow: {
    closeWorkstation: `${mainWindow}/AXButton[@AXSubrole='AXCloseButton']`
  },
  menuBar: {
    menuItem: `${osMenuBar}/AXMenuBarItem[@AXTitle='ReplaceMenuItemName']`,
    menuOption:`${osMenuBar}/AXMenuBarItem[@AXTitle='ReplaceMenuItemName']/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceOption']`
  }
  
}

module.exports = mac_xpath;