import BasePage from "../../basePages/BasePage";

export default class EnvConnectionsPage extends BasePage {
  getAddEnvIcnByName(envName) {
    return this.element(by.xpath(`//div[@class='available-env-name' and @title='${envName}']/parent::div//div[@class='add-available-env-icn']`))
  }

  getEditableLinkedEnvNameCellByName(envName) {
    return this.element(by.xpath(`//div[contains(@class, 'connected-env-name')]//div[contains(@class, 'editable-label-value') and text()='${envName}']`))
  }

  getEditingLinkedEnvNameCellByName(envName) {
    return this.element(by.xpath(`//div[contains(@class, 'connected-env-name')]//input[@class='ant-input' and @value='${envName}']`))
  }

  getLinkedEnvApplicationSelectorByName(envName) {
    return this.element(by.xpath(`//div[contains(@class, 'editable-label-value') and text()='${envName}']/parent::div/parent::div/parent::div/parent::td/parent::tr//div[@class='ant-select-selector']`))
  }

  getLinkedEnvApplicationListItemByName(appName) {
    return this.element(by.xpath(`//div[contains(@class, 'ant-select-dropdown')]//div[@class='application-list-obj-text' and text()='${appName}']/parent::div/parent::div/parent::div`))
  }

  async addEnvByName(envName) {
    const addEnvIcn = await this.getAddEnvIcnByName(envName)
    await this.click({
      elem: addEnvIcn
    })
  }

  async doubleClickNameCell(envName) {
    const nameCell = await this.getEditableLinkedEnvNameCellByName(envName)
    await this.doubleClick({
      elem: nameCell
    })
  }

  async renameLinkedEnv(envName, newEnvName) {
    const nameCell = await this.getEditingLinkedEnvNameCellByName(envName)
    await nameCell.clear()
    await this.input(newEnvName)
    await this.enterClick()
  }

  async hoverLinkedEnv(envName) {
    const nameCell = await this.getEditableLinkedEnvNameCellByName(envName)
    await this.hover({
      elem: nameCell
    })
  }

  async openLinkedEnvApplicationSelectorDropdown(envName) {
    const appSelector = await this.getLinkedEnvApplicationSelectorByName(envName)
    await this.click({
      elem: appSelector
    })
  }

  async selectLinkedEnvApplicationSelectorDropdownListItem(appName) {
    const appListItem = await this.getLinkedEnvApplicationListItemByName(appName)
    await this.click({
      elem: appListItem
    })
  }
}
