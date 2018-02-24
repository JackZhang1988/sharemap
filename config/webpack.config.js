var path = require("path");
var useDefaultConfig = require("@ionic/app-scripts/config/webpack.config.js");
var envTarget = process.env.BUILD_ENV ? process.env.BUILD_ENV : "dev";

console.log('custom webpack config run');
console.log("开始构建" + envTarget + "环境");


module.exports = function() {
  useDefaultConfig.resolve.alias = {
    "@app/env": path.resolve(
      "./src/environments/environment." + envTarget + ".ts"
    )
  };

  return useDefaultConfig;
};
