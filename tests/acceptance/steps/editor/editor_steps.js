const { Then } = require('cucumber')
const { editor } = pageObj

// ** Editor Related ** //

Then('{string} editor should be displayed', async function (editorName) {
  return expect(editor.isEditorDisplayed(editorName)).become(true)
})

Then('{string} Editor should be disappeared', function (editorName) {
  return expect(editor.isEditorDisappeared(editorName)).become(true)
})

// ** Metric Editor Related ** //
Then('Popup should be displayed in editor {string}', async function (itemName) {
  return expect(editor.popup.isPopupDisplayedInEditor(itemName)).become(true)
})
