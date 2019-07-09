const fs = require('fs');

module.exports = function replaceUBBuilder() {
    let cucumberBuilderAddress = "./node_modules/cucumber/lib/support_code_library/builder.js";
   
    try {
      fs.unlinkSync(cucumberBuilderAddress);
    } catch (err) {
      console.info(`Failed to remove ${cucumberBuilderAddress}, maybe it's already removed`);
      console.log(err);
    }

    let ubBuilderAddress = "./utils/ubUtils/builder.js"
    var newUBBuilderContent = fs.readFileSync(ubBuilderAddress, 'utf8');

    console.info(`re-generating ${cucumberBuilderAddress}`);
    fs.appendFileSync(cucumberBuilderAddress, newUBBuilderContent, 'UTF-8');
}