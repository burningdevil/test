import EnvConnection from './EnvConnection';
import Editor from './Editor.js';
import MainWindow from './MainWindow';
import Toolbar from './Toolbar';
import SmartTab from './SmartTab';
import MenuBar from './MenuBar';
import HyperCard from './HyperCard';
import SearchPage from './SearchPage';


function WindowBuilder() {
  const envConnection = new EnvConnection();
  const editor = new Editor();
  const mainWindow = new MainWindow();
  const toolbar = new Toolbar();
  const smartTab = new SmartTab();
  const menuBar = new MenuBar();
  const hyperCard = new HyperCard();
  const searchPage = new SearchPage();

  mainWindow.toolbar = toolbar;
  mainWindow.smartTab = smartTab;
  mainWindow.menuBar = menuBar;
  editor.menuBar = menuBar;
  hyperCard.menuBar = menuBar;
  searchPage.menuBar = menuBar;

  return {
    envConnection,
    editor,
    mainWindow,
    toolbar,
    smartTab,
    menuBar,
    searchPage,
    hyperCard
  }
}

module.exports = WindowBuilder;
