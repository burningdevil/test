import chalk from 'chalk';

function errorLog(text) {
    console.error(chalk.red(text));
}

function groupLog() {
    console.group();
}

function groupLogEnd() {
    console.groupEnd();
}

function infoLog(text) {
    console.info(chalk.gray(text));
}

function successLog(text) {
    console.log(chalk.green(text));
}

export { errorLog, groupLog, groupLogEnd, infoLog, successLog };