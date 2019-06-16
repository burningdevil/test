async function registerWindow(windowName) {
    console.log(await workstationApp.windowHandles())

    let currentWindowHandle = await workstationApp.windowHandle();
    return windowsMap.set(windowName, currentWindowHandle);
}

async function registerNewWindow(windowName) {
    let windowHandles = await workstationApp.windowHandles();
    let newWindowHandle = windowHandles[0];
    return windowsMap.set(windowName, newWindowHandle);
}

async function switchToWindow(windowName) {
    let windowhandle = windowsMap.get(windowName);
    await workstationApp.window(windowhandle);
    return workstationApp.sleep(1000);
}

async function unregisterWindow(windowName) {
    return windowsMap.delete(windowName);
}

module.exports = {registerWindow, registerNewWindow, switchToWindow, unregisterWindow };

