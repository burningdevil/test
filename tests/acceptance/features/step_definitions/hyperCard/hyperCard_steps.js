const { Given, When, Then } = require('cucumber');
const {registerNewWindow,switchToWindow, unregisterWindow} = require('../../../Utils/wsUtils/windowHelper')
  
  When('I open card {cardName}', async function(cardName){
    // no support in Mac yet
    await hyperCard.openExistingCard(cardName);
    if (OSType === 'windows') {
      await registerNewWindow(`Card Editor`);
      await switchToWindow(`Card Editor`);
    } 
    return hyperPage.switchToNewWebView();
  });
  
  When('I clear card', async function(){
     return hyperPage.clickToClearCard();
  });

  When('I close card {cardName}', async function(cardName){
      await hyperPage.switchToDefaultWebView();
      await hyperCard.closeCard(cardName);
      await hyperCard.app.sleep(1000);
      if (OSType === 'windows') {
        await switchToWindow('Workstation Main Window');
        console.log('switched window')
        return unregisterWindow('Card Editor');
      }
 });