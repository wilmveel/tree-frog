var gulp = require('gulp');
var map = require('map-stream');
var treefrog = require("./index.js")

gulp.task('default', function() {

  var config ={
    "brand-primary" : "#FF6600"
  }

  treefrog().boostrap("3.3.5", config)
  .pipe(gulp.dest("dist/lib/boostrap"))
});
