import Window from '../basePages/Window';
const rsd = MAC_XPATH_GENERAL['rsd'];

export default class RSDWindow extends Window {
  //Locators
  async getCloseRSDWindowButton(windowName){
    return this.getNativeElement({
      windows:{ 
        locators: [
            { method: '', value: '' },
            { method: '', value: '' }
          ]},
      mac: { xpath: rsd.closeRSDWindowButton}
    });
  }

  async getComfirmCloseRSDButton(){
    return this.getNativeElement({
      windows:{ 
        locators: [
            { method: '', value: '' },
            { method: '', value: '' }
          ]},
      mac: { xpath: rsd.confirmCloseRSDButton}
    });
  }

  // ** Actions ** //
  async waitRSDWindow(){
    await this.nativeWaitFor({
      windows:{ 
        locators: [
            { method: '', value: '' },
            { method: '', value: '' }
          ]},
      mac: { xpath: rsd.closeRSDWindowButton}
    });
  }
  async closeRSDWindow(){
    await this.nativeWaitFor({
      windows:{ 
        locators: [
            { method: '', value: '' },
            { method: '', value: '' }
          ]},
      mac: { xpath: rsd.closeRSDWindowButton}
    });
    let closeWindowBtn = await this.getCloseRSDWindowButton();
    this.moveToAndClick(closeWindowBtn);
    await this.sleep(4000)
  }

  async confirmCloseRSDWindow() {
    await this.nativeWaitFor({
      windows:{ 
        locators: [
            { method: '', value: '' },
            { method: '', value: '' }
          ]},
      mac: { xpath: rsd.confirmCloseRSDButton}
    });
    let confirmBtn = await this.getComfirmCloseRSDButton();
    this.moveToAndClick(confirmBtn);
    await this.sleep(1000)
  }

}