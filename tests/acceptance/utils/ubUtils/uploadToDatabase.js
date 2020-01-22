const mysql = require('mysql')

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '13647245012att',
  database: 'mydb'
})

con.connect(function(err) {
  if (err) throw err
  console.log('Connected!')
})

con.query('DROP TABLE workstationUBData;', function (err, result, fields) {
  if (err) throw err
})

const sql1 = `CREATE TABLE IF NOT EXISTS workstationUBData 
(
    feature varchar(255),
    scenario varchar(255),
    pattern varchar(255),
    patternID int,
    source varchar(255),
    maxCPU varchar(255),
    avgCPU DOUBLE(255,10),
    maxMemory DOUBLE(255,10),
    avgMemory DOUBLE(255,10),
    duration DOUBLE(255,10)
) `

con.query(sql1, function (err, result, fields) {
  if (err) throw err
})

// Todo: collect environment configuration information.

// upload UB data to database
const ubAverageReport = require('../../reports/ubAverage.json')

const workstationDataList = ubAverageReport.workstation

for (workstationData of workstationDataList) {
  const insertSQL = `INSERT INTO workstationUBData VALUES(?,?,?,?,?,?,?,?,?,?);`

  const formatList = [
    workstationData.feature,
    workstationData.scenario,
    workstationData.pattern,
    parseInt(workstationData.patternID),
    workstationData.source,
    workstationData.maxCPU,
    workstationData.avgCPU,
    workstationData.maxMemory,
    workstationData.avgMemory,
    workstationData.duration
  ]
  con.query(insertSQL, formatList, function (err, result, fields) {
    if (err) throw err
  })
}

con.end(function(err) {
  if (err) {
    console.log(err)
  }
  console.log('Disconnected!')
})
