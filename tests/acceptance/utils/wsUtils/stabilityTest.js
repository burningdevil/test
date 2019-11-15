let tagsArray = ["@ldap", "@metricEditor", "@rsd", "@settings"]; //edit this to include more tags

let randomTag;
let tag = [];
let error = 0;
let executionTime = 0;
let output;
let isError = 0;
let errorRatio = 0;
let numberOfTags;
let maxErrorRatio = 0;
const durationInHrs = process.argv[2];
const execSync = require("child_process").execSync;

function randomTagGenerator() {
  let randomIndex = Math.floor(Math.random() * tagsArray.length);
  let randomElement = tagsArray[randomIndex];
  return randomElement;
}

function noOfTags() {
  return Math.ceil(Math.random() * tagsArray.length);
}

const helpMsg =
  "Cannot accept the parameters. Usage: \n\n" +
  "node utils/wsUtils/stabilityTest.js durationInHrs maxErrorRatio\n" +
  "e.g. node utils/wsUtils/stabilityTest.js 50 0.5";

if (!process.argv[3]) {
  console.log(`Default Error ratio: 0.5 is being used.`);
  maxErrorRatio = 0.5;
} else {
  maxErrorRatio = process.argv[3];
}

if (durationInHrs <= 0) {
  console.log(helpMsg);
  console.log(`Total test duration should be gretaer than 0hrs \n`);
}
if (maxErrorRatio < 0) console.log(`Please input a valid value for max error ratio allowed. Error Ratio = Error count /Total number of runs`);

for (let n = 0; executionTime / 3600 < durationInHrs && errorRatio <= maxErrorRatio; n++) {
  if (isError) {
    execSync(`defaults delete ~/Library/Preferences/com.microstrategy.Workstation 4c158b61ebc73998d366d08f49c1bed507a0264f`);
    execSync(`defaults delete ~/Library/Preferences/com.microstrategy.Workstation acca64b83535b9a1dff37a13cd176f393be7c195`);
    execSync(`defaults read ~/Library/Preferences/com.microstrategy.Workstation`);
    isError = 0;
  }
  try {
    numberOfTags = noOfTags();
    console.log(`Number of tags:  ${numberOfTags}`);

    for (let i = 0; i < numberOfTags; i++) {
      tag[i] = randomTagGenerator();
      randomTag = tag[0];
    }
    for (let i = 1; numberOfTags > 1 && i < numberOfTags; i++) {
      randomTag += " or " + tag[i];
    }
    console.log(`Tag Generated:  ${randomTag}`);
    output = execSync(`yarn test --cucumberOpts.tags "${randomTag}"`, {
      encoding: "utf-8"
    });
    console.log(`Output : ${output}`);
    executionTime += parseInt(output.split("Done in ")[1].split("s")[0]);
    console.log(`Total execution time: ${executionTime}`);
    if (n >= 2) {
      errorRatio = error / (n + 1);
      if (errorRatio == maxErrorRatio) console.log(`Execution is going to stop now as max error ratio is reached.`);
    }
    console.info(`Error ratio is: ${errorRatio}`);
  } catch (err) {
    isError = 1;
    console.log("ERROR! Resetting environment connections.");
    console.log(err);
    error++;
  }
}
console.log(`Executing failed for ${error} number of times`);
