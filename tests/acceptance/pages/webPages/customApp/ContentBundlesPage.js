import BasePage from "../../basePages/BasePage";

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
    getContentMenuInCustomAppListView(menuItem) {
        return this.element(by.xpath(`//span[@class='ag-menu-option-part ag-menu-option-text' and text()='${menuItem}']`))
    }
    async removeContent(name) {
        const contentItem = await this.getGridCellInDossierListView(name)
        await this.rightClick({ elem: contentItem })
        await this.waitForContentMenu('Remove')
        await this.getContentMenuInCustomAppListView('Remove').click()
        await browser.sleep(1000 * this.ratio);
    }
    async finishedSelectContentGroupByClickSelect() {
        await this.getSelectButton().click()
        await browser.sleep(8000 * this.ratio)
    }
}