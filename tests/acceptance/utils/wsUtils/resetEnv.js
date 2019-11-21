const execSync = require("child_process").execSync;
const fs = require("fs");

function resetMacEnv() {
  try {
    //To remove environments added/connected, we should delte 2 plist items from ~/Library/Preferences/com.microstrategy.Workstation.plist file
    //1. 4c158b61ebc73998d366d08f49c1bed507a0264f    2. acca64b83535b9a1dff37a13cd176f393be7c195
    execSync(`defaults delete ~/Library/Preferences/com.microstrategy.Workstation 4c158b61ebc73998d366d08f49c1bed507a0264f`);
    execSync(`defaults delete ~/Library/Preferences/com.microstrategy.Workstation acca64b83535b9a1dff37a13cd176f393be7c195`);
    //Reset the deaults for the changes to apply
    execSync(`defaults read ~/Library/Preferences/com.microstrategy.Workstation`);
    console.log(`Environments are successfully removed.`);
  } catch (error) {
    console.log("No environments present to remove");
    console.log(`${error}\n`);
  }
}

function resetWinEnv() {
  try {
    fs.unlinkSync(`C:\\Users\\luntan\\AppData\\Local\\Microstrategy_Inc\\Workstation.db`);
  } catch (error) {
    console.log(error);
  }
}

module.exports.resetMacEnv = resetMacEnv;
module.exports.resetWinEnv = resetWinEnv;
