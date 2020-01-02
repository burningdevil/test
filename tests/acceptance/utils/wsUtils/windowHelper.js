async function registerWindow(windowName) {
  console.log(await workstationApp.windowHandles())

  const currentWindowHandle = await workstationApp.windowHandle()
  return windowsMap.set(windowName, currentWindowHandle)
}

async function registerNewWindow(windowName) {
  const windowHandles = await workstationApp.windowHandles()
  const newWindowHandle = windowHandles[0]
  return windowsMap.set(windowName, newWindowHandle)
}

async function switchToWindow(windowName) {
  const windowhandle = windowsMap.get(windowName)
  await workstationApp.window(windowhandle)
  return workstationApp.sleep(1000)
}

async function unregisterWindow(windowName) {
  return windowsMap.delete(windowName)
}

module.exports = { registerWindow, registerNewWindow, switchToWindow, unregisterWindow }
