import RootApp from '../basePages/RootApp'
const folderTab = MAC_XPATH_GENERAL.folderTab

export default class FolderTab extends RootApp {
  // Locators
  async getFolder(folderName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Folder Mode' },
          { method: 'Name', value: folderName },
        ]
      },
      mac: { xpath: folderTab.envFolder.replace(/ReplaceMe/g, folderName) }
    })
  }

  async getLocalFolder(folderName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'Name', value: folderName },
        ]
      },
      mac: { xpath: folderTab.myMac }
    })
  }

  async getFolderExpansionIcon() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'Name', value: '' },
        ]
      },
      mac: { xpath: folderTab.expansionIcon }
    })
  }

  // Action
  async selectFolder(folderName) {
    return this.moveToAndClick(await this.getFolder(folderName))
  }

  async selectLocalDiskFolder() {
    return this.moveToAndClick(await this.getLocalFolder())
  }

  async expandFolder(folderName) {
    return this.moveToAndDoubleClick(await this.getFolder(folderName))
  }
}
