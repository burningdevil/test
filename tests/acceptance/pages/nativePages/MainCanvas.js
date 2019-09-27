import RootApp from '../basePages/RootApp';
import EnvSection from './EnvSection'
const mainCanvas = MAC_XPATH_GENERAL['mainCanvas'];

export default class MainCanvas extends RootApp {

    // constructor
    constructor() {
        super();
        this.envSection = new EnvSection()
    }


    async getItem({ itemName, itemType } ) {
        const canvas_viewmode = MAC_XPATH[MAC_VIEWMODE]['mainCanvas']
        // process mac locator
        let macItemPath;
        if (OSType === 'mac') {
            switch (itemType) {
                case "Metrics":
                    macItemPath = canvas_viewmode.metricItem
                    break;
                case "Dossiers":
                    macItemPath = canvas_viewmode.dossierItem
                    break;
                case "Documents":
                    macItemPath = canvas_viewmode.rsdItem
                    break;
                default:
                    throw Error("Error! Please check the item type");
            }
        }

        return this.getNativeElement({
            windows: {
                locators: [
                    { method: '', value: '' },
                ]
            },
            mac: { xpath: macItemPath.replace(/ReplaceItemName/g, itemName) }
        });
    }


    async getItemContextMenuOption(optiontype) {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: '', value: '' },
                ]
            },
            mac: { xpath: MAC_XPATH[MAC_VIEWMODE]['mainCanvas'].contextOption.replace(/ReplaceOption/g, optiontype) }
        });
    }

    async getSearchResultPage() {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: '', value: '' },
                ]
            },
            mac: { xpath: mainCanvas.searchResultPage }
        });
    }

    async getSearchFolder(folderName) {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: '', value: '' },
                ]
            },
            mac: { xpath: mainCanvas.searchingFolder.replace(/ReplaceMe/g, folderName) }
        });
    }


    // actions
    async clickOnItem({itemName, itemType}) {
        let elem = await this.getItem({ itemName, itemType });
        return this.moveToAndClick(elem)
      }

    async doubleClickOnItem({ itemName, itemType }) {

        let item = await this.getItem({ itemName, itemType });

        //wait for the itemname to be shown
        await this.app.waitForElementByXPath(MAC_XPATH[MAC_VIEWMODE]['mainCanvas'].resultItem.replace(/ReplaceMe/g, itemName));

        await this.app.moveToAndDoubleClick(item);
        return this.app.sleep(2000);
    }

    async selectContextMenu({ optiontype, itemName, itemType }) {
        let item = await this.getItem({ itemName, itemType });
        await this.moveToAndClick(item);
        await this.rightClick();
        await this.moveToAndClick(await this.getItemContextMenuOption(optiontype));
        return this.app.sleep(500);
    }

    async selectSearchFolder(folderName) {
        let item = await this.getSearchFolder(folderName);
        await this.moveToAndClick(item);
        return this.app.sleep(500);
    }


    // assertions

    async isItemDisplayedInCurrentView(itemName) {
        try {
          let elem = await this.getItemInCurrentView(itemName);
          return elem.isDisplayed();
        } catch (err) {
          console.log(err);
          return false;
        }
    }


    async isSearchResultPageDisplayed() {
        try {
            let elem = await this.getSearchResultPage(mainCanvas.searchResultPage);
            return elem.isDisplayed();
        } catch (err) {
            console.log(err);
            return false;
        }
      }

}
