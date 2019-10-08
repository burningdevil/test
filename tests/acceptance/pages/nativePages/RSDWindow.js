import Window from '../basePages/Window';
import Popup from './Popup'
const window = MAC_XPATH_GENERAL['window'];
const popup = MAC_XPATH_GENERAL['popup'];

export default class RSDWindow extends Window {

   // constructor
   constructor() {
    super();
    this.popup = new Popup()
  }

  //Locators
  

  // ** Actions ** //
  async waitRSDWindow(){
    await this.nativeWaitFor({
      windows:{ 
        locators: [
            { method: '', value: '' },
            { method: '', value: '' }
          ]},
      mac: { xpath: window.close}
    });
  }

  async confirmCloseRSDWindow() {
    await this.nativeWaitFor({
      windows:{ 
        locators: [
            { method: '', value: '' },
            { method: '', value: '' }
          ]},
      mac: { xpath: popup.button.replace(/ReplaceBtnName/g, 'Yes')}
    });
    let confirmBtn = await this.popup.getButton("Yes")
    this.moveToAndClick(confirmBtn);

    await this.sleep(1000)
  }

}