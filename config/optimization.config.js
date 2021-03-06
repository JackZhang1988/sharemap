// this config used for ionic cordova build --prod

var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/optimization.config.js');

console.log('optimization run');

module.exports = function () {
  useDefaultConfig.resolve.alias = {
    "@app/env": path.resolve('./src/environments/environment' + (process.env.IONIC_ENV === 'prod' ? '' : '.' + process.env.IONIC_ENV) + '.ts')
  };

  return useDefaultConfig;
};
