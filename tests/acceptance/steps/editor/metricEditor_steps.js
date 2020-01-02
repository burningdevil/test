const { When, Then } = require('cucumber')
const { metricEditorPage } = workstationApp.pageObj

Then('Metric editor window should be displayed', async function () {
  return expect(metricEditorPage.isMetricEditorPresent()).become(true)
})

Then('Metric editor window should NOT be displayed', async function () {
  return expect(metricEditorPage.isMetricEditorPresent()).become(false)
})

When('I click button {string}', async function(button) {
  return metricEditorPage.clickButton(button)
})

When('I click popup button {string}', async function(button) {
  return metricEditorPage.clickPopUpButton(button)
})

When('I choose metric editor function {string}', async function(functionName) {
  return metricEditorPage.chooseFunction(functionName)
})

When('I switch to formula editor', async function() {
  return metricEditorPage.switchToFormulaEditor()
})

When('I choose function editor option {string}', async function(option) {
  return metricEditorPage.clearFormulaEditor(option)
})

When('I double click on {string}', async function(functionName) {
  await metricEditorPage.doubleClickFunction(functionName)
  return browser.sleep(500)
})

When('I provide input {string}', async function(text) {
  return metricEditorPage.input(text)
})

When('I click validate button', async function() {
  return metricEditorPage.clickValidate()
})

When('Formula should be valid', async function() {
  return expect(metricEditorPage.formulaStatus()).become('Valid metric formula.')
})

When('I name metric as {string}', async function(provideMetricName) {
  return metricEditorPage.provideMetricName(provideMetricName)
})
