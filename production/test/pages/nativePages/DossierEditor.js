import RootApp from './RootApp';
const dossierEditor = XPATH['dossierEditor'];

let object ={}

export default class DossierEditor extends RootApp {

  // locator
  async getDossierEditorContainer(dossierName) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]},
      mac: { xpath: dossierEditor.container.replace('ReplaceMe', dossierName) }
    });
  }

  async getDossierEditorCloseButton(dossierName) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]},
      mac: { xpath: dossierEditor.close.replace('ReplaceMe', dossierName) }
    });
  }

  // actions
  async closeDossierEditor(dossierName) {
    let closeButton = await this.getDossierEditorCloseButton(dossierName);
    return closeButton.click();
  }

  // assertions
  async isDossierEditorDisplayed(dossierName) {
    try {
      let elem = await this.getDossierEditorContainer(dossierName);
      return elem.isDisplayed();
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}