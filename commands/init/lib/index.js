'use strict';

module.exports = init;

function init(projectName,cmdObj) {
    console.log('@cool-cli/init')
    console.log('init',projectName,cmdObj.force)
}
module.exports = init