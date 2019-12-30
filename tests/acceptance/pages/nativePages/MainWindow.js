import Window from '../basePages/Window'
import MenuBar from './MenuBar'
import Toolbar from './Toolbar'
import Footer from './Footer'
import SmartTab from './SmartTab'
import FolderTab from './FolderTab'
import MainCanvas from './MainCanvas'
import Popup from './Popup'
import Dialogs from './Dialogs'

export default class MainWindow extends Window {
  // constructor
  constructor() {
    super()
    this.footer = new Footer()
    this.menuBar = new MenuBar()
    this.toolbar = new Toolbar()
    this.smartTab = new SmartTab()
    this.folderTab = new FolderTab()
    this.mainCanvas = new MainCanvas()
    this.popup = new Popup()
    this.dialogs = new Dialogs()
  }

  // locator

  // actions

  // assertions
}
