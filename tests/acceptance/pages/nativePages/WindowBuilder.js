import EnvConnection from './EnvConnection';
import DossierEditor from './DossierEditor.js';
import MainWindow from './MainWindow';
import Toolbar from './Toolbar'
import SmartTab from './SmartTab'

function WindowBuilder() {
  const envConnection = new EnvConnection();
  const dossierEditor = new DossierEditor();
  const mainWindow = new MainWindow();
  const toolbar = new Toolbar();
  const smartTab = new SmartTab();

  return {
    envConnection,
    dossierEditor,
    mainWindow,
    toolbar,
    smartTab
  }
}

module.exports = WindowBuilder;