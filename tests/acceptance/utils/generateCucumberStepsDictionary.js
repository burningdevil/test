/**
 * Based on https://github.com/midniteio/step-dictionary
 * Execute with command
 * node utils/generateCucumberStepsDictionary.js
 */
var path = require('path')
var _ = require('lodash')
var fs = require('fs')

function outputReport(outputPath, report) {
  fs.writeFileSync(outputPath, report)
}

function getAllPaths(testFolder) {
  const allPaths = []
  fs.readdirSync(testFolder).forEach(file => {
    if (fs.lstatSync(testFolder + '/' + file).isDirectory()) {
      const araux = getAllPaths(testFolder + '/' + file)
      allPaths.push(...araux)
    }
    if (path.parse(file).ext === '.js') {
      allPaths.push(testFolder + '/' + file)
    }
  })
  return allPaths
}

function getStepDefinitions(paths) {
  const stepDefinitions = []
  paths.forEach(filePath => {
    let fileData
    try {
      fileData = fs.readFileSync(filePath, { encoding: 'utf8' })
    } catch (e) {
      console.log(path + ' could not be read, will skip and continue', e)
    }

    if (fileData) {
      const stepDefinitionMatches = fileData.match(/(Then|When|Given)\s?\(.*/g)
      if (stepDefinitionMatches) {
        stepDefinitionMatches.forEach(stepDefinition => {
          const stepRegex = stepDefinition.substring(
            stepDefinition.indexOf('('),
            stepDefinition.indexOf(',')
          )
          const lineNumber = fileData
            .substring(0, fileData.indexOf(stepRegex))
            .split('\n').length
          const keyword = stepDefinition.substring(0, stepDefinition.indexOf('('))
          const regex = stepRegex.substring(2, stepRegex.length - 1)
          const paramAux = stepDefinition.match(/function\s?\(.*\)/)
          stepDefinitions.push({
            regex: regex,
            keyword: keyword,
            params: paramAux != null ? paramAux[0].match(/\(.*\)/)[0] : '',
            file: filePath,
            line: lineNumber
          })
        })
      }
    }
  })

  return stepDefinitions
}

function generateDic(stepDefinitions, githubBaseURL, githubDefaultBranch) {
  const groupedStepDefintionsAux = _.groupBy(stepDefinitions, 'file')
  const groupedStepDefintions = {}
  for (const file in groupedStepDefintionsAux) {
    groupedStepDefintions[file] = _.sortBy(
      groupedStepDefintionsAux[file],
      'regex'
    )
  }
  const cssFiles = [
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'
  ]
  const jsImports = [
    'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js'
  ]
  const title = 'Dictionary for cucumber steps'
  const pageDescription =
    'Search for available Cucumber steps to include in your scenario.'

  const cssBlock = cssFiles
    .map(location => {
      return `<link rel="stylesheet" type="text/css" href="${location}">`
    })
    .join('\n')

  const jsBlock = jsImports
    .map(location => {
      return `<script src="${location}"></script>`
    })
    .join('\n')

  const inlineCSS = `
      #filter {
        width: 100%;
        font-size: 18pt;
        padding: 10px;
        background-color: #F0F0F0;
        border: 1px solid #CCC;
        color: #0088B5;
      }
      .filename-header {
        font-size: 13pt;
      }
      .step-defintion {
        padding: 20px 5px;
      }
      .label {
        color: #000;
      }
      .form-group, .controls, .footer {
        padding: 20px 0;
      }
      .fileToggleButton {
        float: left;
        position: relative;
        margin-right: 10px;
        border: 1px solid #CCC;
        background-color: #FFF;
        font-size: 8pt;
        color: #AAA;
      }
      .fileToggleButton:hover {
        border: 1px solid #777;
        color: #333;
      }
      .footer {
        font-size: 10pt;
      }
    `

  const header = `
      <h1>${title}</h1>
      <h3>${pageDescription}</h3>
      <div class="form-group">
        <label for="filter">Search by phrase</label>
        <input type="text" id="filter" placeholder="">
      </div>
    `

  let filesBlock = ''
  _.forIn(groupedStepDefintions, (steps, file) => {
    const stepsBlock = steps
      .map(step => {
        /**
      `<dl class="dl-horizontal step-definition" regex="${encodeURIComponent(step.regex)}">
          <dt>Keyword</dt>
          <dd>${step.keyword}</dd>
          <dt>Regex</dt>
          <dd>${step.regex}</dd>
          <!--
          <dt>Parameters</dt>
          <dd>${step.params}</dd>
          -->
          <dt>URI</dt>
          <dd>${path.basename(file)}:${step.line}</dd>
          <dt>GitHub Link</dt>
          <dd><a href='${githubBaseURL}${path.basename(file)}#L${step.line}'>${githubDefaultBranch} branch</a></dd>
          </dl>
      `
*/

        return `<dl class="dl-horizontal step-definition" regex="${encodeURIComponent(
          step.regex
        )}">
          <dt style='color:#196F3D;font-size:130%;'>${step.keyword}</dt>
          <dd style='color:#1F618D;font-size:130%;'><b>${step.regex}</b></dd>
          <dt style='color:#196F3D;'>Link</dt>
          <dd style='color:#1F618D;'><a href='${githubBaseURL}/${file}#L${
  step.line
}'>Line ${step.line} (branch ${githubDefaultBranch})</a></dd>
          </dl>
      `
      })
      .join(' ')
    filesBlock += `
        <div class="file-block">
          <input type="button" class="fileToggleButton" onClick="toggleDefinitions(this)" value="Toggle">
          <p class="filename-header" style='color:#1F618D;font-size:130%;'>
          <b>${path.relative(process.cwd(), file)}</b>
          </p>
          <div class="definitions">
            ${stepsBlock}
          </div>
        </div>
      `
  })

  const filterScript = `
      <script>
        $('#filter').bind('propertychange change click keyup input paste', function(e) {
          var newValue = e.currentTarget.value;
          $('.step-definition').each(function(elem) {
            var regexString = decodeURIComponent(this.getAttribute('regex'));
            var searchFilter = newValue.replace(/ +/g, '.*').replace(/"."/, '".*"');
            var matchDefinition = new RegExp(searchFilter.toLowerCase());
            if (!matchDefinition.test(regexString.toLowerCase())) {
              this.style.display = 'none';
            } else {
              this.style.display = 'block';
            }
          });
          $('.file-block').each(function() {
            var noneFound = true;
            $(this).find('.step-definition').each(function() {
              var regexString = decodeURIComponent(this.getAttribute('regex'));
              var searchFilter = newValue.replace(/ +/g, '.*').replace(/".*"/, '".*"');
              var matchDefinition = new RegExp(searchFilter.toLowerCase());
              if (!matchDefinition.test(regexString.toLowerCase())) {
                this.style.display = 'none';
              } else {
                noneFound = false;
                this.style.display = 'block';
              }
            });
            console.log('nf: ' + noneFound);
            if (noneFound) {
              this.style.display = 'none';
            } else {
              this.style.display = 'block';
            }
          });
        });
      </script>
    `

  const toggleScripts = `
      <script>
        function toggleDefinitions(elem) {
          var definitions = $(elem).siblings()[1];
          $(definitions).toggle();
        }
        function toggleAll(action) {
          if (action === 'collapse') {
            $('.definitions').css('display', 'none');
            $('#toggleAll').text('Show All');
            $('#toggleAll').attr("href", "javascript:toggleAll('show')");
          } else {
            $('.definitions').css('display', 'block');
            $('#toggleAll').text('Collapse All');
            $('#toggleAll').attr("href", "javascript:toggleAll('collapse')");
          }
        }
      </script>
    `

  const mainBody = `
      <div class="controls">
        Available step definitions (${stepDefinitions.length}):
        <a href="javascript:toggleAll('collapse')" id="toggleAll"> Collapse All </a>
      </div>
      ${filesBlock}
      ${filterScript}
      ${toggleScripts}
    `

  const footer = `
      <div class="footer">
        Regenerate this dictionary by executing from the main project folder directory<br>
        <b>node utils/generateCucumberStepsDictionary.js --branch myBranch</b><br>
        Replace <i>myBranch</i> with your current branch (eg <b>next</b>)<br>
      </div>
    `

  return `
      <html>
        <head>
          <title>
            ${title}
          </title>
          ${cssBlock}
          ${jsBlock}
          <style>
            ${inlineCSS}
          </style>
        </head>
        <body>
        <
          <div class="container">
            ${header}
            ${mainBody}
            ${footer}
          </div>
        </body>
      </html>
    `
}

const stepsDirectory = './steps'
const dictionaryFile = './utils/e2edictionary.html'
const githubBaseURL =
  'https://github.microstrategy.com/skasulanati/ws-app-automation'
let githubDefaultBranch = 'master'

// Second argument may be the branch name
const argv = require('minimist')(process.argv.slice(2))
if (argv.help) {
  console.log(`Generates a new HTML file as dicitionary of available E2E steps.
  Usage:
  node utils/generateE2EDictionary.js  [options]
  Supported parameters:
  --help               => displays this help
  --branch branchName  => branch to use in link to GitHub file. Default branch is ${githubDefaultBranch}
  `)
  return
}
if (argv.branch) {
  githubDefaultBranch = argv.branch
}

const githubStepDirectory = `${githubBaseURL}/blob/${githubDefaultBranch}`
const defintions = getStepDefinitions(getAllPaths(stepsDirectory))
const report = generateDic(defintions, githubStepDirectory, githubDefaultBranch)
outputReport(dictionaryFile, report)

console.log(`Dictionary generated at ${dictionaryFile}`)
