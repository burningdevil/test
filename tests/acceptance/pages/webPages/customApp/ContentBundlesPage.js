import BasePage from "../../basePages/BasePage";

export default class ContentsPage extends BasePage{
    getDefaultGroupInput() {
        return this.element(by.xpath(`//div[@id='rc-tabs-0-panel-contentBundles']//span[@id='contentBundleListMsgInfoID']//ancestor::div[@class='content-bundle-list-container-title']//input`));
    }
    getAddContentBtn(){
        return this.element(by.xpath(`//span[@class='content-bundle-list-container-add-text']`))
    }
    getGridCellInDossierListView(gridCellValue) {
        return this.element(by.xpath(`//span[text()='${gridCellValue}']`))
      }
    getSelectButton() {
    return this.element(by.xpath(`//div[@class='content-bundle-picker-btn']//button[@class='ant-btn ant-btn-primary']`))
    }
    async inputName(name) {
        await this.getDefaultGroupInput().click()
        await this.getDefaultGroupInput().clear()
        await this.input(name)
      }
    async addContent() {
        await this.getAddContentBtn().click()
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
}