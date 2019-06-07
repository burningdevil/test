/**
 * Class representing the base of all other page objects
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
    // Keyboard inputs
    async click({ elem, offset = { x: 0, y: 0 } }) {
        await this.brwsr.actions().mouseMove(elem).perform();
        await this.brwsr.actions().mouseMove(offset).perform();
        return this.brwsr.actions().click().perform();
    }


    // Element locators


}
