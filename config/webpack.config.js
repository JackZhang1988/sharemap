var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

// console.log('custom webpack run');
console.log('开始构建'+process.env.IONIC_ENV+'环境');

module.exports = function () {
  useDefaultConfig.resolve.alias = {
    "@app/env": path.resolve('./src/environments/environment' + (process.env.IONIC_ENV === 'prod' ? '' : '.' + process.env.IONIC_ENV) + '.ts')
  };

  return useDefaultConfig;
};