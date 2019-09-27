import RootApp from "../basePages/RootApp";

const dialog = MAC_XPATH_GENERAL['dialog'];

export default class Editor extends RootApp {

  // locator
  async getDialogContainer(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
        ]
      },
      mac: { xpath: dialog.container.replace(/ReplaceDialogTitle/g, itemName) }
    });
  }

  async getDialogSaveButton(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
          { method: 'AccessibilityId', value: 'WindowSaveButton' }
        ]
      },
      mac: { xpath: dialog.button.replace(/ReplaceMe/g, itemName).replace(/ReplaceButtonName/g, 'Save') }
    });
  }

  // actions
  async clickSave(itemName) {
    let saveButton = await this.getDialogSaveButton(itemName);
    return saveButton.click();
  }

  // assertions

  async isDialogDisplayed(itemName) {
    try {
      let elem = await this.getDialogContainer(itemName);
      return elem.isDisplayed();
    } catch (err) {
      console.log(err);
      return false;
    }
  }

}
