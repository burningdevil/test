const fs = require('fs');

module.exports = function replaceUBBuilder() {
    let cucumberBuilderAddress = "./node_modules/cucumber/lib/support_code_library/builder.js";
   
    try {
      fs.unlinkSync(cucumberBuilderAddress, (err) => {
        console.info(`${cucumberBuilderAddress} was deleted`);
      });
    } catch (err) {
      console.error(`${cucumberBuilderAddress} did not exist`);
    }

    let ubBuilderAddress = "./utils/ubUtils/builder.js"
    var newUBBuilderContent = fs.readFileSync(ubBuilderAddress, 'utf8');

    console.info(`re-generating ${cucumberBuilderAddress}`);
    fs.appendFileSync(cucumberBuilderAddress, newUBBuilderContent, 'UTF-8');
}