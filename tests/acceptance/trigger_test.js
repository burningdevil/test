const {exec, execSync} = require('child_process');

// receive arguments from CI Pipeline
const argumentsFromCI = process.argv.slice(2)
const APP_PATH = argumentsFromCI[0]
const ENV_URL = argumentsFromCI[1]

let cp, globalExitCode = 0
// start appium method
const startupAppium = async () => {
    cp = exec('node node_modules/appium/.',{ cwd: '.'})
    let startupError, exitHandler
    cp.on('exit', exitHandler = exitCode => {
        if(exitCode) {
            startupError = new Error('Failed to start Appium')
        }
    })
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Remove listeners...
            cp.removeListener('exit', exitHandler);
            // Startup error?
            if (startupError) {
                reject(startupError);
            }
            resolve();
        },10000)
    })
}

// whole workflow
(async () => {
    try{
        console.info('start Appium...')
        await startupAppium()
    } catch (err) {
        globalExitCode = 1
    }
    try {
        console.info('Running test...')
        let OS_APP_PATH =''
        if(process.platform === 'win32') {
            OS_APP_PATH = `--args.appPath.windows '${APP_PATH}'`
        } else {
            OS_APP_PATH = `--args.appPath.mac '${APP_PATH}'`
        }
        execSync(`yarn test ${OS_APP_PATH} --params.envInfo.envUrl '${ENV_URL}'`, { stdio: 'inherit', encoding: 'utf-8' })
    } catch (err) {
        console.error(err)
        globalExitCode = 2
    };
    console.info('Quit Appium...')
    cp.kill('SIGINT')
    process.exit(globalExitCode)
})()
