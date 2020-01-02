const application = '/AXApplication[@AXTitle=\'MicroStrategy Workstation\']'
const stdWindow = `${application}/AXWindow[@AXSubrole='AXStandardWindow']`
const menuBar = `${application}/AXMenuBar[0]`
const toolbar = `${stdWindow}/AXToolbar[0]`
const mainCanvas = `${stdWindow}/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]`
const mainCanvasIconView = `${mainCanvas}/AXList[@AXSubrole='AXCollectionList']`
const mainCanvasListView = `${mainCanvas}/AXOutline[0]`

const envSection = `${mainCanvas}/AXList[@AXSubrole='AXCollectionList']/AXList[@AXSubrole='AXSectionList']`
const dialog = `${application}/AXWindow[@AXSubrole='AXDialog']`
const popup = `${application}/AXWindow[@AXSubrole='AXStandardWindow']/AXSheet[0]`

const popupInEditor = `${application}/AXWindow[@AXTitle='ReplaceEditorTitle']/AXSheet[0]`
const smartTabGroup = `${stdWindow}/AXSplitGroup[0]/AXGroup[0]/AXScrollArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]`

const macXPath = {
  iconView: {
    mainCanvas: {
      env: {
        addNewEnv: `${envSection}/AXGroup[@AXIdentifier='connectEnvItemPrototype']/AXGroup[@AXIdentifier='Add New Environment Connection']/AXImage[0]`,
        existingEnv: `${envSection}/AXGroup[@AXIdentifier='environmentItemPrototype']/AXGroup[0]/AXStaticText[@AXValue='ReplaceEnvName']`,
      },
      // item Type 1: dossiers, environment, rsd
      dossierItem: `${mainCanvasIconView}/AXList[@AXSubrole='AXSectionList']/AXGroup[@AXIdentifier='WSCollectionViewCardItemPrototype']/AXGroup[0]/AXStaticText[@AXValue='ReplaceItemName\n']`,
      rsdItem:`${mainCanvasIconView}/AXList[@AXSubrole='AXSectionList']/AXGroup[@AXIdentifier='WSCollectionViewCardItemPrototype']/AXGroup[0]/AXStaticText[@AXValue='ReplaceItemName\n']`,
      // itemType2: `${displaySection}/AXGroup[@AXIdentifier='itemPrototype[false]']/AXGroup[0]/AXStaticText[@AXValue='ReplaceMe']`,
      contextOption: `${mainCanvasIconView}/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceOption']`,
      environmentResultItem:`${mainCanvas}/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXStaticText[@AXValue='ReplaceMe']`,
      secondaryContextOption: `${mainCanvasIconView}/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceOption']/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceSecondaryOption']`
    },
    separaterTitle: `/AXApplication[@AXTitle='MicroStrategy Workstation']/AXWindow[@AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup[1]/AXScrollArea[0]/AXList[@AXSubrole='AXCollectionList']/AXList[@AXSubrole='AXSectionList']/AXGroup/AXStaticText[@AXValue='replaceMe']`
  },
  listView: {
    mainCanvas: {
      env: {
        addNewEnv: `${mainCanvasListView}/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXStaticText[@AXValue='Add New Environment Connection']`,
        existingEnv: `${mainCanvasListView}/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXStaticText[@AXValue='ReplaceEnvName']`,
      },
      // item Type 1: Document, Card, Report, Dataset, Metric, Folder
      documentItem: `${mainCanvasListView}/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXTextField[@AXValue='ReplaceItemName']`,
      cardItem: `${mainCanvasListView}/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXTextField[@AXValue='ReplaceItemName']`,
      reportItem: `${mainCanvasListView}/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXTextField[@AXValue='ReplaceItemName']`,
      datasetItem: `${mainCanvasListView}/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXTextField[@AXValue='ReplaceItemName']`,
      metricItem: `${mainCanvasListView}/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXTextField[@AXValue='ReplaceItemName']`,
      folderItem: `${mainCanvasListView}/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXTextField[@AXValue='ReplaceItemName']`,
      // item Type 2: Env, Application, Dossier
      envItem: `${mainCanvasListView}/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXStaticText[@AXValue='ReplaceItemName']`,
      applicationItem: `${mainCanvasListView}/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXStaticText[@AXValue='ReplaceItemName']`,
      dossierItem: `${mainCanvasListView}/AXRow[@AXSubrole='AXOutlineRow']/AXCell[0]/AXStaticText[@AXValue='ReplaceItemName']`,
      contextOption: `${mainCanvasListView}/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceOption']`,
    }
  },
  general: {
    toolbar: {
      refresh: `${toolbar}/AXButton[0]`,
      iconViewButton: `${toolbar}/AXGroup[1]/AXRadioGroup[0]/AXRadioButton[0]`,
      listViewButton: `${toolbar}/AXGroup[1]/AXRadioGroup[0]/AXRadioButton[1]`,
      arrangeBy: `${toolbar}/AXGroup[2]/AXMenuButton[@AXTitle='Arrange By: Type']`,
      sortBy: `${toolbar}/AXGroup[3]/AXMenuButton[@AXTitle='Sort By: Name']`,
      selectApplication: `${toolbar}/AXButton[1]`,
      searchInputBox: `${toolbar}/AXGroup[4]/AXTextField[@AXSubrole='AXSearchField']`,
      quickSearchDropdown: `${stdWindow}/AXToolbar[0]/AXGroup[4]/AXTextField[0]/AXPopover[0]`,
      clearSearchInput: `${toolbar}/AXGroup[4]/AXTextField[@AXSubrole='AXSearchField']/AXButton[1]`
    },
    smartTab: {
      tab: `${smartTabGroup}/AXStaticText[@AXValue='ReplaceMe']`,
      createNewItem: `${smartTabGroup}/AXButton[@AXHelp='ReplaceMe']`,
      // The "+" button for creating a new Document. Currently the only way to locate this button is to use the index. Developer from Mac Workstation team says adding other locator helpers needs some code structure refact and may happen in the future.
      newDocument: `${stdWindow}/AXSplitGroup[0]/AXGroup[0]/AXScrollArea[0]/AXOutline[0]/AXRow[4]/AXCell[0]/AXButton[0]`,
    },
    pluginTab: {
      tab: `/AXApplication[@AXTitle='MicroStrategy Workstation']/AXWindow[@AXSubrole='AXStandardWindow']/AXScrollArea[0]/AXTable[0]/AXRow[@AXSubrole='AXTableRow']/AXCell[0]/AXStaticText[@AXValue='ReplaceMe']`,
    },
    folderTab: {
      envFolder: `${smartTabGroup}/AXStaticText[@AXValue='ReplaceMe']`,
      myMac: `${smartTabGroup}/AXStaticText[@AXValue='Files on My Mac']`
    },
    window: {
      close: `${stdWindow}/AXButton[@AXSubrole='AXCloseButton']`,
      minimize: `${stdWindow}/AXButton[@AXSubrole='AXMinimizeButton']`,
      fullscreen: `${stdWindow}/AXButton[@AXSubrole='AXFullScreenButton']`,
      restore: `${stdWindow}/AXButton[@AXSubrole='AXZoomButton']`
    },
    editor: {
      container: `${application}/AXWindow[@AXTitle='ReplaceEditorTitle']`
    },
    dialog: {
      button: `${dialog}/AXButton[@AXTitle='ReplaceBtnName']`,
      checkBox: `${dialog}/AXCheckBox[@AXTitle='ReplaceCheckboxTitle']`,
      radioButton: `${dialog}/AXRadioButton[@AXTitle='ReplaceRadioBtnTitle']`,
    },
    popup: {
      popupInMain: popup,
      popupInEditor: popupInEditor,
      text: `${popup}/AXStaticText[@AXValue='ReplaceText']`,
      details: `${popup}/AXDisclosureTriangle[0]`,
      button: `${popup}/AXButton[AXTitle='ReplaceBtnName']`,
      certify: `${popup}/AXStaticText[AXValue='Certified ReplaceObjType']`,
    },
    mainCanvas: {
      env: {
        connectDialog: dialog,
        inputEnvName: `${dialog}/AXTextField[0]`,
        inputEnvUrl: `${dialog}/AXTextField[1]`,
        loginMode: `${dialog}/AXRadioButton[@AXTitle='ReplaceLoginMode']`,
        userName: `${dialog}/AXTextField[0]`,
        userPwd: `${dialog}/AXTextField[1]`,
        rememberMe: `${dialog}/AXCheckBox[@AXTitle='Remember Me']`,
        connect: `${dialog}/AXButton[@AXTitle='Connect']`,
        continueToConnect: `${dialog}/AXButton[@AXTitle='Continue']`,
        projectList: `${dialog}`,
        selectProject: `${dialog}/AXScrollArea[0]/AXTable[0]/AXRow[@AXSubrole='AXTableRow']/AXCell[0]/AXCheckBox[@AXTitle='ReplaceProjectName']`,
        rememberSelectedApplications: `${dialog}/AXCheckBox[@AXTitle='Remember Selected Applications']`,
        OKToConnect: `${dialog}/AXButton[@AXTitle='OK']`,
      },
      searchResultPage: `${stdWindow}/AXSplitGroup[0]/AXStaticText[@AXValue='Searching']`,
      searchingFolder: `${stdWindow}/AXSplitGroup[0]/AXCheckBox[@AXTitle='ReplaceMe']`,
    },
    menuBar: {
      menuItem: `${menuBar}/AXMenuBarItem[@AXTitle='ReplaceMenuItemName']`,
      menuOption: `${menuBar}/AXMenuBarItem[@AXTitle='ReplaceMenuItemName']/AXMenu[0]/AXMenuItem[@AXTitle='ReplaceOption']`
    },
    footer: {
      pathtext: `${stdWindow}/AXSplitGroup[0]/AXList[0]/AXStaticText[@AXValue='ReplaceMe']`,
      navigationMode: `${stdWindow}/AXSplitGroup[0]/AXRadioGroup[0]/AXRadioButton[ReplaceModeIndex]`
    },
    selectApplication: {
      application:`${stdWindow}/AXScrollArea[0]/AXTable[0]/AXRow[@AXSubrole='AXTableRow']/AXCell[0]/AXStaticText[@AXValue='ReplaceMe']`,
      selectButton:`${stdWindow}/AXButton[@AXTitle='ReplaceMe']`,
    },
    settings: {
      button: `${stdWindow}/AXButton[@AXTitle='ReplaceMe']`,
      confirmErrorMessageButton: `${application}/AXWindow[@AXSubrole='AXStandardWindow']/AXSheet/AXButton[@AXTitle='OK']`
    }
  }
}

module.exports = macXPath
