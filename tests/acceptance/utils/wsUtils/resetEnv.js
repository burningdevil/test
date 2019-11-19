const execSync = require("child_process").execSync;
let removeEnv;

function resetEnv() {
  try {
    removeEnv = execSync(`defaults delete ~/Library/Preferences/com.microstrategy.Workstation 4c158b61ebc73998d366d08f49c1bed507a0264f`);
    console.log(`Resetting Environments: ${removeEnv}`);
    removeEnv = execSync(`defaults delete ~/Library/Preferences/com.microstrategy.Workstation acca64b83535b9a1dff37a13cd176f393be7c195`);
    console.log(`Resetting Environments: ${removeEnv}`);
    execSync(`defaults read ~/Library/Preferences/com.microstrategy.Workstation`);
  } catch (error) {
    console.log("No environments present to remove");
    console.log(`${error}\n`);
  }
}

module.exports = resetEnv;
