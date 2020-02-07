const fs = require('fs-extra')
const project = require('../../project.config')
const logger = require('../lib/logger')

const editVersion = async (newVersion) => {
  if (newVersion) {
    try {
      const wsObject = await fs.readJson(`${project.outDir}/workstation.json`)
      wsObject.version = newVersion
      await fs.writeFile(`${project.outDir}/workstation.json`, JSON.stringify(wsObject, null, 4));
      logger.info(`Version updated successfully`, newVersion)
    } catch (err) {
      logger.error(`Error in updating new version`, err)
    }
  }
}
editVersion(process.env && process.env.APPLICATION_VERSION)
