const fs = require('fs');

const file_name = "finalize_helpers.js"
//replace the builder.js in node_modules to the builder.js in utils/ubUtils/ . After the replacement, the step information in cucumber will become available to the UB monitor.
function replaceUBBuilder() {
    let cucumberBuilderPath = `./node_modules/cucumber/lib/support_code_library_builder/${file_name}`;

    try {
      fs.unlinkSync(cucumberBuilderPath);
    } catch (err) {
      console.info(`Failed to remove ${cucumberBuilderPath}, maybe it's already removed`);
      console.log(err);
    }

    let ubBuilderPath = `./utils/ubUtils/${file_name}`
    var newUBBuilderContent = fs.readFileSync(ubBuilderPath, 'utf8');

    console.info(`re-generating ${cucumberBuilderPath}`);
    fs.appendFileSync(cucumberBuilderPath, newUBBuilderContent, 'UTF-8');
}

replaceUBBuilder();
