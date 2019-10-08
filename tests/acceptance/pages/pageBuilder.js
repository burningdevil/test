// native page objects
import Dialogs from './nativePages/Dialogs.js';
import Editor from './nativePages/Editor.js';
import HyperCard from './nativePages/HyperCard';
import MainWindow from './nativePages/MainWindow';
import RSDWindow from './nativePages/RSDWindow';
import SettingsPluginWindow from './nativePages/SettingsPluginWindow';

// web page objects
import HyperPage from './webPages/HyperPage';
import LdapConfigPage from './webPages/LdapConfigPage';
import MetricEditorPage from './webPages/MetricEditorPage';
import QuickSearchPage from './webPages/QuickSearchPage';
import RSDPage from './webPages/RSDPage';
import AllSettingsPage from './webPages/AllSettingsPage';
import GoverningSettingsPage from './webPages/GoverningSettingsPage';

function PageBuilder() {
    const dialogs = new Dialogs();
    const editor = new Editor();

    const hyperCard = new HyperCard();
    const mainWindow = new MainWindow();
    const rsdWindow = new RSDWindow();
    const settingsPluginWindow = new SettingsPluginWindow();


    const hyperPage = new HyperPage();
    const ldapPage = new LdapConfigPage();
    const metricEditorPage = new MetricEditorPage();
    const quickSearchPage = new QuickSearchPage();
    const rsdPage = new RSDPage();
    const allSettingsPage = new AllSettingsPage();
    const governingSettingsPage = new GoverningSettingsPage();

    return {
        dialogs,
        editor,
        hyperCard,
        mainWindow,
        rsdWindow,
        settingsPluginWindow,

        hyperPage,
        ldapPage,
        metricEditorPage,
        quickSearchPage,
        rsdPage,
        allSettingsPage,
        governingSettingsPage
      }
}

module.exports = PageBuilder;
