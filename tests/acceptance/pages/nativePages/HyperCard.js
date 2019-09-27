import RootApp from '../basePages/RootApp';

// hyper is not Plugin app in Mac (thus not using CEF) so this is only for Windows
export default class HyperCard extends RootApp {
  //Locators
    async getExistingCard(cardName){
      return this.getNativeElement({
        windows:{
          locators: [
            { method: 'Name', value: `${cardName}\nHyperCard` }
          ]},
        mac: { }
      });
    }

    async getNotSaveButton(){
      return this.getNativeElement({
        windows:{
          locators: [
            { method: 'Name', value: `No` },
            { method: 'ClassName', value: 'Button'}
          ]},
        mac: { }
      });
    }

    async getCloseCard(cardName){
        return this.getNativeElement({
          windows:{
            locators: [
                { method: 'Name', value: cardName },
                { method: 'AccessibilityId', value: 'WindowCloseButton' }
              ]},
          mac: { }
        });
      }

  // ** Actions ** //
  async openExistingCard(cardName){
      let cardObject = await this.getExistingCard(cardName);
      await cardObject.doubleclick();
      return this.app.sleep(2000);
  }

  async closeCard(cardName){
    let closeBtn = await this.getCloseCard(cardName);
    await closeBtn.click();
    return this.app.sleep(1000);
  }

  async selectNotSave() {
    let notSaveButton = await this.getNotSaveButton();
    await notSaveButton.click();
    return this.app.sleep(1000);
  }

}
