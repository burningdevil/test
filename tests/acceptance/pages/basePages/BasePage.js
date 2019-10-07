/**
 * Class representing the base of all other web page objects
 */
export default class BasePage {
    constructor(browserInstance) {
        this.brwsr = browserInstance || browser;
        this.$ = this.brwsr.$;
        this.$$ = this.brwsr.$$;
        this.element = this.brwsr.element;
        this.EC = this.brwsr.ExpectedConditions;
    }

    // Browser Utils
    async executeScript(...args) {
        return this.brwsr.executeScript(...args);
    }

    async sleep(duration) {
        return this.brwsr.sleep(duration);
    }

    async wait(...condition) {
        return this.brwsr.wait(...condition);
    }

    // for WebView management
    async switchToNewWebView() {
        let handles = await browser.getAllWindowHandles();
        await browser.switchTo().window(handles[handles.length -1]);
        console.log('Switch to new WebView: ', await browser.getTitle());
    }

    async switchToDefaultWebView() {
        let handles = await browser.getAllWindowHandles();
        await browser.switchTo().window(handles[0]);
        console.log('Switch back to the default webview: ', await browser.getTitle());
    }

    // Keyboard inputs
    async click({ elem, offset = { x: 0, y: 0 } }) {
        await this.brwsr.actions().mouseMove(elem).perform();
        await this.brwsr.actions().mouseMove(offset).perform();
        return this.brwsr.actions().click().perform();
    }

    async doubleClick({ elem, offset = { x: 0, y: 0 } }) {
        await this.brwsr.actions().mouseMove(elem).perform();
        await this.brwsr.actions().mouseMove(offset).perform();
        return this.brwsr.actions().doubleClick().perform();
    }

    async input(keyword) {
        return this.brwsr.actions().sendKeys(keyword).perform();
    }
}
