const fs = require('fs');

module.exports = function replaceUBBuilder() {
    let cucumberBuilderPath = "./node_modules/cucumber/lib/support_code_library/builder.js";
   
    try {
      fs.unlinkSync(cucumberBuilderPath);
    } catch (err) {
      console.info(`Failed to remove ${cucumberBuilderPath}, maybe it's already removed`);
      console.log(err);
    }

    let ubBuilderPath = "./utils/ubUtils/builder.js"
    var newUBBuilderContent = fs.readFileSync(ubBuilderPath, 'utf8');

    console.info(`re-generating ${cucumberBuilderPath}`);
    fs.appendFileSync(cucumberBuilderPath, newUBBuilderContent, 'UTF-8');
}