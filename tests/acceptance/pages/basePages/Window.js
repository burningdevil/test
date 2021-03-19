import RootApp from './RootApp'
const window = MAC_XPATH_GENERAL.window

export default class Window extends RootApp {
  // locator
  async getCloseButton(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
          { method: 'AccessibilityId', value: 'WindowCloseButton' }
        ]
      },
      mac: { xpath: window.close }
    })
  }

  async getMinimizeButton(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
          { method: 'AccessibilityId', value: 'WindowCloseButton' }
        ]
      },
      mac: { xpath: window.minimize }
    })
  }

  async getFullScreenButton(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'AccessibilityId', value: 'WindowRestoreButton' }
        ]
      },
      mac: { xpath: window.fullscreen }
    })
  }

  async getRestoreButton(itemName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: itemName },
          { method: 'AccessibilityId', value: 'Restore Down' }
        ]
      },
      mac: { xpath: window.restore }
    })
  }

  async getConfirmCloseButton() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'MicroStrategy Workstation' },
          { method: 'ClassName', value: 'ListBox' },
          { method: 'Name', value: 'Yes' }
        ]
      },
      mac: { xpath: window.confirmCloseButton }
    })
  }

  // actions
  async closeWindow(itemName) {
    const closeButton = await this.getCloseButton(itemName)
    return closeButton.click()
  }

  async minimizeWindow(itemName) {
    const minimizeButton = await this.getMinimizeButton(itemName)
    return minimizeButton.click()
  }

  async maximizeWindow(itemName) {
    const fullscreenButton = await this.getFullScreenButton(itemName)
    return fullscreenButton.click()
  }

  async restoreWindow(itemName) {
    const restoreButton = await this.getRestoreButton(itemName)
    return restoreButton.click()
  }

  async confirmCloseWindow() {
    const confirmCloseButton = await this.getConfirmCloseButton()
    return confirmCloseButton.click()
  }

  // assertions
}
