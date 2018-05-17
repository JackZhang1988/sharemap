var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

var env = process.env.BUILD_ENV;

useDefaultConfig.dev.resolve.alias = {
    '@app/env': path.resolve(environmentPath('dev'))
};
useDefaultConfig.prod.resolve.alias = {
    '@app/env': path.resolve(environmentPath('prod'))
};

if (env !== 'prod' && env !== 'dev') {
    // Default to dev config
    useDefaultConfig[env] = useDefaultConfig.dev;
    useDefaultConfig[env].resolve.alias = {
        '@app/env': path.resolve(environmentPath(env))
    };
}

function environmentPath(env) {
    var filePath = './src/environments/environment' + (env ? '.' + env : '.dev') + '.ts';
    if (!fs.existsSync(filePath)) {
        console.log(chalk.red('\n' + filePath + ' does not exist!'));
    } else {
        return filePath;
    }
}

console.log('开始替换环境变量', env);
module.exports = function() {
    return useDefaultConfig;
};
