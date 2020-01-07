import Window from '../basePages/Window'
import MenuBar from './MenuBar'
import Popup from './Popup'

const editor = MAC_XPATH_GENERAL.editor

export default class Editor extends Window {
  // constructor
  constructor() {
    super()
    this.menuBar = new MenuBar()
    this.popup = new Popup()
  }

  // locator

  // assertions
  async isEditorDisplayed(itemName) {
    console.log(itemName)
    try {
      await this.nativeWaitFor({
        windows: {
          locators: [
            { method: 'Name', value: itemName },
          ]
        },
        mac: { xpath: editor.container.replace(/ReplaceEditorTitle/g, itemName) }
      }, 4000, 'Failed to wait for editor to be displayed')
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  async isEditorDisappeared(itemName) {
    try {
      await this.nativeWaitForDisappear({
        windows: {
          locators: [
            { method: 'Name', value: itemName },
          ]
        },
        mac: { xpath: editor.container.replace(/ReplaceEditorTitle/g, itemName) }
      }, 2000, 'Editor still displayed after 2 seconds')
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
}
