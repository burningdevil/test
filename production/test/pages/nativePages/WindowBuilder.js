import AddEnv from './AddEnv';
import DossierEditor from './DossierEditor.js';
import MainWindow from './MainWindow';
import Toolbar from './Toolbar'
import SmartTab from './SmartTab'

function WindowBuilder() {
  const addEnv = new AddEnv();
  const dossierEditor = new DossierEditor();
  const mainWindow = new MainWindow();
  const toolbar = new Toolbar();
  const smartTab = new SmartTab();

  return {
    addEnv,
    dossierEditor,
    mainWindow,
    toolbar,
    smartTab
  }
}

module.exports = WindowBuilder;