import RootApp from '../basePages/RootApp'

const popup = MAC_XPATH_GENERAL.popup

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
    })
  }

  async getPopupInEditor(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'ClassName', value: 'Window' },
        ]
      },
      mac: { xpath: popup.popupInEditor.replace(/ReplaceEditorTitle/g, itemName) }
    })
  }

  async getPopupSaveButton() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Save' }
        ]
      },
      mac: { xpath: popup.button.replace(/ReplaceBtnName/g, 'Save') }
    })
  }

  async getButton(buttonName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'MicroStrategy Workstation' },
          { method: 'Name', value: buttonName }
        ]
      },
      mac: { xpath: popup.button.replace(/ReplaceBtnName/g, buttonName) }
    })
  }

  async getTextField(feildText) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'ClassName', value: 'TextBox' }
        ]
      },
      mac: { xpath: popup.textField.replace(/ReplaceText/g, feildText) }
    })
  }

  async getPopupFolder(folderName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: folderName },
          { method: 'ClassName', value: 'TextBlock' },
        ]
      },
      mac: { xpath: popup.envFolder.replace(/ReplaceText/g, folderName) }
    })
  }

  // actions
  async clickSave() {
    const saveButton = await this.getPopupSaveButton()
    await saveButton.click()
    return this.sleep(2000)
  }

  async selectPopupButton(buttonName) {
    await this.nativeWaitFor({
      windows: {
        locators: [
          { method: 'Name', value: 'MicroStrategy Workstation' },
          { method: 'Name', value: 'Yes' }
        ]
      },
      mac: { xpath: popup.button.replace(/ReplaceBtnName/g, 'Yes') }
    });
    await this.moveToAndClick(await this.getButton(buttonName));
    return this.sleep(1000)
  }

  async saveObjectAs(title) {
    const elem = await this.getTextField('Untitled Filter')
    await elem.clear()
    return elem.sendKeys(title)
  }

  async expandPopupFolder(folderName) {
    return this.moveToAndDoubleClick(await this.getPopupFolder(folderName))
  }

  async selectPopupFolder(folderName) {
    return this.moveToAndClick(await this.getPopupFolder(folderName))
  }

  // assertions

  async isPopupDisplayedInMain() {
    try {
      const elem = await this.getPopupInMain()
      return elem.isDisplayed()
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async isPopupDisplayedInEditor(itemName) {
    try {
      const elem = await this.getPopupInEditor(itemName)
      return elem.isDisplayed()
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
