const { expect } = require('chai')
const { When, Then } = require('cucumber')
const { registerNewWindow, switchToWindow } = require('../../Utils/wsUtils/windowHelper')
const { mainWindow, appInfo } = pageObj

When('I select {string} tab in application info window', async function (tabName) {
  return appInfo.selectTab(tabName)
})


Then('I select {string} in ACL configuration tab', async function (name) {
  return appInfo.selectUserOrGroupByName(name)
})

Then('I remove user or user group of {string} in ACL configuration tab', async function (name) {
  return appInfo.removeUserOrUserGroup(name)
})

Then('I add user or user group in ACL configuration tab', async function () {
  return appInfo.selectUserOrGroupByName()
})

Then('I save changes in application info window', async function () {
  return appInfo.saveChanges()
})

Then('I click cancel in application info window', async function () {
  return appInfo.clickCancelButton()
})

Then('I verify usergroup {string} should not display', async function (name) {
  const result = await appInfo.isUserOrUserGroupDisplayed(name)
  expect(result).to.equal(false)
})

Then('I verify usergroup {string} should display', async function (name) {
  const result = await appInfo.isUserOrUserGroupDisplayed(name)
  expect(result).to.equal(true)
})




