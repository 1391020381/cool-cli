'use strict';

module.exports = core;
const path = require('path')
const pkg = require('../package.json')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync;
const commander = require('commander')
const log = require('@cool-cli/log')
const init = require('@cool-cli/init')
const semver = require('semver')
const constant = require('./constant')
let args;
const program = new commander.Command();
async function core() {
    try{
        checkPkgVersion();
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        // checkInputArgs()
        checkEnv()
       await checkGlobalUpate()
       registerCommand()
       log.verbose('debug','test debug log')
    }catch(e){
        log.error(e.message)
    }
}

function registerCommand(){
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d,--debug','是否开启调试模式',false);
    
    program
        .command('init [projectName]')
        .option('-f,--force','是否强制初始化项目')
        .action(init)    
    program.on('option:debug',function(){
        // program.debug 获取不到
        console.log(program)
        if(program.debug){
            process.env.LOG_LEVEL = 'verbose'
        }else{
            process.env.LOG_LEVEL = 'info'
        }
        log.level = process.env.LOG_LEVEL
        log.verbose('test','verboseverboseverboseverboseverboseverbose')
    }) 
    program.on('command:*',function(obj){
        const availableCommands = program.commands.map(cmd=> cmd.name())
        console.log(colors.red('未知的命令:' + obj[0]))
        if(availableCommands.length>0){
            console.log(colors.red('可用命令:' + availableCommands.join('.')))
        }
    })  
    program.parse(process.argv);
    // console.log(program)
    if(program.args && program.args.length < 1){
        program.outputHelp()
        console.log
    } 
}

 async function checkGlobalUpate(){
    // 1. 获取当前版本号和模块名
    const currentVersion = pkg.version
    const npmName = pkg.name
    const { getNpmSemverVersion } = require('@cool-cli/get-npm-info')
    const lastversions = await getNpmSemverVersion(currentVersion,npmName)
    if(lastversions && semver.gt(lastversions,currentVersion)){
        log.warn('更新提示',colors.yellow(`请手动更新${npmName}，当前版本:${currentVersion},最新版本:${lastversions}
            更新命令: npm install -g ${npmName};
        `))
    }
    // 2. 调用npm API 获取所有版本号
    // 3. 提取所有版本号 比对哪些版本号是大于当前版本号
    // 4. 获取最新的版本号,提示用户更新到该版本
}
function checkEnv(){
    const dotenv  = require('dotenv')
    const dotenvPath = path.resolve(userHome,'.env')
    if(pathExists(dotenvPath)){
        dotenv.config({
            path:dotenvPath
        })
    }
    // config = dotenv.config({})

    createDefaultConfig()
    log.verbose('环境变量:',process.env.CLI_HOME_PATH)
}
function createDefaultConfig(){
    const cliConfig = {
        home:userHome
    }
    if(process.env.CLI_HOME){
        cliConfig['cliHome'] = path.join(userHome,process.env.CLI_HOME)   
    }else{
        cliConfig['cliHome'] = path.join(userHome,constant.DEFAULT_CLI_HOME) 
    }
    // return cliConfig
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}
function checkInputArgs(){
    const minimist = require('minimist')
    args = minimist(process.argv.slice(2))
    checkArgs()
}
function checkArgs(){
    if(args.debug){
        process.env.LOG_LEVEL = 'verbose'
    }else{
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
}
function checkUserHome(){
    if(!userHome || !pathExists(userHome)){
        throw new Error(colors.red('当前登录用户主目录不存在!'))
    }
}

function checkRoot(){
    const rootCheck = require('root-check')
    rootCheck()
}
function checkNodeVersion(){
    const currentVersion = process.version;
    const lowestVersion = constant.LOWEST_NODE_VERSIION
    if(!semver.gte(currentVersion,lowestVersion)){
        throw new Error(colors.red(`cool-cli 需要安装 v${lowestVersion}以上版本的Node.js`))
    }
}
function checkPkgVersion(){
    log.notice('cli',pkg.version)
}
