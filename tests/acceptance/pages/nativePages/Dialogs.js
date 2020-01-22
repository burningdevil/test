import RootApp from '../basePages/RootApp'

const dialog = MAC_XPATH_GENERAL.dialog

export default class Dialogs extends RootApp {
  // locator

  async getDialogButton(buttonName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: buttonName }
        ]
      },
      mac: { xpath: dialog.button.replace(/ReplaceButtonName/g, buttonName) }
    })
  }

  // actions

  async clickDialogButton(buttonName) {
    const button = await this.getDialogButton(buttonName)
    return button.click()
  }

  // assertions

  // dynamic wait
  async isDialogDisplayed(itemName) {
    const elem = await this.getDialogContainer(itemName)
    return elem.isDisplayed()
  }
}
