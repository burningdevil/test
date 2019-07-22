import BasePage from './BasePage';
import DossierEditor from '../nativePages/DossierEditor';

export default class QuickSearchPage extends BasePage {

  // element locator
  getQuickSearchList() {
    return this.$('.QuickSearchListView');
  }

  getQuickSearchListItems() {
    return this.getQuickSearchList().$$('.QuickSearchItem');
  }

  getQuickSearchListItemByIndex(index) {
    return this.getQuickSearchListItems().get(index);
  }

  getQuickSearchListItemByName(name) {
    return this.getQuickSearchListItems().filter(async (elm) => {
      let elmText = await elm.$('.QuickSearchItem-text-name').getText();
      return elmText === name;
    }).first();
  }

  // actions
  async awaitRendering() {
    return this.wait(this.EC.presenceOf(this.getQuickSearchList()), 3000, 'Result List is not present');
  }

  async selectItemByName(name) {
    await this.getQuickSearchListItemByName(name).click();
    let dossierEditor = new DossierEditor();


    // await this.sleep(10000); // wait for dossier to be executed

    let dossierEditorXPath = MAC_XPATH['dossierEditor'];
    let closeButtonXPath = dossierEditorXPath.close.replace(/ReplaceMe/g, "TEC.QA");
    let containerXPath = dossierEditorXPath.container.replace(/ReplaceMe/g, "TEC.QA");

    // console.log(closeButtonXPath);

    await dossierEditor.waitForElementByXPath1(closeButtonXPath, 10000, 200, ()=>{console.log("a call back")});

    // console.log("dossier editor is ",dossierEditor);

    // dossierEditor.waitForElementByXPath(closeButtonXPath, 20000 );


    let dossierEditorCloseButton = await dossierEditor.getDossierEditorCloseButton("TEC.QA");
    await dossierEditor.moveToAndClick(dossierEditorCloseButton);

  }

  // assertions
  async resultCount() {
    return this.getQuickSearchListItems().count();
  }

}