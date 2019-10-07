// native page objects
import Dialogs from './nativePages/Dialogs.js';
import Editor from './nativePages/Editor.js';
import HyperCard from './nativePages/HyperCard';
import MainWindow from './nativePages/MainWindow';

// web page objects
import HyperPage from './webPages/HyperPage';
import LdapConfigPage from './webPages/LdapConfigPage';
import MetricEditorPage from './webPages/MetricEditorPage';
import QuickSearchPage from './webPages/QuickSearchPage';


function PageBuilder() {
    const dialogs = new Dialogs();
    const editor = new Editor();

    const hyperCard = new HyperCard();
    const mainWindow = new MainWindow();


    const hyperPage = new HyperPage();
    const ldapPage = new LdapConfigPage();
    const metricEditorPage = new MetricEditorPage();
    const quickSearchPage = new QuickSearchPage();


    return {
        dialogs,
        editor,
        hyperCard,
        mainWindow,

        hyperPage,
        ldapPage,
        metricEditorPage,
        quickSearchPage
      }
}

module.exports = PageBuilder;
