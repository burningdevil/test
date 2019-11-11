const fs = require('fs')
module.exports = function clearFiles(folder, suffix = '.json') {
    fs.readdirSync(folder).forEach(file => {
        if (file.endsWith(suffix)) {
            try {
                fs.unlinkSync(`${folder}/${file}`);
            } catch (err) {
                console.info(`Couldn't remove ${file}, maybe it did not exist`);
                console.log(err);
            }
        }
    });
}


