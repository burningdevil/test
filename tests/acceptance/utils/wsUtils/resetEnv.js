const execSync = require("child_process").execSync;
const fs = require('fs')
let removeEnv;

function resetMacEnv() {
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

function resetWinEnv() {
  try {
    fs.unlinkSync(`C:\\Users\\luntan\\AppData\\Local\\Microstrategy_Inc\\Workstation.db`);
  } catch (error) {
    console.log(error)
  } 
}

module.exports.resetMacEnv = resetMacEnv;
module.exports.resetWinEnv = resetWinEnv;