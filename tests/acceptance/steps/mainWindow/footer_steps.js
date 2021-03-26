const { When, Then } = require('cucumber')
const { mainWindow } = pageObj

// ** Footer path Related** //
Then('{string} smart tab is selected', async function (tabName) {
  return expect(mainWindow.footer.isTextInPathDisplayed(tabName)).become(true)
})

When('I select folderMode on navigation bar', async function() {
  // Maximizing the windows workstation window since the object required is not within the display.
  // TO-DO: Implement the scrollig logic to find the object if not within the displayed window.
  if (OSType === 'windows') {
    await mainWindow.maximizeWindow('MicroStrategy Workstation - Env...(Developer Mode)')
  }
  await mainWindow.footer.selectFolderMode()
  return mainWindow.app.sleep(2000)
})

When('I select smartMode on navigation bar', async function() {
  // restore the windows workstation window so that the next time the window is maximized when enter the folder mode.
  // TO-DO: Implement the scrollig logic to find the object if not within the displayed window.
  if (OSType === 'windows') {
    await mainWindow.maximizeWindow('MicroStrategy Workstation (Developer Mode)')
  }
  await mainWindow.footer.selectSmartMode()
  return mainWindow.app.sleep(2000)
})
