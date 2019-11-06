let tagsArray = ["@ldap", "@metricEditor", "@rsd", "@settings"]; //edit this to include more tags

function randomTagGenerator() {
  let randomIndex = Math.floor(Math.random() * tagsArray.length);
  let randomElement = tagsArray[randomIndex];
  return randomElement;
}

let randomTag1 = randomTagGenerator();
let randomTag2 = randomTagGenerator();
const execSync = require("child_process").execSync;

let error = 0;
let executionTime = 0;
let output;

const helpMsg =
  "Cannot accept the parameters. Usage: \n\n" +
  "node utils/wsUtils/stabilityTest.js durationInHrs \n" +
  "e.g. node utils/wsUtils/stabilityTest.js 50";

if (!process.argv[2]) {
  console.log(helpMsg);
}

for (n = 0; executionTime / 3600 < process.argv[2]; n++) {
  try {
    output = execSync(
      `yarn test --cucumberOpts.tags "${randomTag1} or ${randomTag2}"`,
      {
        encoding: "utf-8"
      }
    );
    console.log(`Output : ${output}`);
    executionTime += parseInt(output.split("Done in ")[1].split("s")[0]);
    console.log(`Total execution time: ${executionTime}`);
  } catch (err) {
    console.log("error rate is increased! Continue running...");
    console.log(err);
    error++;
  }
}
console.log(`Executing failed for ${error} number of times`);
