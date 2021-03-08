'use strict';

const Package = require('@cool-cli/package')
const log = require('@cool-cli/log')
function exec() {
    const targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH
    log.verbose('targetPath:',targetPath)
    log.verbose('homePath:',homePath)
    const pkg = new Package()
    // 1. targetPath -> modulePath
    // 2. modulePath -> Package(npm模块)
    // 3. Package.getRootFile(获取入口文件)
}

module.exports = exec;
