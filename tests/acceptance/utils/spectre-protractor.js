const createSpectreClient = require('./spectre-client');
const { spectreServerConfig } = require('./../config/constants')
const chalk = require('chalk');
// Indicates that it is in the Jenkins CI environment or run on local machine
const isCI = require('is-ci');

async function initSpectreProtractor(testSuiteName) {
    const spectreProject = isCI ? spectreServerConfig.projectNameCI : spectreServerConfig.prjectNameLocal
    let clientConnection = createSpectreClient(
        spectreProject,
        testSuiteName,
        spectreServerConfig.spectreUrl
    );
    console.log(chalk.green(`[INFO] Init Spectre clients, project=${spectreProject}, testCase=${testSuiteName}`))
    // Expose the take screenshot API that the test case can use.
    // Set to global, user can take screenshot for different browser instance
    global.spectre = {
        async takeScreenshot(name, opts = {}) {
            const br = opts.browser || browser;

            if (!name) {
                throw new Error('The name parameter is required');
            }

            let png;
            try {
                if (opts.element) {
                    // Take screenshot for a single element
                    png = await opts.element.takeScreenshot();
                } else {
                    png = await br.driver.takeScreenshot();
                }
            } catch (err) {
                throw new Error(err);
            }
            const capabilities = await br.getCapabilities();
            const client = await clientConnection;
            const tolerance = opts.tolerance || br.params.tolerance;
            const platform = process.platform === 'win32' ? 'win' : 'mac'
            const result = await client.submitTest({
                name,
                screenShot: Buffer.from(png, 'base64'),
                browser: `${platform} ${capabilities.get('browserName')}`,
                size: `960*708px`,
                diffThreshold: tolerance
            });
            return result;
        }
    };
}

async function spectreImageComparison(name, options = {}) {
    await browser.actions().mouseMove({ x: 0, y: 10000 }).perform()
    const result = await global.spectre.takeScreenshot(name, options)
    result.mismatchUrl = spectreServerConfig.spectreUrl + result.url
    console.log(`[INFO][Spectre - image - compare] ${result.pass ? chalk.green('   Result: Match') : chalk.red('   Result: Mismatch')}, Tolerance: ${result.diff_threshold}, Details go to: ${result.pass ? chalk.green(result.mismatchUrl) : chalk.red(result.mismatchUrl)}`)
    if (customArgObj.args.imageCompare) {
        expect(result.pass).to.equal(true, `Mismatch - Go to: ${result.mismatchUrl} for details`);
    }

}

module.exports = { initSpectreProtractor, spectreImageComparison }
