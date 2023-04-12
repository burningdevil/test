import BasePage from "../../basePages/BasePage";
import { imageCompareConfig, wsNativeWindows } from "../../../config/constants";
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../../../utils/wsUtils/windowHelper')
const { join } = require('path');

export default class ContentsPage extends BasePage {
    getDefaultGroupInput() {
        return this.element(by.xpath(`//div[@id='rc-tabs-0-panel-contentBundles']//span[@id='contentBundleListMsgInfoID']//ancestor::div[@class='content-bundle-list-container-title']//input`));
    }
    getAddContentBtn() {
        return this.element(by.xpath(`//span[@class='content-bundle-list-container-add-text']`))
    }
    getGridCellInDossierListView(gridCellValue) {
        return this.element(by.xpath(`//span[text()='${gridCellValue}']`));
    }
    getSelectButton() {
        return this.element(by.xpath(`//div[@class='content-bundle-picker-btn']//button[@class='ant-btn ant-btn-primary']`));
    }
    getTipIcon() {
        return this.element(by.xpath(`//span[@id='contentBundleListMsgInfoID']`));
    }
    getSelectAll() {
        return this.element(by.xpath(`//div[@class='content-bundle-picker-grid']//div[@class='customHeaderSelectAll']//input`))
    }
    getCollapseIcon(name) {
        return this.element(by.xpath(`//span[@class='content-bundle-list-custom-name' and text()='${name}']//ancestor::div[@class='ag-cell-wrapper']//span[@class='ag-icon ag-icon-small-right']`))
    }
    getContentGroupGrid() {
        return this.$('.ag-center-cols-viewport')
    }

    getAllContentSettings() {
        return this.$('.mstr-select-container.mstr-select-container__enabled')
    }

    getAllContentSettingOptionsByName(name) {
        if (name === 'allow') {
            return this.element(by.xpath(`//div[@class='ant-select-item-option-content' and text()='Allow users to view and create new content']`))
        } else {
            return this.element(by.xpath(`//div[@class='ant-select-item-option-content' and text()='Limit Library content in this application to above Content Groups']`))
        }
    }

    getContentMenuInCustomAppListView(menuItem) {
        return this.element(by.xpath(`//span[@class='ag-menu-option-part ag-menu-option-text' and text()='${menuItem}']`))
    }

    getContextMenuInContentGroupGrid() {
       return this.element(by.xpath(`//div[contains(@class,'ag-menu ')]`))
    }

    async inputName(name) {
        await this.getDefaultGroupInput().click();
        await this.getDefaultGroupInput().clear();
        await this.input(name)
    }
    async addContent() {
        await this.getAddContentBtn().click();
    }
    async pickDossier(name) {
        await this.findSpecifiedDossier(name);
    }
    async findSpecifiedDossier(name) {
        await browser.sleep(5000 * this.ratio)
        await this.wait(this.EC.visibilityOf(this.getGridCellInDossierListView(name)), 60000 * this.ratio, 'The target dossier was not displayed in the add content page')
        await this.getGridCellInDossierListView(name).click()
        await browser.sleep(6000 * this.ratio)
        await this.getSelectButton().click()
        await browser.sleep(8000 * this.ratio)
    }
    async hoverTip() {
        await this.getTipIcon().click();
        await browser.sleep(2000 * this.ratio);
    }
    async selectAll() {
        await this.getSelectAll().click();
        await browser.sleep(2000 * this.ratio);
    }
    async collapseContent(name) {
        await this.getCollapseIcon(name).click();
        await this.wait(this.EC.stalenessOf(this.element(by.xpath(`//*[text()='Loading']`))), 60000 * this.ratio, 'Waiting for loading icon disappear timeout.')
        await browser.sleep(1000 * this.ratio);
    }
    async waitForContentMenu(text) {
        await this.wait(this.EC.visibilityOf(this.element(by.xpath(`//span[@class='ag-menu-option-part ag-menu-option-text' and text()='${text}']`))), 60000 * this.ratio, 'Waiting for delete button in context menu int timeout.')
    }

    async chooseOptionInContentGroupGrid(groupName, option) {
        const contentItem = await this.getGridCellInDossierListView(groupName)
        await this.rightClick({ elem: contentItem })
        await this.waitForContentMenu(option)
        await this.getContentMenuInCustomAppListView(option).click()
    }

    async removeContent(name) {
        await this.chooseOptionInContentGroupGrid(name, 'Remove')
        await browser.sleep(1000 * this.ratio);
    }

    async editContentGroup(groupName) {
        await this.chooseOptionInContentGroupGrid(groupName, 'Edit')
        await browser.sleep(1000 * this.ratio)
        await registerNewWindow(wsNativeWindows.contentGroupEditor)
        await switchToWindow(wsNativeWindows.contentGroupEditor)
        await this.switchToContentGroupEditorDialog()
    }

    async openPropertiesDialog(groupName) {
        await this.chooseOptionInContentGroupGrid(groupName, 'Properties')
        await browser.sleep(1000 * this.ratio)
        await registerNewWindow(wsNativeWindows.contentGroupInfo)
        await switchToWindow(wsNativeWindows.contentGroupInfo)
    }


    async finishedSelectContentGroupByClickSelect() {
        await this.getSelectButton().click()
        await browser.sleep(8000 * this.ratio)
    }

    async clickAllContentSettings() {
        await this.waitForWebElementToBeVisiable(this.getAllContentSettings())
        await this.getAllContentSettings().click()
    }

    async setAllContentSettings(option) {
        await this.getAllContentSettingOptionsByName(option).click()
        await browser.sleep(1000 * this.ratio)
    }

    async selectContentGroupsByNames(contentGroupNames) {
        const names = contentGroupNames.split(',');
        for (const name of names) {
            const contentItem = await this.getGridCellInDossierListView(name)
            await contentItem.click()
            await browser.sleep(1000 * this.ratio)
        }
    }

    async takeScreenshotOnElement(webElement, screenshot) {
        await browser.sleep(3000 * this.ratio)
        const fileName = join(process.platform === 'win32' ? 'win' : 'mac', screenshot)
        await browser.actions().mouseMove({ x: 0, y: 10000 }).perform()
        let elementLocator
        switch (webElement) {
            case imageCompareConfig.contextMenuInContentTab:
                elementLocator = this.getContextMenuInContentGroupGrid()
                await this.waitForWebElementToBeVisiable(elementLocator)
                expect(await browser.imageComparison.checkElement(elementLocator, fileName)).to.below(customArgObj.args.imageCompare ? imageCompareConfig.tolerance : imageCompareConfig.toleranceMax);
        }
    }

}