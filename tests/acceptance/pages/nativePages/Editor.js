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
  async getEditorContainer(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
        ]
      },
      mac: { xpath: editor.container.replace(/ReplaceEditorTitle/g, itemName) }
    });
  }


  // actions


  // assertions
  async isEditorDisplayed(itemName) {
    try {
      let elem = await this.getEditorContainer(itemName);
      return elem.isDisplayed();
    } catch (err) {
      console.log(err);
      return false;
    }
  }

}
