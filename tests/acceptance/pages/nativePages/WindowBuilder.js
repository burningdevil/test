import EnvConnection from './EnvConnection';
import DossierEditor from './DossierEditor.js';
import MainWindow from './MainWindow';
import Toolbar from './Toolbar';
import SmartTab from './SmartTab';
import MenuBar from './MenuBar';


function WindowBuilder() {
  const envConnection = new EnvConnection();
  const dossierEditor = new DossierEditor();
  const mainWindow = new MainWindow();
  const toolbar = new Toolbar();
  const smartTab = new SmartTab();
  const menuBar = new MenuBar();

  mainWindow.toolbar = toolbar;
  mainWindow.smartTab = smartTab;
  mainWindow.menuBar = menuBar;
  dossierEditor.menuBar = menuBar;

  return {
    envConnection,
    dossierEditor,
    mainWindow,
    toolbar,
    smartTab,
    menuBar
  }
}

module.exports = WindowBuilder;
