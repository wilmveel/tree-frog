var fs = require('fs')
var gulp = require("gulp");
var gulpUtil = require("gulp-util");
var gulpDownload = require("gulp-download");
var gulpUnzip = require("gulp-unzip");
var through = require('through2');
var map = require('map-stream');
var npm = require("npm");

module.exports = {

  downloadGithub: function(user, repo, version, callback){
    var url = "https://github.com/" + user + "/" + repo + "/archive/v" + version + ".zip";

    gulpUtil.log("Download from github", user, repo, version);
    return gulpDownload(url)
    .pipe(gulp.dest("target"))
    .pipe(gulpUnzip())
    .pipe(gulp.dest("target"))
    .on('end', function() {
       callback();
    })
  },

  npmInstall: function(repo, version, callback){
    gulpUtil.log("Npm install", repo, version);
    npm.load(function (er, npm) {
      npm.prefix = __dirname + "/target/" + repo + "-" + version;
      npm.commands.install(function(){
        callback()
      })
    })
  },

  replaceConfig: function(repo, version, file, config, regex, callback){
    gulpUtil.log("Replace file with config");
    fs.readFile("target/" + repo + "-" + version + "/" + file, 'utf8', function (err,data) {
      if (err) throw err;
      Object.keys(config).forEach(function(key) {
        reg = RegExp(regex.replace("<key>", key));
        gulpUtil.log("Regex", reg);
        data = data.replace(reg, "$1 " + config[key] + " $2");
        gulpUtil.log("Replace", key, ":", config[key]);
      });
      fs.writeFile("target/" + repo + "-" + version + "/" + file, data, function (err) {
        if (err) throw err;
        callback()
      });
    });

  }
}
