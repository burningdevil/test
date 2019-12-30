const { When, Then } = require('cucumber')

When('LDAP window should be displayed', async function() {
  await ldapPage.switchToNewWebView()
  return expect(ldapPage.isLdapWindowDisplayed()).become(true)
})

When('LDAP window should NOT be displayed', async function() {
  return expect(ldapPage.isLdapWindowDisplayed()).become(false)
})

When('I select sideTab {string}', async function (sideTab) {
  return ldapPage.selectSideTab(sideTab)
})

Then('I click cancel button', async function() {
  await ldapPage.clickCancel()
  return ldapPage.switchToDefaultWebView()
})

When('I click OK after user import', async function() {
  await ldapPage.switchToNewWebView()
  await ldapPage.clickImportOkButton()
  return ldapPage.switchToDefaultWebView()
})

When('I click LDAP configure button', async function() {
  await ldapPage.switchToNewWebView()
  await ldapPage.clickConfiureButton()
  await ldapPage.switchToDefaultWebView()
  return ldapPage.sleep(3000)
})
