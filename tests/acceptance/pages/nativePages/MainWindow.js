import Window from '../basePages/Window';
import MenuBar from './MenuBar';
import Toolbar from './Toolbar';
import Footer from './Footer';
import SmartTab from './SmartTab'
import FolderTab from './FolderTab';
import MainCanvas from './MainCanvas';

export default class MainWindow extends Window {

  // constructor
  constructor() {
    super();
    this.footer = new Footer()
    this.menuBar = new MenuBar()
    this.toolbar = new Toolbar()
    this.smartTab = new SmartTab()
    this.folderTab = new FolderTab()
    this.mainCanvas = new MainCanvas()
  }

  // locator



  // actions


  // assertions



}
