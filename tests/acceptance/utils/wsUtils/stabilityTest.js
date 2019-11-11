let tagsArray = ["@ldap", "@metricEditor", "@rsd", "@settings"]; //edit this to include more tags

function randomTagGenerator() {
  let randomIndex = Math.floor(Math.random() * tagsArray.length);
  let randomElement = tagsArray[randomIndex];
  return randomElement;
}

const execSync = require("child_process").execSync;

let randomTag;
let tag = [];
let error = 0;
let executionTime = 0;
let output;
let isError = 0;
let count = 0;
let errorRatio = 0;
const durationInHrs = process.argv[2];
const numberOfTags = process.argv[3];
const maxErrorRatio = process.argv[4];

const helpMsg =
  "Cannot accept the parameters. Usage: \n\n" +
  "node utils/wsUtils/stabilityTest.js durationInHrs numberOfTags maxErrorRatio\n" +
  "e.g. node utils/wsUtils/stabilityTest.js 50 2 0.5";

if (
  !durationInHrs ||
  !numberOfTags ||
  numberOfTags < 1 ||
  !maxErrorRatio ||
  maxErrorRatio < 0 ||
  durationInHrs <= 0
) {
  if (numberOfTags < 1)
    console.log(`Number of tags should be atleast 1 or greater than 1 \n`);
  if (durationInHrs <= 0)
    console.log(`Total test duration should be gretaer than 0hrs \n`);
  if (maxErrorRatio < 0)
    console.log(
      `Please input a valid value for max error ratio allowed. Error Ratio = Error count /Total number of runs`
    );
  console.log(helpMsg);
}

for (
  let n = 0;
  executionTime / 3600 < durationInHrs &&
  numberOfTags > 0 &&
  errorRatio >= maxErrorRatio;
  n++
) {
  if (isError) {
    execSync(
      `defaults delete ~/Library/Preferences/com.microstrategy.Workstation 4c158b61ebc73998d366d08f49c1bed507a0264f`
    );
    execSync(
      `defaults delete ~/Library/Preferences/com.microstrategy.Workstation acca64b83535b9a1dff37a13cd176f393be7c195`
    );
    execSync(
      `defaults read ~/Library/Preferences/com.microstrategy.Workstation`
    );
    isError = 0;
  }
  try {
    for (let i = 0; i < numberOfTags; i++) {
      tag[i] = randomTagGenerator();
      randomTag = tag[0];
    }
    for (let i = 1; numberOfTags > 1 && i < numberOfTags; i++) {
      randomTag += " or " + tag[i];
    }
    output = execSync(`yarn test --cucumberOpts.tags "${randomTag}"`, {
      encoding: "utf-8"
    });
    count++;
    console.log(`Output : ${output}`);
    executionTime += parseInt(output.split("Done in ")[1].split("s")[0]);
    console.log(`Total execution time: ${executionTime}`);
    errorRatio = error / count;
    console.info(`error ratio is: ${errorRatio}`);
    if (errorRatio == maxErrorRatio)
      console.log(
        `Execution is going to stop now as max error ratio is reached.`
      );
  } catch (err) {
    isError = 1;
    console.log("ERROR! Resetting environment connections.");
    console.log(err);
    error++;
  }
}
console.log(`Executing failed for ${error} number of times`);
