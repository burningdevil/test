const { Parser } = require('json2csv');
 
const fields = ['workstation', 'workstationHelpers', 'build'];
const opts = { fields };

let myData = require("../../reports/ubAverage.json");
myData.build = "11.1.3"
 
try {
  const parser = new Parser(opts);
  const csv = parser.parse(myData);
  console.log(csv);
} catch (err) {
  console.error(err);
}