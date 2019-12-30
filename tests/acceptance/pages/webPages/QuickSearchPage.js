import BasePage from '../basePages/BasePage'

export default class QuickSearchPage extends BasePage {
  // element locator
  getQuickSearchList() {
    return this.$('.QuickSearchListView')
  }

  getQuickSearchListItems() {
    return this.getQuickSearchList().$$('.QuickSearchItem')
  }

  getQuickSearchListItemByIndex(index) {
    return this.getQuickSearchListItems().get(index)
  }

  getQuickSearchListItemByName(name) {
    return this.getQuickSearchListItems().filter(async (elm) => {
      const elmText = await elm.$('.QuickSearchItem-text-name').getText()
      return elmText === name
    }).first()
  }

  // actions
  async awaitRendering() {
    return this.wait(this.EC.presenceOf(this.getQuickSearchList()), 3000, 'Result List is not present')
  }

  async selectItemByName(name) {
    await this.getQuickSearchListItemByName(name).click()

    await editor.nativeWaitFor({
      windows:{
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]
      },
      mac: { xpath: MAC_XPATH.general.editor.container.replace(/ReplaceEditorTitle/g, name) }
    })
  }

  // assertions
  async resultCount() {
    return this.getQuickSearchListItems().count()
  }
}
