import RootApp from './RootApp';
const dossierEditor = MAC_XPATH['dossierEditor'];

export default class DossierEditor extends RootApp {

  // locator
  async getDossierEditorContainer(dossierName) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: dossierName },
        ]},
      mac: { xpath: dossierEditor.container.replace('ReplaceMe', dossierName) }
    });
  }

  async getDossierEditorCloseButton(dossierName) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: dossierName },
          { method: 'AccessibilityId', value: 'WindowCloseButton' }
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