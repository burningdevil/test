import RootApp from './RootApp';
const searchPage = MAC_XPATH_GENERAL['searchPage'];

export default class SearchPage extends RootApp {

    getSearchPage() {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: '', value: '' },
                ]
            },
            mac: { xpath: searchPage.searchingText }
        });
    }

    getItemName({ itemName, itemType }) {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: '', value: '' },
                ]
            },
            mac: { xpath: MAC_XPATH_VIEWMODE['searchPage'].resultItem.replace(/ReplaceMe/g, itemName) }
        });
    }

    getItemContextMenuOption(optiontype) {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: '', value: '' },
                ]
            },
            mac: { xpath: MAC_XPATH_VIEWMODE['searchPage'].contextMenuOption.replace(/ReplaceMe/g, optiontype) }
        });
    }

    getSearchFolder(folderName) {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: '', value: '' },
                ]
            },
            mac: { xpath: searchPage.searchingFolder.replace(/ReplaceMe/g, folderName) }
        });
    }

    async selectSearchFolder(folderName) {
        let item = await this.getSearchFolder(folderName);
        await this.moveToAndClick(item);
        return this.app.sleep(500);
    }

    async selectContextMenu({ optiontype, itemName, itemType }) {
        let item = await this.getItemName({ itemName, itemType });
        await this.moveToAndClick(item);
        await this.rightClick();
        await this.moveToAndClick(await this.getItemContextMenuOption(optiontype));
        return this.app.sleep(500);
    }

    async isSearchPageDisplayed() {
        try {
            let elem = await this.getSearchPage(searchPage.searchingText);
            return elem.isDisplayed();
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async doubleClickOnItem({ itemName, itemType }) {

        let item = await this.getItemName({ itemName, itemType });

        //wait for the itemname to be shown
        await this.app.waitForElementByXPath(MAC_XPATH_VIEWMODE['searchPage'].resultItem.replace(/ReplaceMe/g, itemName));
    
        await this.app.moveToAndDoubleClick(item);
        return this.app.sleep(2000);
    }

    // async isObjectDisplayed(itemName) {
    //     try {
    //         let elem = await this.getItemName(itemName);
    //         return elem.isDisplayed();
    //     } catch (err) {
    //         console.log(err);
    //         return false;
    //     }
    // }

    getNoSearchText() {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: '', value: '' },
                ]
            },
            mac: { xpath: searchPage.noText }
        });
    }

    async searchNoText(){
        let text;
        text = await this.app.getText(getNoSearchText());
        return text === 'None of the objects in this folder matched your search.'
    }

}