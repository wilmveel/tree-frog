var gulp = require('gulp');
var map = require('map-stream');
var treefrog = require("./index.js")

gulp.task('bootstrap', function() {

  var config ={
    "brand-primary" : "#40B8E1"
  }

  treefrog.bootstrap("3.3.5", config)
  .pipe(gulp.dest("output/boostrap"))

});

gulp.task('ionic', function() {

  var config ={
    "light" : "#40B8E1"
  }

  treefrog.ionic("1.0.0", config)
  .pipe(gulp.dest("output/ionic"))

});
