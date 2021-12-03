import BasePage from "../../basePages/BasePage";

export default class ComponentsPage extends BasePage{
    getSidebarCaretIcon() {
        return this.element(by.xpath(`//span[@class='home-screen-components-sidebar-caret']`));
    }
    async collapseSidebar() {
        await browser.sleep(1000 * this.ratio)
        await this.getSidebarCaretIcon().click()
      }
}