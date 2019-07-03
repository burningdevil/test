import RootApp from './RootApp';

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



}