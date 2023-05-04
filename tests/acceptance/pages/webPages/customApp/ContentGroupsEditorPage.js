import BasePage from "../../basePages/BasePage";
import { imageCompareConfig, wsNativeWindows } from "../../../config/constants";
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../../../utils/wsUtils/windowHelper')

export default class ContentGroupEdtior extends BasePage {
    // Locators

    getTabByName(name) {
        return element(by.cssContainingText('.mstrd-ContentBundleEditor .ant-tabs-tab', new RegExp(`^${name}$`)))
    }

    getGroupEditor() {
        return this.$('.mstrd-ContentBundleEditor')
    }

    getNameInput() {
        return this.$('.mstrd-ContentBundleGeneral-content .ant-input')
    }

    getButtonByName(name) {
        return this.element(by.xpath(`//div[@class='mstr-button-container']//span[text()='${name}']`))
    }

    getSaveButtonInContentPicker() {
        return this.$('.mstrd-ContentPicker-saveBtn')
    }

    getSaveButtonInUserPicker() {
        return this.$('.mstrd-UserGroupPicker-saveBtn')
    }

    getContentPickerWindow() {
        return this.$('.mstrd-ContentPicker')
    }

    getRecipientsPickerWindow() {
        return this.$('.mstrd-UserGroupPicker')
    }

    getAddRecipientButton() {
        return this.$('.mstrd-ContentBundleRecipients-top .iconAdd')
    }

    getRecipientSearchbox() {
        return this.$('.mstrd-UserGroupPicker .mstr-input')
    }

    getAddContentButton() {
        return this.$('.iconAdd')
    }

    getContentMenuByName(name) {
        return this.element(by.cssContainingText('.mstrd-ContentPicker-menu .mstrd-ContentPicker-tab', name))
    }

    getContentSearchbox() {
        return this.$('.mstrd-ContentPicker .mstr-input')
    }

    getLoadingContentIndicator() {
        return this.element(by.xpath(`(//*[text()='Loading'])[0]`))
    }

    getSearchResultItem(name) {
        return this.element(by.xpath(`//div[@class='mstrd-ContentPicker-aggrid-search']//span[text()='${name}']`))
    }

    getSearchUserResultItem(name) {
        return this.element(by.xpath(`//div[@class='mstrd-UserGroupPicker']//span[contains(text(),'${name}')]`))
    }

    getCheckboxInContentPickerByName(name) {
        return this.element(by.xpath(`//div[@class='mstrd-ContentPicker-aggrid-search']//span[text()='${name}']//ancestor::div[@class='ag-center-cols-container']//input`))
    }

    getCheckboxInUserPickerByName(name) {
        return this.element(by.xpath(`//div[@class='mstrd-UserGroupPicker']//span[contains(text(),'${name}')]//ancestor::div[@role='row']//input`))
    }

    getContentItem(name) {
        return this.element(by.xpath(`//span[text()='${name}']`))
    }

    getContentCount() {
        return this.$$('.ag-center-cols-container .ag-row')
    }

    // Action helper
    async switchTabByName(tabName) {
        await this.waitForWebElementToBeVisiable(this.getGroupEditor())
        await this.click({ elem: this.getTabByName(tabName) })

    }

    async inputBundleName(name) {
        await this.waitForWebElementToBeVisiable(this.getGroupEditor())
        await this.waitForWebElementToBeVisiable(this.getNameInput())
        if (name === 'Empty') {
            await this.getNameInput().clear()
            await this.getNameInput().sendKeys(protractor.Key.SPACE)
            await this.getNameInput().sendKeys(protractor.Key.BACK_SPACE)

        } else {
            await this.getNameInput().clear().sendKeys(name)
        }
        await this.getNameInput().sendKeys(protractor.Key.ENTER)
    }

    async clickAddContentButtonInContentGroupEditor() {
        await this.click({ elem: this.getAddContentButton() })
        await this.waitForWebElementToBeVisiable(this.getContentPickerWindow())
    }

    async addContentInContentGroupEditor(tabName, objectName) {
        await this.clickAddContentButtonInContentGroupEditor()
        await this.chooseTabInContentDialog(tabName)
        await this.searchContentByNameAndAdd(objectName)
        await this.waitForWebElementToBeVisiable(this.getSaveButtonInContentPicker())
        await this.getSaveButtonInContentPicker().click()
        await this.waitForWebElementToDisappear(this.getSaveButtonInContentPicker())
        await this.waitForWebElementToDisappear(this.getContentPickerWindow())
    }

    async addRecipientByUserName(name) {
        await this.clickAddRecipientButtonInContentGroupEditor()
        await this.searchUserAndAdd(name)
        await this.getSaveButtonInUserPicker().click()
        await this.waitForWebElementToDisappear(this.getRecipientsPickerWindow())
    }

    async clickAddRecipientButtonInContentGroupEditor() {
        await this.click({ elem: this.getAddRecipientButton() })
        await this.waitForWebElementToBeVisiable(this.getRecipientsPickerWindow())
    }

    async waitForContentGridDisplay(type) {
        await this.waitForWebElementToBeVisiable(this.getContentGrid(type))
        const count = await this.getContentGridRows(type).count()
        try {
            await this.waitForWebElementToBeVisiable(this.getContentGridRow(type))
        } catch (err) {
            console.log('content grid of' + type + count)
        }
    }

    async chooseTabInContentDialog(tabName) {
        await this.waitForWebElementToBeVisiable(this.getContentMenuByName('Dossiers'))
        await browser.sleep(1000 * this.ratio);
        if (tabName === "Dossier") {
            await this.click({ elem: this.getContentMenuByName('Dossiers') })
        }
        if (tabName === 'Document') {
            await this.click({ elem: this.getContentMenuByName('Documents') })
        }
        if (tabName === 'Report') {
            await this.click({ elem: this.getContentMenuByName('Reports') })
        }
        await this.waitForWebElementToDisappear(this.getLoadingContentIndicator())
    }

    async searchContentByNameAndAdd(objectName) {
        await browser.sleep(3000 * this.ratio);
        await this.getContentSearchbox().sendKeys(objectName)
        await this.waitForWebElementToDisappear(this.getLoadingContentIndicator())
        await this.waitForWebElementToBeVisiable(this.getSearchResultItem(objectName))
        await this.getCheckboxInContentPickerByName(objectName).click()
    }

    async searchUserAndAdd(name) {
        await this.getRecipientSearchbox().sendKeys(name)
        await this.waitForWebElementToDisappear(this.getLoadingContentIndicator())
        await this.waitForWebElementToBeVisiable(this.getSearchUserResultItem(name))
        await this.getCheckboxInUserPickerByName(name).click()
    }

    async clickSaveButtonInContentGroupEditor() {
        await this.click({ elem: this.getButtonByName('Save') })
        await unregisterWindow(wsNativeWindows.contentGroupEditor)
        await switchToWindow(wsNativeWindows.newCustomAppWindow)
        await this.switchToCustomAppEditorDialog()
    }

    async clickCancelInContentGroupEditor() {
        await this.click({ elem: this.getButtonByName('Cancel') })
        await unregisterWindow(wsNativeWindows.contentGroupEditor)
        await switchToWindow(wsNativeWindows.newCustomAppWindow)
        await this.switchToCustomAppEditorDialog()
    }

    async getContentGroupNameInContentGroupEditor() {
        await this.waitForWebElementToBeVisiable(this.getNameInput())
        const value = await this.getInputValue(this.getNameInput())
        return value
    }

    async isObjectInContentGroups(name) {
        const isDisplayed = await this.getContentItem(name).isDisplayed()
        return isDisplayed
    }

    async getObjectsCount() {
        const total = await this.getContentCount().count()
        return total
    }

}