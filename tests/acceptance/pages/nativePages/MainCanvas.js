import RootApp from '../basePages/RootApp';
import EnvSection from './EnvSection'
const mainCanvas = MAC_XPATH_GENERAL['mainCanvas'];
const selectApplication = MAC_XPATH_GENERAL['selectApplication'];

export default class MainCanvas extends RootApp {

    // constructor
    constructor() {
        super();
        this.envSection = new EnvSection()
    }


    async getItem({ itemName, itemType } ) {
        const canvas_viewmode = MAC_XPATH[MAC_VIEWMODE]['mainCanvas']
        // process mac locator
        let macItemPath = "";
        if (OSType === 'mac') {
            switch (itemType) {
                case "Metrics":
                    macItemPath = canvas_viewmode.metricItem
                    break;
                case "Dossiers":
                    macItemPath = canvas_viewmode.dossierItem
                    break;
                case "Documents":
                    macItemPath = canvas_viewmode.documentItem
                    break;
                case "Environments":
                    macItemPath = canvas_viewmode.envItem
                    break;
                default:
                    throw Error("Error! Please check the item type");
            }
        }

        return this.getNativeElement({
            windows: {
                locators: [
                    { method: 'ClassName', value: 'ListView' },
                    { method: 'Name', value: itemName },
                ]
            },
            mac: { xpath: macItemPath.replace(/ReplaceItemName/g, itemName) }
        });
    }


    async getItemContextMenuOption(optionType) {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: 'Name', value: optionType },
                ]
            },
            mac: { xpath: MAC_XPATH[MAC_VIEWMODE]['mainCanvas'].contextOption.replace(/ReplaceOption/g, optionType) }
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

    async getApplicationName(applicationName) {
      return this.getNativeElement({
        windows: {
          locators: [
            {method: 'Name', value: applicationName}
          ]
        },
        mac:{xpath: selectApplication.application.replace(/ReplaceMe/g, applicationName)}
      })
    }
    
    async getSelectApplicationButton(buttonName) {
      return this.getNativeElement({
        windows: {
          locators: [
            {method: 'Name', value: buttonName}
          ]
        },
        mac:{xpath: selectApplication.selectButton.replace(/ReplaceMe/g, buttonName)}
      })
    }


    // actions
    async clickOnItem({itemName, itemType}) {
      let elem = await this.getItem({ itemName, itemType });
      return this.moveToAndClick(elem)
    }
    
    async selectApplication(applicationName) {
      let applicationElm = await this.getApplicationName(applicationName);
      await this.moveToAndClick(applicationElm);
      let selectButton = await this.getSelectApplicationButton("Select");
      return this.moveToAndClick(selectButton);
    }

    async doubleClickOnItem({ itemName, itemType }) {

        let item = await this.getItem({ itemName, itemType });

        //wait for the itemname to be shown
        await this.app.waitForElementByXPath(MAC_XPATH[MAC_VIEWMODE]['mainCanvas'].resultItem.replace(/ReplaceMe/g, itemName));

        await this.app.moveToAndDoubleClick(item);
        return this.app.sleep(2000);
    }

    async selectContextMenu({ optionType, itemName, itemType }) {
        console.log(`option type is ${optionType}`)
        let item = await this.getItem({ itemName, itemType });
        await this.moveToAndClick(item);
        await this.rightClick();
        await this.moveToAndClick(await this.getItemContextMenuOption(optionType));
        return this.app.sleep(500);
    }

    async selectSearchFolder(folderName) {
        let item = await this.getSearchFolder(folderName);
        await this.moveToAndClick(item);
        return this.app.sleep(500);
    }


    // assertions

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
