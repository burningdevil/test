
function OSSwitch(windows, macOS) {
    if (process.platform === 'win32') {
        if (windows !== null) return windows()
    } else if (process.platform === 'darwin') {
        if (macOS !== null) return macOS()
    } else {
        throw new Error(`Platform '${process.platform}' is not supported!`)
    }
}

async function sleep(time, msg) {
    const slowMotion = 1
    await new Promise((resolve, reject) => setTimeout(resolve, time * slowMotion))
    console.log(`Sleeped ${time * slowMotion} ms, ` + msg)
}

module.exports = { OSSwitch, sleep }
