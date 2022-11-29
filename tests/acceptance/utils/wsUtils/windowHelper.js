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
  if (windowhandle !== undefined) await workstationApp.window(windowhandle)
  return workstationApp.sleep(1000)
}

async function setWindowPosition(windowName, x, y) {
  const windowhandle = windowsMap.get(windowName)
  await workstationApp.sleep(1000)
  return workstationApp.setWindowPosition(x, y, windowhandle)
}

async function maximizeWindowByWindowName(windowName) {
  const windowhandle = windowsMap.get(windowName)
  await workstationApp.sleep(1000)
  return workstationApp.maximize(windowhandle)
}

async function unregisterWindow(windowName) {
  const windowhandle = windowsMap.get(windowName)
  if (windowhandle !== undefined) await windowsMap.delete(windowName)
  return workstationApp.sleep(500)
}

module.exports = { registerWindow, registerNewWindow, switchToWindow, unregisterWindow, setWindowPosition, maximizeWindowByWindowName }
