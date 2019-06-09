let { setWorldConstructor } = require('cucumber');

function CustomWorld() {
  console.log("Setting Cucumber World");
}

setWorldConstructor(CustomWorld);