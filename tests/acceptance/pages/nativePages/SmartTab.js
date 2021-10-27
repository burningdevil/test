import RootApp from '../basePages/RootApp'
const smartTab = MAC_XPATH_GENERAL.smartTab

export default class SmartTab extends RootApp {
  // Locators
  async getTab(tabName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'Name', value: tabName },
        ]
      },
      mac: { xpath: smartTab.tab.replace(/ReplaceMe/g, tabName) }
    })
  }

  async getSmartTab() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'AccessibilityId', value: 'SmartFoldersControl' },
          { method: 'AccessibilityId', value: 'BrowseObjectListBox' }
        ]
      },
      mac: { xpath: smartTab.smartTabContainer, }
    })
  }

  async getCreateNewItem(itemName) {
    let macBtnHelpStr

    if (OSType === 'mac') {
      switch (itemName) {
          case 'Application':
            macBtnHelpStr = 'Create New Application'
            break
          case 'Dossier':
            macBtnHelpStr = 'Create a new dossier'
            break
          case 'Dataset':
            macBtnHelpStr = 'Create a new dataset'
            break
          case 'Document':
            return this.getNativeElement({
              windows: { locators: [] },
              mac: { xpath: smartTab.newDocument }
            })
          default:
            throw Error('Error! Please check the MAC AXPath')
      }
    }

    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'Name', value: `${itemName}s` },
          { method: 'ClassName', value: 'Button' },
        ]
      },
      mac: { xpath: smartTab.createNewItem.replace(/ReplaceMe/g, macBtnHelpStr) }
    })
  }

  // ** Actions ** //
  async selectTab(tabName) {
    return this.moveToAndClick(await this.getTab(tabName))
  }

  async scrollOnSmartTab(direction){
    if (OSType === 'windows') await this.scrollUpOrDown(await this.getSmartTab(),direction)
    return this.app.sleep(200)
  }

  async createNewItem(itemName) {
    await this.moveToAndClick(await this.getCreateNewItem(itemName))
    return this.app.sleep(2000)
  }

  async cacheAllTabs() {
    // first-time cache generation for mac (if needed)
    if (OSType === 'mac') {
      await this.selectTab('My Library')
      await this.app.sleep(4000)
      await this.selectTab('Dossiers')
      await this.app.sleep(4000)
      await this.selectTab('Documents')
      await this.app.sleep(4000)
      await this.selectTab('Cards')
      await this.app.sleep(4000)
      await this.selectTab('Reports')
      await this.app.sleep(4000)
      await this.selectTab('Datasets')
      return this.app.sleep(4000)
    }
  }

  // This is to dynamically wait for the items to be displayed
  // This is a must for Mac as Mac needs to generate cache for now
  async selectTabAndWait(tabName) {
    await this.selectTab(tabName)
    return this.nativeWaitFor({
      windows:{
        locators: [
          { method: 'Name', value: 'AQDT' },
          { method: 'ClassName', value: 'ListBoxItem' }
        ]
      },
      mac: { xpath: MAC_XPATH.iconView.separaterTitle.replace('replaceMe', browser.params.envInfo[0].envName) }
    })
  }
}
