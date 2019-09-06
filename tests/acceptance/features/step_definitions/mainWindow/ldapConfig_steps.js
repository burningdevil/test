const { Given, When, Then } = require('cucumber');

// ** Navigations in Main Window ** //
// this step waits for caching to be completed (for Mac Quick Search)
When('LDAP window should be displayed', async function(){
    await ldap.switchToNewWebView();
    return expect(ldap.isLdapWindowDisplayed()).become(true);
});

When('LDAP window should NOT be displayed', async function(){
    return expect(ldap.isLdapWindowDisplayed()).become(false);
});

When('I select sideTab {sideTab}', async function (sideTab) {
//   await ldap.switchToNewWebView();
  return ldap.selectSideTab(sideTab);
});

Then('I click cancel button', async function(){
    await ldap.clickCancel();
    return ldap.switchToDefaultWebView();
});

Then('I close pop up window for {window} window', async function(window){
    await mainWindow.clickClose(window);
    return ldap.switchToDefaultWebView();
})