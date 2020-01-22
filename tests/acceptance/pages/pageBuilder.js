// native page objects
import Dialogs from './nativePages/Dialogs.js'
import Editor from './nativePages/Editor.js'
import MainWindow from './nativePages/MainWindow'

// web page objects

function PageBuilder() {
  const dialogs = new Dialogs()
  const editor = new Editor()

  const mainWindow = new MainWindow()

  return {
    dialogs,
    editor,
    mainWindow
  }
}

module.exports = PageBuilder
