import RootApp from './RootApp';
const editor = MAC_XPATH_GENERAL['editor'];
const dialog = MAC_XPATH_GENERAL['dialog'];

export default class Editor extends RootApp {

  // locator
  async getEditorContainer(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
        ]
      },
      mac: { xpath: editor.container.replace(/ReplaceMe/g, itemName) }
    });
  }

  async getDialogContainer(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
        ]
      },
      mac: { xpath: dialog.container.replace(/ReplaceMe/g, itemName) }
    });
  }

  async getEditorCloseButton(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
          { method: 'AccessibilityId', value: 'WindowCloseButton' }
        ]
      },
      mac: { xpath: editor.close.replace(/ReplaceMe/g, itemName) }
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
      mac: { xpath: dialog.save.replace(/ReplaceMe/g, itemName) }
    });
  }

  // actions
  async closeEditor(itemName) {
    let closeButton = await this.getEditorCloseButton(itemName);
    return closeButton.click();
  }

  async clickSave(itemName) {
    let saveButton = await this.getDialogSaveButton(itemName);
    return saveButton.click();
  }

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