//引入babel，翻译express的入口
require('babel-core/register');
require('./app.js');
require("babel-core").transform("code", {
	plugins: ["transform-runtime"]
});
