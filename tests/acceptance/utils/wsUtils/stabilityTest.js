let tagsArray = ["@ldap", "@metricEditor", "@rsd", "@settings"]; //edit this to include more tags

function randomTagGenerator() {
  let randomIndex = Math.floor(Math.random() * tagsArray.length);
  let randomElement = tagsArray[randomIndex];
  return randomElement;
}

const execSync = require("child_process").execSync;

let randomTag1;
let randomTag2;
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

for (let n = 0; executionTime / 3600 < process.argv[2]; n++) {
  try {
    randomTag1 = randomTagGenerator();
    randomTag2 = randomTagGenerator();
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
    execSync(
      `defaults delete ~/Library/Preferences/com.microstrategy.Workstation 4c158b61ebc73998d366d08f49c1bed507a0264f`,
      {
        encoding: "utf-8"
      }
    );
    execSync(
      `defaults read ~/Library/Preferences/com.microstrategy.Workstation`,
      {
        encoding: "utf-8"
      }
    );
    console.log("ERROR! Resetting environment connections.");
    console.log(err);
    error++;
  }
}
console.log(`Executing failed for ${error} number of times`);
