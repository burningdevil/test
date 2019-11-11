const fs = require('fs')
const {execSync} = require('child_process');
const clearFiles  = require('./utils/generalUtils.js')

const rerunsFOLDER = './reports/reruns'
const rerunFile = `${rerunsFOLDER}/@rerun.txt`


function testWithRerun() {
    clearFiles(rerunsFOLDER, '.txt')
    let count = 0
    // first execution
    try {
        execSync('yarn test', { stdio: 'inherit', encoding: 'utf-8' });
    } catch (e) {
        console.info('Test finished with failed scenarios.')
        // following execution with rerun txt
        while (fs.existsSync(rerunFile)) {
            console.info('running failed scenarios...')
            // rename the file to add suffix of the running round
            let currentFile = `${rerunsFOLDER}/@rerun_${count}.txt`
            fs.renameSync(rerunFile, currentFile)
            let data = fs.readFileSync(currentFile, 'utf8')
            let lines = data.split('\n')
            console.log('check lines: ', lines, lines.length)
            let lineInfo = lines[0].split(':')
            // if only one failed scenario left in the first line
            if (lineInfo.length <= 2) {
                // check if this is the only line
                if (lines.length <= 1) {
                    // if yes, no @rerun file will be generated
                    console.info('No more scenarios to run')
                    return
                } else {
                    // if more lines, remove the line to generate the @rerun file to rerun the text
                    data = lines.slice(1).join('\n')
                }
            } else {
                // remove the first scenario
                let featureName = lineInfo[0]
                let scenarios = lineInfo.slice(2).join(':')
                // update the first line
                lines[0] = `${featureName}:${scenarios}`
                data = lines.join('\n')
            }
            // write the @rerun text file for the next run
            fs.writeFileSync(rerunFile, data, 'utf8')
            try {
                execSync(`yarn testRerun`, { stdio: 'inherit', encoding: 'utf-8' });
            } catch (e) {
                console.log('test failed')
            }
            // increasing count
            count++
        }
    }


}

testWithRerun()
