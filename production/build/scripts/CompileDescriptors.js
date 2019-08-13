const fs = require('fs-extra')
const sql = require('mssql')
const path = require('path')

const STRING_SERVER = '10.27.10.36'  // TS_SPHINX
const DB_USER = 'dssadmin'
const DB_PASSWD = 'dssadmin'
const HASH_DSN_DB = {
  'LOCALIZATION_WEB': 'STRING_WEB',
}
const fetchStrings = async function (database, password, sqlString) {
  // const pool = await sql.connect('mssql://username:password@localhost/database')
  // const result = await sql.query`select * from mytable where id = ${value}`

  const config = {
    user: DB_USER,
    password,
    server: STRING_SERVER,
    database,
    options: {
      encrypt: false
    }
  }

  try {
    let pool = await sql.connect(config)
    let result = await pool.request().query(sqlString)
    sql.close()
    return result.recordset
  } catch (err) {
    throw err
  }
}

const getObjectFromRow = function (row, columnPostfix, dbPostfix) {
  const messageID = row['ID']
  const engMessage = row['String_English']

  const columnName = 'String_' + columnPostfix
  // For the language that owned by one DB but not another
  let msg = (columnName in row) ? row[columnName] : ('*' + engMessage + '*')

  // Really not sure why messages in DB has '&' everywhere...
  if (msg) {
    msg = msg.replace('&', '')
  }
  // replace all pattern like:  %1  with {0},  %2 with {1}
  let leftSide = 'mstr' + dbPostfix + '.' + messageID

  return {
    'key': leftSide,
    'v': msg
  }
}

const exportToResourceFile = async function (outputFileFolder) {
  const messageIDs = require('../../public/descriptorIDs.json')

  if (!messageIDs || !messageIDs.length) {
    console.log(`No resource to be exported`)
    return
  }

  // TODO ryu: Check if file exists before this?
  // const file = await fs.readFile(path.join(__dirname, '/../files/pwd.txt'))
  const password = DB_PASSWD

  const sqlWeb = `select * from Strings where ID in (${messageIDs.join(',')})`
  let webRows = await fetchStrings(HASH_DSN_DB['LOCALIZATION_WEB'], password, sqlWeb)
  // There are inconsistencies between gui and web DB. We use | to separate them here.
  const acceptLanguageDict = {
    'da': 'Danish',
    'de': 'Deutsch',
    'en-GB': 'English_UK|English',
    'en-US': 'English',
    'en': 'English',
    'es': 'Espanol_Espana|Espanol',
    'fr': 'Francais',
    'it': 'Italiano',
    'ja': 'Japanese',
    'ko': 'Korean',
    'nl': 'Dutch',
    'pl': 'Polish',
    'pt': 'Portuguese_Brazil|Portuguese',
    'ru': 'Russian',
    'sv': 'Svenska',
    'zh-TW': 'Trad_Chinese|ChineseTraditional',
    'zh': 'Chinese|ChineseSimplified',
    'zh-CN': 'Chinese|ChineseSimplified'
  }

  let wholeDescriptors = {}
  for (let [language, colPostfixes] of Object.entries(acceptLanguageDict)) {
    let descriptors = {}
    let colPostfixList = colPostfixes.split('|')

    let webPostfix = ''
    if (colPostfixList.length === 1) {
      webPostfix = colPostfixes
    } else {
      webPostfix = colPostfixList[0]
    }
    for (let row of webRows) {
      let obj = getObjectFromRow(row, webPostfix, 'Web')
      descriptors[obj.key] = obj.v
    }

    const overallObj = {
      'descriptors': descriptors
    }
    wholeDescriptors[language] = overallObj
  }

  const resourceFilesFolder = path.join(outputFileFolder, 'descriptors')

  await fs.ensureDir(resourceFilesFolder)
  await Promise.all(Object.keys(acceptLanguageDict).map((locale) => {
    return fs.writeFile(path.join(resourceFilesFolder, `${locale}.js`),
      'window.mstrDescriptors = ' + JSON.stringify(wholeDescriptors[locale]), 'utf8')
  }))
  console.log(webRows.map(r => r.ID).join(', '))
  console.log(`Completed exporting all resources files to ${resourceFilesFolder}!`)
}

module.exports = {
  exportToResourceFile,
}
