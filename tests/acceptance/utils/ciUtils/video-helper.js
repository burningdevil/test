const { exec, execSync } = require('child_process');
const fs = require('fs')
const FormData = require('form-data');
const { OSSwitch } = require('./os-helper');

function getCaptureScreen() {
    return OSSwitch(() => {
        console.log(`method getCaptureScreen doesn't support windows`)
        return null
    }, () => {
        let deviceIndex = 0
        const cmd = 'ffmpeg -f avfoundation -list_devices true -i ""'
        try {
            execSync(cmd)
        } catch (e) {
            const re = /\[[0-9]\] Capture screen 0/
            const matchs = e.message.match(re)
            if (matchs !== undefined && matchs !== null && matchs.length > 0) {
                deviceIndex = matchs[0].substr(1, 1)
                console.log(`Capture screen index is ${deviceIndex}`)
            } else {
                console.log('unable to find the capture screen')
            }
        }

        return deviceIndex
    })
}

const mac_capture_screen_index = getCaptureScreen()

async function initVideoRecorder() {
    // since currently nodejs doesn't support delete folders recursively on Windows.
    // cmd line will be used for now to remove folders.
    const cmd = OSSwitch(() => {
        return `rmdir /q /s video`
    },
    () => {
        return 'rm -r video'
    });
    try {
        execSync(cmd, () => {
            console.log(`input cmd: ${cmd}`)
        });
    } catch (error) {
        console.log(`delete previous folder error: ${error}`)
    }
    try {
        fs.mkdirSync('./video', { recursive: true });
    } catch (error) {
        console.log(`mkdir error: ${error}`)
    }
}

function isVideoRecorderAvailable() {
    let ffmpegValid = true
    try {
        const cmdHelp = `ffmpeg -h`
        console.log(`the cmd is ===========${cmdHelp}==============================`)
        const exeCmd = execSync(cmdHelp);
    } catch (error) {
        console.log(`ffmpeg is not available the error message is: ${error}`)
        ffmpegValid = false
    }
    if (ffmpegValid == false) {
        console.log(`try the ffmpeg with full path c:/ffmpeg/bin/ffmpeg and /user/local/bin/ffmpeg`)
        try {
            ffmpegValid = true
            const cmdHelp2 = OSSwitch(() => {
                return `c:/ffmpeg/bin/ffmpeg -h`
            },
            () => {
                return `/user/local/bin/ffmpeg -h`
            });
            const exeCmd2 = execSync(cmdHelp2);
        } catch (error) {
            console.log(`full path ffmpeg ${cmdHelp2} is not available the error message is: ${error}`)
            ffmpegValid = false
        }
    }

    return ffmpegValid;
};

async function recordVideoForScenario(scenario) {
    const fileName = scenario.pickle.name.replace(/ /g, '_').replace(/[^a-zA-Z_]+/g, '') + '-' + scenario.sourceLocation.line;
    const filePath = 'video/' + scenario.sourceLocation.uri
    const process = await recordVideo(filePath, fileName)
    return {
        process: process,
        path: filePath,
        name: fileName + '.mkv'
    }
};

async function recordVideo(filePath, fileName) {
    try {
        fs.mkdirSync(`./${filePath}`, { recursive: true });
    } catch (error) {
        console.log(`mkdir ${filePath} error: ${error}`)
    }
    const cmd = OSSwitch(() => {
        return `c:/ffmpeg/bin/ffmpeg -f dshow -rtbufsize 1024M -framerate 30 -t 300 -i video="screen-capture-recorder"  -c:v libx264 -crf 0 -preset ultrafast ${filePath}/${fileName}.mkv`
    },
    () => {
        return `ffmpeg -f avfoundation -t 300 -i "${mac_capture_screen_index}" ${filePath}/${fileName}.mkv`
    });
    console.log(`input cmd: ${cmd}`)
    const process = exec(cmd, (error) => {
        if (error) {
            console.log(`exec ${cmd} error: ${error}`)
        }
    });
    return process;
}

async function stopRecord(process) {
    try {
        process.stdin.write('q')
    } catch (e) {
        console.log(`failed to kill the video recorder normally at first place, pid: ${process.pid}`)
    }
    const cmd = OSSwitch(() => {
        return `tasklist`
    },
    () => {
        return `ps -p ${process.pid}`
    });
    console.log(`process id: ${process.pid}`)
    for (let waitTime = 0; waitTime <= 10000; waitTime += 500) {
        try {
            const processList = execSync(cmd)
            await workstationApp.sleep(500);
            if (processList.indexOf(process.pid) <= -1) {
                console.log(`waited ${waitTime}ms loops for kill: ${process.pid}`)
                break;
            }
        } catch (error) {
            console.log(`exec stop record ${cmd} error: ${error}`)
        }
    }
}

async function removeVideo(scenario) {
    const fileName = scenario.pickle.name.replace(/ /g, '_').replace(/[^a-zA-Z_]+/g, '') + '-' + scenario.sourceLocation.line;
    const filePath = `./video/${scenario.sourceLocation.uri}/${fileName}.mkv`
    console.info(`remove file path: ${filePath}`)
    try {
        fs.unlinkSync(filePath);
    } catch (error) {
        console.info(`remove video error: ${error}`)
    }
}

/**
 * upload a file to a remote go-fastdfs system
 * @param {string} file the location of the file to be loaded
 * @param {string} path the location on the server that the file will be uploaded to
 * @returns {string} the metadata of the uploaded file
 */

async function uploadVideo(file, path) {
    const GOFASTFDS = 'http://tlserver.labs.microstrategy.com:8080/upload'
    return new Promise((resolve, reject) => {
        // https://nodejs.org/api/events.html#events_error_events
        if(!fs.existsSync(file)) {
            reject(new Error(`no such file or directory, '${file}'`))
        } else {
            const form = new FormData();
            form.append('file', fs.createReadStream(file))
            form.append('path', path)
            form.append('output', 'json')
            form.submit(GOFASTFDS, (err, res) => {
                let data = ''
                if (err) {
                    console.log('error happends during from submit: ', err)
                    reject(err)
                } else {
                    res.on('data', (c) => {
                        data += c
                    })
                    res.on('end', () => {
                        if (res.statusCode === 200) {
                            resolve(data)
                        } else {
                            reject(data)
                        }
                    })
                }
            })
        }

    })
}

module.exports = { initVideoRecorder, recordVideo, recordVideoForScenario, stopRecord, removeVideo, uploadVideo, isVideoRecorderAvailable }
