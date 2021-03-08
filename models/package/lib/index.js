'use strict';
const { isObject } = require('@cool-cli/utils')


class Package {
    constructor(options){
        // package的路径
        if(!options || !isObject(options)){
            throw new Error('Package类的options参数不能为空')
        }
        this.targetPath = options.targetPath
        // package的存储路径
        this.storePath = options.storePath
        // package的name
        this.packageName = options.name
        // package的version
        this.packageVersion = options.version
        console.log('Package constructor')
    }
    exists(){}
    install(){}
    update(){}
    getRootFilePath(){}
}

module.exports = Package;