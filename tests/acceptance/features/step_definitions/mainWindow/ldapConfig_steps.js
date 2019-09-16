const { Given, When, Then } = require('cucumber');

When('LDAP window should be displayed', async function(){
    await ldap.switchToNewWebView();
    return expect(ldap.isLdapWindowDisplayed()).become(true);
});

When('LDAP window should NOT be displayed', async function(){
    return expect(ldap.isLdapWindowDisplayed()).become(false);
});

When('I select sideTab {sideTab}', async function (sideTab) {
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

When('I click OK after user import', async function(){
    await ldap.switchToNewWebView();
    await ldap.clickImportOkButton();
    return ldap.switchToDefaultWebView();
  })

  When('I click LDAP configure button', async function(){
    await ldap.switchToNewWebView();
    await ldap.clickConfiureButton();
    await ldap.switchToDefaultWebView();
    return ldap.sleep(3000);
  })