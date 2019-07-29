const application = "/AXApplication[@AXTitle='MicroStrategy Workstation']";
const osMenuBar = `${application}/AXMenuBar[0]`;
const mainWindow = `${application}/AXWindow[@AXSubrole='AXStandardWindow']`;
const displaySection = `${mainWindow}/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXList[@AXSubrole='AXCollectionList']/AXList[@AXSubrole='AXSectionList']`;
const envDialoguePath = `${application}/AXWindow[@AXSubrole='AXDialog']`;
const toolbar = `${mainWindow}/AXToolbar[0]`;
const smartTabGroup = `${mainWindow}/AXSplitGroup[0]/AXGroup[0]/AXScrollArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]`;

const mac_xpath = {
  iconView: {
    env: {
      addNewEnv: `${displaySection}/AXGroup[@AXIdentifier='connectEnvItemPrototype']/AXGroup[@AXIdentifier='Add New Environment Connection']/AXImage[0]`,
      existingEnv: `${displaySection}/AXGroup[@AXIdentifier='environmentItemPrototype']/AXGroup[0]/AXStaticText[@AXValue='ReplaceMe']`,
      envContextOption: `${mainWindow}/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXList[@AXSubrole='AXCollectionList']/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceMe']`,
    },
    searchPage: {
      resultItem: `${displaySection}/AXGroup[@AXIdentifier='WSCollectionViewCardItemPrototype']/AXGroup[0]/AXStaticText[@AXValue='ReplaceMe\n']`,
      contextMenuOption: `${mainWindow}/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXList[@AXSubrole='AXCollectionList']/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceMe']`
      // smallResultItem: `${displaySection}/AXGroup[@AXIdentifier='itemPrototype[false]']/AXGroup[0]/AXStaticText[@AXValue='ReplaceMe']`,
    },
  },
  listView: {
    env: {
      addNewEnv: `${mainWindow}/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXStaticText[@AXValue='Add New Environment Connection']`,
      existingEnv: `${mainWindow}/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXStaticText[@AXValue='ReplaceMe']`,
      envContextOption: `${mainWindow}/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXOutline[0]/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceMe']`,
    },
    searchPage: {
      resultItem: `${mainWindow}/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXTextField[@AXValue='ReplaceMe']`,
      contextMenuOption: `${mainWindow}/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXOutline[0]/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceMe']`,
    }
  },
  general: {
    env: {
      connectDialog: envDialoguePath,
      inputEnvName: `${envDialoguePath}/AXTextField[0]`,
      inputEnvUrl: `${envDialoguePath}/AXTextField[1]`,
      loginMode: `${envDialoguePath}/AXRadioButton[@AXTitle='ReplaceMe']`,
      userName: `${envDialoguePath}/AXTextField[0]`,
      userPwd: `${envDialoguePath}/AXTextField[1]`,
      rememberMe: `${envDialoguePath}/AXCheckBox[@AXTitle='Remember Me']`,
      connect: `${envDialoguePath}/AXButton[@AXTitle='Connect']`,
      continueToConnect: `${envDialoguePath}/AXButton[@AXTitle='Continue']`,
      projectList: `${envDialoguePath}`,
      selectProject: `${envDialoguePath}/AXScrollArea[0]/AXTable[0]/AXRow[@AXSubrole='AXTableRow']/AXCell[0]/AXCheckBox[@AXTitle='ReplaceMe']`,
      rememberSelectedApplications: `${envDialoguePath}/AXCheckBox[@AXTitle='Remember Selected Applications']`,
      OKToConnect: `${envDialoguePath}/AXButton[@AXTitle='OK']`,
    },
    toolbar: {
      refresh: `${toolbar}/AXButton[0]`,
      iconViewButton: `${toolbar}/AXGroup[1]/AXRadioGroup[0]/AXRadioButton[0]`,
      listViewButton: `${toolbar}/AXGroup[1]/AXRadioGroup[0]/AXRadioButton[1]`,
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
      dropdown: `${mainWindow}/AXToolbar[0]/AXGroup[4]/AXTextField[0]/AXPopover[0]`,
    },
    editor: {
      container: `${application}/AXWindow[@AXTitle='ReplaceMe']`,
      close: `${application}/AXWindow[@AXTitle='ReplaceMe']/AXButton[@AXSubrole='AXCloseButton']`
    },
    workstationMainWindow: {
      closeWorkstation: `${mainWindow}/AXButton[@AXSubrole='AXCloseButton']`,
      itemInCurrentView: `${displaySection}/AXGroup[@AXIdentifier='itemPrototype[false]']/AXGroup[0]/AXStaticText[@AXValue='ReplaceMe']`
    },
    searchPage: {
      searchingText: `${mainWindow}/AXSplitGroup[0]/AXStaticText[@AXValue='Searching']`,
      searchingFolder: `${mainWindow}/AXSplitGroup[0]/AXCheckBox[@AXTitle='ReplaceMe']`,
    },
    menuBar: {
      menuItem: `${osMenuBar}/AXMenuBarItem[@AXTitle='ReplaceMenuItemName']`,
      menuOption: `${osMenuBar}/AXMenuBarItem[@AXTitle='ReplaceMenuItemName']/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceOption']`
    },
    footer: {
      pathtext: `${mainWindow}/AXSplitGroup[0]/AXList[0]/AXStaticText[@AXValue='ReplaceMe']`
    }
  },

}

module.exports = mac_xpath;