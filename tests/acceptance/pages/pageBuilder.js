// native page objects
import Dialogs from './nativePages/Dialogs.js'
import Editor from './nativePages/Editor.js'
import MainWindow from './nativePages/MainWindow'
import ApplicationInfo from './nativePages/ApplicationInfo'
import ContentGroupInfoDialog from './nativePages/ContentGroupInfo'
import AppWindow from './nativePages/AppWindow'
import EnvWindow from './nativePages/EnvWindow'

// web page objects

function PageBuilder() {
  const dialogs = new Dialogs()
  const editor = new Editor()
  const mainWindow = new MainWindow()
  const appInfo = new ApplicationInfo()
  const contentGroupInfo = new ContentGroupInfoDialog()
  const appWindow = new AppWindow()
  const envWindow = new EnvWindow()

  return {
    dialogs,
    editor,
    mainWindow,
    appInfo,
    contentGroupInfo,
    appWindow,
    envWindow
  }
}

module.exports = PageBuilder
