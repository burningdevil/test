import Window from '../basePages/Window';
import MenuBar from './MenuBar'
import Popup from './Popup';

const editor = MAC_XPATH_GENERAL['editor'];

export default class Editor extends Window {

  // constructor
  constructor() {
    super();
    this.menuBar = new MenuBar()
    this.popup = new Popup()
  }

  // locator


  // actions



  // assertions
  async isEditorDisplayed(itemName) {
    return this.nativeWaitFor({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
        ]
      },
      mac: { xpath: editor.container.replace(/ReplaceEditorTitle/g, itemName) }
    })
  }

}
