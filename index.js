var fs = require('fs')
var gulp = require("gulp");
var gulpUtil = require("gulp-util");
var gulpDownload = require("gulp-download");
var gulpUnzip = require("gulp-unzip");
var through = require('through2');
var map = require('map-stream');
var npm = require("npm");

module.exports = function(){

  return {
    bootstrap: function(version, config){
      console.log("Hello World" + JSON.stringify(config));

      var url = "https://github.com/twbs/bootstrap/archive/v" + version + ".zip";
      var dir = __dirname + "/tmp/bootstrap-" + version;

      var download = function(callback){
        gulpUtil.log("bootstrap: download");
        gulpDownload(url)
        .pipe(gulp.dest("tmp"))
        .pipe(gulpUnzip())
        .pipe(gulp.dest("tmp"))
        .on('end', function() {
           callback();
        })
     }

     var install = function(callback){
       gulpUtil.log("bootstrap: install");
       npm.load(function (er, npm) {
         npm.prefix = dir;
         npm.commands.install(function(){
           callback()
         })
       })
     }

    var replace = function(callback){
      gulpUtil.log("bootstrap: replace");
      fs.readFile(dir + "/less/variables.less", 'utf8', function (err,data) {
        if (err) throw err;
        Object.keys(config).forEach(function(key) {
          regex = RegExp("(@" + key + ":).*(;.*)");
          data = data.replace(regex, "$1" + config[key] + "$2");
          gulpUtil.log(key, ":",config[key]);
        });
        fs.writeFile(dir + '/message.txt', data, function (err) {
          if (err) throw err;
          callback()
        });
      });
    }

    var build = function(callback){
      gulpUtil.log("bootstrap: build");
      var grunt = require(dir + "/node_modules/grunt")
      grunt.cli.tasks = ['dist']
      grunt.cli({
        "base" : dir,
        "gruntfile" : dir + "/Gruntfile.js"
      }, callback);
    }

    var stream = through.obj(function(file, encoding, done) {
      return done(null, file);
    });

    download(function(){
      install(function(){
        replace(function(){
          build(function(){
            gulpUtil.log("bootstrap: write files to stream");
            gulp.src(dir + '/dist/**/*')
            .pipe(map(function(file, done){
              stream.write(file);
              done(null, file);
            }))
            .on('end', function() {
              stream.end();
            })
          })
        })
      })
    })

    return stream

    },

    ionic: function(config){
      console.log("Hello World" + config);
    }

  }
}
