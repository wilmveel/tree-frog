var fs = require('fs')
var gulp = require("gulp");
var gulpSass = require("gulp-sass");
var gulpLess = require("gulp-less");
var gulpUtil = require("gulp-util");
var gulpDownload = require("gulp-download");
var gulpUnzip = require("gulp-unzip");
var gulpCssmin = require('gulp-cssmin');
var gulpRename = require('gulp-rename');
var through = require('through2');
var map = require('map-stream');
var npm = require("npm");

var util = require("./util.js");

module.exports = {
  bootstrap: function(version, config){
    console.log("Hello World" + JSON.stringify(config));
    var dir = "target/bootstrap-" + version;

    var build = function(callback){
      gulpUtil.log("bootstrap: build");
      var dir = "target/bootstrap-" + version;
      return gulp.src(dir + "/less/bootstrap.less")
      .pipe(gulpLess())
      .pipe(gulp.dest(dir + "/dist/css"))
      .pipe(gulpCssmin())
      .pipe(gulpRename({suffix: '.min'}))
      .pipe(gulp.dest(dir + "/dist/css"))
      .on('end', callback);
    }

    util.downloadGithub("twbs", "bootstrap", version, function(){
      util.replaceConfig("bootstrap", version, "less/variables.less", config, "(@<key>:\\s*).*(;.*)", function(){
        build(function(){
          gulp.src(dir + '/dist/**/*')
          .pipe(map(function(file, done){
            stream.write(file);
            done(null, file);
          }))
        })
      })
    })

    var stream = through.obj(function(file, encoding, done) {
      return done(null, file);
    });

    return stream

  },

  ionic: function(version, config){

    var build = function(callback){
      gulp.src("target/ionic-" + version + "/scss/ionic.scss")
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulp.dest("target/ionic-" + version + "/release/css"))
        .pipe(gulpCssmin())
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulp.dest("target/ionic-" + version + "/release/css"))
        .on('end', callback);
    }

    util.downloadGithub("driftyco", "ionic", version, function(){
      util.replaceConfig("ionic", version, "scss/_variables.scss", config, "(\\$<key>:\\s*).*(!default;.*)", function(){
        build(function(){
          gulp.src("target/ionic-" + version + '/release/**/*')
          .pipe(map(function(file, done){
            stream.write(file);
            done(null, file);
          }))
        });
      });
    });

    var stream = through.obj(function(file, encoding, done) {
      return done(null, file);
    });

    return stream
  }

}
