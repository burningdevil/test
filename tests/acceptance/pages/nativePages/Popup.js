import RootApp from "../basePages/RootApp";

const popup = MAC_XPATH_GENERAL['popup'];

export default class Popup extends RootApp {

  // locator

  async getPopupInMain(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
        ]
      },
      mac: { xpath: popup.popupInMain }
    });
  }

  async getPopupInEditor(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
        ]
      },
      mac: { xpath: popup.popupInEditor.replace(/ReplaceEditorTitle/g, itemName) }
    });
  }

  async getPopupSaveButton(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
          { method: 'AccessibilityId', value: 'WindowSaveButton' }
        ]
      },
      mac: { xpath: popup.button.replace(/ReplaceBtnName/g, 'Save') }
    });
  }

  async getButton(buttonName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]
      },
      mac: { xpath: popup.button.replace(/ReplaceBtnName/g, buttonName) }
    });
  }

  // actions
  async clickSave() {
    let saveButton = await this.getPopupSaveButton();
    return saveButton.click();
  }

  // assertions

  async isPopupDisplayedInMain() {
    try {
      let elem = await this.getPopupInMain();
      return elem.isDisplayed();
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async isPopupDisplayedInEditor(itemName) {
    try {
      let elem = await this.getPopupInEditor(itemName);
      return elem.isDisplayed();
    } catch (err) {
      console.log(err);
      return false;
    }
  }

}
